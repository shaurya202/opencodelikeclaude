export class WebSyncManager {
    config = {
        enabled: false,
        autoSync: true,
    };
    records = [];
    syncCallbacks = [];
    constructor(config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    async push(sessionId, data) {
        if (!this.config.enabled)
            throw new Error("Web sync is disabled");
        const record = {
            id: this.generateId(),
            sessionId,
            action: "push",
            timestamp: Date.now(),
            status: "synced",
            data,
        };
        this.records.push(record);
        for (const cb of this.syncCallbacks) {
            cb(record);
        }
        return record;
    }
    async pull(sessionId) {
        if (!this.config.enabled)
            throw new Error("Web sync is disabled");
        const record = {
            id: this.generateId(),
            sessionId,
            action: "pull",
            timestamp: Date.now(),
            status: "synced",
        };
        this.records.push(record);
        for (const cb of this.syncCallbacks) {
            cb(record);
        }
        return record;
    }
    async branch(sessionId, _parentSessionId) {
        if (!this.config.enabled)
            throw new Error("Web sync is disabled");
        const record = {
            id: this.generateId(),
            sessionId,
            action: "branch",
            timestamp: Date.now(),
            status: "synced",
        };
        this.records.push(record);
        for (const cb of this.syncCallbacks) {
            cb(record);
        }
        return record;
    }
    getRecords(sessionId) {
        if (sessionId) {
            return this.records.filter(r => r.sessionId === sessionId);
        }
        return [...this.records];
    }
    clearRecords() {
        this.records = [];
    }
    onSync(callback) {
        this.syncCallbacks.push(callback);
    }
    generateId() {
        return `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.records = [];
        this.syncCallbacks = [];
    }
}
export const webSyncManager = new WebSyncManager();
//# sourceMappingURL=sync.js.map