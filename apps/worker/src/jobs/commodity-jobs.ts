"""Commodity data fetching and signal calculation jobs."""

import { Job } from 'bullmq';
import axios from 'axios';
import { logger } from '../utils/logger';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

/**
 * Fetch commodity prices from the backend API.
 * Called hourly during market hours to keep prices current.
 */
export async function handleFetchCommodityPrices(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting commodity price fetch...`);

    // Call backend API to fetch commodity prices
    const response = await axios.get(
      `${BACKEND_API_URL}/commodities/overview`,
      {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    logger.info(
      `[Job ${job.id}] Successfully fetched commodity prices: ${Object.keys(data.precious_metals || {}).length} metals, ${Object.keys(data.ai_materials || {}).length} AI materials`
    );

    return {
      success: true,
      preciousMetalsUpdated: Object.keys(data.precious_metals || {}).length,
      aiMaterialsUpdated: Object.keys(data.ai_materials || {}).length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to fetch commodity prices`, error);
    throw error;
  }
}

/**
 * Calculate technical signals for commodities (MA crossovers).
 * Called daily to detect bullish/bearish signals.
 */
export async function handleCalculateCommoditySignals(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting commodity signal calculation...`);

    const commodityTypes = [
      'gold',
      'silver',
      'copper',
      'platinum',
      'palladium',
      'lithium',
      'semiconductor',
      'rare_earth',
      'aluminum',
      'nickel',
      'crude_oil',
      'natural_gas',
      'uranium',
    ];

    const signals: any[] = [];

    for (const commodityType of commodityTypes) {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/commodities/signals/${commodityType}?days=30`,
          { timeout: 10000 }
        );

        if (response.data.signal_count > 0) {
          signals.push({
            commodityType,
            signalCount: response.data.signal_count,
            bullish: response.data.bullish_count,
            bearish: response.data.bearish_count,
          });
        }
      } catch (err) {
        logger.warn(`Failed to fetch signals for ${commodityType}`);
      }
    }

    logger.info(
      `[Job ${job.id}] Calculated signals: ${signals.length} commodities with signals`
    );

    return {
      success: true,
      totalSignals: signals.reduce((sum, s) => sum + s.signalCount, 0),
      commoditiesWithSignals: signals.length,
      signals,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to calculate signals`, error);
    throw error;
  }
}

/**
 * Track AI-critical materials (lithium, semiconductors, rare earth, etc.).
 * Called daily to monitor supply chains and geopolitical risks.
 */
export async function handleTrackAIMaterials(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting AI materials tracking...`);

    const response = await axios.get(
      `${BACKEND_API_URL}/commodities/ai-materials`,
      { timeout: 20000 }
    );

    const materials = response.data.materials || [];

    logger.info(
      `[Job ${job.id}] Tracked ${materials.length} AI materials`
    );

    return {
      success: true,
      materialsTracked: materials.length,
      highRisk: materials.filter((m: any) => m.supply_risk === 'high').length,
      mediumRisk: materials.filter((m: any) => m.supply_risk === 'medium').length,
      lowRisk: materials.filter((m: any) => m.supply_risk === 'low').length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to track AI materials`, error);
    throw error;
  }
}

/**
 * Monitor space technology materials (titanium, tungsten, cobalt, gallium).
 * Called daily to track materials critical for aerospace and space industry.
 */
export async function handleUpdateSpaceTechMaterials(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting space tech materials update...`);

    const spaceMaterials = ['titanium', 'tungsten', 'cobalt', 'gallium'];
    const updates: any[] = [];

    for (const material of spaceMaterials) {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/commodities/space-tech/${material}`,
          { timeout: 10000 }
        );

        updates.push({
          material,
          supplyRisk: response.data.supply_risk,
          geopoliticalRisk: response.data.geopolitical_risk,
          aiRelevance: response.data.ai_relevance,
        });
      } catch (err) {
        logger.warn(`Failed to update ${material} space tech material`);
      }
    }

    logger.info(
      `[Job ${job.id}] Updated ${updates.length} space tech materials`
    );

    return {
      success: true,
      materialsUpdated: updates.length,
      materials: updates,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to update space tech materials`, error);
    throw error;
  }
}
