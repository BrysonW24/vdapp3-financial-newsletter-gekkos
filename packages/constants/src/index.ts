// Shared constants for Gekkos

// Stock symbols
export const BIG_FOUR_BANKS = {
  CBA: 'Commonwealth Bank',
  WBC: 'Westpac',
  NAB: 'National Australia Bank',
  ANZ: 'ANZ Bank',
} as const

// Market indices
export const MARKET_INDICES = {
  ASX200: 'S&P/ASX 200',
  SP500: 'S&P 500',
  NIKKEI: 'Nikkei 225',
  FTSE: 'FTSE 100',
} as const

// Cryptocurrency symbols
export const CRYPTO_SYMBOLS = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  BNB: 'Binance Coin',
  SOL: 'Solana',
} as const

// News sources
export const NEWS_SOURCES = {
  AFR: 'Australian Financial Review',
  WSJ: 'Wall Street Journal',
  BLOOMBERG: 'Bloomberg',
  REUTERS: 'Reuters',
  COINDESK: 'CoinDesk',
  COINTELEGRAPH: 'Cointelegraph',
} as const

// API endpoints (to be configured)
export const API_ENDPOINTS = {
  MARKET_DATA: '/api/market-data',
  NEWSLETTER: '/api/newsletter',
  ARTICLES: '/api/articles',
} as const
