"""Job scheduling configuration for recurring background tasks."""

import { Queue } from 'bullmq';
import { redisConnection } from './queue/connection';
import { logger } from './utils/logger';

/**
 * Configure recurring job schedules using BullMQ repeat patterns.
 * Cron patterns: "minute hour day_of_month month day_of_week"
 */
export async function configureSchedules() {
  try {
    logger.info('Configuring job schedules...');

    // ==========================================
    // COMMODITY JOBS
    // ==========================================
    const commodityQueue = new Queue('commodity-jobs', {
      connection: redisConnection,
    });

    // Fetch commodity prices every 4 hours (0, 4, 8, 12, 16, 20 UTC)
    await commodityQueue.add(
      'fetch-commodity-prices',
      {},
      {
        repeat: {
          pattern: '0 */4 * * *', // Every 4 hours
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Commodity price fetch: Every 4 hours');

    // Calculate commodity signals daily at 9 AM UTC
    await commodityQueue.add(
      'calculate-commodity-signals',
      {},
      {
        repeat: {
          pattern: '0 9 * * *', // 9 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Commodity signals: Daily at 09:00 UTC');

    // Track AI materials daily at 10 AM UTC
    await commodityQueue.add(
      'track-ai-materials',
      {},
      {
        repeat: {
          pattern: '0 10 * * *', // 10 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ AI materials tracking: Daily at 10:00 UTC');

    // Update space tech materials daily at 11 AM UTC
    await commodityQueue.add(
      'update-space-tech-materials',
      {},
      {
        repeat: {
          pattern: '0 11 * * *', // 11 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Space tech materials: Daily at 11:00 UTC');

    // ==========================================
    // VENTURE CAPITAL JOBS
    // ==========================================
    const vcQueue = new Queue('vc-jobs', { connection: redisConnection });

    // Sync VC data daily at 2 AM UTC
    await vcQueue.add(
      'sync-vc-data',
      {},
      {
        repeat: {
          pattern: '0 2 * * *', // 2 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ VC data sync: Daily at 02:00 UTC');

    // Track funding rounds daily at 3 AM UTC
    await vcQueue.add(
      'track-funding-rounds',
      {},
      {
        repeat: {
          pattern: '0 3 * * *', // 3 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Funding rounds tracking: Daily at 03:00 UTC');

    // Monitor IPO pipeline daily at 4 AM UTC
    await vcQueue.add(
      'monitor-ipo-pipeline',
      {},
      {
        repeat: {
          pattern: '0 4 * * *', // 4 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ IPO pipeline monitoring: Daily at 04:00 UTC');

    // Track M&A activity daily at 5 AM UTC
    await vcQueue.add(
      'track-m-and-a',
      {},
      {
        repeat: {
          pattern: '0 5 * * *', // 5 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ M&A tracking: Daily at 05:00 UTC');

    // Track top investors weekly on Mondays at 6 AM UTC
    await vcQueue.add(
      'track-top-investors',
      {},
      {
        repeat: {
          pattern: '0 6 * * 1', // Monday 6 AM UTC
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Top investors tracking: Weekly Mondays at 06:00 UTC');

    // ==========================================
    // PORTFOLIO JOBS
    // ==========================================
    const portfolioQueue = new Queue('portfolio-jobs', {
      connection: redisConnection,
    });

    // Update portfolio prices every 2 hours during market hours
    // (Market hours: 1:30 AM - 8:00 PM UTC for US equity markets)
    await portfolioQueue.add(
      'update-portfolio-prices',
      {},
      {
        repeat: {
          pattern: '0 1,3,5,7,9,11,13,15,17,19 * * 1-5', // Every 2 hours on weekdays
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Portfolio price updates: Every 2 hours (market hours, weekdays)');

    // Create portfolio snapshots daily at 4 PM UTC
    await portfolioQueue.add(
      'create-portfolio-snapshots',
      {},
      {
        repeat: {
          pattern: '0 16 * * *', // 4 PM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Portfolio snapshots: Daily at 16:00 UTC');

    // Calculate portfolio performance daily at 5 PM UTC
    await portfolioQueue.add(
      'calculate-portfolio-performance',
      {},
      {
        repeat: {
          pattern: '0 17 * * *', // 5 PM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Portfolio performance: Daily at 17:00 UTC');

    // Generate portfolio alerts daily at 6 PM UTC
    await portfolioQueue.add(
      'generate-portfolio-alerts',
      {},
      {
        repeat: {
          pattern: '0 18 * * *', // 6 PM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Portfolio alerts: Daily at 18:00 UTC');

    // ==========================================
    // CHART & TECHNICAL ANALYSIS JOBS
    // ==========================================
    const chartQueue = new Queue('chart-jobs', { connection: redisConnection });

    // Batch fetch all chart data hourly during market hours
    await chartQueue.add(
      'batch-fetch-chart-data',
      {},
      {
        repeat: {
          pattern: '0 1,3,5,7,9,11,13,15,17,19 * * 1-5', // Every 2 hours, weekdays
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Chart data batch fetch: Every 2 hours (market hours, weekdays)');

    // Calculate moving averages daily at 8 AM UTC
    await chartQueue.add(
      'calculate-moving-averages',
      {},
      {
        repeat: {
          pattern: '0 8 * * *', // 8 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Moving averages: Daily at 08:00 UTC');

    // Update chart signals daily at 9 AM UTC
    await chartQueue.add(
      'update-chart-signals',
      {},
      {
        repeat: {
          pattern: '0 9 * * *', // 9 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Chart signals: Daily at 09:00 UTC');

    // Generate Druckenmiller report daily at 8 AM UTC
    await chartQueue.add(
      'generate-druckenmiller-report',
      {},
      {
        repeat: {
          pattern: '0 8 * * *', // 8 AM UTC daily
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Druckenmiller report: Daily at 08:00 UTC');

    // Generate chart summary weekly on Sundays at 8 AM UTC
    await chartQueue.add(
      'generate-chart-summary',
      {},
      {
        repeat: {
          pattern: '0 8 * * 0', // Sunday 8 AM UTC
          tz: 'UTC',
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    logger.info('✓ Chart summary: Weekly Sundays at 08:00 UTC');

    logger.info('');
    logger.info('====================================');
    logger.info('✓ All job schedules configured');
    logger.info('====================================');

  } catch (error) {
    logger.error('Failed to configure schedules', error);
    throw error;
  }
}

/**
 * Summary of configured schedules:
 *
 * MARKET HOURS JOBS (Mon-Fri during market hours):
 * - Portfolio prices: Every 2 hours
 * - Chart data batch: Every 2 hours
 *
 * DAILY JOBS:
 * - 02:00 UTC: VC data sync
 * - 03:00 UTC: Funding rounds tracking
 * - 04:00 UTC: IPO pipeline monitoring
 * - 05:00 UTC: M&A activity tracking
 * - 08:00 UTC: Druckenmiller report, Moving averages, Chart summary
 * - 09:00 UTC: Commodity signals, AI materials, Chart signals
 * - 10:00 UTC: AI materials detailed tracking
 * - 11:00 UTC: Space tech materials
 * - 16:00 UTC: Portfolio snapshots
 * - 17:00 UTC: Portfolio performance calculation
 * - 18:00 UTC: Portfolio alerts
 *
 * HOURLY COMMODITY JOBS:
 * - Every 4 hours: Commodity price fetches (0, 4, 8, 12, 16, 20 UTC)
 *
 * WEEKLY JOBS:
 * - Monday 06:00 UTC: Top investors tracking
 * - Sunday 08:00 UTC: Chart summary
 */
