import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PrismaClientPkg = require('@prisma/client');
const PrismaClient = PrismaClientPkg.PrismaClient;
import bcrypt from 'bcrypt';
import logger from './utils/logger.js';

const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    logger.info('Starting database seeding...');

    // 1. Create Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN', description: 'System Administrator' }
    });

    const doctorRole = await prisma.role.upsert({
        where: { name: 'DOCTOR' },
        update: {},
        create: { name: 'DOCTOR', description: 'Medical Professional' }
    });

    const patientRole = await prisma.role.upsert({
        where: { name: 'PATIENT' },
        update: {},
        create: { name: 'PATIENT', description: 'Healthcare Patient' }
    });

    // 2. Create Permissions
    const permissions = [
        'view_patient_profiles',
        'view_lab_reports',
        'view_prescriptions',
        'write_prescriptions',
        'upload_lab_reports',
        'manage_users'
    ];

    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { name: perm },
            update: {},
            create: { name: perm, description: `Allow ${perm.replace(/_/g, ' ')}` }
        });
    }

    // 3. Assign Permissions to Roles
    const allPerms = await prisma.permission.findMany();

    // Doctor gets view and write
    const doctorPerms = allPerms.filter((p: any) => !['manage_users'].includes(p.name));
    for (const dp of doctorPerms) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: doctorRole.id, permissionId: dp.id } },
            update: {},
            create: { roleId: doctorRole.id, permissionId: dp.id }
        });
    }

    // Patient gets view own records
    const patientPerms = allPerms.filter((p: any) => ['view_patient_profiles', 'view_lab_reports', 'view_prescriptions'].includes(p.name));
    for (const pp of patientPerms) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: patientRole.id, permissionId: pp.id } },
            update: {},
            create: { roleId: patientRole.id, permissionId: pp.id }
        });
    }

    // 4. Create Master Admin
    const hashedAdminPassword = await bcrypt.hash('AdminSecurePassword123!', 12);
    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@securecare.local' },
        update: {},
        create: {
            email: 'admin@securecare.local',
            password: hashedAdminPassword
        }
    });

    logger.info(`Master Admin Created: ${admin.email}`);

    // 5. Create Demo Doctor (Approved)
    const hashedUserPass = await bcrypt.hash('DoctorSecure123!', 12);
    const doctor = await prisma.user.upsert({
        where: { email: 'doctor@securecare.local' },
        update: {},
        create: {
            email: 'doctor@securecare.local',
            password: hashedUserPass,
            roleId: doctorRole.id,
            status: 'APPROVED',
            approvedBy: admin.id,
            approvedAt: new Date()
        }
    });

    logger.info(`Demo Doctor Created: ${doctor.email}`);

    // 6. Create Demo Patient (Approved)
    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@securecare.local' },
        update: {},
        create: {
            email: 'patient@securecare.local',
            password: await bcrypt.hash('PatientSecure123!', 12),
            roleId: patientRole.id,
            status: 'APPROVED',
            approvedBy: admin.id,
            approvedAt: new Date()
        }
    });

    logger.info(`Demo Patient User Created: ${patientUser.email}`);

    // 7. Create Patient Profile Data
    const profile = await prisma.patient.upsert({
        where: { id: patientUser.id },
        update: {},
        create: {
            id: patientUser.id,
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('1980-05-15'),
            medicalNotes: 'Patient has a history of seasonal allergies. No known drug allergies.'
        }
    });

    // 8. Assign Doctor to Patient
    await prisma.doctorPatientAssignment.upsert({
        where: { doctorId_patientId: { doctorId: doctor.id, patientId: patientUser.id } },
        update: {},
        create: { doctorId: doctor.id, patientId: patientUser.id }
    });

    // 9. Create a Sample Prescription
    await prisma.prescription.create({
        data: {
            doctorId: doctor.id,
            patientId: patientUser.id,
            medication: 'Amoxicillin',
            dosage: '500mg twice daily for 7 days'
        }
    });

    logger.info('Database seeding completed successfully.');
}

main()
    .catch((e) => {
        logger.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
