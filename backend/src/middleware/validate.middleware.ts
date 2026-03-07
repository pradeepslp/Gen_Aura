import { Request, Response, NextFunction } from 'express';
import { ZodError, AnyZodObject } from 'zod';
import { AppError } from '../utils/errors.js';

export const validateRequest = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            console.error('Validation error:', error);
            if (error instanceof ZodError) {
                const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                return next(new AppError(message, 400));
            }
            return next(error);
        }
    };
};
