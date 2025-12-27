'use client'

import { useCryptoData } from '@/lib/hooks/useCryptoData'

interface CryptoPrice {
  name: string
  symbol: string
  price: number
  change24h: number
  icon: string
}

export default function CryptoFeed() {
  const { data, loading, error } = useCryptoData()

  // Map crypto icons
  const cryptoIcons: Record<string, string> = {
    'bitcoin': '₿',
    'ethereum': 'Ξ',
    'binancecoin': '🔶',
    'solana': '◎',
  }

  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">₿</span>
          Crypto Feed
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">₿</span>
          Crypto Feed
        </h2>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">⚠️ Unable to load crypto data</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  const cryptoPrices: CryptoPrice[] = data?.cryptos.map((crypto: any) => ({
    name: crypto.name,
    symbol: crypto.symbol.toUpperCase(),
    price: crypto.current_price,
    change24h: crypto.price_change_percentage_24h,
    icon: cryptoIcons[crypto.id] || '🪙',
  })) || []

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">₿</span>
          <div className="flex flex-col">
            <span>Crypto Feed</span>
            <span className="text-xs font-normal text-purple-700">🪙 Live cryptocurrency prices & market data</span>
          </div>
        </div>
        <span className="ml-auto text-xs font-normal text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
          LIVE DATA ✨
        </span>
      </h2>

      {/* Crypto Prices Dashboard */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {cryptoPrices.length > 0 ? (
          cryptoPrices.map((crypto) => (
            <div key={crypto.symbol} className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{crypto.icon}</span>
                <span className="text-xs font-mono text-purple-200">{crypto.symbol}</span>
              </div>
              <h4 className="text-sm font-medium text-purple-100 mb-1">{crypto.name}</h4>
              <div className="text-xl font-bold mb-1">
                {crypto.price && crypto.price > 0 ? (
                  `$${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  <span className="text-purple-300 text-xs">Loading price...</span>
                )}
              </div>
              <div className={`text-sm font-semibold ${(crypto.change24h || 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {crypto.change24h !== null && crypto.change24h !== undefined ? (
                  <>
                    {(crypto.change24h || 0) >= 0 ? '+' : ''}{(crypto.change24h || 0).toFixed(1)}% (24h)
                  </>
                ) : (
                  <span className="text-purple-300 text-xs">-- % (24h)</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 md:col-span-4 bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center">
            <p className="text-purple-700 font-medium">Crypto prices loading from live data...</p>
            <p className="text-purple-600 text-sm mt-1">Price data will appear here shortly</p>
          </div>
        )}
      </div>

      {/* Market Cap & Fear/Greed */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌐</span>
            <span className="text-sm font-medium text-purple-100">Total Crypto Market Cap</span>
          </div>
          <div className="text-3xl font-bold">
            ${data?.globalMarketCap ? (data.globalMarketCap / 1e12).toFixed(2) : '0.00'}T
          </div>
          <div className={`text-sm font-semibold ${(data?.marketCapChange24h || 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {(data?.marketCapChange24h || 0) >= 0 ? '+' : ''}{(data?.marketCapChange24h || 0).toFixed(2)}% (24h)
          </div>
        </div>
        <div className={`bg-gradient-to-r ${
          data?.fearGreedIndex && data.fearGreedIndex.value >= 50
            ? 'from-green-500 to-emerald-600'
            : 'from-orange-500 to-red-600'
        } text-white rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{data?.fearGreedIndex && data.fearGreedIndex.value >= 50 ? '😊' : '😰'}</span>
            <span className="text-sm font-medium text-white opacity-90">Fear & Greed Index</span>
          </div>
          <div className="text-3xl font-bold">
            {data?.fearGreedIndex?.value || 'N/A'} {data?.fearGreedIndex && '/ 100'}
          </div>
          <div className="text-sm text-white opacity-90 font-semibold">
            {data?.fearGreedIndex?.classification || 'Loading...'}
          </div>
        </div>
      </div>

      {/* View All Articles Button */}
      <div className="mt-6 text-center">
        <a
          href="/news?category=crypto"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <span>📰</span>
          View All Crypto News & Analysis
          <span>→</span>
        </a>
      </div>
    </div>
  )
}
