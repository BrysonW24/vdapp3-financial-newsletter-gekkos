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

  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Update category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory])

  const fetchArticles = async () => {
    try {
      setLoading(true)

      // Fetch from API with category parameter
      const response = await fetch(`/api/news?category=${selectedCategory}`)
      const data = await response.json()

      if (response.ok && Array.isArray(data)) {
        // Transform articles to match our interface
        const transformedArticles = data.map((article: any, index: number) => ({
          id: `${article.category || selectedCategory}-${index}`,
          title: article.title || 'Untitled',
          content: article.description || article.summary || '',
          source: article.source || 'Unknown',
          sourceUrl: article.url || '#',
          publishedAt: article.publishedAt || new Date().toISOString(),
          category: article.category || selectedCategory,
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
    const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory
    const sourceMatch = selectedSource === 'all' || article.source === selectedSource

    // Search filter - search across title, content, and source
    const searchLower = searchQuery.toLowerCase()
    const searchMatch = searchQuery === '' ||
      (article.title || '').toLowerCase().includes(searchLower) ||
      (article.content || '').toLowerCase().includes(searchLower) ||
      (article.source || '').toLowerCase().includes(searchLower)

    return categoryMatch && sourceMatch && searchMatch
  })

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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold hover:text-green-100 transition-colors">
                🦎 Gekkos
              </Link>
              <span className="text-green-300">|</span>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold">
                  {getCategoryIcon(selectedCategory)} News Intelligence
                </h1>
                <p className="text-xs text-green-100">
                  {getCategoryName(selectedCategory)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                ← Home
              </Link>
              <Link
                href="/news/search"
                className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
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
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
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
