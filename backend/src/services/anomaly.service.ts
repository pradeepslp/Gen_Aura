import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';
import { AuditService } from './audit.service.js';

interface AnomalyData {
    userId: string;
    action: string;
    resource: string;
    ip?: string;
    device?: string;
}

export const AnomalyDetectionService = {
    async trackAndEvaluate(data: AnomalyData) {
        try {
            // 1. Log to User Activity
            await prisma.userActivityLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    resource: data.resource,
                    ip: data.ip || 'unknown',
                    device: data.device || 'unknown'
                }
            });

            // 2. Evaluate Rule-based Risks
            let riskScore = 0;
            let reasons: string[] = [];

            // A. Check for new device
            const deviceHistory = await prisma.userActivityLog.findFirst({
                where: { userId: data.userId, device: data.device, NOT: { id: undefined } } // simplified check
            });
            if (!deviceHistory && data.device !== 'unknown') {
                riskScore += 20;
                reasons.push('Login from new device');
            }

            // B. Repeated forbidden attempts (e.g., getting multiple 403s rapidly)
            if (data.action === 'FORBIDDEN_ACCESS') {
                const recentForbidden = await prisma.userActivityLog.count({
                    where: {
                        userId: data.userId,
                        action: 'FORBIDDEN_ACCESS',
                        timestamp: { gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 mins
                    }
                });
                if (recentForbidden > 3) {
                    riskScore += 25;
                    reasons.push('Multiple forbidden access attempts');
                }
            }

            // C. Mass data access (>50 records in 5 mins)
            if (data.action === 'VIEW_RECORD') {
                const recentViews = await prisma.userActivityLog.count({
                    where: {
                        userId: data.userId,
                        action: 'VIEW_RECORD',
                        timestamp: { gte: new Date(Date.now() - 5 * 60 * 1000) }
                    }
                });
                if (recentViews > 50) {
                    riskScore += 40;
                    reasons.push('Mass data access detected');
                }
            }

            // 3. Trigger Actions Based on Risk Thresholds
            if (riskScore > 0) {
                const reasonStr = reasons.join(', ');

                await prisma.securityAlert.create({
                    data: {
                        userId: data.userId,
                        riskScore,
                        reason: reasonStr
                    }
                });

                await AuditService.log('SECURITY_ALERT_GENERATED', `Risk: ${riskScore} - ${reasonStr}`, data.userId, data.ip);

                if (riskScore > 150) {
                    // Lock Account immediately immediately
                    await prisma.user.update({
                        where: { id: data.userId },
                        data: { status: 'SUSPENDED' }
                    });
                    logger.warn(`User ${data.userId} auto-suspended due to extreme risk score: ${riskScore}`);
                    await AuditService.log('ACCOUNT_AUTO_SUSPENDED', `Risk Score: ${riskScore}`, data.userId, data.ip);
                }
            }

        } catch (error) {
            logger.error('Anomaly Detection Engine failed', error);
        }
    }
};
