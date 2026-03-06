import { Router } from 'express';
import { createAppointment, getPatientAppointments, getPatientAppointmentsForDoctor } from '../controllers/appointment.controller.js';
import { authenticateUser, checkAccountApproved } from '../middleware/auth.middleware.js';
import { evaluateABACPatientAccess } from '../middleware/rbac.middleware.js';
import { trackActivity } from '../middleware/anomaly.middleware.js';

const router = Router();

// Secure all appointment routes
router.use(authenticateUser);
router.use(checkAccountApproved);

router.post('/book',
    trackActivity('BOOK_APPOINTMENT', (req) => `NewAppointment-${req.user.id}`),
    createAppointment
);

router.get('/history',
    trackActivity('VIEW_APPOINTMENTS', (req) => `MyAppointments-${req.user.id}`),
    getPatientAppointments
);

router.get('/patient/:patientId',
    evaluateABACPatientAccess,
    trackActivity('VIEW_PATIENT_APPOINTMENTS', (req) => `PatientAppointments-${req.params.patientId}`),
    getPatientAppointmentsForDoctor
);

export default router;
