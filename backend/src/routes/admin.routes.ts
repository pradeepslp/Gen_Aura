import { Router } from 'express';
import { getPendingUsers, getAllUsers, approveUser, unauthorizeUser, rejectUser, deleteUser, getSecurityAlerts, resolveSecurityAlert, getDashboardStats, getAnomalyLogs, getAuditLogs } from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require Admin Authorization
router.use(authenticateAdmin);

// Dashboard Stats
router.get('/stats', getDashboardStats);

// User Approval Management
router.get('/users', getAllUsers);
router.get('/users/pending', getPendingUsers);
router.post('/users/:userId/approve', approveUser);
router.post('/users/:userId/unauthorize', unauthorizeUser);
router.post('/users/:userId/reject', rejectUser);
router.delete('/users/:userId', deleteUser);

// Security Dashboard
router.get('/security/alerts', getSecurityAlerts);
router.post('/security/alerts/:alertId/resolve', resolveSecurityAlert);
router.get('/anomalies', getAnomalyLogs);
router.get('/audit', getAuditLogs);

export default router;
