import prisma from '../src/utils/prisma.js';

async function main() {
    const roles = await prisma.role.findMany();
    console.log('Available Roles:');
    console.table(roles);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
