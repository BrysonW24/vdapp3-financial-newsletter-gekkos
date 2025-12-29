'use client'

import Link from 'next/link'

export default function StocksFeed() {
  const marketIndicators = [
    { name: 'ASX 200', value: '7,845', change: '+1.2%', icon: '🇦🇺', color: 'blue' },
    { name: 'S&P 500', value: '4,567', change: '+0.8%', icon: '🇺🇸', color: 'green' },
    { name: 'Nikkei 225', value: '32,145', change: '+0.5%', icon: '🇯🇵', color: 'red' },
    { name: 'FTSE 100', value: '7,678', change: '-0.3%', icon: '🇬🇧', color: 'yellow' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">💹</span>
          <div className="flex flex-col">
            <span>Stocks Feed</span>
            <span className="text-xs font-normal text-blue-700">📊 Global market indices & stock news</span>
          </div>
        </div>
      </h2>

      {/* Market Indices Dashboard */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketIndicators.map((indicator) => (
          <div key={indicator.name} className={`${colorMap[indicator.color]} text-white rounded-lg p-4 shadow-md`}>
            <div className="text-2xl mb-2">{indicator.icon}</div>
            <div className="text-xs font-medium text-white/80 mb-1">{indicator.name}</div>
            <div className="text-2xl font-bold mb-1">{indicator.value}</div>
            <div className={`text-xs font-semibold ${indicator.change.startsWith('+') ? 'text-green-200' : 'text-red-200'}`}>
              {indicator.change}
            </div>
          </div>
        ))}
      </div>

      {/* Sector Performance */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: 'Financials', change: 1.8, icon: '🏦' },
          { name: 'Materials', change: 1.2, icon: '⛏️' },
          { name: 'Healthcare', change: -0.5, icon: '🏥' },
          { name: 'Technology', change: 0.9, icon: '💻' },
        ].map((sector) => (
          <div key={sector.name} className="bg-slate-800 text-white rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">{sector.icon}</div>
            <div className="text-xs font-medium text-slate-300 mb-1">{sector.name}</div>
            <div className={`text-lg font-bold ${sector.change >= 0 ? 'text-financial-gain' : 'text-financial-loss'}`}>
              {sector.change >= 0 ? '+' : ''}{sector.change}%
            </div>
          </div>
        ))}
      </div>

      {/* View All Articles Button */}
      <div className="text-center">
        <Link
          href="/news?category=stocks"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <span>📰</span>
          View All Stock Market News & Analysis
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
