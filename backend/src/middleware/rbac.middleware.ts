import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';

export const checkRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role.name)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

export const checkPermission = (requiredPermission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }

        const permissions = req.user.role.rolePermissions.map((rp: any) => rp.permission.name);

        if (!permissions.includes(requiredPermission)) {
            return next(new AppError(`Forbidden: Missing permission ${requiredPermission}`, 403));
        }
        next();
    };
};

// Attribute-Based Access Control Example
export const evaluateABACPatientAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patientId = (req.params.patientId || req.params.id) as string;
        const userId = req.user.id;
        const role = req.user.role.name;

        // An Admin bypassing rules (or handled via separate admin routes)
        if (role === 'ADMIN') return next();

        // 1. Patient can access their own data
        if (role === 'PATIENT' && userId === patientId) {
            return next();
        }

        // 2. Doctor can only access assigned patients
        if (role === 'DOCTOR') {
            const assignment = await prisma.doctorPatientAssignment.findUnique({
                where: {
                    doctorId_patientId: { doctorId: userId, patientId: patientId }
                }
            });

            if (assignment) return next();
        }

        // For other restrictive queries - default Deny
        return next(new AppError('Attribute-Based Access Control blocked this request.', 403));
    } catch (err) {
        next(err);
    }
};
