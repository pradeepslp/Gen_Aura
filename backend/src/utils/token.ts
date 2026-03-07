import jwt from 'jsonwebtoken';

const USER_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'user-access-secret-key-123';
const ADMIN_ACCESS_SECRET = process.env.JWT_ADMIN_SECRET || 'admin-access-secret-key-123';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-123';

export const signUserAccessToken = (userId: string, role: string) => {
    return jwt.sign({ id: userId, role }, USER_ACCESS_SECRET, { expiresIn: '15m' });
};

export const signUserRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const signAdminAccessToken = (adminId: string) => {
    return jwt.sign({ id: adminId, role: 'ADMIN' }, ADMIN_ACCESS_SECRET, { expiresIn: '15m' });
};

export const signAdminRefreshToken = (adminId: string) => {
    return jwt.sign({ id: adminId }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyUserAccessToken = (token: string) => {
    return jwt.verify(token, USER_ACCESS_SECRET);
};

export const verifyAdminAccessToken = (token: string) => {
    return jwt.verify(token, ADMIN_ACCESS_SECRET);
};

export const verifyUserRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET);
};
