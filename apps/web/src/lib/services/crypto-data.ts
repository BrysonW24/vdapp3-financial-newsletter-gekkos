// Crypto Data Service - Fetches cryptocurrency data from CoinGecko
// CoinGecko has a generous free tier - no API key required

import {
  fetchWithTimeout,
  isRateLimitError,
  isRetryableError,
} from '@/lib/utils/fetch-utils'
import { fetchAudUsd } from './market-data'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  marketCap?: number
  volume24h?: number
  high24h?: number
  low24h?: number
  priceAud?: number
  changeAud24h?: number
}

export interface CryptoMarketData {
  totalMarketCap: number
  totalMarketCapChange24h: number
  fearGreedIndex?: number
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

/**
 * Fetch cryptocurrency prices
 */
export async function fetchCryptoPrices(ids: string[]): Promise<CryptoPrice[]> {
  try {
    const idsParam = ids.join(',')
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`

    const response = await fetchWithTimeout(url, {}, 5000)

    // Handle rate limiting
    if (isRateLimitError(response)) {
      console.warn('CoinGecko rate limit hit (429). Backing off...')
      return []
    }

    // Handle other retryable errors
    if (isRetryableError(response)) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`)
    }

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Fetch AUD/USD rate for conversion
    const audRate = await fetchAudUsd()
    const audMultiplier = audRate?.rate ?? 1.0

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_24h,
      changePercent24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      // Convert to AUD (USD price * AUD/USD rate)
      priceAud: audMultiplier ? coin.current_price * audMultiplier : undefined,
      changeAud24h: audMultiplier ? coin.price_change_24h * audMultiplier : undefined,
    }))
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching crypto prices:', error.message)
    } else {
      console.error('Error fetching crypto prices:', error)
    }
    return []
  }
}

/**
 * Fetch featured cryptocurrencies (BTC, ETH, BNB, SOL)
 */
export async function fetchFeaturedCryptos(): Promise<CryptoPrice[]> {
  return fetchCryptoPrices(['bitcoin', 'ethereum', 'binancecoin', 'solana'])
}

/**
 * Fetch global crypto market data
 */
export async function fetchGlobalCryptoData(): Promise<CryptoMarketData | null> {
  try {
    const url = `${COINGECKO_API}/global`

    const response = await fetchWithTimeout(url, {}, 5000)

    // Handle rate limiting
    if (isRateLimitError(response)) {
      console.warn('CoinGecko rate limit hit (429). Returning null...')
      return null
    }

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }

    const data = await response.json()
    const globalData = data.data

    return {
      totalMarketCap: globalData.total_market_cap.usd,
      totalMarketCapChange24h: globalData.market_cap_change_percentage_24h_usd,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching global crypto data:', error.message)
    } else {
      console.error('Error fetching global crypto data:', error)
    }
    return null
  }
}

/**
 * Get Fear & Greed Index from alternative.me API
 */
export async function fetchFearGreedIndex(): Promise<{
  value: number
  classification: string
} | null> {
  try {
    const url = 'https://api.alternative.me/fng/'

    const response = await fetchWithTimeout(url, {}, 5000)

    if (isRateLimitError(response)) {
      console.warn('Fear & Greed API rate limit hit. Returning null...')
      return null
    }

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const latest = data.data[0]

    return {
      value: parseInt(latest.value),
      classification: latest.value_classification,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Fear & Greed Index:', error.message)
    } else {
      console.error('Error fetching Fear & Greed Index:', error)
    }
    return null
  }
}

/**
 * Fetch trending cryptocurrencies
 */
export async function fetchTrendingCryptos(): Promise<string[]> {
  try {
    const url = `${COINGECKO_API}/search/trending`

    const response = await fetchWithTimeout(url, {}, 5000)

    if (isRateLimitError(response)) {
      console.warn('CoinGecko trending API rate limit hit. Returning empty...')
      return []
    }

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.coins.slice(0, 5).map((coin: any) => coin.item.name)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching trending cryptos:', error.message)
    } else {
      console.error('Error fetching trending cryptos:', error)
    }
    return []
  }
}
