// News data service using RSS feeds for unlimited free access
// Alternative: NewsAPI.org (free tier: 100 requests/day, requires API key)

import {
  fetchWithTimeout,
  isRateLimitError,
  isRetryableError,
} from '@/lib/utils/fetch-utils'

interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: string
}

// Free RSS feed sources for financial news
const RSS_FEEDS = {
  general: [
    'https://www.afr.com/rss',
    'https://www.abc.net.au/news/feed/51120/rss.xml',
  ],
  stocks: [
    'https://www.marketwatch.com/rss/topstories',
    'https://finance.yahoo.com/news/rssindex',
  ],
  crypto: [
    'https://cointelegraph.com/rss',
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
  ],
  tech: [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
  ],
}

/**
 * Parse RSS feed with timeout and error handling
 */
async function parseRSSFeed(url: string): Promise<NewsArticle[]> {
  try {
    const response = await fetchWithTimeout(
      url,
      {
        next: { revalidate: 900 }, // Cache for 15 minutes
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        },
      },
      10000 // 10s timeout for RSS feeds (can be slow)
    )

    if (isRateLimitError(response)) {
      console.warn(`RSS feed rate limit for ${url} (429). Backing off...`)
      return []
    }

    if (isRetryableError(response)) {
      console.warn(`RSS feed error for ${url}: ${response.status} ${response.statusText}`)
      return []
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
    }

    const xml = await response.text()

    // Simple XML parsing for RSS items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/
    const linkRegex = /<link>(.*?)<\/link>/
    const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/

    const articles: NewsArticle[] = []
    let match

    while ((match = itemRegex.exec(xml)) !== null && articles.length < 5) {
      const item = match[1]

      const titleMatch = item.match(titleRegex)
      const linkMatch = item.match(linkRegex)
      const descMatch = item.match(descRegex)
      const pubDateMatch = item.match(pubDateRegex)

      if (titleMatch && linkMatch) {
        articles.push({
          title: titleMatch[1] || titleMatch[2] || '',
          description: descMatch ? (descMatch[1] || descMatch[2] || '') : '',
          url: linkMatch[1] || '',
          source: new URL(url).hostname.replace('www.', ''),
          publishedAt: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
          category: 'general',
        })
      }
    }

    return articles
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error parsing RSS feed ${url}:`, error.message)
    } else {
      console.error(`Error parsing RSS feed ${url}:`, error)
    }
    return []
  }
}

export async function fetchFinancialNews(): Promise<NewsArticle[]> {
  try {
    // Fetch from multiple RSS feeds
    const articles = await parseRSSFeed('https://www.marketwatch.com/rss/topstories')
    return articles.slice(0, 5)
  } catch (error) {
    console.error('Error fetching financial news:', error)
    return []
  }
}

export async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    const articles = await parseRSSFeed('https://cointelegraph.com/rss')
    return articles.slice(0, 5)
  } catch (error) {
    console.error('Error fetching crypto news:', error)
    return []
  }
}

export async function fetchTechNews(): Promise<NewsArticle[]> {
  try {
    const articles = await parseRSSFeed('https://techcrunch.com/feed/')
    return articles.slice(0, 5)
  } catch (error) {
    console.error('Error fetching tech news:', error)
    return []
  }
}

export async function fetchPropertyNews(): Promise<NewsArticle[]> {
  try {
    // Australian property news from AFR
    const articles = await parseRSSFeed('https://www.afr.com/property/rss')
    return articles.slice(0, 5)
  } catch (error) {
    console.error('Error fetching property news:', error)
    return []
  }
}
