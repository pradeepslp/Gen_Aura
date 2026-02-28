import { Request, Response } from 'express';
import { AuthServices } from '../services/auth.service.js';
import { asyncHandler } from '../utils/errors.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthServices.registerUser(req.body, req.ip || '');
    res.status(201).json({
        success: true,
        data: result
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const device = req.headers['user-agent'] || 'Unknown';
    const result = await AuthServices.loginUser(req.body, req.ip || '', device);

    res.status(200).json({
        success: true,
        data: result
    });
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthServices.loginAdmin(req.body, req.ip || '');

    res.status(200).json({
        success: true,
        data: result
    });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await AuthServices.rotateUserToken(refreshToken);

    res.status(200).json({
        success: true,
        data: result
    });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const { refreshToken } = req.body;

    let accessToken = '';
    if (authHeader && authHeader.startsWith('Bearer')) {
        accessToken = authHeader.split(' ')[1];
    }

    await AuthServices.logoutUser(accessToken, refreshToken);

    res.status(200).json({
        success: true,
        message: 'Successfully logged out'
    });
});
