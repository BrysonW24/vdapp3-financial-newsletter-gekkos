'use client'

import { useNews } from '@/lib/hooks/useNews'

interface Article {
  title: string
  source: string
  url: string
}

export default function PropertyFeed() {
  const { articles: newsArticles, loading, error } = useNews('/api/property-news')

  const headlineStory = {
    title: newsArticles[0]?.title || 'Australian Property Prices Rise 2.1% in Q4, Defying Rate Hikes',
    source: newsArticles[0]?.source || 'Domain',
    url: newsArticles[0]?.url || '#',
    summary: newsArticles[0]?.description || 'Australian property markets showed resilience in the fourth quarter, with capital city dwelling values rising 2.1% despite elevated interest rates.',
  }

  const articles: Article[] = newsArticles.slice(1, 6).map(article => ({
    title: article.title,
    source: article.source,
    url: article.url,
  }))

  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">🏠</span>
          Property Feed
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

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
            <span className="text-xs font-normal text-orange-700">🏘️ Australian property market data & news</span>
          </div>
        </div>
        {!error && articles.length > 0 && (
          <span className="ml-auto text-xs font-normal text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            LIVE NEWS ✨
          </span>
        )}
      </h2>

      {/* Property Market Dashboard */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {propertyIndicators.map((indicator) => (
          <div key={indicator.name} className={`${colorMap[indicator.color]} text-white rounded-lg p-4 shadow-md`}>
            <div className="text-2xl mb-2">{indicator.icon}</div>
            <div className="text-xs font-medium text-white/80 mb-1">{indicator.name}</div>
            <div className="text-2xl font-bold mb-1">{indicator.value}</div>
            <div className="text-xs font-semibold text-green-200">{indicator.change}</div>
          </div>
        ))}
      </div>

      {/* Headline Story */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">🔥</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{headlineStory.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{headlineStory.summary}</p>
            <a href={headlineStory.url} target="_blank" rel="noopener noreferrer" className="article-link text-sm font-medium">
              Read full story on {headlineStory.source} →
            </a>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-700">Latest Property News</h3>
          <a href="/news?category=property" className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View All Articles →
          </a>
        </div>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 hover:bg-orange-50 hover:border-orange-300 border-2 border-transparent transition-all duration-200">
              <span className="text-orange-600 font-bold text-sm mt-0.5">•</span>
              <div className="flex-1">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-link font-medium">
                  {article.title}
                </a>
                <p className="text-xs text-slate-500 mt-1">Source: {article.source}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Market Insight */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Market Insight</h4>
            <p className="text-sm text-blue-800">
              Property experts suggest the current market conditions favor buyers in outer suburbs while inner-city apartments remain competitive. First home buyers should consider government incentives and off-peak buying periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
