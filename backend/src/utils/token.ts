import jwt from 'jsonwebtoken';

const USER_ACCESS_SECRET = process.env.USER_JWT_ACCESS_SECRET || 'dev_user_access_secret';
const USER_REFRESH_SECRET = process.env.USER_JWT_REFRESH_SECRET || 'dev_user_refresh_secret';

const ADMIN_ACCESS_SECRET = process.env.ADMIN_JWT_ACCESS_SECRET || 'dev_admin_access_secret';
const ADMIN_REFRESH_SECRET = process.env.ADMIN_JWT_REFRESH_SECRET || 'dev_admin_refresh_secret';

// Access Token: 15 minutes
export const signUserAccessToken = (userId: string, role: string) => {
    return jwt.sign({ id: userId, role }, USER_ACCESS_SECRET, { expiresIn: '15m' });
};

// Refresh Token: 7 days
export const signUserRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, USER_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyUserAccessToken = (token: string) => {
    return jwt.verify(token, USER_ACCESS_SECRET);
};

export const verifyUserRefreshToken = (token: string) => {
    return jwt.verify(token, USER_REFRESH_SECRET);
};

// --- Admin Tokens ---

export const signAdminAccessToken = (adminId: string) => {
    return jwt.sign({ id: adminId, role: 'ADMIN' }, ADMIN_ACCESS_SECRET, { expiresIn: '15m' });
};

export const signAdminRefreshToken = (adminId: string) => {
    return jwt.sign({ id: adminId }, ADMIN_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAdminAccessToken = (token: string) => {
    return jwt.verify(token, ADMIN_ACCESS_SECRET);
};

export const verifyAdminRefreshToken = (token: string) => {
    return jwt.verify(token, ADMIN_REFRESH_SECRET);
};
