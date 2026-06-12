import { spawn } from "child_process";
export class MCPClient {
    process = null;
    buffer = "";
    pending = new Map();
    nextId = 1;
    _connected = false;
    get connected() {
        return this._connected;
    }
    async connect(config) {
        const env = { ...process.env };
        if (config.env) {
            for (const [key, value] of Object.entries(config.env)) {
                if (value)
                    env[key] = value;
            }
        }
        this.process = spawn(config.command, config.args || [], {
            env,
            stdio: ["pipe", "pipe", "pipe"],
            shell: process.platform === "win32",
        });
        this.process.stdout?.on("data", (data) => {
            this.buffer += data.toString();
            this.processBuffer();
        });
        this.process.stderr?.on("data", (_data) => {
            // MCP servers often log diagnostics to stderr
        });
        this.process.on("exit", (code) => {
            this._connected = false;
            for (const [, pending] of this.pending) {
                pending.reject(new Error(`MCP server exited with code ${code}`));
            }
            this.pending.clear();
        });
        this.process.on("error", (err) => {
            this._connected = false;
            for (const [, pending] of this.pending) {
                pending.reject(new Error(`MCP server error: ${err.message}`));
            }
            this.pending.clear();
        });
        this._connected = true;
    }
    processBuffer() {
        const lines = this.buffer.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            try {
                const msg = JSON.parse(line);
                const pending = this.pending.get(msg.id);
                if (pending) {
                    this.pending.delete(msg.id);
                    if (msg.error) {
                        pending.reject(new Error(`MCP error [${msg.error.code}]: ${msg.error.message}`));
                    }
                    else {
                        pending.resolve(msg.result);
                    }
                }
            }
            catch {
                // Skip malformed JSON lines
            }
        }
        this.buffer = lines[lines.length - 1];
    }
    async send(method, params) {
        if (!this._connected || !this.process?.stdin) {
            throw new Error("MCP client not connected");
        }
        const id = this.nextId++;
        const msg = { jsonrpc: "2.0", id, method, params };
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`MCP request timed out: ${method}`));
            }, 30000);
            this.pending.set(id, {
                resolve: (v) => { clearTimeout(timeout); resolve(v); },
                reject: (e) => { clearTimeout(timeout); reject(e); },
            });
            this.process.stdin.write(JSON.stringify(msg) + "\n");
        });
    }
    async listTools() {
        const result = await this.send("tools/list");
        return result.tools || [];
    }
    async listResources() {
        const result = await this.send("resources/list");
        return result.resources || [];
    }
    async callTool(name, args) {
        const result = await this.send("tools/call", { name, arguments: args });
        return result;
    }
    async disconnect() {
        this._connected = false;
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
        for (const [, pending] of this.pending) {
            pending.reject(new Error("MCP client disconnected"));
        }
        this.pending.clear();
    }
}
//# sourceMappingURL=client.js.map