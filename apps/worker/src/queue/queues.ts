import { Queue } from 'bullmq';
import { redisConnection } from './connection';

export const QUEUE_NAMES = {
  NEWSLETTER_GENERATION: 'newsletter-generation',
  CONTENT_FETCH: 'content-fetch',
  CONTENT_SUMMARIZE: 'content-summarize',
} as const;

export const newsletterQueue = new Queue(QUEUE_NAMES.NEWSLETTER_GENERATION, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600, // 24 hours
    },
    removeOnFail: {
      count: 1000,
      age: 7 * 24 * 3600, // 7 days
    },
  },
});

export const contentFetchQueue = new Queue(QUEUE_NAMES.CONTENT_FETCH, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: {
      count: 500,
      age: 12 * 3600, // 12 hours
    },
  },
});

export const contentSummarizeQueue = new Queue(QUEUE_NAMES.CONTENT_SUMMARIZE, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1500,
    },
    removeOnComplete: {
      count: 500,
      age: 12 * 3600, // 12 hours
    },
  },
});
