import { Request, Response, NextFunction } from 'express';
import { verifyUserAccessToken, verifyAdminAccessToken } from '../utils/token.js';
import { AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';

// Extend Express Request Type
declare global {
    namespace Express {
        interface Request {
            user?: any;
            admin?: any;
        }
    }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        const decoded = verifyUserAccessToken(token) as any;

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: { include: { rolePermissions: { include: { permission: true } } } } }
        });

        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }

        // Attach user securely to request
        req.user = currentUser;
        next();
    } catch (err) {
        next(err);
    }
};

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in as Admin! Please log in to get access.', 401));
        }

        const decoded = verifyAdminAccessToken(token) as any;
        const adminId = typeof decoded.id === 'object' ? decoded.id.id : decoded.id;

        const currentAdmin = await prisma.adminUser.findUnique({
            where: { id: adminId }
        });

        if (!currentAdmin) {
            return next(new AppError('The admin belonging to this token does no longer exist.', 401));
        }

        req.admin = currentAdmin;
        next();
    } catch (err) {
        next(err);
    }
};

export const checkAccountApproved = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError('Unauthorized', 401));
    }

    if (req.user.status !== 'APPROVED') {
        return next(new AppError('Account pending admin approval', 403));
    }

    next();
};
