export class IDEManager {
    config = {
        enabled: false,
        extension: "opencode",
        autoConnect: true,
    };
    connection = {
        connected: false,
        name: "",
        version: "",
        workspace: "",
    };
    connectionCallbacks = [];
    disconnectionCallbacks = [];
    messageCallbacks = [];
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
    isConnected() {
        return this.connection.connected;
    }
    getConnection() {
        return { ...this.connection };
    }
    async connect(name, options) {
        if (!this.config.enabled)
            throw new Error("IDE integration is disabled");
        this.connection = {
            connected: true,
            name,
            version: options?.version || "unknown",
            workspace: options?.workspace || process.cwd(),
            connectedAt: Date.now(),
        };
        for (const cb of this.connectionCallbacks) {
            cb(this.connection);
        }
        return this.getConnection();
    }
    async disconnect() {
        this.connection = {
            connected: false,
            name: "",
            version: "",
            workspace: "",
        };
        for (const cb of this.disconnectionCallbacks) {
            cb();
        }
    }
    async openFile(filePath, line) {
        if (!this.connection.connected)
            return false;
        const loc = line ? `:${line}` : "";
        for (const cb of this.messageCallbacks) {
            cb(`open:${filePath}${loc}`);
        }
        return true;
    }
    async highlightLine(filePath, line) {
        if (!this.connection.connected)
            return false;
        for (const cb of this.messageCallbacks) {
            cb(`highlight:${filePath}:${line}`);
        }
        return true;
    }
    async showMessage(message, type) {
        if (!this.connection.connected)
            return false;
        for (const cb of this.messageCallbacks) {
            cb(`message:${type || "info"}:${message}`);
        }
        return true;
    }
    onConnect(callback) {
        this.connectionCallbacks.push(callback);
    }
    onDisconnect(callback) {
        this.disconnectionCallbacks.push(callback);
    }
    onMessage(callback) {
        this.messageCallbacks.push(callback);
    }
    detectIDE() {
        const detected = [];
        const env = process.env;
        if (env.TERM_PROGRAM === "vscode")
            detected.push("vscode");
        if (env.VSCODE_PID)
            detected.push("vscode");
        if (env.JETBRAINS_IDE)
            detected.push(env.JETBRAINS_IDE);
        if (env.INTELLIJ_IDEA)
            detected.push("intellij");
        if (detected.length === 0)
            detected.push("terminal");
        return detected;
    }
    destroy() {
        this.disconnect();
        this.connectionCallbacks = [];
        this.disconnectionCallbacks = [];
        this.messageCallbacks = [];
    }
}
export const ideManager = new IDEManager();
//# sourceMappingURL=ide.js.map