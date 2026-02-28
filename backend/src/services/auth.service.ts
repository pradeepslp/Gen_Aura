import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';
import { redisClient } from '../utils/redis.js';
import {
    signUserAccessToken,
    signUserRefreshToken,
    signAdminAccessToken,
    signAdminRefreshToken,
    verifyUserRefreshToken,
    verifyAdminRefreshToken,
} from '../utils/token.js';

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

        return {
            id: newUser.id,
            email: newUser.email,
            status: newUser.status,
            role: newUser.role.name,
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

        return { user: { id: user.id, email: user.email, status: user.status, role: user.role.name }, accessToken, refreshToken };
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

        } catch (e) {
            throw new AppError('Invalid refresh token', 401);
        }
    },

    async logoutUser(accessToken: string, refreshToken: string) {
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        }

        // Blacklist access token in Redis to prevent reuse until it expires
        const decoded = jwt.decode(accessToken) as any;
        if (decoded && decoded.exp) {
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await redisClient.setEx(`bl:${accessToken}`, ttl, '1');
            }
        }
    }
};
