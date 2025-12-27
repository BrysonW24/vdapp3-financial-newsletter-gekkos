import { NextResponse } from 'next/server'
import {
  fetchWithTimeout,
  isRetryableError,
} from '@/lib/utils/fetch-utils'
import { insightCache } from '@/lib/utils/cache-utils'

interface FinancialInsight {
  title: string;
  subtitle: string;
  description: string;
  value?: string;
  change?: string;
  changePercent?: string;
  source: string;
  category: string;
  icon: string;
  color: string;
  dataPoint?: string;
  timestamp: string;
}

// Fallback graphics for when real data isn't available
const fallbackInsights = [
  {
    title: 'Market Cap Milestone',
    subtitle: 'Global stock market reaches new heights',
    description: 'The combined market capitalization of the top 500 global companies continues to grow, reflecting investor confidence in technology and innovation sectors.',
    value: '$120.5T',
    change: '+$2.3T',
    changePercent: '+1.95%',
    source: 'Market Data',
    category: 'Market Overview',
    icon: '📊',
    color: 'bg-blue-500',
    dataPoint: 'Global Market Cap',
    timestamp: new Date().toISOString()
  },
  {
    title: 'Tech Sector Performance',
    subtitle: 'Technology stocks lead market gains',
    description: 'The NASDAQ-100 technology index outperforms broader markets, driven by AI, cloud computing, and digital transformation trends.',
    value: '+3.2%',
    change: '+245 points',
    changePercent: '+3.2%',
    source: 'Market Data',
    category: 'Sector Analysis',
    icon: '💻',
    color: 'bg-purple-500',
    dataPoint: 'Tech Index',
    timestamp: new Date().toISOString()
  },
  {
    title: 'Cryptocurrency Momentum',
    subtitle: 'Digital assets show resilience',
    description: 'Major cryptocurrencies maintain momentum with Bitcoin and Ethereum trading near recent highs, supported by institutional adoption and regulatory clarity.',
    value: '$2.8T',
    change: '+$180B',
    changePercent: '+6.9%',
    source: 'Crypto Market Data',
    category: 'Digital Assets',
    icon: '🪙',
    color: 'bg-yellow-500',
    dataPoint: 'Total Crypto Market Cap',
    timestamp: new Date().toISOString()
  },
  {
    title: 'Economic Growth Update',
    subtitle: 'Global economies show strong growth signals',
    description: 'Major economic indicators suggest continued growth momentum across developed and emerging markets, with inflation moderating steadily.',
    value: '2.8%',
    change: '+0.3%',
    changePercent: '+12%',
    source: 'Economic Data',
    category: 'Economy',
    icon: '📈',
    color: 'bg-green-500',
    dataPoint: 'Global GDP Growth',
    timestamp: new Date().toISOString()
  },
  {
    title: 'Energy Transition Progress',
    subtitle: 'Renewable energy markets expanding rapidly',
    description: 'Clean energy investments reach record highs as governments and corporations accelerate sustainability initiatives worldwide.',
    value: '$890B',
    change: '+$95B YoY',
    changePercent: '+12%',
    source: 'Energy Market Data',
    category: 'Green Energy',
    icon: '⚡',
    color: 'bg-emerald-500',
    dataPoint: 'Clean Energy Investment',
    timestamp: new Date().toISOString()
  }
];

async function fetchFromAlphaVantage(): Promise<FinancialInsight | null> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  if (!apiKey) {
    console.log('ALPHA_VANTAGE_API_KEY not set')
    return null
  }

  try {
    // Fetch market data from Alpha Vantage with timeout
    const response = await fetchWithTimeout(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^GSPC&apikey=${apiKey}`,
      {},
      8000 // 8s timeout
    )

    if (isRetryableError(response)) {
      console.warn(`Alpha Vantage API error: ${response.status}`)
      return null
    }

    if (!response.ok) {
      console.error('Alpha Vantage API error:', response.statusText)
      return null
    }

    const data = await response.json()
    const quote = data['Global Quote']

    if (quote && quote.price) {
      const price = parseFloat(quote.price)
      const change = parseFloat(quote['change']) || 0
      const changePercent = parseFloat(quote['change percent']?.replace('%', '') || '0')

      return {
        title: 'S&P 500 Market Update',
        subtitle: 'Stock market performance tracker',
        description: `The S&P 500 index is tracking the market performance with current price movements reflecting investor sentiment and economic data releases.`,
        value: `$${price.toFixed(2)}`,
        change: change >= 0 ? `+$${change.toFixed(2)}` : `$${change.toFixed(2)}`,
        changePercent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        source: 'Alpha Vantage - Real Market Data',
        category: 'Stock Market',
        icon: '📈',
        color: changePercent >= 0 ? 'bg-green-500' : 'bg-red-500',
        dataPoint: 'S&P 500 Index',
        timestamp: new Date().toISOString()
      }
    }

    return null
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching from Alpha Vantage:', error.message)
    } else {
      console.error('Error fetching from Alpha Vantage:', error)
    }
    return null
  }
}

async function fetchCryptoInsight(): Promise<FinancialInsight | null> {
  try {
    // Free CoinGecko API endpoint for market data with timeout
    const response = await fetchWithTimeout(
      'https://api.coingecko.com/api/v3/global?localization=false',
      {},
      5000 // 5s timeout for CoinGecko
    )

    if (isRetryableError(response)) {
      console.warn(`CoinGecko API error: ${response.status}`)
      return null
    }

    if (!response.ok) {
      console.error('CoinGecko API error:', response.statusText)
      return null
    }

    const data = await response.json()
    const totalMarketCap = data.data?.total_market_cap?.usd || 0
    const marketCapChangeUsd = data.data?.market_cap_change_24h_usd || 0
    const marketCapChangePercent = data.data?.market_cap_change_percentage_24h || 0

    return {
      title: 'Cryptocurrency Market Snapshot',
      subtitle: 'Global crypto market performance',
      description: 'The cryptocurrency market shows dynamic activity with major digital assets trading actively and new developments in blockchain technology driving adoption.',
      value: `$${(totalMarketCap / 1e12).toFixed(2)}T`,
      change: `$${(Math.abs(marketCapChangeUsd) / 1e9).toFixed(1)}B`,
      changePercent: `${marketCapChangePercent >= 0 ? '+' : ''}${marketCapChangePercent.toFixed(2)}%`,
      source: 'CoinGecko - Real Market Data',
      category: 'Digital Assets',
      icon: '🪙',
      color: marketCapChangePercent >= 0 ? 'bg-green-500' : 'bg-red-500',
      dataPoint: 'Total Crypto Market Cap',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching crypto data:', error.message)
    } else {
      console.error('Error fetching crypto data:', error)
    }
    return null
  }
}

function getDayOfWeekInsight(): FinancialInsight {
  const day = new Date().getDay();
  const insights = [
    fallbackInsights[4], // Sunday - Energy
    fallbackInsights[0], // Monday - Market Cap
    fallbackInsights[1], // Tuesday - Tech
    fallbackInsights[2], // Wednesday - Crypto
    fallbackInsights[3], // Thursday - Economy
    fallbackInsights[1], // Friday - Tech
    fallbackInsights[2]  // Saturday - Crypto
  ];
  return insights[day];
}


export async function GET() {
  try {
    // Use unified caching layer
    // This will automatically handle cache expiration at midnight
    const insight = await insightCache.get('daily-insight', async () => {
      // Try to fetch real financial data
      let data: FinancialInsight | null = null;

      // First try: Market data from Alpha Vantage
      data = await fetchFromAlphaVantage();

      // Second try: Crypto data from CoinGecko
      if (!data) {
        data = await fetchCryptoInsight();
      }

      // Fallback: Use day-based rotation
      if (!data) {
        console.log('Real financial data unavailable, using fallback insight');
        data = getDayOfWeekInsight();
      }

      return data;
    });

    return NextResponse.json(insight);
  } catch (error) {
    console.error('Financial insight fetch error:', error);
    // Return fallback on error
    return NextResponse.json(getDayOfWeekInsight());
  }
}