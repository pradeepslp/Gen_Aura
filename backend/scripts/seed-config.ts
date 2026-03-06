import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PrismaClientPkg = require('@prisma/client');
const { PrismaClient } = PrismaClientPkg;
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding System Configuration...');

    // We use a singleton pattern with id 'singleton'
    const config = await prisma.systemConfig.upsert({
        where: { id: 'singleton' },
        update: {},
        create: {
            id: 'singleton',
            mfaEnabled: true,
            sessionTimeout: 15,
            jwtExpiry: '15m',
            strictAudit: false,
            logRetention: 2190,
            phiRedaction: 'Full Redaction',
            anomalyEngine: true,
            lockoutThreshold: 5
        }
    });

    console.log('System Configuration initialized:', config);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
