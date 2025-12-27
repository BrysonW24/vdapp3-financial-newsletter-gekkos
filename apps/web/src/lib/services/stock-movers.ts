// Stock movers service - fetches top gainers and losers
// Using Yahoo Finance API (free, no key required)

import {
  fetchWithTimeout,
  isRetryableError,
} from '@/lib/utils/fetch-utils'

interface StockMover {
  code: string
  name: string
  price: number
  changePercent: number
  volume: number
}

// ASX 200 top movers - we'll use Yahoo Finance to get real data
// For a comprehensive solution, you'd want to use a paid API like Alpha Vantage or Polygon.io
// For now, we'll fetch some popular ASX stocks and sort by performance

const ASX_WATCHLIST = [
  'CBA.AX', 'BHP.AX', 'CSL.AX', 'NAB.AX', 'WBC.AX', 'ANZ.AX', 'WES.AX', 'MQG.AX',
  'FMG.AX', 'RIO.AX', 'WDS.AX', 'GMG.AX', 'WOW.AX', 'TLS.AX', 'ALL.AX', 'WTC.AX',
  'STO.AX', 'QBE.AX', 'TCL.AX', 'COL.AX', 'MIN.AX', 'AMP.AX', 'ORG.AX', 'S32.AX',
  'RMD.AX', 'IAG.AX', 'REA.AX', 'QAN.AX', 'SHL.AX', 'TWE.AX',
]

async function fetchStockQuote(symbol: string): Promise<{ symbol: string; price: number; change: number; changePercent: number; name: string } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`

    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
      8000 // 8s timeout
    )

    if (isRetryableError(response)) {
      console.warn(`Yahoo Finance error for ${symbol}: ${response.status}`)
      return null
    }

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data?.chart?.result?.[0]) {
      return null
    }

    const result = data.chart.result[0]
    const meta = result.meta
    const quote = result.indicators?.quote?.[0]

    if (!meta || !quote) {
      return null
    }

    const currentPrice = meta.regularMarketPrice || meta.previousClose
    const previousClose = meta.chartPreviousClose || meta.previousClose
    const change = currentPrice - previousClose
    const changePercent = (change / previousClose) * 100

    return {
      symbol: symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      name: meta.longName || symbol.replace('.AX', ''),
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message)
    } else {
      console.error(`Error fetching quote for ${symbol}:`, error)
    }
    return null
  }
}

export async function fetchTopMovers(): Promise<{ gainers: StockMover[]; losers: StockMover[] }> {
  try {
    // Fetch quotes for watchlist stocks
    const quotes = await Promise.all(
      ASX_WATCHLIST.map(symbol => fetchStockQuote(symbol))
    )

    // Filter out null results
    const validQuotes = quotes.filter((q): q is NonNullable<typeof q> => q !== null)

    // Sort by change percent
    const sorted = [...validQuotes].sort((a, b) => b.changePercent - a.changePercent)

    // Top 5 gainers and losers
    const gainers: StockMover[] = sorted.slice(0, 5).map(q => ({
      code: q.symbol.replace('.AX', ''),
      name: q.name,
      price: q.price,
      changePercent: q.changePercent,
      volume: 0, // Volume data would require additional API calls
    }))

    const losers: StockMover[] = sorted.slice(-5).reverse().map(q => ({
      code: q.symbol.replace('.AX', ''),
      name: q.name,
      price: q.price,
      changePercent: q.changePercent,
      volume: 0,
    }))

    return { gainers, losers }
  } catch (error) {
    console.error('Error fetching top movers:', error)
    return { gainers: [], losers: [] }
  }
}
