import { Router } from 'express';
import { register, login, adminLogin, refreshToken, logout } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validators.js';

const router = Router();

// Public routes for end users
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), refreshToken);
router.post('/logout', logout);

// Isolated route for Administrators
router.post('/admin/login', validateRequest(loginSchema), adminLogin);

export default router;
