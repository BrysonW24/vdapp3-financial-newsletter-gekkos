'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SearchFilters {
  keywords: string
  category: string
  source: string
  dateFrom: string
  dateTo: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  sourceUrl: string
  publishedAt: string
  category: string
}

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: '',
    category: 'all',
    source: 'all',
    dateFrom: '',
    dateTo: '',
  })

  const [results, setResults] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)

    try {
      // Fetch from API with category parameter
      const response = await fetch(`/api/news?category=${filters.category}`)
      const data = await response.json()

      let allArticles: NewsArticle[] = []

      if (response.ok && Array.isArray(data)) {
        allArticles = data.map((article: any, index: number) => ({
          id: `${article.category || filters.category}-${index}`,
          title: article.title || 'Untitled',
          content: article.description || article.summary || '',
          source: article.source || 'Unknown',
          sourceUrl: article.url || '#',
          publishedAt: article.publishedAt || new Date().toISOString(),
          category: article.category || filters.category,
        }))
      }

      // Apply filters
      let filteredResults = allArticles

      // Keyword filter
      if (filters.keywords) {
        const keywordsLower = filters.keywords.toLowerCase()
        filteredResults = filteredResults.filter(article =>
          article.title.toLowerCase().includes(keywordsLower) ||
          article.content.toLowerCase().includes(keywordsLower) ||
          article.source.toLowerCase().includes(keywordsLower)
        )
      }

      // Source filter
      if (filters.source !== 'all') {
        filteredResults = filteredResults.filter(article =>
          article.source === filters.source
        )
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        filteredResults = filteredResults.filter(article =>
          new Date(article.publishedAt) >= fromDate
        )
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        filteredResults = filteredResults.filter(article =>
          new Date(article.publishedAt) <= toDate
        )
      }

      // Sort by date (newest first)
      filteredResults.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )

      setResults(filteredResults)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      stocks: 'bg-blue-100 text-blue-800',
      crypto: 'bg-purple-100 text-purple-800',
      tech: 'bg-indigo-100 text-indigo-800',
      property: 'bg-green-100 text-green-800',
      economy: 'bg-orange-100 text-orange-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white border-b border-green-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold hover:text-green-100 transition-colors">
                🦎 Gekkos
              </Link>
              <span className="text-green-300">|</span>
              <Link href="/news" className="text-green-100 hover:text-white transition-colors">
                News
              </Link>
              <span className="text-green-300">|</span>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold">
                  🔍 Advanced Search
                </h1>
                <p className="text-xs text-green-100">
                  Multi-criteria news search
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/news"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                ← Back to News
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Advanced News Search
          </h2>

          <div className="space-y-4">
            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={filters.keywords}
                onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                placeholder="e.g., bitcoin, inflation, technology..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Search across article titles, descriptions, and sources
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="stocks">Stocks & Markets</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="tech">Technology</option>
                  <option value="property">Property</option>
                  <option value="economy">Economy</option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Sources</option>
                  <option value="marketwatch.com">MarketWatch</option>
                  <option value="cointelegraph.com">Cointelegraph</option>
                  <option value="techcrunch.com">TechCrunch</option>
                  <option value="afr.com">AFR</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setFilters({
                  keywords: '',
                  category: 'all',
                  source: 'all',
                  dateFrom: '',
                  dateTo: '',
                })}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search Articles'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Searching articles...</p>
          </div>
        )}

        {searched && !loading && (
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-900">
              Found {results.length} article{results.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Results Grid */}
        {searched && !loading && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No articles found matching your search criteria.
                </p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              results.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600">
                    <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Source: {article.source}
                    </span>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Read full article →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
