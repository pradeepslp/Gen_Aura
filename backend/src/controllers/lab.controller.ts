import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { AuditService } from '../services/audit.service.js';

export const getAllPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await prisma.user.findMany({
        where: {
            role: { name: 'PATIENT' },
            status: 'APPROVED'
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            patientProfile: true
        }
    });

    res.status(200).json({ success: true, patients });
});

export const uploadReport = asyncHandler(async (req: Request, res: Response) => {
    const { patientId, reportUrl } = req.body;
    const technicianId = req.user.id;

    const report = await prisma.labReport.create({
        data: {
            patientId,
            reportUrl,
            uploadedBy: technicianId
        }
    });

    await AuditService.log('UPLOAD_LAB_REPORT', `Lab Technician ${technicianId} uploaded report for patient ${patientId}`, patientId, (req.ip as string) || 'unknown');

    res.status(201).json({ success: true, report });
});
