import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.name}: ${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.message
        });
    }

    // Handle generic JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.', error: 'Invalid token. Please log in again.' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please log in again.', error: 'Token expired. Please log in again.' });
    }

    // Fallback generic error
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: 'Internal Server Error'
    });
};
