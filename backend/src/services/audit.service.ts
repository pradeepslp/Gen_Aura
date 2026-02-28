import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';

export const AuditService = {
    async log(action: string, resource: string, userId?: string, ip?: string) {
        try {
            await prisma.auditLog.create({
                data: {
                    action,
                    resource,
                    userId: userId || null, // Null indicates system/unauthenticated action
                    ip: ip || 'unknown',
                },
            });
        } catch (error) {
            // We don't want audit failures to crash the main request flow, but we must log them.
            logger.error('Failed to write audit log', { error, action, resource, userId, ip });
        }
    }
};
