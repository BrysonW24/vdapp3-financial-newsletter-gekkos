'use client'

import { useState, useEffect } from 'react'

interface StockMover {
  code: string
  name: string
  price: number
  changePercent: number
  volume: number
}

interface StockMoversResponse {
  gainers: StockMover[]
  losers: StockMover[]
}

export function useStockMovers() {
  const [data, setData] = useState<StockMoversResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/stock-movers')

        if (!response.ok) {
          throw new Error('Failed to fetch stock movers')
        }

        const result = await response.json()

        if (result.success) {
          setData(result.data)
          setError(null)
        } else {
          throw new Error(result.error || 'Unknown error')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movers')
        console.error('Stock movers hook error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}
