interface MemoizeOptions {
    maxSize?: number;
    ttl?: number;
    key?: (...args: unknown[]) => string;
}
export declare class Memoizer {
    private caches;
    private getCache;
    memoize<T>(fn: (...args: unknown[]) => T | Promise<T>, cacheName: string, options?: MemoizeOptions): (...args: unknown[]) => Promise<T>;
    clear(name?: string): void;
    invalidate(name: string, ...args: unknown[]): void;
}
export declare const memoizer: Memoizer;
export {};
//# sourceMappingURL=memoize.d.ts.map