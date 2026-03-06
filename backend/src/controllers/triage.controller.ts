import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { AuditService } from '../services/audit.service.js';
import { AppError } from '../utils/errors.js';

export const getSymptoms = asyncHandler(async (req: Request, res: Response) => {
    const symptoms = await prisma.symptom.findMany({
        orderBy: { name: 'asc' }
    });
    res.status(200).json({ success: true, data: symptoms });
});

export const getQuestions = asyncHandler(async (req: Request, res: Response) => {
    const { symptomId } = req.params;
    const questions = await prisma.triageQuestion.findMany({
        where: { symptomId },
        include: { answers: { orderBy: { score: 'asc' } } }
    });
    res.status(200).json({ success: true, data: questions });
});

export const evaluateTriage = asyncHandler(async (req: Request, res: Response) => {
    const { symptomId, answers } = req.body; // answers is an array of answer IDs
    const patientId = req.user.id;

    if (!symptomId || !Array.isArray(answers)) {
        throw new AppError('Symptom ID and answers array are required', 400);
    }

    const selectedAnswers = await prisma.triageAnswer.findMany({
        where: { id: { in: answers } }
    });

    const totalScore = selectedAnswers.reduce((sum: number, ans: any) => sum + ans.score, 0);

    let riskLevel = 'Low';
    let specialist = 'General Physician';

    if (totalScore >= 10) {
        riskLevel = 'Emergency';
        specialist = 'Emergency Department';
    } else if (totalScore >= 7) {
        riskLevel = 'High';
        specialist = 'Specialist Consultation';
    } else if (totalScore >= 4) {
        riskLevel = 'Moderate';
        specialist = 'Internal Medicine';
    }

    const result = await prisma.triageResult.create({
        data: {
            patientId,
            symptomId,
            totalScore,
            riskLevel,
            recommendedSpecialist: specialist
        },
        include: { symptom: true }
    });

    await AuditService.log('TRIAGE_PERFORMED', `Risk Level: ${riskLevel} for symptom: ${result.symptom.name}`, patientId, req.ip);

    res.status(201).json({ success: true, data: result });
});

export const getTriageHistory = asyncHandler(async (req: Request, res: Response) => {
    const patientId = req.user.id;
    const history = await prisma.triageResult.findMany({
        where: { patientId },
        include: { symptom: true },
        orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: history });
});
