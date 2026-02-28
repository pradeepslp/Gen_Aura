import { Request, Response, NextFunction } from 'express';
import { AnomalyDetectionService } from '../services/anomaly.service.js';

export const trackActivity = (action: string, resourceLocator: (req: Request) => string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // We only track authenticated users
        if (req.user) {
            const resource = resourceLocator(req);

            // Fire and forget; do not block the main request thread
            AnomalyDetectionService.trackAndEvaluate({
                userId: req.user.id,
                action,
                resource,
                ip: req.ip || 'unknown',
                device: req.headers['user-agent'] || 'unknown',
            }).catch(e => console.error('Anomaly Engine Async Error:', e));
        }
        next();
    };
};
