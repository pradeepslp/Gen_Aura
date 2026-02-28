import prisma from './src/utils/prisma.js';

async function checkDoctors() {
    console.log("Querying doctors...");
    try {
        const doctors = await prisma.doctor.findMany();
        console.log(`Found ${doctors.length} doctors.`);
        console.log(doctors);

        const users = await prisma.user.findMany({
            include: { role: true }
        });

        const doctorUsers = users.filter(u => u.role.name === 'DOCTOR');
        console.log(`Found ${doctorUsers.length} user records with DOCTOR role.`);
    } catch (e) {
        console.error("Error querying db:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDoctors();
