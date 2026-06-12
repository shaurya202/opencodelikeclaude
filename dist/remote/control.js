export class RemoteControlServer {
    config = {
        enabled: false,
        port: 9447,
        host: "localhost",
    };
    status = "stopped";
    sessions = new Map();
    messageCallbacks = [];
    connectionCallbacks = [];
    disconnectionCallbacks = [];
    serverRef = null;
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
    getStatus() {
        return this.status;
    }
    async start() {
        if (this.status === "running")
            return;
        if (!this.config.enabled)
            throw new Error("Remote control is disabled");
        this.status = "running";
        this.serverRef = {
            close: () => {
                this.status = "stopped";
            },
        };
    }
    async stop() {
        if (this.serverRef) {
            this.serverRef.close();
            this.serverRef = null;
        }
        this.status = "stopped";
        this.sessions.clear();
    }
    getSessions() {
        return Array.from(this.sessions.values());
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    disconnectSession(id) {
        const session = this.sessions.get(id);
        if (!session)
            return false;
        this.sessions.delete(id);
        for (const cb of this.disconnectionCallbacks) {
            cb(id);
        }
        return true;
    }
    broadcast(message) {
        for (const [sessionId] of this.sessions) {
            for (const cb of this.messageCallbacks) {
                cb(sessionId, message);
            }
        }
    }
    sendToSession(sessionId, message) {
        if (!this.sessions.has(sessionId))
            return false;
        for (const cb of this.messageCallbacks) {
            cb(sessionId, message);
        }
        return true;
    }
    onMessage(callback) {
        this.messageCallbacks.push(callback);
    }
    onConnection(callback) {
        this.connectionCallbacks.push(callback);
    }
    onDisconnection(callback) {
        this.disconnectionCallbacks.push(callback);
    }
    registerSession(session) {
        this.sessions.set(session.id, session);
        for (const cb of this.connectionCallbacks) {
            cb(session);
        }
    }
    generateId() {
        return `rc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.stop();
        this.messageCallbacks = [];
        this.connectionCallbacks = [];
        this.disconnectionCallbacks = [];
    }
}
export const remoteControlServer = new RemoteControlServer();
//# sourceMappingURL=control.js.map