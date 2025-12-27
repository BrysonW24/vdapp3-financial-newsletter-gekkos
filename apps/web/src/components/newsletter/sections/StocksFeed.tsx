'use client'

import { useNews } from '@/lib/hooks/useNews'

interface Article {
  title: string
  source: string
  url: string
}

export default function StocksFeed() {
  const { articles: newsArticles, loading, error } = useNews('/api/news')

  const headlineStory = {
    title: newsArticles[0]?.title || 'ASX 200 Reaches New 6-Month High on Banking Sector Strength',
    source: newsArticles[0]?.source || 'Australian Financial Review',
    url: newsArticles[0]?.url || '#',
    summary: newsArticles[0]?.description || 'The ASX 200 climbed to its highest level in six months as the major banks rallied on improved profit outlooks and stabilizing interest rate expectations.',
  }

  const articles: Article[] = newsArticles.slice(1, 6).map(article => ({
    title: article.title,
    source: article.source,
    url: article.url,
  }))

  // Loading state
  if (loading) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">💹</span>
          Stocks Feed
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

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
        {!error && articles.length > 0 && (
          <span className="ml-auto text-xs font-normal text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            LIVE NEWS ✨
          </span>
        )}
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

      {/* Headline Story */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">📰</span>
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
          <h3 className="text-lg font-semibold text-slate-700">Top Stock Market News</h3>
          <a href="/news?category=stocks" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All Articles →
          </a>
        </div>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all duration-200">
              <span className="text-blue-600 font-bold text-sm mt-0.5">•</span>
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

      {/* Sector Performance */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
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
    </div>
  )
}
