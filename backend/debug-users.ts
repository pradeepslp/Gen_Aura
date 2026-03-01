import prisma from './src/utils/prisma.js';

async function main() {
    const updated = await prisma.user.updateMany({
        where: { emailVerified: false },
        data: { emailVerified: true }
    });
    console.log(`Updated ${updated.count} users to emailVerified: true`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
