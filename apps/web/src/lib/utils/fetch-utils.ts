/**
 * Fetch utilities for API calls with timeout and retry logic
 */

/**
 * Fetch with timeout protection
 * Aborts request if it takes longer than timeoutMs
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 5000
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

/**
 * Retry fetch with exponential backoff
 * Useful for transient failures (rate limits, temporary outages)
 */
export async function retryFetch<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelayMs?: number
    maxDelayMs?: number
    onRetry?: (attempt: number, error: Error) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    onRetry,
  } = options

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }

      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelayMs
      )

      if (onRetry && error instanceof Error) {
        onRetry(attempt + 1, error)
      }

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error('Retry limit exceeded')
}

/**
 * Fetch with both timeout and retry
 */
export async function fetchWithRetry(
  url: string,
  options: {
    timeoutMs?: number
    maxRetries?: number
    baseDelayMs?: number
    headers?: HeadersInit
  } = {}
): Promise<Response> {
  const {
    timeoutMs = 5000,
    maxRetries = 3,
    baseDelayMs = 1000,
    headers,
  } = options

  return retryFetch(
    () =>
      fetchWithTimeout(url, { headers }, timeoutMs),
    {
      maxRetries,
      baseDelayMs,
      onRetry: (attempt, error) => {
        console.warn(
          `Fetch retry attempt ${attempt}/${maxRetries} for ${url}:`,
          error.message
        )
      },
    }
  )
}

/**
 * Check if response indicates rate limiting
 */
export function isRateLimitError(response: Response): boolean {
  return response.status === 429
}

/**
 * Check if response indicates a retryable error
 */
export function isRetryableError(response: Response): boolean {
  const retryableStatuses = [408, 429, 500, 502, 503, 504]
  return retryableStatuses.includes(response.status)
}
