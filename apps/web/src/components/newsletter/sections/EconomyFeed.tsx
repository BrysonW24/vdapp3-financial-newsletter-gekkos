'use client'

import { useNews } from '@/lib/hooks/useNews'

interface Article {
  title: string
  source: string
  url: string
}

export default function EconomyFeed() {
  const { articles: newsArticles, loading, error } = useNews('/api/news')

  const headlineStory = {
    title: newsArticles[0]?.title || 'RBA Holds Cash Rate Steady at 4.35%, Signals Data-Dependent Approach',
    source: newsArticles[0]?.source || 'Australian Financial Review',
    url: newsArticles[0]?.url || '#',
    summary: newsArticles[0]?.description || 'The Reserve Bank of Australia kept the official cash rate unchanged at 4.35% for the third consecutive meeting.',
  }

  const articles: Article[] = newsArticles.slice(1, 6).map(article => ({
    title: article.title,
    source: article.source,
    url: article.url,
  }))

  const economicIndicators = [
    { name: 'Cash Rate', value: '4.35%', change: 'Unchanged', icon: '🏦', color: 'blue' },
    { name: 'CPI (YoY)', value: '4.1%', change: '↓ from 4.3%', icon: '📊', color: 'green' },
    { name: 'Unemployment', value: '3.7%', change: 'Stable', icon: '👥', color: 'yellow' },
    { name: 'GDP Growth', value: '2.1%', change: '↑ from 1.8%', icon: '📈', color: 'purple' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  }

  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">🎯</span>
          Strategic Moat Finder
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    )
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
        {!error && articles.length > 0 && (
          <span className="ml-auto text-xs font-normal text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
            LIVE NEWS ✨
          </span>
        )}
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

      {/* Headline Story */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">🎯</span>
          <div className="flex-1">
            <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full mb-2">
              RBA ANNOUNCEMENT
            </div>
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
          <h3 className="text-lg font-semibold text-slate-700">Economic News & Analysis</h3>
          <a href="/news?category=economy" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All Articles →
          </a>
        </div>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent transition-all duration-200">
              <span className="text-emerald-600 font-bold text-sm mt-0.5">•</span>
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

      {/* Expert Commentary */}
      <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Expert View</h4>
            <p className="text-sm text-amber-800 italic">
              "The RBA's patient approach reflects confidence that inflation is trending downward without requiring further rate hikes. We expect the first cut by Q3 2024."
            </p>
            <p className="text-xs text-amber-700 mt-2">— Chief Economist, Major Bank</p>
          </div>
        </div>
      </div>
    </div>
  )
}
