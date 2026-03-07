import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { AuditService } from '../services/audit.service.js';

/**
 * Creates a new workflow request.
 * Can be initiated by a Patient or a Doctor.
 */
export const createRequest = asyncHandler(async (req: Request, res: Response) => {
    const { patientId, category, title, description, priority, initialDeptId } = req.body;
    const actorId = req.user.id;

    // Check if patient exists
    const patient = await prisma.user.findUnique({
        where: { id: patientId },
        include: { role: true }
    });

    if (!patient) throw new AppError('Patient not found', 404);

    // Create workflow request
    const request = await prisma.workflowRequest.create({
        data: {
            patientId,
            category,
            title,
            description,
            priority: priority || 'MEDIUM',
            currentDeptId: initialDeptId,
            status: 'OPEN',
            steps: {
                create: {
                    toDeptId: initialDeptId,
                    actorId,
                    actionTaken: 'REQUEST_CREATED',
                    comments: 'Initial request creation'
                }
            }
        },
        include: {
            steps: true,
            currentDept: true
        }
    });

    await AuditService.log('WORKFLOW_CREATE', `WorkflowRequest: ${request.id}`, actorId, req.ip);

    res.status(201).json({
        success: true,
        message: 'Workflow request created successfully',
        request
    });
});

/**
 * Moves a request to a different state or department.
 */
export const moveRequest = asyncHandler(async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { toDeptId, status, actionTaken, comments } = req.body;
    const actorId = req.user.id;

    const currentRequest = await prisma.workflowRequest.findUnique({
        where: { id: requestId },
        include: { currentDept: true }
    });

    if (!currentRequest) throw new AppError('Workflow request not found', 404);

    // Authority check: Staff can only move requests if they are in the department currently handling it,
    // OR if they are an Admin
    const isAdmin = req.user.role.name === 'ADMIN';
    if (!isAdmin && req.user.departmentId && req.user.departmentId !== currentRequest.currentDeptId) {
        throw new AppError('You do not have authority to move this request from the current department', 403);
    }

    const fromDeptId = currentRequest.currentDeptId;

    const updatedRequest = await prisma.$transaction(async (tx: any) => {
        const reqUpdate = await tx.workflowRequest.update({
            where: { id: requestId },
            data: {
                currentDeptId: toDeptId || fromDeptId,
                status: status || 'IN_PROGRESS'
            }
        });

        await tx.workflowStep.create({
            data: {
                requestId,
                fromDeptId,
                toDeptId: toDeptId || fromDeptId,
                actorId,
                actionTaken,
                comments: comments || `Request updated to ${status}`
            }
        });

        return reqUpdate;
    });

    await AuditService.log('WORKFLOW_TRANSFER', `WorkflowRequest: ${requestId} moved to ${toDeptId || fromDeptId}`, actorId, req.ip);

    res.status(200).json({
        success: true,
        message: 'Workflow request updated successfully',
        request: updatedRequest
    });
});

/**
 * Returns all WorkflowRequest items where currentDeptId matches the staff member's department.
 */
export const getDepartmentQueue = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = req.user.departmentId;

    if (!departmentId) throw new AppError('Staff member not assigned to a department', 400);

    const queue = await prisma.workflowRequest.findMany({
        where: { currentDeptId: departmentId },
        include: {
            patient: {
                select: {
                    id: true,
                    email: true,
                    patientProfile: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            steps: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    res.status(200).json({ success: true, queue });
});

/**
 * Allows a patient to see the full timeline (WorkflowStep) of their specific request.
 */
export const getPatientRequestHistory = asyncHandler(async (req: Request, res: Response) => {
    const { requestId } = req.params;

    const request = await prisma.workflowRequest.findUnique({
        where: { id: requestId },
        include: {
            currentDept: true,
            steps: {
                include: {
                    fromDept: true,
                    toDept: true,
                    actor: {
                        select: {
                            id: true,
                            email: true,
                            role: { select: { name: true } },
                            doctorProfile: { select: { firstName: true, lastName: true, specialization: true } },
                            labTechnicianProfile: { select: { firstName: true, lastName: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!request) throw new AppError('Workflow request not found', 404);

    // Secure check
    const isPatient = req.user.id === request.patientId;
    const isStaff = !!req.user.departmentId;
    const isAdmin = req.user.role.name === 'ADMIN';

    if (!isPatient && !isStaff && !isAdmin) {
        throw new AppError('Unauthorized access to workflow history', 403);
    }

    res.status(200).json({ success: true, request });
});

/**
 * Get all departments
 */
export const getDepartments = asyncHandler(async (req: Request, res: Response) => {
    const departments = await prisma.department.findMany({
        orderBy: { name: 'asc' }
    });
    res.status(200).json({ success: true, departments });
});
