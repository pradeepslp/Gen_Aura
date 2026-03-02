import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PrismaClientPkg = require('@prisma/client');
const PrismaClient = PrismaClientPkg.PrismaClient;
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding patient vitals...");

    const patients = await prisma.patient.findMany({
        include: { vitals: true }
    });

    for (const patient of patients) {
        if (!patient.vitals) {
            await prisma.patientVitals.create({
                data: {
                    patientId: patient.id,
                    heartRate: (Math.floor(Math.random() * (100 - 60 + 1)) + 60).toString(),
                    bloodPressure: `${Math.floor(Math.random() * (130 - 110 + 1)) + 110}/${Math.floor(Math.random() * (90 - 70 + 1)) + 70}`,
                    bloodGlucose: (Math.random() * (6.5 - 4.0) + 4.0).toFixed(1)
                }
            });
            console.log(`Created vitals for patient ${patient.id}`);
        }
    }

    console.log("Assigning users if needed...");
    // Ensure doctor@securecare.local has some assignments
    const doctor = await prisma.user.findFirst({
        where: { email: 'doctor@securecare.local' }
    });

    const patientUser = await prisma.user.findFirst({
        where: { email: 'patient@securecare.local' }
    });

    if (doctor && patientUser) {
        await prisma.doctorPatientAssignment.upsert({
            where: { doctorId_patientId: { doctorId: doctor.id, patientId: patientUser.id } },
            update: {},
            create: { doctorId: doctor.id, patientId: patientUser.id }
        });
        console.log("Ensured assignment between default doctor and patient.");
    }

    console.log("Seed script logic complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
