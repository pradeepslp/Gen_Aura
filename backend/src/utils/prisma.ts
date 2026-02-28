import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PrismaClientPkg = require('@prisma/client');
const PrismaClient = PrismaClientPkg.PrismaClient;

// Prevent multiple instances of Prisma Client in development
declare global {
    var prisma: any;
}

const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
