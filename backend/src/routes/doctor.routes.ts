import { Router } from 'express';
import { getMyPatients, addPrescription, uploadLabReport } from '../controllers/doctor.controller.js';
import { authenticateUser, checkAccountApproved } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

// Secure Doctor routes
router.use(authenticateUser);
router.use(checkAccountApproved);
router.use(checkRole('DOCTOR'));

router.get('/patients', getMyPatients);
router.post('/prescriptions', addPrescription);
router.post('/labs', uploadLabReport);

export default router;
