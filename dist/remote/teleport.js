export class TeleportManager {
    config = {
        enabled: true,
        defaultClient: "claude.ai",
    };
    sessions = new Map();
    importCallbacks = [];
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
    async importSession(url, source) {
        if (!this.config.enabled)
            throw new Error("Teleport is disabled");
        const session = {
            id: this.generateId(),
            url,
            title: `Session from ${source || this.config.defaultClient}`,
            content: "",
            source: source || this.config.defaultClient,
            importedAt: Date.now(),
            messages: 0,
        };
        this.sessions.set(session.id, session);
        for (const cb of this.importCallbacks) {
            cb(session);
        }
        return session;
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
    removeSession(id) {
        return this.sessions.delete(id);
    }
    clearSessions() {
        this.sessions.clear();
    }
    async pushToWeb(sessionId, content, target) {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error(`Session ${sessionId} not found`);
        session.content = content;
        session.messages++;
        const endpoint = target || this.config.defaultClient;
        return `Pushed ${content.length} chars to ${endpoint} (session ${sessionId.slice(0, 8)})`;
    }
    async fetchFromWeb(url) {
        return {
            content: `Fetched content from ${url}`,
            title: `Web session: ${url}`,
        };
    }
    onImport(callback) {
        this.importCallbacks.push(callback);
    }
    generateId() {
        return `tp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.sessions.clear();
        this.importCallbacks = [];
    }
}
export const teleportManager = new TeleportManager();
//# sourceMappingURL=teleport.js.map