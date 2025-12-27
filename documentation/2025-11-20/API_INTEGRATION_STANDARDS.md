# 📋 API Integration Standards

> **Purpose:** Define standardized patterns for all external API integrations in the newsletter-daily-prod backend.
>
> **Last Updated:** 2025-11-09
> **Status:** Active
> **Applies To:** All data services, routes, and external API calls

---

## Quick Reference

### Core Principles

1. **Timeout Protection** — All external API calls must have explicit timeouts
2. **Error Handling** — Differentiate between transient and permanent failures
3. **Rate Limit Awareness** — Detect and gracefully handle 429 responses
4. **Logging & Observability** — Log all API decisions with context
5. **Graceful Degradation** — Return sensible defaults on failure
6. **Next.js Caching** — Use `next: { revalidate }` for cache control

---

## Service-by-Service Implementation Status

### ✅ Web Services (Fully Optimized)

| Service | API | Timeout | Rate Limit Handling | Status |
|---------|-----|---------|-------------------|--------|
| **crypto-data** | CoinGecko + Alternative.me | 5s | ✅ Detects 429 | Complete |
| **market-data** | Yahoo Finance | 8s | ✅ Handles errors | Complete |
| **news-data** | RSS feeds | 10s | ✅ Logs warnings | Complete |
| **stock-movers** | Yahoo Finance | 8s | ✅ Returns null | Complete |
| **portfolioNewsService** | NewsAPI | 10s | ✅ Backs off | Complete |
| **intelligenceService** | OpenAI (Vercel AI) | Built-in | ✅ SDK handles | Complete |

### ⏳ Worker Services (Pending)

| Service | API | Status | Notes |
|---------|-----|--------|-------|
| **worker/market-data** | Yahoo Finance + CoinGecko | Pending | Uses axios library |
| **worker/news** | Mock/RSS | Pending | Returns mock data |

### 📍 External API Summary

| API | Endpoint | Type | Auth | Timeout |
|-----|----------|------|------|---------|
| **CoinGecko** | `api.coingecko.com/api/v3` | Free | None | 5s |
| **Alternative.me** | `api.alternative.me/fng/` | Free | None | 5s |
| **Yahoo Finance** | `query1.finance.yahoo.com/v8` | Free | None | 8s |
| **NewsAPI** | `newsapi.org/v2` | Freemium | API Key | 10s |
| **OpenAI** | `api.openai.com/v1` | Paid | API Key | Built-in |
| **RSS Feeds** | Various (20+ sources) | Free | None | 10s |

---

## Implementation Pattern

### Standard Fetch Utility Functions

All external API calls MUST use one of these utilities from `fetch-utils.ts`:

```typescript
// For single calls with timeout only
await fetchWithTimeout(url, options, timeoutMs)

// For calls with retry + timeout
const result = await retryFetch(() => fetchWithTimeout(url, opts, timeoutMs), {
  maxRetries: 3,
  baseDelayMs: 1000
})

// For direct fetch with retry/timeout
await fetchWithRetry(url, { timeoutMs: 5000, maxRetries: 3 })

// Helper functions
isRateLimitError(response)     // Detects 429 responses
isRetryableError(response)      // Detects 408, 429, 500, 502, 503, 504
```

### Service Template

Every service file must follow this structure:

```typescript
// services/my-service.ts

import {
  fetchWithTimeout,
  isRateLimitError,
  isRetryableError,
} from '@/lib/utils/fetch-utils'

/**
 * Fetch data from external API with timeout and error handling
 */
export async function fetchData(): Promise<DataType | null> {
  try {
    const url = 'https://api.example.com/endpoint'

    // 1️⃣ Use fetchWithTimeout for protection
    const response = await fetchWithTimeout(url, {
      headers: { /* ... */ },
      next: { revalidate: 300 }, // Cache for 5 minutes
    }, 5000) // 5s timeout

    // 2️⃣ Check for rate limiting
    if (isRateLimitError(response)) {
      console.warn('API rate limit hit (429). Backing off...')
      return null // Return graceful default
    }

    // 3️⃣ Check for retryable errors
    if (isRetryableError(response)) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    // 4️⃣ Check for other errors
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    // 5️⃣ Parse and return data
    const data = await response.json()
    return data

  } catch (error) {
    // 6️⃣ Log errors with context
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message)
    } else {
      console.error('Error fetching data:', error)
    }
    return null // Return graceful default
  }
}
```

---

## Timeout Values by API Type

Choose timeout based on API characteristics:

| Type | Timeout | Rationale | Examples |
|------|---------|-----------|----------|
| **Fast APIs** | 3-5s | RESTful, small payloads | CoinGecko, Alternative.me |
| **Standard APIs** | 8s | Stock data, larger responses | Yahoo Finance, Polygon |
| **Slow APIs** | 10-15s | RSS parsing, complex queries | RSS feeds, NewsAPI |
| **LLM APIs** | Built-in | Handled by SDK | OpenAI, Anthropic |
| **Webhooks** | 30s | Async processing | Stripe, GitHub |

---

## Caching Strategy

### Next.js Native Caching

Use `next: { revalidate }` directive in `fetch()` options:

```typescript
const response = await fetch(url, {
  next: { revalidate: 300 } // Cache for 5 minutes
})
```

### Revalidation Times by Data Type

| Data Type | Revalidate (s) | Rationale |
|-----------|---------------|-----------|
| **Stock prices** | 300 (5 min) | Updates every 5 min during market hours |
| **Crypto prices** | 300-600 (5-10 min) | 24/7, high volatility = frequent updates |
| **News/RSS** | 900 (15 min) | Once published, content is stable |
| **Market indices** | 300 (5 min) | Updates with market closes |
| **Fear/Greed index** | 3600 (1 h) | Slow-moving sentiment indicator |
| **Daily data** | 86400 (1 day) | Earnings, IPOs, static reports |
| **LLM generations** | 0 (no cache) | Always fresh, expensive |

### Manual Caching (Last Resort)

For complex caching logic, use `globalThis` with timestamp validation:

```typescript
// Cache until midnight Sydney time
const cacheKey = `quote:${symbol}`
const cached = globalThis[cacheKey]
const now = new Date()
const midnight = new Date(now)
midnight.setHours(24, 0, 0, 0)
const isStale = now > midnight

if (cached && !isStale) {
  return cached.data
}

// Fetch fresh data...
globalThis[cacheKey] = { data, timestamp: now }
```

---

## Error Handling Matrix

```
┌─────────────┬──────────────┬────────────┬──────────────┐
│ Status      │ Category     │ Action     │ Log Level    │
├─────────────┼──────────────┼────────────┼──────────────┤
│ 429         │ Rate limit   │ Backoff    │ WARN         │
│ 408, 5xx    │ Retryable    │ Retry     │ WARN         │
│ 400, 401    │ Client error │ Fail      │ ERROR        │
│ 403, 404    │ Not found    │ Fail      │ ERROR        │
│ Timeout     │ Network      │ Return ⊥  │ WARN         │
│ Parse err   │ Data error   │ Return ⊥  │ ERROR        │
└─────────────┴──────────────┴────────────┴──────────────┘

⊥ = null, [], or empty object (sensible default)
```

### Implementation Example

```typescript
try {
  const response = await fetchWithTimeout(url, options, 5000)

  if (isRateLimitError(response)) {
    console.warn(`Rate limit: ${url}`)
    return [] // Graceful default
  }

  if (isRetryableError(response)) {
    console.warn(`Retryable: ${response.status}`)
    throw new Error(`API error ${response.status}`)
  }

  if (!response.ok) {
    console.error(`API error: ${response.status}`)
    throw new Error(`API error: ${response.statusText}`)
  }

  return await response.json()

} catch (error) {
  if (error instanceof Error) {
    console.error('Fetch failed:', error.message)
  } else {
    console.error('Fetch failed:', error)
  }
  return [] // Always return sensible default
}
```

---

## Monitoring & Observability

### Required Logging

Log these events for all API calls:

```typescript
// 1. Timeout
console.warn(`API timeout: ${url} (exceeded ${timeoutMs}ms)`)

// 2. Rate limit
console.warn(`Rate limit hit: ${url} (429)`)

// 3. Transient errors
console.warn(`Transient error: ${url} (${status})`)

// 4. Permanent errors
console.error(`API error: ${url} (${status})`)

// 5. Parse errors
console.error(`Parse error: ${url}`, error.message)
```

### Metrics to Track

```typescript
{
  "api_calls_total": 1000,
  "api_success_rate": 0.98,
  "api_timeout_rate": 0.01,
  "api_rate_limit_hits": 5,
  "avg_response_time_ms": 450,
  "by_api": {
    "coingecko": { "calls": 300, "success_rate": 0.99 },
    "yahoo_finance": { "calls": 200, "success_rate": 0.97 },
    "newsapi": { "calls": 100, "success_rate": 0.96 }
  }
}
```

### Alert Thresholds

Trigger alerts if:

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Error rate | > 10% | Page on-call |
| Timeout rate | > 5% | Investigate API |
| Rate limit hits | > 20/day | Reduce request rate |
| Response time | > 5s p95 | Check API health |

---

## Rate Limiting Strategy

### Detection & Response

```typescript
if (isRateLimitError(response)) {
  // Option 1: Exponential backoff
  const delay = Math.pow(2, retryCount) * 1000
  await sleep(delay)

  // Option 2: Circuit breaker
  circuitBreaker.recordFailure()
  if (circuitBreaker.isOpen) {
    return fallbackData
  }

  // Option 3: Graceful degradation
  return cachedDataOrNull
}
```

### Rate Limit Headers

Some APIs return rate limit info in headers:

```typescript
const rateLimit = {
  limit: parseInt(response.headers.get('x-ratelimit-limit') || '0'),
  remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0'),
  reset: parseInt(response.headers.get('x-ratelimit-reset') || '0'),
}

if (rateLimit.remaining < 10) {
  console.warn('Approaching rate limit', rateLimit)
}
```

---

## API Keys & Environment Variables

### Secrets Management

```env
# .env.local (NEVER commit)
OPENAI_API_KEY=sk-...
NEWS_API_KEY=...
IEX_CLOUD_API_KEY=...

# Free APIs (no key needed)
# CoinGecko, Yahoo Finance, RSS feeds, etc.
```

### Key Rotation

- Rotate API keys every 90 days
- Use separate keys for dev/staging/prod
- Never log API keys or secrets
- Use Vercel Secrets for sensitive values

### Handling Missing Keys

```typescript
const apiKey = process.env.NEWS_API_KEY
if (!apiKey) {
  console.warn('NEWS_API_KEY not configured, skipping API')
  return [] // Return graceful default
}
```

---

## Testing

### Unit Tests Template

```typescript
describe('fetchCryptoData', () => {
  it('should return null on timeout', async () => {
    // Mock fetchWithTimeout to timeout
    await expect(fetchCryptoData()).resolves.toEqual(null)
  })

  it('should handle 429 rate limit', async () => {
    // Mock response with 429 status
    const result = await fetchCryptoData()
    expect(result).toEqual([])
  })

  it('should parse valid response', async () => {
    const result = await fetchCryptoData()
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        price: expect.any(Number),
      })
    ]))
  })
})
```

### Manual Testing Checklist

- [ ] API call succeeds with valid data
- [ ] Timeout triggers after N seconds
- [ ] 429 rate limit handled gracefully
- [ ] 5xx errors return sensible default
- [ ] Caching works (2nd call within revalidate window is instant)
- [ ] Logging captures all API decisions
- [ ] Error messages are informative

---

## Performance Optimization

### Request Batching

When possible, batch multiple requests:

```typescript
// ❌ Bad: 4 sequential requests
const stocks = await Promise.all([
  fetchStockQuote('CBA.AX'),
  fetchStockQuote('NAB.AX'),
  fetchStockQuote('ANZ.AX'),
  fetchStockQuote('WBC.AX'),
])
// Takes: 4 * 1s = 4s

// ✅ Good: Parallel requests
const stocks = await Promise.all([
  fetchStockQuote('CBA.AX'),
  fetchStockQuote('NAB.AX'),
  fetchStockQuote('ANZ.AX'),
  fetchStockQuote('WBC.AX'),
])
// Takes: 1s
```

### Response Size Limits

- Truncate large responses to necessary data
- Example: Use `slice(0, 1000)` for large text
- Limit RSS feed items to 5–10 per feed

### Connection Pooling

For worker services using axios, enable keep-alive:

```typescript
const axiosInstance = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
})
```

---

## Security Checklist

- [ ] API keys never logged or exposed in errors
- [ ] HTTPS only (no unencrypted HTTP)
- [ ] User-Agent header present for RSS/web scraping
- [ ] Input validation on all API parameters
- [ ] Rate limit respected (don't hammer free APIs)
- [ ] No personal data sent to third-party APIs
- [ ] Verify SSL certificates in production
- [ ] Use timeouts to prevent DoS via slow requests

---

## Migration Checklist

When adding a new external API:

- [ ] Create service file in `/lib/services/`
- [ ] Import timeout/retry utilities from `fetch-utils.ts`
- [ ] Implement timeout protection (5–10s)
- [ ] Handle rate limits (detect 429)
- [ ] Handle retryable errors (500, 503)
- [ ] Return sensible default on failure
- [ ] Log all decisions (timeout, rate limit, error)
- [ ] Add `.env` variable if needed
- [ ] Set `next: { revalidate }` cache time
- [ ] Write unit tests
- [ ] Document in this standards file

---

## Quick Command Reference

### Add Timeout to Existing Service

```bash
# 1. Import utilities
import { fetchWithTimeout, isRateLimitError, isRetryableError } from '@/lib/utils/fetch-utils'

# 2. Replace fetch() with fetchWithTimeout()
- const response = await fetch(url, options)
+ const response = await fetchWithTimeout(url, options, 5000)

# 3. Add rate limit handling
+ if (isRateLimitError(response)) {
+   console.warn('Rate limit hit')
+   return []
+ }

# 4. Test and deploy
```

---

## FAQ

**Q: Why 5s timeout for CoinGecko but 8s for Yahoo Finance?**
A: CoinGecko is typically faster due to lighter payloads. Yahoo Finance returns larger datasets and can be slower.

**Q: Can I use retry logic with Next.js caching?**
A: Yes, they complement each other. Cache handles normal requests; retry handles transient failures.

**Q: What if the API goes down completely?**
A: The timeout will trigger, we return `null`/`[]`, and the UI shows cached/fallback data. Graceful degradation.

**Q: Should I use exponential backoff for retries?**
A: Yes, via `retryFetch()` utility. Default is 1s → 2s → 4s → 8s.

**Q: How do I monitor API health in production?**
A: Use Sentry for errors, Langfuse for LLM calls, and Datadog/CloudWatch for metrics.

---

## Related Documents

- [CRYPTO_API_FIXES.md](CRYPTO_API_FIXES.md) — Detailed crypto API improvements
- [BACKEND_WAY_OF_WORKING.md](BACKEND_WAY_OF_WORKING.md) — Backend architecture & pipeline
- [fetch-utils.ts](apps/web/src/lib/utils/fetch-utils.ts) — Timeout/retry utility source

---

**Last Updated:** 2025-11-09
**Maintainer:** Backend Team
**Review Cycle:** Quarterly
**Next Review:** 2026-02-09
