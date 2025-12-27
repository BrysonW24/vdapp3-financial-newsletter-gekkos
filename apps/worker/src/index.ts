import { Worker } from 'bullmq';
import { redisConnection } from './queue/connection';
import {
  newsletterQueue,
  contentFetchQueue,
  contentSummarizeQueue,
  QUEUE_NAMES,
} from './queue/queues';
import { logger } from './utils/logger';
import {
  handleFetchMarkets,
  handleFetchNews,
  handleGenerateNewsletter,
  handleSummarizeArticles,
  handlePublishNewsletter,
  handleDailyOrchestration,
} from './jobs/handlers';

// Initialize workers for each queue
const contentFetchWorker = new Worker(QUEUE_NAMES.CONTENT_FETCH, async (job) => {
  switch (job.name) {
    case 'fetch-markets':
      return handleFetchMarkets(job);
    case 'fetch-news':
      return handleFetchNews(job);
    default:
      throw new Error(`Unknown content fetch job: ${job.name}`);
  }
}, {
  connection: redisConnection,
  concurrency: 3,
});

const contentSummarizeWorker = new Worker(
  QUEUE_NAMES.CONTENT_SUMMARIZE,
  async (job) => {
    switch (job.name) {
      case 'summarize-articles':
        return handleSummarizeArticles(job);
      default:
        throw new Error(`Unknown summarize job: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

const newsletterWorker = new Worker(QUEUE_NAMES.NEWSLETTER_GENERATION, async (job) => {
  switch (job.name) {
    case 'generate-newsletter':
      return handleGenerateNewsletter(job);
    case 'publish-newsletter':
      return handlePublishNewsletter(job);
    case 'daily-orchestration':
      return handleDailyOrchestration(job);
    default:
      throw new Error(`Unknown newsletter job: ${job.name}`);
  }
}, {
  connection: redisConnection,
  concurrency: 1, // Only one newsletter generation at a time
});

// Event listeners for content fetch worker
contentFetchWorker.on('completed', (job) => {
  logger.info(`✓ Content fetch job ${job.id} (${job.name}) completed`);
});

contentFetchWorker.on('failed', (job, err) => {
  logger.error(`✗ Content fetch job ${job?.id} (${job?.name}) failed`, err);
});

contentFetchWorker.on('error', (err) => {
  logger.error('Content fetch worker error', err);
});

// Event listeners for summarize worker
contentSummarizeWorker.on('completed', (job) => {
  logger.info(`✓ Summarize job ${job.id} (${job.name}) completed`);
});

contentSummarizeWorker.on('failed', (job, err) => {
  logger.error(`✗ Summarize job ${job?.id} (${job?.name}) failed`, err);
});

contentSummarizeWorker.on('error', (err) => {
  logger.error('Summarize worker error', err);
});

// Event listeners for newsletter worker
newsletterWorker.on('completed', (job) => {
  logger.info(`✓ Newsletter job ${job.id} (${job.name}) completed`);
});

newsletterWorker.on('failed', (job, err) => {
  logger.error(`✗ Newsletter job ${job?.id} (${job?.name}) failed`, err);
});

newsletterWorker.on('error', (err) => {
  logger.error('Newsletter worker error', err);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`\nReceived ${signal}, shutting down gracefully...`);

  try {
    await Promise.all([
      contentFetchWorker.close(),
      contentSummarizeWorker.close(),
      newsletterWorker.close(),
    ]);

    await redisConnection.quit();
    logger.info('Worker shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Startup
logger.info('====================================');
logger.info('🚀 Gekkos Newsletter Worker Started');
logger.info('====================================');
logger.info(`Content Fetch Queue: ${QUEUE_NAMES.CONTENT_FETCH}`);
logger.info(`Content Summarize Queue: ${QUEUE_NAMES.CONTENT_SUMMARIZE}`);
logger.info(`Newsletter Queue: ${QUEUE_NAMES.NEWSLETTER_GENERATION}`);
logger.info('');
logger.info('Available jobs:');
logger.info('  - fetch-markets (content-fetch)');
logger.info('  - fetch-news (content-fetch)');
logger.info('  - summarize-articles (content-summarize)');
logger.info('  - generate-newsletter (newsletter-generation)');
logger.info('  - publish-newsletter (newsletter-generation)');
logger.info('  - daily-orchestration (newsletter-generation)');
logger.info('');
logger.info('Waiting for jobs...');
