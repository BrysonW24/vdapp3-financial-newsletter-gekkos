// Market Data Service - Fetches real stock market data
// Using Yahoo Finance API (free alternative to paid services)

import {
  fetchWithTimeout,
  isRateLimitError,
  isRetryableError,
} from '@/lib/utils/fetch-utils'

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high?: number
  low?: number
  volume?: number
}

export interface IndexData {
  name: string
  code: string
  value: number
  change: number
  changePercent: number
  flag: string
}

/**
 * Fetch stock quote from Yahoo Finance
 * Free API - no key required
 */
export async function fetchStockQuote(symbol: string): Promise<StockData | null> {
  try {
    // Using Yahoo Finance API v8
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`

    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
      8000 // 8s timeout for Yahoo Finance (can be slower)
    )

    if (isRateLimitError(response)) {
      console.warn(`Yahoo Finance rate limit for ${symbol} (429). Backing off...`)
      return null
    }

    if (isRetryableError(response)) {
      throw new Error(`Yahoo Finance error for ${symbol}: ${response.status} ${response.statusText}`)
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol}: ${response.statusText}`)
    }

    const data = await response.json()
    const result = data.chart.result[0]
    const meta = result.meta
    const quote = result.indicators.quote[0]

    const currentPrice = meta.regularMarketPrice
    const previousClose = meta.chartPreviousClose
    const change = currentPrice - previousClose
    const changePercent = (change / previousClose) * 100

    return {
      symbol: meta.symbol,
      name: meta.longName || meta.symbol,
      price: currentPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      volume: meta.regularMarketVolume,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching stock ${symbol}:`, error.message)
    } else {
      console.error(`Error fetching stock ${symbol}:`, error)
    }
    return null
  }
}

/**
 * Fetch multiple stocks in parallel
 */
export async function fetchMultipleStocks(symbols: string[]): Promise<StockData[]> {
  const promises = symbols.map(symbol => fetchStockQuote(symbol))
  const results = await Promise.all(promises)
  return results.filter((stock): stock is StockData => stock !== null)
}

/**
 * Fetch major market indices
 */
export async function fetchMarketIndices(): Promise<IndexData[]> {
  const indices = [
    { symbol: '^AXJO', name: 'ASX 200', code: 'XJO', flag: '🇦🇺' },
    { symbol: '^GSPC', name: 'S&P 500', code: 'SPX', flag: '🇺🇸' },
    { symbol: '^N225', name: 'Nikkei 225', code: 'N225', flag: '🇯🇵' },
    { symbol: '^FTSE', name: 'FTSE 100', code: 'FTSE', flag: '🇬🇧' },
  ]

  const promises = indices.map(async (index) => {
    const data = await fetchStockQuote(index.symbol)
    if (!data) return null

    return {
      name: index.name,
      code: index.code,
      value: data.price,
      change: data.change,
      changePercent: data.changePercent,
      flag: index.flag,
    }
  })

  const results = await Promise.all(promises)
  return results.filter((index): index is IndexData => index !== null)
}

/**
 * Fetch Big 4 Australian banks
 * Note: Bitcoin/crypto data is fetched separately via CoinGecko in crypto-data.ts
 */
export async function fetchFeaturedStocks(): Promise<StockData[]> {
  const symbols = [
    'CBA.AX',  // Commonwealth Bank
    'WBC.AX',  // Westpac
    'NAB.AX',  // NAB
    'ANZ.AX',  // ANZ
  ]

  return fetchMultipleStocks(symbols)
}

/**
 * Fetch top ASX movers
 * Note: This requires web scraping or paid API for real-time data
 * For now, returns mock data - will implement in Phase 3
 */
export async function fetchTopMovers(): Promise<{
  gainers: StockData[]
  losers: StockData[]
}> {
  // TODO: Implement with web scraping or paid API
  // For now, return empty arrays - frontend will show mock data
  return {
    gainers: [],
    losers: [],
  }
}

/**
 * Fetch AUD/USD exchange rate
 */
export async function fetchAudUsd(): Promise<{
  rate: number
  change: number
  changePercent: number
} | null> {
  try {
    const data = await fetchStockQuote('AUDUSD=X')
    if (!data) return null

    return {
      rate: data.price,
      change: data.change,
      changePercent: data.changePercent,
    }
  } catch (error) {
    console.error('Error fetching AUD/USD:', error)
    return null
  }
}
