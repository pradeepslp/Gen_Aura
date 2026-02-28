import prisma from './src/utils/prisma.js';

async function approveAll() {
    console.log("Approving all users...");
    try {
        const result = await prisma.user.updateMany({
            where: { status: 'PENDING' },
            data: { status: 'APPROVED' }
        });
        console.log(`Successfully approved ${result.count} PENDING users.`);
    } catch (e) {
        console.error("Error updating users:", e);
    } finally {
        await prisma.$disconnect();
    }
}

approveAll();
