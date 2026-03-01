import { Router } from 'express';
import { register, login, adminLogin, refreshToken, logout, verifyEmail, resendVerification } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema, resendVerificationSchema } from '../utils/validators.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes for end users
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), refreshToken);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', validateRequest(resendVerificationSchema), resendVerification);
router.post('/resend-verification', validateRequest(resendVerificationSchema), resendVerification);
router.get('/me', authenticateUser, (req, res) => {
    // Current authenticated user is attached to req.user by authenticateUser middleware
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role.name,
                status: req.user.status,
                emailVerified: req.user.emailVerified
            }
        }
    });
});

// Isolated route for Administrators
router.post('/admin/login', validateRequest(loginSchema), adminLogin);

export default router;
