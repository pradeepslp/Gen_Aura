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
    console.log('Seeding triage data...');

    // Cleanup first to avoid duplicates
    await prisma.triageAnswer.deleteMany({});
    await prisma.triageQuestion.deleteMany({});
    await prisma.symptom.deleteMany({});

    // 1. Fever
    const fever = await prisma.symptom.create({
        data: { name: 'Fever' }
    });

    await prisma.triageQuestion.create({
        data: {
            symptomId: fever.id,
            text: 'What is your current temperature?',
            answers: {
                create: [
                    { text: 'Normal (97-99°F)', score: 0 },
                    { text: 'Mild (99-101°F)', score: 2 },
                    { text: 'High (>102°F)', score: 5 }
                ]
            }
        }
    });

    await prisma.triageQuestion.create({
        data: {
            symptomId: fever.id,
            text: 'How long have you had this fever?',
            answers: {
                create: [
                    { text: 'Less than 1 day', score: 1 },
                    { text: '1-3 days', score: 2 },
                    { text: 'More than 3 days', score: 4 }
                ]
            }
        }
    });

    await prisma.triageQuestion.create({
        data: {
            symptomId: fever.id,
            text: 'Do you have difficulty breathing?',
            answers: {
                create: [
                    { text: 'No', score: 0 },
                    { text: 'Slight difficulty', score: 3 },
                    { text: 'Severe difficulty', score: 10 }
                ]
            }
        }
    });

    // 2. Chest Pain
    const chestPain = await prisma.symptom.create({
        data: { name: 'Chest Pain' }
    });

    await prisma.triageQuestion.create({
        data: {
            symptomId: chestPain.id,
            text: 'How would you describe the pain?',
            answers: {
                create: [
                    { text: 'Dull ache', score: 2 },
                    { text: 'Sharp/Stabbing', score: 5 },
                    { text: 'Pressure/Heaviness', score: 8 }
                ]
            }
        }
    });

    await prisma.triageQuestion.create({
        data: {
            symptomId: chestPain.id,
            text: 'Does the pain radiate to your arm or jaw?',
            answers: {
                create: [
                    { text: 'No', score: 0 },
                    { text: 'Yes', score: 10 }
                ]
            }
        }
    });

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
