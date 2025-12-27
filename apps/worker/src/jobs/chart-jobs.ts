"""Technical analysis and Druckenmiller chart generation jobs."""

import { Job } from 'bullmq';
import axios from 'axios';
import { logger } from '../utils/logger';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

/**
 * Generate Druckenmiller technical analysis charts and report.
 * Called daily at 8 AM to create comprehensive PDF report with 270+ global assets.
 */
export async function handleGenerateDruckenmillerReport(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting Druckenmiller report generation...`);

    const reportDate = new Date().toISOString().split('T')[0];

    // Request PDF report generation
    const response = await axios.post(
      `${BACKEND_API_URL}/charts/druckenmiller-report`,
      {
        targetDate: reportDate,
        includeSignals: true,
        format: 'pdf',
      },
      {
        timeout: 120000, // 2 minute timeout for PDF generation
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    logger.info(
      `[Job ${job.id}] Generated Druckenmiller report: ${response.data.length} bytes`
    );

    return {
      success: true,
      reportSize: response.data.length,
      reportDate,
      assetsIncluded: 270,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to generate Druckenmiller report`, error);
    throw error;
  }
}

/**
 * Update and calculate technical signals for all tracked assets.
 * Called daily to detect moving average crossovers and bullish/bearish signals.
 */
export async function handleUpdateChartSignals(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting chart signals update...`);

    // Fetch all signals for the last day
    const response = await axios.get(
      `${BACKEND_API_URL}/charts/signals?days=1&limit=500`,
      { timeout: 60000 }
    );

    const signalsData = response.data;

    logger.info(
      `[Job ${job.id}] Updated signals: ${signalsData.totalSignals} signals detected`
    );

    return {
      success: true,
      totalSignals: signalsData.totalSignals || 0,
      bullishSignals: signalsData.bullishSignals || 0,
      bearishSignals: signalsData.bearishSignals || 0,
      assetsWithSignals: signalsData.assetsWithSignals || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to update chart signals`, error);
    throw error;
  }
}

/**
 * Batch fetch and update all chart data for 270+ global assets.
 * Called hourly during market hours to keep all asset prices current.
 */
export async function handleBatchFetchChartData(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting batch chart data fetch...`);

    // Fetch all chart timeseries data
    const response = await axios.post(
      `${BACKEND_API_URL}/charts/timeseries/batch-fetch`,
      {
        includeAllSymbols: true,
      },
      { timeout: 90000 } // 90 second timeout for batch operation
    );

    const result = response.data;

    logger.info(
      `[Job ${job.id}] Fetched chart data: ${result.symbolsUpdated || 0} symbols`
    );

    return {
      success: true,
      symbolsUpdated: result.symbolsUpdated || 0,
      dataPointsCreated: result.dataPointsCreated || 0,
      failedSymbols: result.failedSymbols || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to fetch chart data`, error);
    throw error;
  }
}

/**
 * Calculate and update moving averages for all tracked symbols.
 * Called daily to compute 8-period and 20-period moving averages.
 */
export async function handleCalculateMovingAverages(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting moving average calculation...`);

    // Update all moving averages
    const response = await axios.post(
      `${BACKEND_API_URL}/charts/moving-averages/calculate`,
      {
        updateAll: true,
        periods: [8, 20],
      },
      { timeout: 60000 }
    );

    const result = response.data;

    logger.info(
      `[Job ${job.id}] Calculated MAs: ${result.symbolsUpdated || 0} symbols`
    );

    return {
      success: true,
      symbolsUpdated: result.symbolsUpdated || 0,
      ma8Updated: result.ma8Updated || 0,
      ma20Updated: result.ma20Updated || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to calculate moving averages`, error);
    throw error;
  }
}

/**
 * Generate summary statistics for the Druckenmiller asset class analysis.
 * Called weekly to provide summary metrics and sector analysis.
 */
export async function handleGenerateChartSummary(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting chart summary generation...`);

    // Get summary statistics
    const response = await axios.get(
      `${BACKEND_API_URL}/charts/summary?includeSignals=true`,
      { timeout: 30000 }
    );

    const summary = response.data;

    logger.info(
      `[Job ${job.id}] Generated summary: ${summary.totalAssets || 0} assets`
    );

    return {
      success: true,
      totalAssets: summary.totalAssets || 0,
      bullishAssets: summary.bullishAssets || 0,
      bearishAssets: summary.bearishAssets || 0,
      neutralAssets: summary.neutralAssets || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to generate chart summary`, error);
    throw error;
  }
}
