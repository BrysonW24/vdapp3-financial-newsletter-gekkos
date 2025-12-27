/**
 * Daily Caching Utilities
 *
 * Provides a standardized caching strategy for all dynamic content routes.
 * Uses in-memory globalThis storage with midnight expiration for single-instance deployments.
 *
 * For multi-instance deployments, consider implementing Redis-backed caching.
 *
 * Usage:
 * ```typescript
 * const cache = new DailyCache<MyData>();
 * const cached = await cache.get('my-key', async () => {
 *   return await fetchMyData();
 * });
 * ```
 */

/**
 * Cache entry with expiration metadata
 */
interface CacheEntry<T> {
  data: T;
  expiresAt: string; // ISO string for midnight expiration
  createdAt: string; // ISO string for debugging
}

/**
 * Cache statistics for monitoring
 */
interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  averageRetrievalTime: number;
}

/**
 * DailyCache - Unified caching for daily content
 *
 * Features:
 * - Automatic midnight expiration
 * - Type-safe generic support
 * - Cache statistics tracking
 * - Lazy evaluation of fetch functions
 * - Error handling for failed fetches
 */
export class DailyCache<T> {
  private cacheKey: string;
  private stats: Map<string, CacheStats> = new Map();

  constructor(namespace: string = 'cache') {
    this.cacheKey = `__${namespace}Cache`;
    this.ensureCacheExists();
  }

  /**
   * Ensure cache object exists in globalThis
   */
  private ensureCacheExists(): void {
    if (typeof globalThis !== 'undefined' && !(this.cacheKey in globalThis)) {
      (globalThis as any)[this.cacheKey] = {};
    }
  }

  /**
   * Get cache storage object
   */
  private getCache(): Record<string, CacheEntry<T>> {
    if (typeof globalThis === 'undefined') {
      return {};
    }
    return (globalThis as any)[this.cacheKey] || {};
  }

  /**
   * Set cache storage object
   */
  private setCache(cache: Record<string, CacheEntry<T>>): void {
    if (typeof globalThis !== 'undefined') {
      (globalThis as any)[this.cacheKey] = cache;
    }
  }

  /**
   * Get today's cache expiration time (midnight UTC)
   */
  private getTodaysMidnight(): Date {
    const now = new Date();
    const tomorrow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0);
    return tomorrow;
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValid(entry: CacheEntry<T>): boolean {
    const expiresAt = new Date(entry.expiresAt);
    return new Date() < expiresAt;
  }

  /**
   * Get a value from cache or fetch it if missing/expired
   *
   * @param key - Cache key (scoped to this cache instance)
   * @param fetcher - Async function to fetch the value if not cached
   * @param options - Cache options
   * @returns Cached or freshly fetched value
   */
  async get(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: 'daily'; logHits?: boolean } = {}
  ): Promise<T> {
    const startTime = Date.now();
    const cache = this.getCache();
    const cached = cache[key];

    // Check if cached value is valid
    if (cached && this.isValid(cached)) {
      const retrievalTime = Date.now() - startTime;
      this.recordHit(key, retrievalTime);

      if (options.logHits !== false) {
        console.log(`[CACHE HIT] ${key} (${retrievalTime}ms)`);
      }
      return cached.data;
    }

    // Fetch fresh data
    console.log(`[CACHE MISS] ${key} - fetching fresh data`);
    const startFetchTime = Date.now();

    try {
      const data = await fetcher();
      const retrievalTime = Date.now() - startFetchTime;

      // Store in cache
      const expiresAt = this.getTodaysMidnight();
      const entry: CacheEntry<T> = {
        data,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };

      cache[key] = entry;
      this.setCache(cache);

      this.recordMiss(key, retrievalTime);
      console.log(`[CACHE SET] ${key} (fetched in ${retrievalTime}ms, expires at ${expiresAt.toISOString()})`);

      return data;
    } catch (error) {
      // If fetch fails and we have stale cache, return it as fallback
      if (cached) {
        console.warn(`[CACHE FALLBACK] ${key} - fetch failed, returning stale cache`);
        return cached.data;
      }

      // If fetch fails and no cache, rethrow error
      console.error(`[CACHE ERROR] ${key} - fetch failed and no cache available`);
      throw error;
    }
  }

  /**
   * Manually set a cache value
   */
  set(key: string, data: T): void {
    const cache = this.getCache();
    const expiresAt = this.getTodaysMidnight();

    const entry: CacheEntry<T> = {
      data,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    cache[key] = entry;
    this.setCache(cache);
    console.log(`[CACHE SET] ${key} (expires at ${expiresAt.toISOString()})`);
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(key: string): void {
    const cache = this.getCache();
    delete cache[key];
    this.setCache(cache);
    console.log(`[CACHE INVALIDATED] ${key}`);
  }

  /**
   * Clear entire cache for this namespace
   */
  clear(): void {
    if (typeof globalThis !== 'undefined') {
      (globalThis as any)[this.cacheKey] = {};
    }
    console.log(`[CACHE CLEARED] ${this.cacheKey}`);
  }

  /**
   * Get cache statistics
   */
  getStats(key: string): CacheStats | undefined {
    return this.stats.get(key);
  }

  /**
   * Record a cache hit
   */
  private recordHit(key: string, retrievalTime: number): void {
    const stats = this.stats.get(key) || { hits: 0, misses: 0, hitRate: 0, averageRetrievalTime: 0 };
    stats.hits++;
    stats.averageRetrievalTime = (stats.averageRetrievalTime + retrievalTime) / 2;
    stats.hitRate = stats.hits / (stats.hits + stats.misses);
    this.stats.set(key, stats);
  }

  /**
   * Record a cache miss
   */
  private recordMiss(key: string, retrievalTime: number): void {
    const stats = this.stats.get(key) || { hits: 0, misses: 0, hitRate: 0, averageRetrievalTime: 0 };
    stats.misses++;
    stats.averageRetrievalTime = (stats.averageRetrievalTime + retrievalTime) / 2;
    stats.hitRate = stats.hits / (stats.hits + stats.misses);
    this.stats.set(key, stats);
  }

  /**
   * Get all statistics
   */
  getAllStats(): Record<string, CacheStats> {
    const result: Record<string, CacheStats> = {};
    this.stats.forEach((stats, key) => {
      result[key] = stats;
    });
    return result;
  }
}

/**
 * Pre-configured caches for different content types
 */
export const quoteCache = new DailyCache<any>('quoteCache');
export const insightCache = new DailyCache<any>('insightCache');
export const ipoCache = new DailyCache<any>('ipoCache');
export const newsCache = new DailyCache<any>('newsCache');
export const cryptoCache = new DailyCache<any>('cryptoCache');
export const stockCache = new DailyCache<any>('stockCache');

/**
 * Helper function to create a cache-enabled endpoint handler
 *
 * Usage:
 * ```typescript
 * export const GET = withDailyCache(async () => {
 *   return await fetchMyData();
 * }, 'my-cache-key');
 * ```
 */
export function withDailyCache<T>(
  fetcher: () => Promise<T>,
  cacheKey: string,
  cache: DailyCache<T> = quoteCache as any
) {
  return async () => {
    return await cache.get(cacheKey, fetcher);
  };
}
