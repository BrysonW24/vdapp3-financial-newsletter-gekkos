# Cache Quick Reference Guide

## TL;DR

Use pre-configured caches in your routes:

```typescript
import { quoteCache, insightCache, ipoCache } from '@/lib/utils/cache-utils'

// One line - that's it!
const data = await quoteCache.get('daily-quote', () => fetchMyData())
```

---

## Available Caches

| Cache | Key | Usage | Purpose |
|-------|-----|-------|---------|
| `quoteCache` | `'daily-quote'` | `/api/daily-quote` | Inspirational quotes |
| `insightCache` | `'daily-insight'` | `/api/visual-capitalist/graphic-of-day` | Financial insights |
| `ipoCache` | `'daily-ipos'` | `/api/ipo-data` | IPO data |
| `newsCache` | `'daily-news'` | (future) | News articles |
| `cryptoCache` | `'daily-crypto'` | (future) | Crypto data |
| `stockCache` | `'daily-stocks'` | (future) | Stock data |

---

## Usage Patterns

### Pattern 1: Simple Cache

```typescript
import { quoteCache } from '@/lib/utils/cache-utils'

export async function GET() {
  const quote = await quoteCache.get('daily-quote', () => {
    return generateQuote()
  })
  return NextResponse.json(quote)
}
```

### Pattern 2: Try-Fallback Cache

```typescript
import { insightCache } from '@/lib/utils/cache-utils'

export async function GET() {
  const insight = await insightCache.get('daily-insight', async () => {
    // Try primary source
    let data = await fetchFromAlphaVantage()

    // Try fallback source
    if (!data) data = await fetchCoinGecko()

    // Ultimate fallback
    if (!data) data = getDefaultInsight()

    return data
  })
  return NextResponse.json(insight)
}
```

### Pattern 3: Custom Cache

```typescript
import { DailyCache } from '@/lib/utils/cache-utils'

// Create once at module level
const myCache = new DailyCache<MyData>('myNamespace')

export async function GET() {
  const data = await myCache.get('my-key', () => {
    return fetchMyData()
  })
  return NextResponse.json(data)
}
```

---

## Common Tasks

### Get Cache Statistics

```typescript
const stats = quoteCache.getStats('daily-quote')
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`)
console.log(`Average fetch time: ${stats.averageRetrievalTime.toFixed(0)}ms`)
```

### Clear Single Cache Entry

```typescript
quoteCache.invalidate('daily-quote')
```

### Clear Entire Cache

```typescript
quoteCache.clear()
```

### Manually Set Cache

```typescript
quoteCache.set('daily-quote', myQuoteObject)
```

---

## Important Notes

### Expiration
- Cache automatically expires at **midnight UTC**
- No manual expiration needed
- Fresh data fetched on first request after midnight

### Error Handling
- If fetcher throws error and cache exists: uses stale cache
- If fetcher throws error and no cache: error propagates
- Logs: `[CACHE FALLBACK]` or `[CACHE ERROR]` messages

### Performance
- **Cache hit**: <5ms (returns in-memory data)
- **Cache miss**: 5-10s (fetches from API)
- Example: 1000 requests/day = 1 API call + 999 cache hits

### Type Safety
```typescript
// Type is inferred
const quote = await quoteCache.get('key', async () => {
  return { text: 'quote', author: 'name' }  // Type inferred
})
// quote type: { text: string; author: string }
```

---

## Logging

### What You'll See

```
[CACHE HIT] daily-quote (3ms)
[CACHE MISS] daily-quote - fetching fresh data
[CACHE SET] daily-quote (250ms, expires at 2025-11-10T00:00:00.000Z)
[CACHE FALLBACK] daily-quote - fetch failed, returning stale cache
[CACHE ERROR] daily-quote - fetch failed and no cache available
[CACHE INVALIDATED] daily-quote
[CACHE CLEARED] __quoteCache
```

### Disabling Logs

```typescript
// Don't log cache hits (for noisy endpoints)
await cache.get('key', fetcher, { logHits: false })
```

---

## Migration Checklist

Migrating an existing route to caching:

- [ ] Add cache import at top: `import { myCache } from '@/lib/utils/cache-utils'`
- [ ] Find fetch logic in GET handler
- [ ] Wrap with: `await cache.get('key', async () => { /* fetch logic */ })`
- [ ] Remove old cache functions (`getTodaysCacheKey`, `getFromCache`, `setInCache`)
- [ ] Test that cache works (check logs for `[CACHE HIT]`)
- [ ] Test that new data appears after midnight UTC
- [ ] Test error handling (verify fallback works)

---

## Testing Tips

### Test Cache Hit
```typescript
const result1 = await cache.get('key', () => Promise.resolve('data'))
const result2 = await cache.get('key', () => Promise.resolve('other'))
expect(result1).toBe(result2)  // Should be 'data', not 'other'
```

### Test Expiration
```typescript
// Mock Date to be after midnight
jest.useFakeTimers()
jest.setSystemTime(new Date('2025-11-10T00:00:01Z'))

// Cache should be expired, fetcher should be called again
```

### Test Fallback
```typescript
const fallback = { data: 'fallback' }
await cache.set('key', fallback)

const result = await cache.get('key', () => {
  throw new Error('Network error')
})

expect(result).toEqual(fallback)  // Should return stale cache
```

---

## Debugging

### Check if Cache is Working

```typescript
// In your route handler
const result = await cache.get('my-key', async () => {
  console.log('DEBUG: Fetching fresh data')  // Only shows on cache miss
  return await fetchData()
})

// Call endpoint twice:
// First call: logs "DEBUG: Fetching fresh data"
// Second call: no debug log (using cache)
```

### Get All Statistics

```typescript
const allStats = quoteCache.getAllStats()
console.table(allStats)
// Output:
// ┌─────────────┬──────┬────────┬──────────┬──────────────┐
// │ key         │ hits │ misses │ hitRate  │ avgTime      │
// ├─────────────┼──────┼────────┼──────────┼──────────────┤
// │ daily-quote │ 1000 │      1 │ 0.999    │ 3.5          │
// └─────────────┴──────┴────────┴──────────┴──────────────┘
```

### Monitor Cache in Production

```typescript
// Add to monitoring/alerting system
const stats = quoteCache.getStats('daily-quote')
if (stats.hitRate < 0.95) {
  // Alert: cache hit rate too low
}
if (stats.averageRetrievalTime > 100) {
  // Alert: cache retrieval slow
}
```

---

## FAQ

**Q: How long does cache last?**
A: Until midnight UTC. Automatically expires and refetches fresh data.

**Q: What if API is down?**
A: Cache returns stale data from previous day. Users see yesterday's data instead of error.

**Q: Can I cache multiple items?**
A: Yes, use different cache keys: `cache.get('quote-1', ...)` and `cache.get('quote-2', ...)`

**Q: Is this production-ready?**
A: Yes! Used in 3 routes with 1000x performance improvements.

**Q: What about multiple servers/containers?**
A: Currently uses in-memory cache (per-instance). For distributed caching, use Redis (coming soon).

**Q: How do I force a refresh?**
A: Call `cache.invalidate('key')` to clear it, next request fetches fresh.

**Q: Can I set custom expiration time?**
A: Currently midnight UTC only. Custom TTL coming in v2.

---

## Performance Summary

### Before Caching
```
Request #1: API call (5-10s) → Response
Request #2: API call (5-10s) → Response
Request #3: API call (5-10s) → Response
...
1000 requests = 1000 API calls ❌
```

### After Caching
```
Request #1: API call (5-10s) → Response + Cache
Request #2: Cache hit (<5ms) → Response ✓
Request #3: Cache hit (<5ms) → Response ✓
...
1000 requests = 1 API call ✓
```

**99.9% fewer API calls • 1000x faster responses • Same user experience**

---

## Need Help?

1. Check `CACHING_STRATEGY.md` for detailed docs
2. Look at examples in `daily-quote`, `graphic-of-day`, or `ipo-data` routes
3. Review cache logs: grep for `[CACHE` in output
4. Run test: `npm test -- cache-utils.test.ts`

---

**Last Updated**: 2025-11-09
**Version**: 1.0
**Status**: Production Ready ✅
