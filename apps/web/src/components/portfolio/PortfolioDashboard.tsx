'use client'

import { useState, useEffect } from 'react'

interface PortfolioNews {
  title: string
  summary: string
  url: string
  source: string
  relevantHoldings: string[]
  matchedKeywords: string[]
  relevanceScore: number
  publishedAt: Date
}

interface PortfolioDashboardProps {
  portfolioId?: string
  isEnabled: boolean
}

export default function PortfolioDashboard({ portfolioId = 'demo-1', isEnabled }: PortfolioDashboardProps) {
  const [news, setNews] = useState<PortfolioNews[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEnabled || !portfolioId) return

    const fetchPortfolioNews = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/portfolio/news?portfolioId=${portfolioId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch portfolio news')
        }

        const data = await response.json()
        setNews(data.news || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching portfolio news:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioNews()
  }, [portfolioId, isEnabled])

  if (!isEnabled) return null

  return (
    <section id="portfolio" className="space-y-6">
      <div className="section-card">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span className="text-4xl">💼</span>
          <span>My Portfolio News</span>
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Personalised news and updates for your investments
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gecko-200 border-t-gecko-500"></div>
            <span className="ml-4 text-slate-600">Fetching personalised news...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* News List */}
        {!loading && !error && news.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              Found {news.length} articles relevant to your holdings
            </p>

            {news.map((article, index) => (
              <div
                key={index}
                className="bg-white border-2 border-slate-200 rounded-lg p-6 hover:border-gecko-300 hover:shadow-lg transition-all duration-200 group"
              >
                {/* Article Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex-1 group-hover:text-gecko-600 transition-colors">
                    {article.title}
                  </h3>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-2 bg-gecko-100 hover:bg-gecko-500 text-gecko-700 hover:text-white font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
                  >
                    Read →
                  </a>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>📰</span>
                    {article.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏰</span>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⭐</span>
                    Relevance: {Math.round(article.relevanceScore * 100)}%
                  </span>
                </div>

                {/* Summary */}
                {article.summary && (
                  <p className="text-slate-700 text-sm mb-4 line-clamp-2">{article.summary}</p>
                )}

                {/* Matched Holdings */}
                {article.relevantHoldings.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-600">Relates to:</span>
                    {article.relevantHoldings.map((symbol) => (
                      <span
                        key={symbol}
                        className="inline-block px-3 py-1 bg-gecko-100 text-gecko-700 rounded-full text-xs font-semibold"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>
                )}

                {/* Matched Keywords */}
                {article.matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Keywords:</span>
                    {article.matchedKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No news found for your portfolio yet</p>
            <p className="text-sm text-slate-500">
              Check back later or add more holdings to expand coverage
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
