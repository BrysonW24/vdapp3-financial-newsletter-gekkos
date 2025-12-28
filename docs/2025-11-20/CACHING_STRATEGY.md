# Unified Daily Caching Strategy

## Overview

This document outlines the standardized caching strategy for all dynamic content in the newsletter-daily-prod backend. All cache entries automatically expire at midnight UTC, ensuring fresh data is fetched each day.

## Architecture

### Single-Instance Strategy (Current)
- **Location**: In-memory `globalThis` storage
- **Expiration**: Midnight UTC (daily)
- **Cache Stats**: Built-in hit/miss tracking
- **Performance**: Extremely fast (in-memory lookups)

### Multi-Instance Strategy (Future)
When deploying to multi-instance environments (multiple serverless functions or containers), consider:
- Redis-backed caching with distributed expiration
- Shared cache layer using Next.js KV store
- Database-backed caching with TTL

## Implementation

### Core Class: `DailyCache<T>`

Located in `apps/web/src/lib/utils/cache-utils.ts`

```typescript
import { DailyCache, quoteCache, insightCache, ipoCache } from '@/lib/utils/cache-utils'

// Usage pattern
const data = await cache.get('cache-key', async () => {
  return await fetchMyData()
})
```

### Pre-configured Caches

Available for immediate use:
- **`quoteCache`** - Daily quotes (daily-quote route)
- **`insightCache`** - Financial insights (visual-capitalist/graphic-of-day route)
- **`ipoCache`** - IPO data (ipo-data route)
- **`newsCache`** - News articles (future)
- **`cryptoCache`** - Crypto data (future)
- **`stockCache`** - Stock data (future)

## Usage Examples

### Basic Usage

```typescript
import { quoteCache } from '@/lib/utils/cache-utils'

export async function GET() {
  const quote = await quoteCache.get('daily-quote', async () => {
    return await generateQuoteWithLLM()
  })

  return NextResponse.json(quote)
}
```

### With Error Handling

```typescript
const insight = await insightCache.get('daily-insight', async () => {
  // Try real data first
  let data = await fetchFromAlphaVantage()

  // Fallback to alternative source
  if (!data) {
    data = await fetchCryptoInsight()
  }

  // Ultimate fallback
  if (!data) {
    data = getDefaultInsight()
  }

  return data
})
```

### Creating Custom Caches

```typescript
import { DailyCache } from '@/lib/utils/cache-utils'

// Create a new cache for your content type
const customCache = new DailyCache<MyDataType>('customCache')

// Use it
const data = await customCache.get('my-key', async () => {
  return await fetchMyData()
})
```

### Cache Invalidation

```typescript
// Manually clear a specific cache entry
quoteCache.invalidate('daily-quote')

// Clear entire cache
quoteCache.clear()
```

### Cache Statistics

```typescript
// Get stats for a specific key
const stats = quoteCache.getStats('daily-quote')
console.log(`Hits: ${stats.hits}, Hit Rate: ${stats.hitRate}`)

// Get all statistics
const allStats = quoteCache.getAllStats()
```

## Applied Routes

### 1. Daily Quote (`/api/daily-quote`)

**Before**: Custom caching logic with `__quoteCache` globalThis namespace

**After**:
```typescript
const quote = await quoteCache.get('daily-quote', async () => {
  const generatedQuote = await generateQuoteWithLLM()
  return generatedQuote || fallbackQuote()
})
```

**Benefits**:
- 15+ lines of cache code reduced to 1 function call
- Automatic statistics tracking
- Consistent behavior with other routes

### 2. Financial Insight (`/api/visual-capitalist/graphic-of-day`)

**Before**: Custom caching logic with `__insightCache` globalThis namespace

**After**:
```typescript
const insight = await insightCache.get('daily-insight', async () => {
  let data = await fetchFromAlphaVantage()
  if (!data) data = await fetchCryptoInsight()
  if (!data) data = getDayOfWeekInsight()
  return data
})
```

**Benefits**:
- 50+ lines of cache code reduced to 1 function call
- Better separation of concerns
- Consistent error handling

### 3. IPO Data (`/api/ipo-data`)

**Before**: Custom caching logic with `__ipoCache` globalThis namespace

**After**:
```typescript
const ipos = await ipoCache.get('daily-ipos', async () => {
  let data = await fetchFromIexCloud()
  if (!data || data.length === 0) data = await fetchFromNasdaqNews()
  if (!data || data.length === 0) data = fallbackIpos
  return data
})
```

**Benefits**:
- 50+ lines of cache code reduced to 1 function call
- Automated cache expiration at midnight
- Built-in logging for debugging

## Cache Behavior

### Midnight Expiration

Cache automatically expires at **midnight UTC** each day:
```typescript
// Gets next day at 00:00:00 UTC
const midnight = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
```

### Hit/Miss Tracking

Every cache access is logged:
```
[CACHE HIT] daily-quote (3ms)
[CACHE MISS] daily-quote - fetching fresh data
[CACHE SET] daily-quote (fetched in 250ms, expires at 2025-11-10T00:00:00.000Z)
```

### Stale Cache Fallback

If a fetch fails but stale cache exists:
```
[CACHE FALLBACK] daily-quote - fetch failed, returning stale cache
```

## Timeout and Retry Integration

Caching works seamlessly with the fetch utilities:

```typescript
// fetch-utils.ts handles timeouts and retries
const response = await fetchWithTimeout(url, options, 8000)

// cache-utils.ts handles caching
const data = await cache.get('key', async () => {
  return await fetchWithTimeout(url, options, 8000)
})
```

## Performance Impact

### Before Caching Layer
- Every request fetches fresh data from external APIs
- Multiple API calls per request
- Higher latency (5-10s per route)
- Rate limit pressure on external APIs

### After Caching Layer
- First request of the day: ~5-10s (includes API call)
- Subsequent requests: <5ms (in-memory cache)
- 1000x faster for cached requests
- 99.9% reduction in API calls for a typical day

**Example**: 1000 requests per day
- Before: 1000 API calls
- After: 1 API call + 999 cache hits = 99.9% reduction

## Migration Guide

For existing routes using custom caching:

### Step 1: Add Import
```typescript
import { customCache } from '@/lib/utils/cache-utils'
```

### Step 2: Replace Cache Functions
Remove these functions:
- `getTodaysCacheKey()`
- `getFromCache()`
- `setInCache()`

### Step 3: Update GET Handler
```typescript
// Before
const cacheKey = getTodaysCacheKey()
const cached = await getFromCache(cacheKey)
if (cached) return cached
const data = await fetchData()
await setInCache(cacheKey, data)
return data

// After
const data = await cache.get('cache-key', () => fetchData())
return data
```

### Step 4: Test
```bash
# Test cache hit
curl /api/your-route  # First call - fetches fresh
curl /api/your-route  # Second call - returns cache

# Check logs for [CACHE HIT] or [CACHE MISS]
```

## Troubleshooting

### Cache Not Expiring
- Ensure using `DailyCache` class (not custom globalThis code)
- Check that timezone is UTC
- Verify current time hasn't passed midnight UTC

### High Memory Usage
- For large data objects, consider Redis caching
- Monitor cache size with `getAllStats()`
- Clear unused caches with `cache.clear()`

### Stale Data Being Returned
- Check logs for `[CACHE FALLBACK]` messages
- Verify fetcher function error handling
- Manually invalidate with `cache.invalidate(key)`

### Cache Stats Not Appearing
- Stats are recorded per-key
- Use `getStats(key)` not `getStats()` without parameters
- Stats persist in `globalThis` until process restart

## Monitoring

### Log Messages

**Cache Operations**:
```
[CACHE HIT] key (5ms)          # Cache hit with retrieval time
[CACHE MISS] key - ...          # Cache miss, fetching fresh data
[CACHE SET] key (250ms, ...)    # Cache saved with fetch time
[CACHE INVALIDATED] key         # Cache manually cleared
[CACHE CLEARED] namespace       # Entire cache cleared
```

**Errors**:
```
[CACHE FALLBACK] key - ...      # Fetch failed, using stale cache
[CACHE ERROR] key - ...         # Fetch failed and no cache available
```

### Statistics Reporting

To add monitoring dashboard:

```typescript
// Get all cache statistics
const stats = cache.getAllStats()

// Example output
{
  'daily-quote': {
    hits: 1000,
    misses: 1,
    hitRate: 0.999,
    averageRetrievalTime: 4.5
  },
  'daily-insight': {
    hits: 950,
    misses: 2,
    hitRate: 0.998,
    averageRetrievalTime: 3.2
  }
}
```

## Future Improvements

### 1. Redis Caching
For multi-instance deployments:
```typescript
// Extend DailyCache with Redis backend
class RedisCache<T> extends DailyCache<T> {
  async get(key: string, fetcher: () => Promise<T>) {
    // Check Redis first
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached)

    // Fetch and cache in Redis
    const data = await fetcher()
    await redis.setex(key, 86400, JSON.stringify(data)) // 24h TTL
    return data
  }
}
```

### 2. Compressed Storage
For large objects:
```typescript
// Compress cache entries to reduce memory usage
const compressed = await compress(largeObject)
cache.set('large-key', compressed)
```

### 3. Partial Cache Invalidation
```typescript
// Invalidate based on patterns
cache.invalidatePattern('daily-*')  // Clears all daily caches
```

### 4. Cache Warming
```typescript
// Pre-populate cache at startup
async function warmCache() {
  await quoteCache.get('daily-quote', () => generateQuoteWithLLM())
  await insightCache.get('daily-insight', () => fetchFinancialInsight())
  await ipoCache.get('daily-ipos', () => fetchIpoData())
}

// Call on server startup
warmCache().catch(console.error)
```

## Testing

### Unit Tests

```typescript
import { DailyCache } from '@/lib/utils/cache-utils'

describe('DailyCache', () => {
  it('returns fresh data on cache miss', async () => {
    const cache = new DailyCache<string>('test')
    const result = await cache.get('test-key', () => Promise.resolve('data'))
    expect(result).toBe('data')
  })

  it('returns cached data on cache hit', async () => {
    const cache = new DailyCache<string>('test')
    let callCount = 0

    const result1 = await cache.get('test-key', () => {
      callCount++
      return Promise.resolve('data')
    })
    const result2 = await cache.get('test-key', () => {
      callCount++
      return Promise.resolve('different')
    })

    expect(callCount).toBe(1)
    expect(result1).toBe(result2).toBe('data')
  })
})
```

## Summary

The unified `DailyCache` class provides:
- ✅ Consistent caching across all routes
- ✅ Automatic midnight expiration
- ✅ Built-in statistics tracking
- ✅ Error handling with stale fallback
- ✅ 99%+ performance improvement for repeated requests
- ✅ Minimal code (1 line vs 50+ lines per route)
- ✅ Easy migration path for existing routes

**Total lines of code removed**: 150+ lines of duplicate cache logic
**Total lines of code added**: 200 lines of reusable cache utility
**Net impact**: Cleaner, more maintainable codebase with better performance
