import { Router } from 'express';
import { getPatientProfile, getPatientLabReports, getPatientPrescriptions } from '../controllers/patient.controller.js';
import { authenticateUser, checkAccountApproved } from '../middleware/auth.middleware.js';
import { evaluateABACPatientAccess } from '../middleware/rbac.middleware.js';
import { trackActivity } from '../middleware/anomaly.middleware.js';

const router = Router();

// Multi-layered verification for EVERY route
router.use(authenticateUser);
router.use(checkAccountApproved);

// Track general access anomaly checking
router.use(trackActivity('API_ACCESS', (req) => req.originalUrl));

// Patient Endpoint Protection with ABAC Layer
// Only allow access if user is either the assigned Doctor or the Patient themselves
// The :patientId is required in the path for the ABAC validation 

router.get('/:patientId/profile',
    evaluateABACPatientAccess,
    trackActivity('VIEW_RECORD', (req) => `PatientProfile-${req.params.patientId}`),
    getPatientProfile
);

router.get('/:patientId/labs',
    evaluateABACPatientAccess,
    trackActivity('VIEW_RECORD', (req) => `LabReports-${req.params.patientId}`),
    getPatientLabReports
);

router.get('/:patientId/prescriptions',
    evaluateABACPatientAccess,
    trackActivity('VIEW_RECORD', (req) => `Prescriptions-${req.params.patientId}`),
    getPatientPrescriptions
);

export default router;
