"""Portfolio tracking and snapshot jobs."""

import { Job } from 'bullmq';
import axios from 'axios';
import { logger } from '../utils/logger';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

/**
 * Create daily portfolio snapshots for all users.
 * Called daily at 4 PM to capture portfolio values for trend tracking.
 */
export async function handleCreatePortfolioSnapshots(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting portfolio snapshot creation...`);

    // Call backend API to create snapshots
    const response = await axios.post(
      `${BACKEND_API_URL}/portfolio/snapshots/daily`,
      {
        snapshotDate: new Date().toISOString().split('T')[0],
        includeAllUsers: true,
      },
      {
        timeout: 60000, // 60 second timeout for potentially long operation
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;

    logger.info(
      `[Job ${job.id}] Created ${result.snapshotsCreated} portfolio snapshots`
    );

    return {
      success: true,
      snapshotsCreated: result.snapshotsCreated || 0,
      usersProcessed: result.usersProcessed || 0,
      totalValue: result.totalPortfolioValue || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to create portfolio snapshots`, error);
    throw error;
  }
}

/**
 * Calculate portfolio performance metrics.
 * Called daily to track P&L, gains/losses, and performance trends.
 */
export async function handleCalculatePortfolioPerformance(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting portfolio performance calculation...`);

    // Get portfolio performance for all users
    const response = await axios.get(
      `${BACKEND_API_URL}/portfolio/performance/all?days=30`,
      { timeout: 30000 }
    );

    const performanceData = response.data;

    logger.info(
      `[Job ${job.id}] Calculated performance for ${performanceData.portfoliosAnalyzed || 0} portfolios`
    );

    return {
      success: true,
      portfoliosAnalyzed: performanceData.portfoliosAnalyzed || 0,
      topGainer: performanceData.topGainer || null,
      topLoser: performanceData.topLoser || null,
      avgPerformance: performanceData.avgPerformance || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to calculate performance`, error);
    throw error;
  }
}

/**
 * Fetch and update current prices for all portfolio holdings.
 * Called every 2 hours during market hours to keep portfolio values current.
 */
export async function handleUpdatePortfolioPrices(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting portfolio price update...`);

    // Get all user portfolios and fetch current prices
    const response = await axios.post(
      `${BACKEND_API_URL}/portfolio/prices/refresh`,
      {
        refreshAll: true,
      },
      {
        timeout: 45000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;

    logger.info(
      `[Job ${job.id}] Updated prices for ${result.holdingsUpdated || 0} holdings`
    );

    return {
      success: true,
      holdingsUpdated: result.holdingsUpdated || 0,
      portfoliosUpdated: result.portfoliosUpdated || 0,
      failedUpdates: result.failedUpdates || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to update portfolio prices`, error);
    throw error;
  }
}

/**
 * Generate portfolio alerts and notifications.
 * Called daily to identify significant portfolio changes or alerts.
 */
export async function handleGeneratePortfolioAlerts(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting portfolio alerts generation...`);

    const response = await axios.post(
      `${BACKEND_API_URL}/portfolio/alerts/generate`,
      {
        thresholdPercent: 5, // Alert on 5% changes
        lookbackDays: 1,
      },
      { timeout: 30000 }
    );

    const alerts = response.data;

    logger.info(
      `[Job ${job.id}] Generated ${alerts.totalAlerts || 0} portfolio alerts`
    );

    return {
      success: true,
      totalAlerts: alerts.totalAlerts || 0,
      gainAlerts: alerts.gainAlerts || 0,
      lossAlerts: alerts.lossAlerts || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to generate alerts`, error);
    throw error;
  }
}
