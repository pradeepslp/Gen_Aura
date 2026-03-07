import { Router } from 'express';
import { createRequest, moveRequest, getDepartmentQueue, getPatientRequestHistory, getDepartments } from '../controllers/workflow.controller.js';
import { authenticateUser, checkAccountApproved } from '../middleware/auth.middleware.js';
import { trackActivity } from '../middleware/anomaly.middleware.js';

const router = Router();

// Apply global workflow protection
router.use(authenticateUser);
router.use(checkAccountApproved);

// Create a new request (Patient or Doctor)
router.post('/request', trackActivity('WORKFLOW_CREATE', (req) => `Workflow category: ${req.body.category}`), createRequest);

// Move a request (Staff only - internal check in controller)
router.patch('/request/:requestId/move', trackActivity('WORKFLOW_MOVE', (req) => `Move request: ${req.params.requestId}`), moveRequest);

// Get department-specific queue
router.get('/queue', getDepartmentQueue);

// Get full history for a request
router.get('/request/:requestId/history', getPatientRequestHistory);

// List all departments
router.get('/departments', getDepartments);

export default router;
