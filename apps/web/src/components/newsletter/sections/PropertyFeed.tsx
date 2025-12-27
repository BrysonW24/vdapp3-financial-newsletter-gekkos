'use client'

export default function PropertyFeed() {
  const propertyIndicators = [
    { name: 'Sydney Median', value: '$1.42M', change: '+2.1%', icon: '🏙️', color: 'orange' },
    { name: 'Melbourne Median', value: '$985K', change: '+1.8%', icon: '🌆', color: 'amber' },
    { name: 'Brisbane Median', value: '$815K', change: '+3.2%', icon: '☀️', color: 'yellow' },
    { name: 'Perth Median', value: '$685K', change: '+4.5%', icon: '🌊', color: 'blue' },
  ]

  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">🏠</span>
          <div className="flex flex-col">
            <span>Property Feed</span>
            <span className="text-xs font-normal text-orange-700">🏘️ Australian property market median prices</span>
          </div>
        </div>
      </h2>

      {/* Property Market Dashboard */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {propertyIndicators.map((indicator) => (
          <div key={indicator.name} className={`${colorMap[indicator.color]} text-white rounded-lg p-4 shadow-md`}>
            <div className="text-2xl mb-2">{indicator.icon}</div>
            <div className="text-xs font-medium text-white/80 mb-1">{indicator.name}</div>
            <div className="text-2xl font-bold mb-1">{indicator.value}</div>
            <div className="text-xs font-semibold text-green-200">{indicator.change} (QoQ)</div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="text-orange-600 text-sm font-medium mb-1">National Clearance Rate</div>
          <div className="text-3xl font-bold text-slate-900">68.4%</div>
          <div className="text-xs text-green-600 font-semibold">+2.1% from last week</div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="text-orange-600 text-sm font-medium mb-1">Avg Days on Market</div>
          <div className="text-3xl font-bold text-slate-900">32</div>
          <div className="text-xs text-red-600 font-semibold">+3 days from last month</div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="text-orange-600 text-sm font-medium mb-1">Rental Yield (Sydney)</div>
          <div className="text-3xl font-bold text-slate-900">3.2%</div>
          <div className="text-xs text-slate-600">Gross annual return</div>
        </div>
      </div>

      {/* View All Articles Button */}
      <div className="text-center">
        <a
          href="/news?category=property"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <span>📰</span>
          View All Property Market News & Analysis
          <span>→</span>
        </a>
      </div>
    </div>
  )
}
