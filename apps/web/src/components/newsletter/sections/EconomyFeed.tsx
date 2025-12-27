'use client'

export default function EconomyFeed() {

  const economicIndicators = [
    { name: 'Cash Rate', value: '4.35%', change: 'Unchanged', icon: '🏦', color: 'emerald' },
    { name: 'CPI (YoY)', value: '4.1%', change: '↓ from 4.3%', icon: '📊', color: 'teal' },
    { name: 'Unemployment', value: '3.7%', change: 'Stable', icon: '👥', color: 'cyan' },
    { name: 'GDP Growth', value: '2.1%', change: '↑ from 1.8%', icon: '📈', color: 'green' },
  ]

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">🏦</span>
          <div className="flex flex-col">
            <span>Australia Economy Feed</span>
            <span className="text-xs font-normal text-emerald-700">🇦🇺 Australian economic indicators & news</span>
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

      {/* Additional Economic Metrics - Row 1 */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">AUD/USD</div>
          <div className="text-3xl font-bold text-slate-900">$0.68</div>
          <div className="text-xs text-green-600 font-semibold">+0.5% today</div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">ASX 200 VIX</div>
          <div className="text-3xl font-bold text-slate-900">12.4</div>
          <div className="text-xs text-slate-600">Market volatility</div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">10Y Bond Yield</div>
          <div className="text-3xl font-bold text-slate-900">4.12%</div>
          <div className="text-xs text-red-600 font-semibold">+0.08% this week</div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">Retail Sales (MoM)</div>
          <div className="text-3xl font-bold text-slate-900">+0.3%</div>
          <div className="text-xs text-green-600 font-semibold">Above forecast</div>
        </div>
      </div>

      {/* Additional Economic Metrics - Row 2 */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">Trade Balance</div>
          <div className="text-3xl font-bold text-slate-900">$8.9B</div>
          <div className="text-xs text-green-600 font-semibold">Surplus (Monthly)</div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">Consumer Confidence</div>
          <div className="text-3xl font-bold text-slate-900">82.4</div>
          <div className="text-xs text-green-600 font-semibold">+2.1 pts this month</div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">Business Confidence</div>
          <div className="text-3xl font-bold text-slate-900">+6</div>
          <div className="text-xs text-green-600 font-semibold">Improving sentiment</div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">Wage Growth (YoY)</div>
          <div className="text-3xl font-bold text-slate-900">4.1%</div>
          <div className="text-xs text-green-600 font-semibold">Strong growth</div>
        </div>
      </div>

      {/* View All Articles Button */}
      <div className="text-center">
        <a
          href="/news?category=economy"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <span>📰</span>
          View All Economic News & Analysis
          <span>→</span>
        </a>
      </div>
    </div>
  )
}
