import Redis from 'ioredis';
import { logger } from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    logger.warn(`Retrying Redis connection (attempt ${times}), delay: ${delay}ms`);
    return delay;
  },
  reconnectOnError: (err) => {
    logger.error('Redis connection error:', err);
    return true;
  },
});

redisConnection.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisConnection.on('error', (err) => {
  logger.error('Redis error:', err);
});

redisConnection.on('ready', () => {
  logger.info('Redis is ready to accept commands');
});
