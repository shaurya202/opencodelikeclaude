import { spawn, ChildProcess } from "child_process";
import { MCPServerConfig, MCPTool, MCPToolResult, MCPResource } from "./types";

interface JsonRpcMessage {
  jsonrpc: "2.0";
  id: number;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: { code: number; message: string };
}

export class MCPClient {
  private process: ChildProcess | null = null;
  private buffer = "";
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private nextId = 1;
  private _connected = false;

  get connected(): boolean {
    return this._connected;
  }

  async connect(config: MCPServerConfig): Promise<void> {
    const env = { ...process.env };
    if (config.env) {
      for (const [key, value] of Object.entries(config.env)) {
        if (value) env[key] = value;
      }
    }

    this.process = spawn(config.command, config.args || [], {
      env,
      stdio: ["pipe", "pipe", "pipe"],
      shell: process.platform === "win32",
    });

    this.process.stdout?.on("data", (data: Buffer) => {
      this.buffer += data.toString();
      this.processBuffer();
    });

    this.process.stderr?.on("data", (_data: Buffer) => {
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

  private processBuffer(): void {
    const lines = this.buffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      try {
        const msg = JSON.parse(line) as JsonRpcMessage;
        const pending = this.pending.get(msg.id);
        if (pending) {
          this.pending.delete(msg.id);
          if (msg.error) {
            pending.reject(new Error(`MCP error [${msg.error.code}]: ${msg.error.message}`));
          } else {
            pending.resolve(msg.result);
          }
        }
      } catch {
        // Skip malformed JSON lines
      }
    }
    this.buffer = lines[lines.length - 1];
  }

  private async send(method: string, params?: unknown): Promise<unknown> {
    if (!this._connected || !this.process?.stdin) {
      throw new Error("MCP client not connected");
    }
    const id = this.nextId++;
    const msg: JsonRpcMessage = { jsonrpc: "2.0", id, method, params };
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`MCP request timed out: ${method}`));
      }, 30000);
      this.pending.set(id, {
        resolve: (v: unknown) => { clearTimeout(timeout); resolve(v); },
        reject: (e: Error) => { clearTimeout(timeout); reject(e); },
      });
      this.process!.stdin!.write(JSON.stringify(msg) + "\n");
    });
  }

  async listTools(): Promise<MCPTool[]> {
    const result = await this.send("tools/list");
    return (result as { tools: MCPTool[] }).tools || [];
  }

  async listResources(): Promise<MCPResource[]> {
    const result = await this.send("resources/list");
    return (result as { resources: MCPResource[] }).resources || [];
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<MCPToolResult> {
    const result = await this.send("tools/call", { name, arguments: args });
    return result as MCPToolResult;
  }

  async disconnect(): Promise<void> {
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
