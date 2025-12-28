/**
 * Portfolio News Service
 * Fetches and ranks news articles relevant to user's portfolio holdings
 */

import {
  fetchWithTimeout,
  isRateLimitError,
  isRetryableError,
} from '@/lib/utils/fetch-utils'

interface Holding {
  id: string
  symbol: string
  name: string
  type: 'stock' | 'crypto' | 'property' | 'etf' | 'fund'
  keywords: string[]
}

interface PortfolioNews {
  title: string
  summary: string
  url: string
  source: string
  relevantHoldings: string[] // symbol
  matchedKeywords: string[]
  relevanceScore: number // 0-1
  publishedAt: Date
}

/**
 * Get news relevant to portfolio holdings
 * Searches using symbols and keywords from holdings
 */
export async function getPortfolioNews(
  holdings: Holding[],
  limit: number = 20
): Promise<PortfolioNews[]> {
  try {
    // Build search query from all holding keywords
    const allKeywords = holdings.flatMap((h) => h.keywords)
    const uniqueKeywords = [...new Set(allKeywords)]

    // Search NewsAPI for articles matching any keyword
    const newsArticles = await searchNewsAPI(uniqueKeywords, limit * 2)

    // Score and filter articles based on relevance to holdings
    const scoredArticles = scoreArticles(newsArticles, holdings)

    // Sort by relevance score and return top N
    return scoredArticles
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching portfolio news:', error)
    return []
  }
}

/**
 * Search NewsAPI for articles with timeout and error handling
 */
async function searchNewsAPI(keywords: string[], limit: number): Promise<any[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      console.warn('NEWS_API_KEY not configured')
      return []
    }

    // Create search query from keywords
    const searchQuery = keywords.slice(0, 5).join(' OR ')

    const response = await fetchWithTimeout(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&pageSize=${limit}&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
      10000 // 10s timeout for NewsAPI
    )

    if (isRateLimitError(response)) {
      console.warn('NewsAPI rate limit hit (429). Backing off...')
      return []
    }

    if (isRetryableError(response)) {
      console.warn(`NewsAPI error: ${response.status} ${response.statusText}`)
      return []
    }

    if (!response.ok) {
      console.error('NewsAPI error:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.articles || []
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error searching NewsAPI:', error.message)
    } else {
      console.error('Error searching NewsAPI:', error)
    }
    return []
  }
}

/**
 * Score articles based on relevance to holdings
 */
function scoreArticles(
  articles: any[],
  holdings: Holding[]
): PortfolioNews[] {
  return articles.map((article) => {
    const articleText = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase()

    const relevantHoldings: string[] = []
    const matchedKeywords: string[] = []
    let relevanceScore = 0

    // Check each holding
    for (const holding of holdings) {
      let holdingMatch = false

      // Check if any keywords match
      for (const keyword of holding.keywords) {
        const keywordLower = keyword.toLowerCase()
        if (articleText.includes(keywordLower)) {
          matchedKeywords.push(keyword)
          holdingMatch = true
          relevanceScore += 0.1 // Each match adds 10%
        }
      }

      if (holdingMatch) {
        relevantHoldings.push(holding.symbol)
      }
    }

    // Boost score for recent articles
    const hoursOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60)
    if (hoursOld < 1) relevanceScore += 0.1
    if (hoursOld < 6) relevanceScore += 0.05

    // Normalise score to 0-1
    relevanceScore = Math.min(relevanceScore, 1)

    return {
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) || '',
      url: article.url,
      source: article.source.name,
      relevantHoldings,
      matchedKeywords: [...new Set(matchedKeywords)],
      relevanceScore,
      publishedAt: new Date(article.publishedAt),
    }
  })
}

/**
 * Get portfolio summary with current holdings value estimate
 */
export function getPortfolioSummary(holdings: Holding[]) {
  const summary = {
    totalHoldings: holdings.length,
    byType: {
      stocks: holdings.filter((h) => h.type === 'stock').length,
      crypto: holdings.filter((h) => h.type === 'crypto').length,
      property: holdings.filter((h) => h.type === 'property').length,
      other: holdings.filter((h) => !['stock', 'crypto', 'property'].includes(h.type))
        .length,
    },
    topSectors: getTopSectors(holdings),
  }

  return summary
}

/**
 * Get most represented sectors
 */
function getTopSectors(holdings: Holding[]) {
  const sectorMap = new Map<string, number>()

  holdings.forEach((holding) => {
    if (holding.type === 'stock' && holding.name) {
      const sector = inferSector(holding.name)
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + 1)
    }
  })

  return Array.from(sectorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sector, count]) => ({ sector, count }))
}

/**
 * Infer sector from holding name
 */
function inferSector(name: string): string {
  const nameUpper = name.toUpperCase()

  const sectorKeywords = {
    Banking: ['BANK', 'CBA', 'NAB', 'ANZ', 'WESTPAC'],
    Technology: ['TECH', 'TECH', 'COMPUTER', 'SOFTWARE', 'APPLE', 'MICROSOFT', 'GOOGLE'],
    Energy: ['ENERGY', 'OIL', 'GAS', 'WOODSIDE', 'SANTOS'],
    Healthcare: ['HEALTH', 'MEDICAL', 'PHARMA', 'BIOTECH'],
    Real_Estate: ['PROPERTY', 'REAL ESTATE', 'REIT'],
    Mining: ['MINING', 'LITHIUM', 'GOLD', 'BHP'],
  }

  for (const [sector, keywords] of Object.entries(sectorKeywords)) {
    if (keywords.some((kw) => nameUpper.includes(kw))) {
      return sector.replace('_', ' ')
    }
  }

  return 'Other'
}
