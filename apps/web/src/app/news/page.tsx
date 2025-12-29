'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  sourceUrl: string
  publishedAt: string
  category: string
}

function NewsIntelligenceContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const categoriesParam = searchParams.get('categories') // Support multiple categories

  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    // Initialize from URL params
    if (categoriesParam) {
      return categoriesParam.split(',')
    }
    if (categoryParam && categoryParam !== 'all') {
      return [categoryParam]
    }
    return []
  })
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Update categories when URL params change
  useEffect(() => {
    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(','))
    } else if (categoryParam && categoryParam !== 'all') {
      setSelectedCategories([categoryParam])
    } else if (categoryParam === 'all') {
      setSelectedCategories([])
    }
  }, [categoryParam, categoriesParam])

  useEffect(() => {
    fetchArticles()
  }, [selectedCategories])

  const fetchArticles = async () => {
    try {
      setLoading(true)

      // Fetch from API - fetch all categories and filter client-side for multiple category support
      const category = selectedCategories.length > 0 ? selectedCategories.join(',') : 'all'
      const response = await fetch(`/api/news?category=${category}`)
      const data = await response.json()

      if (response.ok && Array.isArray(data)) {
        // Transform articles to match our interface
        const transformedArticles = data.map((article: any, index: number) => ({
          id: `${article.category || 'unknown'}-${index}`,
          title: article.title || 'Untitled',
          content: article.description || article.summary || '',
          source: article.source || 'Unknown',
          sourceUrl: article.url || '#',
          publishedAt: article.publishedAt || new Date().toISOString(),
          category: article.category || 'general',
        }))

        // Sort by published date (newest first)
        transformedArticles.sort((a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )

        setArticles(transformedArticles)
        setError(null)
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      setError('Failed to fetch news articles.')
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    // Category match - show all if no categories selected, otherwise match any selected category
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(article.category)
    const sourceMatch = selectedSource === 'all' || article.source === selectedSource

    // Search filter - search across title, content, and source
    const searchLower = searchQuery.toLowerCase()
    const searchMatch = searchQuery === '' ||
      (article.title || '').toLowerCase().includes(searchLower) ||
      (article.content || '').toLowerCase().includes(searchLower) ||
      (article.source || '').toLowerCase().includes(searchLower)

    return categoryMatch && sourceMatch && searchMatch
  })

  const toggleCategory = (category: string) => {
    if (category === 'all') {
      setSelectedCategories([])
    } else {
      setSelectedCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      )
    }
  }

  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))]
  const sources = ['all', ...Array.from(new Set(articles.map(a => a.source)))]

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

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      all: '📰',
      stocks: '💹',
      crypto: '₿',
      tech: '💻',
      property: '🏠',
      economy: '🏦',
    }
    return icons[category] || '📰'
  }

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      all: 'All News',
      stocks: 'Stocks & Markets',
      crypto: 'Cryptocurrency',
      tech: 'Technology',
      property: 'Property',
      economy: 'Economy',
    }
    return names[category] || category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white border-b border-green-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:h-16 gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4 w-full sm:w-auto">
              <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-green-100 transition-colors">
                🦎 Gekkos
              </Link>
              <span className="hidden sm:inline text-green-300">|</span>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-semibold">
                  📰 News Intelligence
                </h1>
                <p className="text-xs text-green-100">
                  {selectedCategories.length === 0
                    ? 'All Categories'
                    : selectedCategories.map(cat => getCategoryName(cat)).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/"
                className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm sm:text-base min-h-[44px] flex items-center"
              >
                ← Home
              </Link>
              <Link
                href="/news/search"
                className="px-4 py-3 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm sm:text-base min-h-[44px] flex items-center"
              >
                Advanced Search
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by keyword..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[48px] text-base"
              />
            </div>

            {/* Category Filter - Multi-select chips */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories {selectedCategories.length > 0 && (
                  <span className="text-xs text-gray-500">({selectedCategories.length} selected)</span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.length === 0
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📰 All Categories
                </button>
                {categories.filter(cat => cat !== 'all').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategories.includes(cat)
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getCategoryIcon(cat)} {getCategoryName(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[48px] text-base"
              >
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredArticles.length} of {articles.length} articles
              </p>
              <button
                onClick={fetchArticles}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <div>
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-3 hover:text-green-600 transition-colors">
                        {article.title}
                      </h2>

                      {/* Content Preview */}
                      <p className="text-gray-600 mb-4 line-clamp-4 flex-1">
                        {article.content?.substring(0, 200)}...
                      </p>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <span className="font-medium">{article.source}</span>
                          </div>
                          <time className="text-gray-500 text-xs">
                            {formatDate(article.publishedAt)}
                          </time>
                        </div>
                        {article.sourceUrl && (
                          <a
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                          >
                            Read full article
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewsIntelligencePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading news intelligence...</p>
        </div>
      </div>
    }>
      <NewsIntelligenceContent />
    </Suspense>
  )
}
