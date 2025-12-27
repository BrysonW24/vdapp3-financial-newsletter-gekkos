import { NextRequest, NextResponse } from 'next/server'
import {
  fetchFinancialNews,
  fetchCryptoNews,
  fetchTechNews,
  fetchPropertyNews,
  fetchEconomyNews,
} from '@/lib/services/news-data'

export const dynamic = 'force-dynamic' // Always fetch fresh data

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || 'all'

    let articles: any[] = []

    switch (category.toLowerCase()) {
      case 'stocks':
        articles = await fetchFinancialNews()
        break
      case 'crypto':
        articles = await fetchCryptoNews()
        break
      case 'tech':
        articles = await fetchTechNews()
        break
      case 'property':
        articles = await fetchPropertyNews()
        break
      case 'economy':
        articles = await fetchEconomyNews()
        break
      case 'all':
        // Fetch from all categories in parallel
        const [stocks, crypto, tech, property, economy] = await Promise.all([
          fetchFinancialNews(),
          fetchCryptoNews(),
          fetchTechNews(),
          fetchPropertyNews(),
          fetchEconomyNews(),
        ])
        articles = [...stocks, ...crypto, ...tech, ...property, ...economy]
        break
      default:
        articles = await fetchFinancialNews()
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch news',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
