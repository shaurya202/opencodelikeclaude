import { rootLogger } from "./logger";

interface CacheEntry<T> {
  value: T;
  expiry: number;
  createdAt: number;
}

interface MemoizeOptions {
  maxSize?: number;
  ttl?: number;
  key?: (...args: unknown[]) => string;
}

const DEFAULT_MAX_SIZE = 100;
const DEFAULT_TTL = 60_000;

export class Memoizer {
  private caches = new Map<string, Map<string, CacheEntry<unknown>>>();

  private getCache<T>(name: string): Map<string, CacheEntry<T>> {
    let cache = this.caches.get(name) as Map<string, CacheEntry<T>> | undefined;
    if (!cache) {
      cache = new Map();
      this.caches.set(name, cache as Map<string, CacheEntry<unknown>>);
    }
    return cache;
  }

  memoize<T>(
    fn: (...args: unknown[]) => T | Promise<T>,
    cacheName: string,
    options: MemoizeOptions = {}
  ): (...args: unknown[]) => Promise<T> {
    const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
    const ttl = options.ttl ?? DEFAULT_TTL;
    const cache = this.getCache<T>(cacheName);

    return async (...args: unknown[]): Promise<T> => {
      const key = options.key ? options.key(args) : JSON.stringify(args);
      const now = Date.now();
      const entry = cache.get(key);

      if (entry && now < entry.expiry) {
        return entry.value;
      }

      const result = await fn(...args);
      cache.set(key, { value: result, expiry: now + ttl, createdAt: now });

      if (cache.size > maxSize) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined) {
          cache.delete(oldestKey);
        }
      }

      return result;
    };
  }

  clear(name?: string): void {
    if (name) {
      this.caches.delete(name);
      rootLogger.debug(`Cleared memoize cache: ${name}`);
    } else {
      this.caches.clear();
      rootLogger.debug("Cleared all memoize caches");
    }
  }

  invalidate(name: string, ...args: unknown[]): void {
    const cache = this.caches.get(name);
    if (!cache) return;

    const key = JSON.stringify(args);
    cache.delete(key);
  }
}

export const memoizer = new Memoizer();
