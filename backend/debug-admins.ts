import prisma from './src/utils/prisma.js';

async function main() {
    const admins = await prisma.adminUser.findMany();
    console.log("ADMINS FOUND: ", admins.length);
    console.log(JSON.stringify(admins, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
