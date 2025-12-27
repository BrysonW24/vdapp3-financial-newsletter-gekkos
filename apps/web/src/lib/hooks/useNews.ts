'use client'

import { useState, useEffect } from 'react'

interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: string
}

export function useNews(endpoint: string = '/api/news') {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }

        const result = await response.json()

        if (result.success) {
          setArticles(result.data)
          setError(null)
        } else {
          throw new Error(result.error || 'Unknown error')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news')
        console.error('News hook error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Refresh news every 15 minutes
    const interval = setInterval(fetchNews, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [endpoint])

  return { articles, loading, error }
}
