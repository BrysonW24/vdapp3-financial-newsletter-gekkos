import { NextResponse } from 'next/server'
import {
  fetchMarketIndices,
  fetchFeaturedStocks,
  fetchAudUsd,
  fetchTopMovers,
} from '@/lib/services/market-data'

export const dynamic = 'force-dynamic' // Disable caching for fresh data

/**
 * GET /api/market-data
 * Fetches all market data for the Trading Feed
 */
export async function GET() {
  try {
    // Fetch all data in parallel for better performance
    const [indices, featuredStocks, audUsd, movers] = await Promise.all([
      fetchMarketIndices(),
      fetchFeaturedStocks(),
      fetchAudUsd(),
      fetchTopMovers(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        indices,
        featuredStocks,
        audUsd,
        topGainers: movers.gainers,
        topLosers: movers.losers,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Market data API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
