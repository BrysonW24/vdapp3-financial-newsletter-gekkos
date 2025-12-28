'use client'

import { useState } from 'react'
import Link from 'next/link'

// Chart categories based on Druckenmiller's 272 chart methodology
const chartCategories = [
  { id: 'equities', name: 'Equities', icon: '💹', color: 'blue', count: 90 },
  { id: 'commodities', name: 'Commodities', icon: '📊', color: 'amber', count: 65 },
  { id: 'currencies', name: 'Currencies', icon: '💱', color: 'green', count: 55 },
  { id: 'fixed-income', name: 'Fixed Income', icon: '📈', color: 'purple', count: 50 },
  { id: 'volatility', name: 'Volatility & Internals', icon: '⚡', color: 'red', count: 12 },
]

const timeframes = [
  { id: 'daily', name: 'Daily', prediction: '8-20 Days' },
  { id: 'weekly', name: 'Weekly', prediction: '8-20 Weeks' },
  { id: 'monthly', name: 'Monthly', prediction: '8-20 Months' },
]

const australianMarkets = [
  { symbol: 'ASX200', name: 'ASX 200 Index', category: 'equities' },
  { symbol: 'CBA', name: 'Commonwealth Bank', category: 'equities' },
  { symbol: 'BHP', name: 'BHP Group', category: 'equities' },
  { symbol: 'AUDUSD', name: 'AUD/USD', category: 'currencies' },
  { symbol: 'IRON', name: 'Iron Ore', category: 'commodities' },
  { symbol: 'AU10Y', name: 'Australian 10Y Bond', category: 'fixed-income' },
]

export default function EconomicChartsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold hover:text-indigo-100 transition-colors">
                🦎 Gekkos
              </Link>
              <span className="text-indigo-300">|</span>
              <h1 className="text-xl font-semibold">📈 Economic Charts</h1>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-6xl">📊</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">Stan Druckenmiller's 272 Chart Methodology</h2>
              <p className="text-lg text-indigo-100 mb-4">
                Professional-grade macro investing charts covering global equities, commodities, currencies, and fixed income markets.
                Each chart viewed across daily, weekly, and monthly timeframes to predict trends for 8-20 periods.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/docs/DRUCKENMILLER_CHARTS.md"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm"
                >
                  📚 Read Documentation
                </Link>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm border border-white/30">
                  📥 Export to PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {chartCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{cat.count}</div>
              <div className="text-sm text-gray-600">{cat.name}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Class
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Markets ({chartCategories.reduce((sum, c) => sum + c.count, 0)} charts)</option>
                {chartCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name} ({cat.count} charts)
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setSelectedTimeframe(tf.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedTimeframe === tf.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>{tf.name}</div>
                    <div className="text-xs opacity-75">{tf.prediction}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Australian Markets Quick Access */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🇦🇺</span>
            <span>Australian Markets</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {australianMarkets.map((market) => (
              <button
                key={market.symbol}
                className="p-3 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
              >
                <div className="font-bold text-gray-900 text-sm">{market.symbol}</div>
                <div className="text-xs text-gray-600 mt-1">{market.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Markets' : chartCategories.find(c => c.id === selectedCategory)?.name}
              {' '}({selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)} Timeframe)
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                📌 Add to Favorites
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                🔔 Set Alert
              </button>
            </div>
          </div>

          {/* Coming Soon Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Charts Coming Soon</h4>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Professional charting infrastructure is being implemented. Charts will include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-bold text-blue-900 mb-2">📈 Technical Indicators</div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Moving Averages (50, 200-day)</li>
                  <li>• RSI & MACD</li>
                  <li>• Volume Analysis</li>
                  <li>• Support/Resistance</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="font-bold text-purple-900 mb-2">⏱️ Multi-Timeframe</div>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Daily (8-20 day forecast)</li>
                  <li>• Weekly (8-20 week forecast)</li>
                  <li>• Monthly (8-20 month forecast)</li>
                  <li>• Synchronised analysis</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-bold text-green-900 mb-2">🛠️ Tools & Export</div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Drawing tools (trendlines)</li>
                  <li>• Chart annotations</li>
                  <li>• PDF export for reports</li>
                  <li>• Custom watchlists</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Druckenmiller Philosophy */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>Druckenmiller's Investment Philosophy</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Core Principles:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>75-80% Fundamentals:</strong> Deep macro research drives ideas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>20-25% Technicals:</strong> Charts confirm timing and conviction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Concentrated Bets:</strong> When aligned, bet big (20%+ of portfolio)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Decision Framework:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-green-100 rounded">
                  <span className="text-green-700 font-bold">✅</span>
                  <span className="text-green-900"><strong>Strong Fundamental + Strong Chart = BIG BET</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded">
                  <span className="text-yellow-700 font-bold">⚠️</span>
                  <span className="text-yellow-900"><strong>Strong Fundamental + Weak Chart = WAIT</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-100 rounded">
                  <span className="text-red-700 font-bold">❌</span>
                  <span className="text-red-900"><strong>Weak Fundamental + Strong Chart = NO TRADE</strong></span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">
            "Charts keep you honest. Fundamentals generate the idea. Technicals decide whether you should act on it." — Stan Druckenmiller
          </p>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Learn More</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="https://asymmetryobservations.com/2018/10/03/stanley-druckenmiller-on-his-use-of-technical-analysis-and-instinct/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <h4 className="font-bold text-gray-900 mb-1">Druckenmiller on Technical Analysis</h4>
              <p className="text-sm text-gray-600">Asymmetry Observations</p>
            </Link>
            <Link
              href="https://market-bulls.com/stanley-druckenmiller-trading-strategy/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <h4 className="font-bold text-gray-900 mb-1">Druckenmiller Trading Strategy</h4>
              <p className="text-sm text-gray-600">MarketBulls</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
