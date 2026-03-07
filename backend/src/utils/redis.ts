import { createClient } from 'redis';
import logger from './logger.js';

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                // Stop retrying so aggressively if it's failing
                return new Error('Redis reconnection failed after 10 retries');
            }
            return Math.min(retries * 50, 2000);
        }
    }
});

let isRedisSuppressed = false;

redisClient.on('error', (err: any) => {
    // Only log if not suppressed AND if it's not a common "ECONNREFUSED" when we intended to skip
    if (!isRedisSuppressed && process.env.SKIP_REDIS !== 'true') {
        logger.error('Redis Client Error', err);
    }
});
redisClient.on('connect', () => {
    isRedisSuppressed = false;
    logger.info('Redis Client Connected');
});

export const connectRedis = async () => {
    if (process.env.SKIP_REDIS === 'true') {
        isRedisSuppressed = true;
        return;
    }
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
        } catch (err) {
            isRedisSuppressed = true;
            throw err;
        }
    }
};
