'use client'

import { useNews } from '@/lib/hooks/useNews'

interface Article {
  title: string
  source: string
  url: string
}

export default function GlobalPolitics() {
  const { articles: newsArticles, loading, error } = useNews('/api/global-politics-news')

  const headlineStory = {
    title: newsArticles[0]?.title || 'Global Political Tensions Rise as Major Powers Navigate Diplomatic Channels',
    source: newsArticles[0]?.source || 'Reuters',
    url: newsArticles[0]?.url || '#',
    summary: newsArticles[0]?.description || 'World leaders convene to discuss pressing geopolitical issues and international relations.',
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
          <span className="text-3xl">🌍</span>
          Global Politics
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section-card animate-slide-up">
        <h2 className="section-title">
          <span className="text-3xl">🌍</span>
          Global Politics
        </h2>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">⚠️ Unable to load global politics news</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-card animate-slide-up">
      <h2 className="section-title">
        <span className="text-3xl">🌍</span>
        Global Politics
        {!error && articles.length > 0 && (
          <span className="ml-auto text-xs font-normal text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            BREAKING NEWS 🔴
          </span>
        )}
      </h2>

      {/* Global Regions Overview */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🇺🇸</div>
          <div className="text-xs font-medium text-blue-100 mb-1">Americas</div>
          <div className="text-sm font-bold">Political Update</div>
        </div>
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🇪🇺</div>
          <div className="text-xs font-medium text-amber-100 mb-1">Europe</div>
          <div className="text-sm font-bold">Political News</div>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🌏</div>
          <div className="text-xs font-medium text-red-100 mb-1">Asia-Pacific</div>
          <div className="text-sm font-bold">Regional Developments</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg p-4 shadow-md">
          <div className="text-2xl mb-2">🌍</div>
          <div className="text-xs font-medium text-green-100 mb-1">Global</div>
          <div className="text-sm font-bold">International Affairs</div>
        </div>
      </div>

      {/* Headline Story */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">📰</span>
          <div className="flex-1">
            <div className="inline-block px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full mb-2">
              TOP STORY
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{headlineStory.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{headlineStory.summary}</p>
            <a href={headlineStory.url} target="_blank" rel="noopener noreferrer" className="article-link text-sm font-medium">
              Read full story on {headlineStory.source} →
            </a>
          </div>
        </div>
      </div>

      {/* Related News */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Global Politics & Diplomacy</h3>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 hover:bg-amber-50 hover:border-amber-300 border-2 border-transparent transition-all duration-200">
              <span className="text-amber-600 font-bold text-sm mt-0.5">◆</span>
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

      {/* Policy Brief */}
      <div className="mt-6 bg-slate-100 border-l-4 border-slate-600 rounded-r-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Policy Brief</h4>
            <p className="text-sm text-slate-700 italic">
              "International diplomacy continues to play a crucial role in navigating complex geopolitical challenges. Key focus areas include trade negotiations, security alliances, and multilateral cooperation."
            </p>
            <p className="text-xs text-slate-600 mt-2">— Global Affairs Analysis</p>
          </div>
        </div>
      </div>
    </div>
  )
}
