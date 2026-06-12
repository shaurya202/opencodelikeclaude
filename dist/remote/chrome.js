export class ChromeManager {
    config = {
        enabled: false,
        headless: false,
        remoteDebugPort: 9222,
    };
    isRunning = false;
    statusCallbacks = [];
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
    isActive() {
        return this.isRunning;
    }
    async launch(_options) {
        if (!this.config.enabled)
            throw new Error("Chrome integration is disabled");
        if (this.isRunning)
            return;
        this.isRunning = true;
        for (const cb of this.statusCallbacks) {
            cb(true);
        }
    }
    async close() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        for (const cb of this.statusCallbacks) {
            cb(false);
        }
    }
    async navigate(_url) {
        if (!this.isRunning)
            return false;
        return true;
    }
    async screenshot(options) {
        if (!this.isRunning)
            return undefined;
        return options?.path || undefined;
    }
    async evaluate(script) {
        if (!this.isRunning)
            return null;
        return `Evaluated: ${script.slice(0, 50)}`;
    }
    onStatusChange(callback) {
        this.statusCallbacks.push(callback);
    }
    generateId() {
        return `chrome-${Date.now()}`;
    }
    destroy() {
        this.close();
        this.statusCallbacks = [];
    }
}
export const chromeManager = new ChromeManager();
//# sourceMappingURL=chrome.js.map