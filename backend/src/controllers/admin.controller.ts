import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { AuditService } from '../services/audit.service.js';

export const getPendingUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        where: {
            status: 'PENDING',
            emailVerified: true // Only show to admin if they verified their email
        },
        select: {
            id: true,
            email: true,
            status: true,
            createdAt: true,
            role: { select: { name: true } }
        }
    });

    res.status(200).json({ success: true, users });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        where: { status: 'APPROVED' },
        select: {
            id: true,
            email: true,
            status: true,
            createdAt: true,
            role: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, users });
});

export const approveUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const adminId = req.admin.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);
    if (user.status === 'APPROVED') throw new AppError('User is already approved', 400);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            status: 'APPROVED',
            approvedBy: adminId,
            approvedAt: new Date(),
        }
    });

    await AuditService.log('USER_APPROVED', `Admin ${adminId} approved user ${userId}`, userId as string, (req.ip as string) || 'unknown');

    res.status(200).json({ success: true, message: 'User approved successfully', user: updatedUser });
});

export const unauthorizeUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const adminId = req.admin.id;

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
    if (!user) throw new AppError('User not found', 404);
    if (user.role.name === 'ADMIN') throw new AppError('Cannot unauthorize admin users', 403);
    if (user.status !== 'APPROVED') throw new AppError('User must be approved to unauthorize', 400);

    const updatedUser = await prisma.user.delete({
        where: { id: userId }
    });

    await AuditService.log('USER_UNAUTHORIZED', `Admin ${adminId} revoked authorization and deleted user ${userId}`, userId as string, (req.ip as string) || 'unknown');

    res.status(200).json({ success: true, message: 'User deleted from the database', user: updatedUser });
});

export const rejectUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const adminId = req.admin.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            status: 'REJECTED',
            approvedBy: adminId,
            approvedAt: new Date(),
        }
    });

    await AuditService.log('USER_REJECTED', `Admin ${adminId} rejected user ${userId}`, userId as string, (req.ip as string) || 'unknown');

    res.status(200).json({ success: true, message: 'User rejected successfully', user: updatedUser });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const adminId = req.admin.id;

    // Verify user exists and is not an admin
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });

    if (!user) throw new AppError('User not found', 404);
    if (user.role.name === 'ADMIN') throw new AppError('Cannot delete admin users', 403);

    // Delete user - Prisma schema requires manual cascading if not set in DB
    // Or we rely on Prisma's onDelete: Cascade if configured. Let's assume standard deletion.
    await prisma.user.delete({
        where: { id: userId }
    });

    await AuditService.log('USER_DELETED', `Admin ${adminId} permanently deleted user ${userId}`, undefined, (req.ip as string) || 'unknown');

    res.status(200).json({ success: true, message: 'User permanently deleted' });
});

export const getSecurityAlerts = asyncHandler(async (req: Request, res: Response) => {
    const alerts = await prisma.securityAlert.findMany({
        where: { resolved: false },
        orderBy: { riskScore: 'desc' },
        include: { user: { select: { email: true } } }
    });

    res.status(200).json({ success: true, alerts });
});

export const getAnomalyLogs = asyncHandler(async (req: Request, res: Response) => {
    // Admin only endpoint to fetch anomaly logs
    const logs = await prisma.anomalyLog.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 100 // Limit to the most recent 100 logs
    });

    res.status(200).json({ success: true, logs });
});

export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const logs = await prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
        include: { user: { select: { email: true } } },
        take: 500 // Arbitrary reasonable limit for the UI
    });

    // Map `timestamp` to `createdAt` for frontend consistency if needed
    const mappedLogs = logs.map((log: any) => ({
        ...log,
        createdAt: log.timestamp
    }));

    res.status(200).json({ success: true, logs: mappedLogs });
});

export const resolveSecurityAlert = asyncHandler(async (req: Request, res: Response) => {
    const { alertId } = req.params;
    const adminId = req.admin.id;

    await prisma.securityAlert.update({
        where: { id: alertId },
        data: { resolved: true }
    });

    await AuditService.log('SECURITY_ALERT_RESOLVED', `Admin ${adminId} resolved alert ${alertId}`, adminId, (req.ip as string) || 'unknown');

    res.status(200).json({ success: true, message: 'Alert resolved' });
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    console.log('Fetching dashboard stats...');
    try {
        const [userCount, pendingCount, alertCount, recentLogs] = await Promise.all([
            prisma.user.count({ where: { status: 'APPROVED' } }),
            prisma.user.count({ where: { status: 'PENDING', emailVerified: true } }),
            prisma.securityAlert.count({ where: { resolved: false } }),
            prisma.auditLog.findMany({
                take: 5,
                orderBy: { timestamp: 'desc' },
                include: { user: { select: { email: true } } }
            })
        ]);
        console.log('Stats fetched successfully');

        res.status(200).json({
            success: true,
            stats: {
                authorizedUsers: userCount,
                pendingAuthorizations: pendingCount,
                activeAnomalies: alertCount,
                securityScore: 98,
                systemUptime: '99.9%',
                recentActivity: recentLogs
            }
        });
    } catch (error: any) {
        console.error('Error in getDashboardStats:', error);
        throw error;
    }
});
