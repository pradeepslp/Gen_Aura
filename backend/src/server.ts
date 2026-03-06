import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import logger from './utils/logger.js';
import { connectRedis } from './utils/redis.js';
import prisma from './utils/prisma.js';

const port = process.env.PORT || 3001;

const startServer = async () => {
    try {
        // 1. Connect Redis (non-blocking, gracefully skip if unavailable)
        try {
            if (process.env.SKIP_REDIS !== 'true') {
                await Promise.race([
                    connectRedis(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timeout')), 2000))
                ]);
            } else {
                logger.info('Redis connection skipped as per configuration.');
            }
        } catch (err) {
            logger.warn('Redis unavailable, continuing without cache: Redis connection failed or timed out.');
        }

        // 2. Test Prisma Connection
        await prisma.$connect();
        logger.info('Prisma connected to database successfully.');

        // 3. Start Express server
        const server = app.listen(port, () => {
            logger.info(`App is running on port ${port}...`);
        });

        // Handle Unhandled Rejections
        process.on('unhandledRejection', (err: any) => {
            logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
            logger.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

        // Handle SIGTERM
        process.on('SIGTERM', () => {
            logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
            server.close(() => {
                logger.info('💥 Process terminated!');
            });
        });

    } catch (err: any) {
        logger.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
