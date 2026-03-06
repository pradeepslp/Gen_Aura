import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { AuditService } from '../services/audit.service.js';
import { AppError } from '../utils/errors.js';

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
    const {
        fullName,
        age,
        gender,
        contactNumber,
        address,
        chiefComplaint,
        complaintDetails,
        medicalHistory,
        historyDetails,
        currentMedications,
        medicationDetails
    } = req.body;

    const patientId = req.user.id;

    if (!fullName || !age || !gender || !contactNumber || !address) {
        throw new AppError('Basic personal details are required', 400);
    }

    const appointment = await prisma.appointment.create({
        data: {
            patientId,
            fullName,
            age,
            gender,
            contactNumber,
            address,
            chiefComplaint: chiefComplaint || [],
            complaintDetails,
            medicalHistory: medicalHistory || [],
            historyDetails,
            currentMedications: currentMedications || [],
            medicationDetails
        }
    });

    await AuditService.log('APPOINTMENT_BOOKED', `New appointment booked by patient: ${patientId}`, patientId, req.ip);

    res.status(201).json({
        success: true,
        data: appointment
    });
});

export const getPatientAppointments = asyncHandler(async (req: Request, res: Response) => {
    const patientId = req.user.id;

    const appointments = await prisma.appointment.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
        success: true,
        data: appointments
    });
});

export const getPatientAppointmentsForDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const appointments = await prisma.appointment.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
        success: true,
        data: appointments
    });
});
