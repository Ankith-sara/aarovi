/**
 * Lightweight in-memory cache with TTL support.
 * Avoids repeated DB hits for frequently-read, rarely-changing data (e.g. product list).
 */

class Cache {
    constructor() {
        this._store = new Map();
    }

    /**
     * @param {string} key
     * @param {any}    value
     * @param {number} ttlMs   Time-to-live in milliseconds (default 5 min)
     */
    set(key, value, ttlMs = 5 * 60 * 1000) {
        this._store.set(key, { value, expiresAt: Date.now() + ttlMs });
    }

    get(key) {
        const entry = this._store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this._store.delete(key);
            return null;
        }
        return entry.value;
    }

    del(key) {
        this._store.delete(key);
    }

    /** Bust all keys that start with a given prefix */
    bust(prefix) {
        for (const key of this._store.keys()) {
            if (key.startsWith(prefix)) this._store.delete(key);
        }
    }

    clear() {
        this._store.clear();
    }
}

// Singleton — shared across the whole process
export const cache = new Cache();
