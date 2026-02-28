import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { AuthServices } from './src/services/auth.service';

const prisma = new PrismaClient();

async function testDocReg() {
    console.log("Starting test registration...");
    try {
        const result = await AuthServices.registerUser({
            firstName: 'Test',
            lastName: 'Doctor',
            email: `testdoc_${Date.now()}@example.com`,
            password: 'Password123!',
            roleId: 'DOCTOR'
        }, '127.0.0.1');

        console.log("Registration successful:", result);

        // Verify database records
        const user = await prisma.user.findUnique({ where: { id: result.id }, include: { role: true } });
        console.log("User record:", user?.email, "| Role:", user?.role.name);

        const doctor = await prisma.doctor.findUnique({ where: { id: result.id } });
        console.log("Doctor record created:", !!doctor);
        if (doctor) console.log("Doctor details:", doctor);

    } catch (error) {
        console.error("Registration failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testDocReg();
