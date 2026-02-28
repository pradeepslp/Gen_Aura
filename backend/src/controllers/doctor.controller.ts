import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { AuditService } from '../services/audit.service.js';

export const getMyPatients = asyncHandler(async (req: Request, res: Response) => {
    const doctorId = req.user.id;

    const assignments = await prisma.doctorPatientAssignment.findMany({
        where: { doctorId },
        include: {
            patient: {
                select: {
                    id: true,
                    email: true,
                    status: true,
                    createdAt: true
                }
            }
        }
    });

    const patients = assignments.map((a: any) => a.patient);

    res.status(200).json({ success: true, patients });
});

export const addPrescription = asyncHandler(async (req: Request, res: Response) => {
    const { patientId, medication, dosage } = req.body;
    const doctorId = req.user.id;

    const prescription = await prisma.prescription.create({
        data: {
            patientId,
            doctorId,
            medication,
            dosage
        }
    });

    await AuditService.log('WRITE_PRESCRIPTION', `New prescription for patient ${patientId}`, doctorId, (req.ip as string) || 'unknown');

    res.status(201).json({ success: true, prescription });
});

export const uploadLabReport = asyncHandler(async (req: Request, res: Response) => {
    const { patientId, reportUrl } = req.body;
    const doctorId = req.user.id;

    const report = await prisma.labReport.create({
        data: {
            patientId,
            reportUrl,
            uploadedBy: doctorId
        }
    });

    await AuditService.log('UPLOAD_LAB_REPORT', `New lab report for patient ${patientId}`, doctorId, (req.ip as string) || 'unknown');

    res.status(201).json({ success: true, report });
});
