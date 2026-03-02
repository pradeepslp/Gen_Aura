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
    console.log("Checking for orphaned patients...");
    const patients = await prisma.$queryRawUnsafe(`SELECT * FROM "Patient"`);
    const users = await prisma.$queryRawUnsafe(`SELECT id FROM "User"`);

    const userIds = new Set((users as any[]).map(u => u.id));

    let deletedPatients = 0;
    for (const p of patients as any[]) {
        if (!userIds.has(p.id)) {
            console.log(`Deleting orphaned patient: ${p.id}`);
            await prisma.$executeRawUnsafe(`DELETE FROM "Patient" WHERE id = '${p.id}'`);
            deletedPatients++;
        }
    }
    console.log(`Deleted ${deletedPatients} orphaned patients.`);

    console.log("Checking for orphaned doctors...");
    const doctors = await prisma.$queryRawUnsafe(`SELECT * FROM "Doctor"`);

    let deletedDoctors = 0;
    for (const d of doctors as any[]) {
        if (!userIds.has(d.id)) {
            console.log(`Deleting orphaned doctor: ${d.id}`);
            await prisma.$executeRawUnsafe(`DELETE FROM "Doctor" WHERE id = '${d.id}'`);
            deletedDoctors++;
        }
    }
    console.log(`Deleted ${deletedDoctors} orphaned doctors.`);

    console.log("Checking for mismatching IDs...");

    // Check if there are User records with role PATIENT that don't have Patient records
    const patientRole = await prisma.$queryRawUnsafe(`SELECT id FROM "Role" WHERE name = 'PATIENT' LIMIT 1`);
    if ((patientRole as any[]).length > 0) {
        const pRoleId = (patientRole as any[])[0].id;
        const patientUsers = await prisma.$queryRawUnsafe(`SELECT id FROM "User" WHERE "roleId" = '${pRoleId}'`);
        const pIds = new Set((patients as any[]).map(p => p.id));
        for (const pu of patientUsers as any[]) {
            if (!pIds.has(pu.id)) {
                console.log(`User ${pu.id} is PATIENT but has no Patient record.`);
            }
        }
    }

    console.log("Cleanup complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
