import { Router } from 'express';
import { getSymptoms, getQuestions, evaluateTriage, getTriageHistory } from '../controllers/triage.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// All triage routes require authentication
router.use(authenticateUser);

router.get('/symptoms', getSymptoms);
router.get('/questions/:symptomId', getQuestions);
router.post('/evaluate', evaluateTriage);
router.get('/history', getTriageHistory);

export default router;
