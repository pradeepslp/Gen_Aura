import { Router } from 'express';
import { getAllPatients, uploadReport } from '../controllers/lab.controller.js';
import { authenticateUser, checkAccountApproved } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

// Secure Lab Technician routes
router.use(authenticateUser);
router.use(checkAccountApproved);
router.use(checkRole('LAB_TECHNICIAN'));

router.get('/patients', getAllPatients);
router.post('/upload', uploadReport);

export default router;
