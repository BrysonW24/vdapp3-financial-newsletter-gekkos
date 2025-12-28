// News data service using RSS feeds with proper HTML entity decoding
// Uses rss-parser library for clean, formatted content

import Parser from 'rss-parser'
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

// Initialise RSS parser with custom fields for media content
const rssParser = new Parser({
  customFields: {
    item: ['media:thumbnail', 'media:content', 'content:encoded'],
  },
  timeout: 10000,
})

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
 * Decode HTML entities and strip HTML tags
 */
function cleanHtmlContent(text: string): string {
  if (!text) return ''

  // Strip HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '')

  // Decode common HTML entities (backup for cases rss-parser misses)
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2019;/g, "\u2019") // Right single quotation mark
    .replace(/&#x2014;/g, "\u2014") // Em dash
    .replace(/&#x2013;/g, "\u2013") // En dash
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, "\u2013") // En dash
    .replace(/&mdash;/g, "\u2014") // Em dash
    .replace(/&rsquo;/g, "\u2019") // Right single quotation mark
    .replace(/&lsquo;/g, "\u2018") // Left single quotation mark
    .replace(/&rdquo;/g, "\u201D") // Right double quotation mark
    .replace(/&ldquo;/g, "\u201C") // Left double quotation mark

  return cleaned.trim()
}

/**
 * Extract clean content from RSS item
 * Priority: contentSnippet > content:encoded > description > summary
 */
function extractContent(item: any): string {
  // contentSnippet is already decoded by rss-parser
  if (item.contentSnippet) {
    return item.contentSnippet.substring(0, 500)
  }

  // Try content:encoded field (some feeds use this)
  if (item['content:encoded']) {
    return cleanHtmlContent(item['content:encoded']).substring(0, 500)
  }

  // Try description
  if (item.description) {
    return cleanHtmlContent(item.description).substring(0, 500)
  }

  // Try summary as fallback
  if (item.summary) {
    return cleanHtmlContent(item.summary).substring(0, 500)
  }

  return ''
}

/**
 * Parse RSS feed with rss-parser (automatic entity decoding)
 */
async function parseRSSFeed(url: string, category: string = 'general'): Promise<NewsArticle[]> {
  try {
    // Use rss-parser's built-in fetch with timeout
    const feed = await rssParser.parseURL(url)

    // Map feed items to NewsArticle format
    const articles: NewsArticle[] = feed.items.slice(0, 5).map((item, index) => {
      return {
        title: cleanHtmlContent(item.title || 'Untitled'),
        description: extractContent(item),
        url: item.link || item.guid || '#',
        source: new URL(url).hostname.replace('www.', ''),
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        category,
      }
    })

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
    const articles = await parseRSSFeed('https://www.marketwatch.com/rss/topstories', 'stocks')
    return articles
  } catch (error) {
    console.error('Error fetching financial news:', error)
    return []
  }
}

export async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    const articles = await parseRSSFeed('https://cointelegraph.com/rss', 'crypto')
    return articles
  } catch (error) {
    console.error('Error fetching crypto news:', error)
    return []
  }
}

export async function fetchTechNews(): Promise<NewsArticle[]> {
  try {
    const articles = await parseRSSFeed('https://techcrunch.com/feed/', 'tech')
    return articles
  } catch (error) {
    console.error('Error fetching tech news:', error)
    return []
  }
}

export async function fetchPropertyNews(): Promise<NewsArticle[]> {
  try {
    // Australian property news from AFR
    const articles = await parseRSSFeed('https://www.afr.com/property/rss', 'property')
    return articles
  } catch (error) {
    console.error('Error fetching property news:', error)
    return []
  }
}

export async function fetchEconomyNews(): Promise<NewsArticle[]> {
  try {
    const articles = await parseRSSFeed('https://www.marketwatch.com/rss/topstories', 'economy')
    return articles
  } catch (error) {
    console.error('Error fetching economy news:', error)
    return []
  }
}
