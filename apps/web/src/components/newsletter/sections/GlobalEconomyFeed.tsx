'use client'

export default function GlobalEconomyFeed() {

  const economicIndicators = [
    { name: 'US GDP Growth', value: '2.9%', change: '↑ from 2.6%', icon: '🇺🇸', color: 'blue' },
    { name: 'EU Inflation', value: '2.4%', change: '↓ from 2.9%', icon: '🇪🇺', color: 'green' },
    { name: 'China GDP', value: '5.2%', change: 'Stable', icon: '🇨🇳', color: 'red' },
    { name: 'Global PMI', value: '51.8', change: '↑ from 50.9', icon: '🌍', color: 'purple' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">🌍</span>
          <div className="flex flex-col">
            <span>Global Economy Feed</span>
            <span className="text-xs font-normal text-blue-700">🌎 Major global economic indicators & trends</span>
          </div>
        </div>
      </h2>

      {/* Economic Indicators Dashboard */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {economicIndicators.map((indicator) => (
          <div key={indicator.name} className={`${colorMap[indicator.color]} text-white rounded-lg p-4 shadow-md`}>
            <div className="text-2xl mb-2">{indicator.icon}</div>
            <div className="text-xs font-medium text-white/80 mb-1">{indicator.name}</div>
            <div className="text-2xl font-bold mb-1">{indicator.value}</div>
            <div className="text-xs text-white/90">{indicator.change}</div>
          </div>
        ))}
      </div>

      {/* Additional Global Metrics - Row 1 */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">US Fed Rate</div>
          <div className="text-3xl font-bold text-slate-900">5.50%</div>
          <div className="text-xs text-slate-600">Unchanged</div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">ECB Rate</div>
          <div className="text-3xl font-bold text-slate-900">4.50%</div>
          <div className="text-xs text-green-600 font-semibold">-0.25% cut</div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">Global Stocks</div>
          <div className="text-3xl font-bold text-slate-900">+12.3%</div>
          <div className="text-xs text-green-600 font-semibold">YTD performance</div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">USD Index</div>
          <div className="text-3xl font-bold text-slate-900">103.5</div>
          <div className="text-xs text-red-600 font-semibold">-0.3% this week</div>
        </div>
      </div>

      {/* Additional Global Metrics - Row 2 */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">Oil Price (Brent)</div>
          <div className="text-3xl font-bold text-slate-900">$82.50</div>
          <div className="text-xs text-green-600 font-semibold">+1.8% this week</div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">Gold</div>
          <div className="text-3xl font-bold text-slate-900">$2,075</div>
          <div className="text-xs text-green-600 font-semibold">+1.2% today</div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">10Y US Treasury</div>
          <div className="text-3xl font-bold text-slate-900">4.35%</div>
          <div className="text-xs text-slate-600">Yield stable</div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">VIX (Fear Index)</div>
          <div className="text-3xl font-bold text-slate-900">14.2</div>
          <div className="text-xs text-green-600 font-semibold">-0.8 (Low volatility)</div>
        </div>
      </div>

      {/* View All Articles Button */}
      <div className="text-center">
        <a
          href="/news?category=economy"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <span>📰</span>
          View All Global Economic News & Analysis
          <span>→</span>
        </a>
      </div>
    </div>
  )
}
