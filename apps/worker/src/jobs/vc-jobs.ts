"""Venture capital data synchronization and tracking jobs."""

import { Job } from 'bullmq';
import axios from 'axios';
import { logger } from '../utils/logger';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

/**
 * Synchronize VC fund and company data.
 * Called daily to update company profiles, valuations, and investor information.
 */
export async function handleSyncVCData(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting VC data synchronization...`);

    // Get market summary to trigger updates
    const response = await axios.get(
      `${BACKEND_API_URL}/venture-capital/summary`,
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data;

    logger.info(
      `[Job ${job.id}] VC data synchronized: ${summary.summary.total_ai_companies} AI companies, ${summary.summary.total_space_tech_companies} space tech companies`
    );

    return {
      success: true,
      aiCompaniesCount: summary.summary.total_ai_companies,
      spaceTechCount: summary.summary.total_space_tech_companies,
      aiValuation: summary.summary.total_ai_valuation,
      spaceTechValuation: summary.summary.total_space_tech_valuation,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to sync VC data`, error);
    throw error;
  }
}

/**
 * Track recent funding rounds and investment activity.
 * Called daily to monitor new funding announcements and capital movements.
 */
export async function handleTrackFundingRounds(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting funding rounds tracking...`);

    const response = await axios.get(
      `${BACKEND_API_URL}/venture-capital/funding-rounds?days=90&limit=100`,
      { timeout: 20000 }
    );

    const fundingData = response.data;

    logger.info(
      `[Job ${job.id}] Tracked ${fundingData.total_funding_rounds} funding rounds`
    );

    return {
      success: true,
      totalRounds: fundingData.total_funding_rounds,
      totalCapitalRaised: fundingData.total_capital_raised,
      avgRoundSize: fundingData.avg_round_size,
      roundsCount: fundingData.returned,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to track funding rounds`, error);
    throw error;
  }
}

/**
 * Monitor IPO pipeline for companies expected to go public.
 * Called daily to update readiness scores and track movement through pipeline.
 */
export async function handleMonitorIPOPipeline(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting IPO pipeline monitoring...`);

    const response = await axios.get(
      `${BACKEND_API_URL}/venture-capital/ipo-pipeline?limit=200`,
      { timeout: 25000 }
    );

    const pipeline = response.data;

    logger.info(
      `[Job ${job.id}] Monitored IPO pipeline: ${pipeline.total_ipo_candidates} candidates`
    );

    return {
      success: true,
      totalCandidates: pipeline.total_ipo_candidates,
      highConfidence: pipeline.high_confidence,
      mediumConfidence: pipeline.medium_confidence,
      lowConfidence: pipeline.low_confidence,
      expected2025: pipeline.pipeline.filter(
        (c: any) => c.expected_ipo_year === 2025
      ).length,
      expected2026: pipeline.pipeline.filter(
        (c: any) => c.expected_ipo_year === 2026
      ).length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to monitor IPO pipeline`, error);
    throw error;
  }
}

/**
 * Track M&A activity and acquisitions.
 * Called daily to monitor consolidation, strategic acquisitions, and exit events.
 */
export async function handleTrackMAndA(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting M&A tracking...`);

    const response = await axios.get(
      `${BACKEND_API_URL}/venture-capital/acquisitions?days=90&limit=100`,
      { timeout: 20000 }
    );

    const maData = response.data;

    logger.info(
      `[Job ${job.id}] Tracked ${maData.total_deals} M&A deals`
    );

    return {
      success: true,
      totalDeals: maData.total_deals,
      totalDealValue: maData.total_deal_value,
      avgDealValue: maData.total_deal_value / Math.max(maData.total_deals, 1),
      dealsReturned: maData.returned,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to track M&A activity`, error);
    throw error;
  }
}

/**
 * Track top investors and their portfolio activity.
 * Called weekly to identify most active VCs and their focus areas.
 */
export async function handleTrackTopInvestors(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting top investors tracking...`);

    const response = await axios.get(
      `${BACKEND_API_URL}/venture-capital/investors?limit=50`,
      { timeout: 15000 }
    );

    const investorData = response.data;

    logger.info(
      `[Job ${job.id}] Tracked ${investorData.top_investors} top investors`
    );

    return {
      success: true,
      topInvestorsCount: investorData.top_investors,
      investors: investorData.investors.slice(0, 20).map((inv: any) => ({
        name: inv.investor_name,
        type: inv.investor_type,
        portfolioCount: inv.portfolio_count,
        totalInvested: inv.total_invested,
      })),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to track top investors`, error);
    throw error;
  }
}
