import { NextResponse } from 'next/server'
import {
  fetchWithTimeout,
  isRetryableError,
} from '@/lib/utils/fetch-utils'
import { ipoCache } from '@/lib/utils/cache-utils'

// Fallback hardcoded IPOs in case scraping fails
const fallbackIpos = [
  {
    companyName: 'TechNova Solutions',
    symbol: 'TNVA',
    priceRange: '$18-22',
    expectedDate: '2025-02-15',
    sector: 'Technology',
    description: 'AI-powered enterprise software solutions for digital transformation.',
    marketCap: '$2.1B',
    underwriters: ['Goldman Sachs', 'Morgan Stanley'],
    source: 'Fallback Data',
    url: 'https://www.nasdaq.com/market-activity/ipos'
  },
  {
    companyName: 'GreenEnergy Corp',
    symbol: 'GREN',
    priceRange: '$24-28',
    expectedDate: '2025-02-22',
    sector: 'Clean Energy',
    description: 'Renewable energy storage and grid optimization technology.',
    marketCap: '$1.8B',
    underwriters: ['J.P. Morgan', 'Bank of America'],
    source: 'Fallback Data',
    url: 'https://www.nyse.com/ipo-center/'
  },
  {
    companyName: 'MediTech Innovations',
    symbol: 'MDTI',
    priceRange: '$15-19',
    expectedDate: '2025-02-28',
    sector: 'Healthcare',
    description: 'Advanced medical devices for minimally invasive surgery.',
    marketCap: '$1.5B',
    underwriters: ['Citigroup', 'UBS'],
    source: 'Fallback Data',
    url: 'https://www.iposcoop.com/'
  }
];

interface IPO {
  companyName: string;
  symbol: string;
  priceRange: string;
  expectedDate: string;
  sector: string;
  description: string;
  marketCap: string;
  underwriters?: string[];
  source: string;
  url: string;
}

async function fetchFromIexCloud(): Promise<IPO[] | null> {
  // IEX Cloud has a free tier with IPO data
  const apiKey = process.env.IEX_CLOUD_API_KEY
  if (!apiKey) {
    console.log('IEX_CLOUD_API_KEY not set, skipping IEX Cloud fetch')
    return null
  }

  try {
    const response = await fetchWithTimeout(
      `https://cloud.iexapis.com/stable/data-points/MARKET/UPCOMING_IPOS?token=${apiKey}`,
      {},
      8000 // 8s timeout
    )

    if (isRetryableError(response)) {
      console.warn(`IEX Cloud API error: ${response.status}`)
      return null
    }

    if (!response.ok) {
      console.error('IEX Cloud API error:', response.statusText)
      return null
    }

    const data = await response.json()

    // IEX Cloud returns data in a specific format
    // Parse and transform to our format
    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, 5).map((ipo: any) => ({
        companyName: ipo.companyName || ipo.name,
        symbol: ipo.symbol,
        priceRange: ipo.priceRange || 'TBD',
        expectedDate: ipo.expectedDate || ipo.expectedIPODate || 'TBD',
        sector: ipo.sector || 'Technology',
        description: ipo.description || 'Upcoming IPO',
        marketCap: ipo.marketCap || 'TBD',
        underwriters: ipo.underwriters || [],
        source: 'IEX Cloud - Real Data',
        url: `https://iexcloud.io/console/home`
      }))
    }

    return null
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching from IEX Cloud:', error.message)
    } else {
      console.error('Error fetching from IEX Cloud:', error)
    }
    return null
  }
}

async function fetchFromNasdaqNews(): Promise<IPO[] | null> {
  // Fallback: Fetch IPO news from NewsAPI to identify recent IPO filings
  const newsApiKey = process.env.NEWS_API_KEY
  if (!newsApiKey) {
    console.log('NEWS_API_KEY not set, skipping IPO news fetch')
    return null
  }

  try {
    const response = await fetchWithTimeout(
      `https://newsapi.org/v2/everything?q=IPO+upcoming+2025&sortBy=publishedAt&language=en&pageSize=5&apiKey=${newsApiKey}`,
      {},
      10000 // 10s timeout for NewsAPI
    )

    if (isRetryableError(response)) {
      console.warn(`NewsAPI error: ${response.status}`)
      return null
    }

    if (!response.ok) {
      console.error('NewsAPI error:', response.statusText)
      return null
    }

    const data = await response.json()
    const articles = data.articles || []

    if (articles.length === 0) {
      return null
    }

    // Transform news articles about IPOs into IPO data
    // This is a simplified approach - in production, you'd parse for specific details
    return articles.slice(0, 3).map((article: any, index: number) => ({
      companyName: extractCompanyName(article.title),
      symbol: generatePlaceholderSymbol(index),
      priceRange: 'TBD',
      expectedDate: new Date(article.publishedAt).toISOString().split('T')[0],
      sector: 'Technology',
      description: article.description || article.title,
      marketCap: 'TBD',
      underwriters: [],
      source: `NewsAPI - ${article.source.name}`,
      url: article.url
    }))
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching from NewsAPI:', error.message)
    } else {
      console.error('Error fetching from NewsAPI:', error)
    }
    return null
  }
}

function extractCompanyName(title: string): string {
  // Simple extraction of company name from headline
  const match = title.match(/^([A-Z][A-Za-z\s&]*?)(?:\s+(?:IPO|files|to go public|plans|announces))/i);
  if (match) {
    return match[1].trim();
  }
  // Fallback: use first 2-3 capitalized words
  const words = title.match(/\b[A-Z][a-z]+\b/g) || [];
  return words.slice(0, 2).join(' ') || 'New Company';
}

function generatePlaceholderSymbol(index: number): string {
  const symbols = ['UNCO', 'NOVO', 'TECH', 'GROW', 'NEXT'];
  return symbols[index % symbols.length];
}


export async function GET() {
  try {
    // Use unified caching layer
    // This will automatically handle cache expiration at midnight
    const ipos = await ipoCache.get('daily-ipos', async () => {
      // Try to fetch real IPO data
      let data: IPO[] | null = null;

      // First try: IEX Cloud (most reliable)
      data = await fetchFromIexCloud();

      // Second try: NewsAPI for IPO news
      if (!data || data.length === 0) {
        data = await fetchFromNasdaqNews();
      }

      // Fallback to hardcoded data if APIs fail
      if (!data || data.length === 0) {
        console.log('Real IPO data unavailable, using fallback data');
        data = fallbackIpos;
      }

      return data;
    });

    return NextResponse.json({ ipos });
  } catch (error) {
    console.error('IPO data fetch error:', error);
    // Return fallback on error
    return NextResponse.json({ ipos: fallbackIpos });
  }
}