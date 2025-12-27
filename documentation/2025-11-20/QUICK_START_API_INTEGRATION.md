# ⚡ Quick Start: Adding Timeout/Retry to Any API

> **For:** Developers adding new external API integrations
> **Time:** 5 minutes per API
> **Difficulty:** Beginner

---

## 3-Minute Implementation

### Step 1: Import Utilities

```typescript
// At the top of your service file
import {
  fetchWithTimeout,
  isRateLimitError,
  isRetryableError,
} from '@/lib/utils/fetch-utils'
```

### Step 2: Replace fetch() Call

```typescript
// ❌ BEFORE
const response = await fetch(url, { next: { revalidate: 300 } })

// ✅ AFTER
const response = await fetchWithTimeout(
  url,
  { next: { revalidate: 300 } },
  5000 // timeout in ms
)
```

### Step 3: Add Error Handling

```typescript
// Add these checks after fetchWithTimeout
if (isRateLimitError(response)) {
  console.warn(`Rate limit hit (429) for ${url}`)
  return [] // or null, or cached data
}

if (isRetryableError(response)) {
  throw new Error(`API error: ${response.status}`)
}

if (!response.ok) {
  throw new Error(`API error: ${response.statusText}`)
}
```

### Step 4: Wrap in Try/Catch

```typescript
try {
  const response = await fetchWithTimeout(url, options, 5000)
  // ... error handling ...
  const data = await response.json()
  return data
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message)
  } else {
    console.error('Error:', error)
  }
  return [] // sensible default
}
```

---

## Copy-Paste Template

```typescript
import {
  fetchWithTimeout,
  isRateLimitError,
  isRetryableError,
} from '@/lib/utils/fetch-utils'

export async function fetchData(): Promise<DataType | null> {
  try {
    const url = 'https://api.example.com/endpoint'

    // Fetch with 5s timeout
    const response = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'Newsletter-Bot/1.0' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    }, 5000)

    // Rate limit detection
    if (isRateLimitError(response)) {
      console.warn(`Rate limit hit (429) for ${url}`)
      return null
    }

    // Transient error handling
    if (isRetryableError(response)) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    // Other errors
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    // Parse and return
    const data = await response.json()
    return data

  } catch (error) {
    // Log error with context
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message)
    } else {
      console.error('Error fetching data:', error)
    }
    return null // sensible default
  }
}
```

---

## Timeout Values Quick Reference

| API Type | Timeout | Example |
|----------|---------|---------|
| **Fast APIs** | 3–5s | CoinGecko, Alpha Vantage |
| **Standard APIs** | 5–8s | Yahoo Finance, NewsAPI |
| **Slow APIs** | 10–15s | RSS feeds, web scraping |
| **LLM APIs** | Built-in | OpenAI, Anthropic |

**Rule of thumb:** Start with 5s, increase if you get timeouts in logs.

---

## Caching (Optional but Recommended)

Add to your fetch call:

```typescript
const response = await fetchWithTimeout(url, {
  next: {
    revalidate: 300 // ← Cache for 5 minutes
  },
}, 5000)
```

**Cache times by data:**
- Stock prices: 300s (5 min)
- News/RSS: 900s (15 min)
- Daily data: 86400s (1 day)
- LLM output: 0 (no cache)

---

## Common Mistakes ❌

### ❌ Missing Error Types
```typescript
// DON'T: Catch all errors the same way
if (error) {
  return null
}

// DO: Differentiate error types
if (error instanceof Error) {
  console.error('Error:', error.message)
} else {
  console.error('Unknown error:', error)
}
```

### ❌ Silent Failures
```typescript
// DON'T: Return empty array without logging
catch (error) {
  return []
}

// DO: Log before returning default
catch (error) {
  console.error('API failed:', error)
  return []
}
```

### ❌ Wrong Timeout Value
```typescript
// DON'T: 500ms (too short for most APIs)
const response = await fetchWithTimeout(url, {}, 500)

// DO: 5000ms minimum
const response = await fetchWithTimeout(url, {}, 5000)
```

### ❌ Ignoring Rate Limits
```typescript
// DON'T: Treat 429 like other errors
if (!response.ok) {
  throw new Error('API failed')
}

// DO: Handle 429 specially
if (isRateLimitError(response)) {
  console.warn('Rate limit, backing off...')
  return null
}
```

---

## Testing Your API

### 1. Normal Request
```typescript
const data = await fetchData()
console.log('Success:', data)
```

### 2. Simulate Timeout
```bash
# In browser DevTools Network tab:
# Throttle → GPRS (very slow)
# Then call your API
```

### 3. Simulate Rate Limit
```typescript
// Modify your mock to return 429
const response = { status: 429, ok: false, statusText: 'Too Many Requests' }
```

### 4. Check Caching
```bash
# First call: check time in Network tab
# Second call (within 5 min): should be < 50ms from cache
```

---

## Real-World Examples

### Example 1: NewsAPI

```typescript
async function searchNews(keywords: string[]): Promise<Article[]> {
  try {
    const query = keywords.join(' ')
    const apiKey = process.env.NEWS_API_KEY

    const response = await fetchWithTimeout(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } },
      10000 // NewsAPI can be slow
    )

    if (isRateLimitError(response)) {
      console.warn('NewsAPI rate limit')
      return []
    }

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`)
    }

    const data = await response.json()
    return data.articles || []

  } catch (error) {
    console.error('News search failed:', error instanceof Error ? error.message : error)
    return []
  }
}
```

### Example 2: Stock Data (Yahoo Finance)

```typescript
async function fetchStockPrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetchWithTimeout(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 }, // 5 min cache
      },
      8000 // Yahoo can be slow
    )

    if (isRetryableError(response)) {
      throw new Error(`Yahoo error: ${response.status}`)
    }

    if (!response.ok) {
      throw new Error('Yahoo API failed')
    }

    const data = await response.json()
    return data.chart.result[0].meta.regularMarketPrice

  } catch (error) {
    console.error('Stock fetch failed:', error instanceof Error ? error.message : error)
    return null
  }
}
```

### Example 3: Crypto Data (CoinGecko)

```typescript
async function fetchCryptoPrice(id: string): Promise<number | null> {
  try {
    const response = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/coins/${id}?vs_currency=usd`,
      { next: { revalidate: 300 } },
      5000 // CoinGecko is fast
    )

    if (isRateLimitError(response)) {
      console.warn('CoinGecko rate limit')
      return null
    }

    if (!response.ok) {
      throw new Error(`CoinGecko error: ${response.status}`)
    }

    const data = await response.json()
    return data.market_data.current_price.usd

  } catch (error) {
    console.error('Crypto fetch failed:', error instanceof Error ? error.message : error)
    return null
  }
}
```

---

## Troubleshooting

### Issue: Timeouts happening frequently

**Solution:** Increase timeout value
```typescript
// From 5s to 10s
const response = await fetchWithTimeout(url, options, 10000)
```

### Issue: "API rate limit hit (429)" messages

**Solution:** Check if you're making too many requests
```typescript
// Add caching to reduce requests
next: { revalidate: 600 } // Cache for 10 min instead of 5
```

### Issue: Getting "Cannot find module 'fetch-utils'"

**Solution:** Check import path
```typescript
// Make sure path is correct
import { fetchWithTimeout } from '@/lib/utils/fetch-utils'
// Not: './fetch-utils' (relative path won't work)
```

### Issue: Response parsing fails

**Solution:** Add validation
```typescript
const data = await response.json()
if (!data || !data.price) {
  throw new Error('Invalid response format')
}
return data.price
```

---

## Checklist for Production

- [ ] Timeout set (5–10s)
- [ ] Rate limit handling implemented
- [ ] Error logging added
- [ ] Caching configured
- [ ] Tested with throttling
- [ ] Tested with offline
- [ ] Docs updated with new API
- [ ] Deployed to staging first
- [ ] Monitored logs for errors

---

## When to Ask for Help

If you get stuck on:
- How to set timeout value for a specific API → Check API_INTEGRATION_STANDARDS.md
- How retryFetch works → Check fetch-utils.ts source code
- How to set up monitoring → Check API_INTEGRATION_STANDARDS.md section on observability

---

## Related Resources

- **Full Standards:** [API_INTEGRATION_STANDARDS.md](API_INTEGRATION_STANDARDS.md)
- **Utility Source:** [fetch-utils.ts](apps/web/src/lib/utils/fetch-utils.ts)
- **Real Example:** [crypto-data.ts](apps/web/src/lib/services/crypto-data.ts)
- **Quick Summary:** [API_OPTIMIZATION_SUMMARY.md](API_OPTIMIZATION_SUMMARY.md)

---

**Time to implement:** 5 minutes per API
**Complexity:** Beginner-friendly
**Impact:** High (prevents hangs, improves reliability)

Good luck! 🚀
