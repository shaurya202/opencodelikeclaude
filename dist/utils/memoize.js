import { rootLogger } from "./logger";
const DEFAULT_MAX_SIZE = 100;
const DEFAULT_TTL = 60_000;
export class Memoizer {
    caches = new Map();
    getCache(name) {
        let cache = this.caches.get(name);
        if (!cache) {
            cache = new Map();
            this.caches.set(name, cache);
        }
        return cache;
    }
    memoize(fn, cacheName, options = {}) {
        const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
        const ttl = options.ttl ?? DEFAULT_TTL;
        const cache = this.getCache(cacheName);
        return async (...args) => {
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
    clear(name) {
        if (name) {
            this.caches.delete(name);
            rootLogger.debug(`Cleared memoize cache: ${name}`);
        }
        else {
            this.caches.clear();
            rootLogger.debug("Cleared all memoize caches");
        }
    }
    invalidate(name, ...args) {
        const cache = this.caches.get(name);
        if (!cache)
            return;
        const key = JSON.stringify(args);
        cache.delete(key);
    }
}
export const memoizer = new Memoizer();
//# sourceMappingURL=memoize.js.map