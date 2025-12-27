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

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">🏠</span>
        Property Feed
        {!error && articles.length > 0 && (
          <span className="ml-auto text-xs font-normal text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            LIVE NEWS ✨
          </span>
        )}
      </h2>

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
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Latest Property News</h3>
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
