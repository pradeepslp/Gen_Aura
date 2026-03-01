import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/errors.js';
import {
    signUserAccessToken,
    signUserRefreshToken,
    signAdminAccessToken,
    signAdminRefreshToken,
    verifyUserRefreshToken
} from '../utils/token.js';
import crypto from 'crypto';
import { EmailService } from './email.service.js';

// In a real app, this would be a specialized utility using SendGrid/Mailgun/SES
const sendVerificationEmail = async (email: string, token: string) => {
    // Determine the base URL dynamically based on environment or via an explicitly set env variable
    // For local development, assume frontend is mostly running on port 3000
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h2 style="color: #0ea5e9;">Welcome to SecureCare!</h2>
        <p style="color: #64748b; font-size: 16px;">
          To complete your registration and initiate the Zero-Trust approval process, 
          please verify your identity.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #0ea5e9; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Verify Email Address
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `;

    try {
        await EmailService.sendEmail(
            email,
            'SecureCare: Verify Your Identity',
            emailHtml
        );
    } catch (error) {
        console.error("Failed to send verification email via Nodemailer:", error);
        // Optionally, handle the error gracefully or throw so the registration fails
        // For now, let's just log it so standard registration can complete if SMTP is misconfigured
    }
};

export const AuthServices = {
    async registerUser(data: any, ip: string) {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) throw new AppError('Email already in use', 400);

        // 2. Hash password (12 rounds as specified)
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // 3. Resolve Role ID (Support both Name and UUID)
        let roleId = data.roleId;
        const roleByName = await prisma.role.findUnique({
            where: { name: data.roleId },
        });

        if (roleByName) {
            roleId = roleByName.id;
        }

        // 4. Create user (Default status is PENDING per schema)
        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                roleId: roleId,
            },
            include: {
                role: true,
            }
        });

        // 5. Create patient or doctor profile based on role
        if (newUser.role.name === 'PATIENT') {
            await prisma.patient.create({
                data: {
                    id: newUser.id,
                    firstName: data.firstName || 'Patient',
                    lastName: data.lastName || 'User',
                    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(1990, 0, 1)
                }
            })
        } else if (newUser.role.name === 'DOCTOR') {
            console.log("Entering Doctor creation block for user:", newUser.id);
            try {
                const doctor = await prisma.doctor.create({
                    data: {
                        id: newUser.id,
                        firstName: data.firstName || 'Doctor',
                        lastName: data.lastName || 'Professional',
                        specialization: 'General Medicine', // Default for self-reg
                        licenseNumber: `LIC-${Math.random().toString(36).substring(7).toUpperCase()}`
                    }
                });
                console.log("Successfully created Doctor record:", doctor);
            } catch (err) {
                console.error("Failed to create Doctor record:", err);
            }
        }

        // 6. Generate and store verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        await prisma.verificationToken.create({
            data: {
                token: verificationToken,
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            }
        });

        // 7. Send verification email
        await sendVerificationEmail(newUser.email, verificationToken);

        return {
            id: newUser.id,
            email: newUser.email,
            status: newUser.status,
            role: newUser.role.name,
            message: "Registration successful. Please check your email to verify your account."
        };
    },

    async loginUser(data: any, ip: string, device: string) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { role: true },
        });

        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new AppError('Invalid credentials', 401);
        }

        // Removed hard block: allow login to proceed so frontend can route to /pending-approval and show correct message dựa on emailVerified

        // Note: User can login even if PENDING status. Access control is handled post-login middleware.

        const accessToken = signUserAccessToken(user.id, user.role.name);
        const refreshToken = signUserRefreshToken(user.id);

        // Store refresh token in Database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });

        return { user: { id: user.id, email: user.email, status: user.status, role: user.role.name, emailVerified: user.emailVerified }, accessToken, refreshToken };
    },

    async loginAdmin(data: any, ip: string) {
        const admin = await prisma.adminUser.findUnique({
            where: { email: data.email }
        });

        if (!admin || !(await bcrypt.compare(data.password, admin.password))) {
            throw new AppError('Invalid admin credentials', 401);
        }

        const accessToken = signAdminAccessToken(admin.id);
        const refreshToken = signAdminRefreshToken(admin.id);

        await prisma.adminRefreshToken.create({
            data: {
                token: refreshToken,
                adminId: admin.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return { admin: { id: admin.id, email: admin.email }, accessToken, refreshToken };
    },

    async rotateUserToken(oldRefreshToken: string) {
        try {
            const decoded = verifyUserRefreshToken(oldRefreshToken) as { id: string };
            const storedToken = await prisma.refreshToken.findUnique({ where: { token: oldRefreshToken }, include: { user: { include: { role: true } } } });

            if (!storedToken) {
                throw new AppError('Token invalid or already consumed', 401);
            }

            // Token rotation: destroy the old one
            await prisma.refreshToken.delete({ where: { id: storedToken.id } });

            const newAccessToken = signUserAccessToken(storedToken.userId, storedToken.user.role.name);
            const newRefreshToken = signUserRefreshToken(storedToken.userId);

            // Store new token
            await prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: storedToken.userId,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new AppError('Invalid refresh token', 401);
        }
    },

    async logoutUser(accessToken: string, refreshToken?: string) {
        // Ideally, blacklist the accessToken in Redis here.
        // For now, we mainly invalidate the refresh token in the DB.

        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            });
        }
    },

    async verifyEmail(token: string) {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        if (!verificationToken || verificationToken.expiresAt < new Date()) {
            // Delete expired token to clean up
            if (verificationToken) {
                await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
            }
            throw new AppError('Invalid or expired verification token', 400);
        }

        // Use a transaction to ensure both operations succeed or fail together
        const [updatedUser] = await prisma.$transaction([
            prisma.user.update({
                where: { id: verificationToken.userId },
                data: { emailVerified: true },
                include: { role: true }
            }),
            prisma.verificationToken.delete({
                where: { id: verificationToken.id }
            })
        ]);

        // Generate tokens to log the user in immediately after verification
        const accessToken = signUserAccessToken(updatedUser.id, updatedUser.role.name);
        // Clean up any old refresh tokens for this user first
        await prisma.refreshToken.deleteMany({ where: { userId: updatedUser.id } });
        const refreshToken = signUserRefreshToken(updatedUser.id);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: updatedUser.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });

        return {
            message: 'Email verified successfully',
            tokens: {
                accessToken,
                refreshToken
            },
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role.name,
                status: updatedUser.status,
                emailVerified: updatedUser.emailVerified
            }
        };
    },

    async resendVerification(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (user.emailVerified) {
            throw new AppError("Email is already verified", 400);
        }

        // Generate new token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Delete any existing tokens for this user
        await prisma.verificationToken.deleteMany({
            where: { userId: user.id }
        });

        await prisma.verificationToken.create({
            data: {
                token: verificationToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            }
        });

        // Send email
        await sendVerificationEmail(user.email, verificationToken);

        return { message: "Verification email sent successfully." };
    }
};
