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
            medicalNotes: true, // Simulated secure data
            vitals: true
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
        include: {
            doctor: {
                select: {
                    email: true,
                    doctorProfile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            specialization: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    await AuditService.log('VIEW_RECORD', `Prescriptions accessed for Patient: ${patientId}`, req.user.id, req.ip);

    res.status(200).json({ success: true, prescriptions });
});

export const getAssignedDoctors = asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const assignments = await prisma.doctorPatientAssignment.findMany({
        where: { patientId },
        include: {
            doctor: {
                include: {
                    doctorProfile: true
                }
            }
        }
    });

    const doctors = assignments.map((a: any) => ({
        id: a.doctor.id,
        email: a.doctor.email,
        firstName: a.doctor.doctorProfile?.firstName,
        lastName: a.doctor.doctorProfile?.lastName,
        specialization: a.doctor.doctorProfile?.specialization
    }));

    await AuditService.log('VIEW_RECORD', `Assigned Doctors accessed for Patient: ${patientId}`, req.user.id, req.ip);

    res.status(200).json({ success: true, doctors });
});

export const getPatientDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const [patient, reports, prescriptions, workflowRequests] = await Promise.all([
        prisma.patient.findUnique({
            where: { id: patientId },
            include: { vitals: true }
        }),
        prisma.labReport.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.prescription.findMany({
            where: { patientId },
            include: {
                doctor: {
                    select: {
                        email: true,
                        doctorProfile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                specialization: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.workflowRequest.findMany({
            where: { patientId },
            include: { currentDept: true },
            orderBy: { updatedAt: 'desc' }
        })
    ]);

    if (!patient) throw new AppError('Patient not found', 404);

    await AuditService.log('VIEW_RECORD', `Patient Dashboard consolidated access: ${patientId}`, req.user.id, req.ip);

    res.status(200).json({
        success: true,
        data: {
            patient,
            reports,
            prescriptions,
            workflowRequests
        }
    });
});

export const getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    });

    const formattedDoctors = doctors.map((d: any) => ({
        id: d.user.id,
        email: d.user.email,
        firstName: d.firstName,
        lastName: d.lastName,
        specialization: d.specialization,
        licenseNumber: d.licenseNumber
    }));

    res.status(200).json({ success: true, doctors: formattedDoctors });
});
