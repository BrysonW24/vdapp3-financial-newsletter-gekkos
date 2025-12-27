'use client'

import { useMarketData } from '@/lib/hooks/useMarketData'
import { useStockMovers } from '@/lib/hooks/useStockMovers'

interface MarketIndex {
  name: string
  code: string
  value: number
  change: number
  changePercent: number
  flag: string
}

interface FeaturedStock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface MarketMover {
  code: string
  name: string
  changePercent: number
  price: number
}

export default function TradingFeed() {
  const { data, loading, error } = useMarketData()
  const { data: moversData, loading: moversLoading, error: moversError } = useStockMovers()

  // Format numbers
  const formatNumber = (num: number) => num.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatCurrency = (num: number) => `$${formatNumber(num)}`
  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${formatNumber(change)} (${sign}${percent.toFixed(2)}%)`
  }

  // Real stock movers data
  const topGainers: MarketMover[] = moversData?.gainers || []
  const topDecliners: MarketMover[] = moversData?.losers || []
  const hasMoversData = !moversLoading && !moversError && topGainers.length > 0

  // Loading state
  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">📈</span>
          Trading Feed
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gecko-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600">Loading real-time market data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">📈</span>
          Trading Feed
        </h2>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Unable to load market data</h3>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">📈</span>
          Trading Feed
        </h2>
        <p className="text-slate-600">No market data available</p>
      </div>
    )
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">📈</span>
        Trading Feed
        <span className="ml-auto text-xs font-normal text-green-600 bg-green-100 px-3 py-1 rounded-full">
          LIVE DATA ✨
        </span>
      </h2>

      {/* Major Indices */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Global Markets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.indices && data.indices.length > 0 ? (
            data.indices.map((index: MarketIndex) => (
              <div key={index.code} className="market-data-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{index.flag}</span>
                  <span className="text-xs font-mono text-slate-400">{index.code}</span>
                </div>
                <h4 className="text-sm font-medium text-slate-300 mb-1">{index.name}</h4>
                <div className="text-2xl font-bold mb-1">{formatNumber(index.value)}</div>
                <div className={`text-sm font-semibold ${index.change >= 0 ? 'text-financial-gain' : 'text-financial-loss'}`}>
                  {formatChange(index.change, index.changePercent)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 col-span-4">Loading indices...</p>
          )}
        </div>
      </div>

      {/* AUD/USD Exchange Rate */}
      {data.audUsd && (
        <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💱</span>
              <div>
                <h4 className="font-semibold text-slate-800">AUD to USD Exchange Rate</h4>
                <p className="text-xs text-slate-600">Australian Dollar to US Dollar</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{data.audUsd.rate.toFixed(4)}</div>
              <div className={`text-sm font-semibold ${data.audUsd.change >= 0 ? 'text-financial-gain' : 'text-financial-loss'}`}>
                {formatChange(data.audUsd.change, data.audUsd.changePercent)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Stocks */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Featured Stocks (Big 4 Banks + Bitcoin)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {data.featuredStocks && data.featuredStocks.length > 0 ? (
            data.featuredStocks.map((stock: FeaturedStock) => (
              <div key={stock.symbol} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 hover:border-gecko-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-gecko-700 bg-gecko-100 px-2 py-1 rounded">
                    {stock.symbol.replace('.AX', '').replace('-USD', '')}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-slate-700 mb-2 line-clamp-1">{stock.name}</h4>
                <div className="text-xl font-bold text-slate-900 mb-1">{formatCurrency(stock.price)}</div>
                <div className={`text-sm font-semibold ${stock.change >= 0 ? 'stat-positive' : 'stat-negative'}`}>
                  {formatChange(stock.change, stock.changePercent)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 col-span-5">Loading stocks...</p>
          )}
        </div>
      </div>

      {/* Market Movers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>🚀</span>
            Top 5 Gainers - ASX Watchlist
            {hasMoversData && (
              <span className="ml-auto text-xs font-normal text-green-600 bg-green-200 px-2 py-1 rounded">LIVE ✨</span>
            )}
            {moversLoading && (
              <span className="ml-auto text-xs font-normal text-slate-500">Loading...</span>
            )}
          </h3>
          <div className="space-y-3">
            {topGainers.map((stock, index) => (
              <div key={stock.code} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-green-600">#{index + 1}</span>
                  <div>
                    <div className="font-mono text-sm font-bold text-slate-900">{stock.code}</div>
                    <div className="text-xs text-slate-600">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">{formatCurrency(stock.price)}</div>
                  <div className="text-sm font-bold stat-positive">+{stock.changePercent.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Decliners */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <span>📉</span>
            Top 5 Decliners - ASX Watchlist
            {hasMoversData && (
              <span className="ml-auto text-xs font-normal text-red-600 bg-red-200 px-2 py-1 rounded">LIVE ✨</span>
            )}
            {moversLoading && (
              <span className="ml-auto text-xs font-normal text-slate-500">Loading...</span>
            )}
          </h3>
          <div className="space-y-3">
            {topDecliners.map((stock, index) => (
              <div key={stock.code} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-red-600">#{index + 1}</span>
                  <div>
                    <div className="font-mono text-sm font-bold text-slate-900">{stock.code}</div>
                    <div className="text-xs text-slate-600">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">{formatCurrency(stock.price)}</div>
                  <div className="text-sm font-bold stat-negative">{stock.changePercent.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source Note */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          Live market data from Yahoo Finance • Updates every 5 minutes
          {hasMoversData && ' • Top movers from ASX watchlist (30 stocks)'}
        </p>
      </div>
    </div>
  )
}
