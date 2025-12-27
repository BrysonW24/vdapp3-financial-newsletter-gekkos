import { NextResponse } from 'next/server'
import {
  fetchFeaturedCryptos,
  fetchGlobalCryptoData,
  fetchFearGreedIndex,
} from '@/lib/services/crypto-data'

// Caching is handled at the service level (5-10 min revalidation)
// Removing force-dynamic to respect Next.js fetch cache directives

/**
 * GET /api/crypto-data
 * Fetches all cryptocurrency data for the Crypto Feed
 */
export async function GET() {
  try {
    // Fetch all data in parallel
    const [cryptos, globalData, fearGreed] = await Promise.all([
      fetchFeaturedCryptos(),
      fetchGlobalCryptoData(),
      fetchFearGreedIndex(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        cryptos,
        globalMarketCap: globalData?.totalMarketCap,
        marketCapChange24h: globalData?.totalMarketCapChange24h,
        fearGreedIndex: fearGreed,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Crypto data API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crypto data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
