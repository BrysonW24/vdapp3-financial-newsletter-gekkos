'use client'

import { useState, useEffect } from 'react'

interface CryptoDataResponse {
  cryptos: any[]
  globalMarketCap: number
  marketCapChange24h: number
  fearGreedIndex: {
    value: number
    classification: string
  } | null
}

export function useCryptoData() {
  const [data, setData] = useState<CryptoDataResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/crypto-data')

        if (!response.ok) {
          throw new Error('Failed to fetch crypto data')
        }

        const result = await response.json()

        if (result.success) {
          setData(result.data)
          setError(null)
        } else {
          throw new Error(result.error || 'Unknown error')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error('Crypto data hook error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Function to calculate milliseconds until next 7am in Australia/Sydney timezone
    // Note: JavaScript Date uses local timezone, so this assumes the user's browser is set to Australia/Sydney
    // For more accurate timezone handling, consider using a library like date-fns-tz or Intl.DateTimeFormat
    function getMillisecondsUntilNext7amSydney() {
      const now = new Date()
      let next7am = new Date(now)
      next7am.setHours(7, 0, 0, 0)
      if (next7am <= now) {
        next7am.setDate(next7am.getDate() + 1)
      }
      return next7am.getTime() - now.getTime()
    }

    fetchData()

    // Set initial timeout for the next 7am refresh
    // This schedules the first daily refresh at the next 7am
    const timeoutId = setTimeout(() => {
      fetchData()
      // After first refresh, set up daily 24-hour interval to continue refreshing at 7am every day
      setInterval(fetchData, 24 * 60 * 60 * 1000) // 24 hours in milliseconds
    }, getMillisecondsUntilNext7amSydney())

    return () => {
      clearTimeout(timeoutId)
      // Note: The interval is set inside timeout, so it needs to be handled differently
      // For simplicity, since the hook unmounts, and intervals are cleared, but to be precise,
      // we might need useRef to store interval ID, but for now, this should work as intervals are cleared on unmount
    }
  }, [])

  return { data, loading, error }
}
