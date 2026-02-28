import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validateRequest = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: (error as any).errors.map((e: any) => e.message).join(', '),
                    error: (error as any).errors.map((e: any) => e.message).join(', '),
                });
            }
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    };
};
