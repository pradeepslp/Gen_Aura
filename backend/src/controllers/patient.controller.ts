import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { AuditService } from '../services/audit.service.js';

export const getPatientProfile = asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            medicalNotes: true // Simulated secure data
        }
    });

    if (!patient) throw new AppError('Patient not found', 404);

    await AuditService.log('VIEW_RECORD', `Patient Profile: ${patientId}`, req.user.id, req.ip);

    res.status(200).json({ success: true, patient });
});

export const getPatientLabReports = asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const reports = await prisma.labReport.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' }
    });

    await AuditService.log('VIEW_RECORD', `Lab Reports accessed for Patient: ${patientId}`, req.user.id, req.ip);

    res.status(200).json({ success: true, reports });
});

export const getPatientPrescriptions = asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const prescriptions = await prisma.prescription.findMany({
        where: { patientId },
        include: { doctor: { select: { email: true } } },
        orderBy: { createdAt: 'desc' }
    });

    await AuditService.log('VIEW_RECORD', `Prescriptions accessed for Patient: ${patientId}`, req.user.id, req.ip);

    res.status(200).json({ success: true, prescriptions });
});
