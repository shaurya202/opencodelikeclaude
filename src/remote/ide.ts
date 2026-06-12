import { IDEConfig, IDEConnection } from "./types";

export class IDEManager {
  private config: IDEConfig = {
    enabled: false,
    extension: "opencode",
    autoConnect: true,
  };
  private connection: IDEConnection = {
    connected: false,
    name: "",
    version: "",
    workspace: "",
  };
  private connectionCallbacks: Array<(connection: IDEConnection) => void> = [];
  private disconnectionCallbacks: Array<() => void> = [];
  private messageCallbacks: Array<(message: string) => void> = [];

  constructor(config?: Partial<IDEConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): IDEConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<IDEConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isConnected(): boolean {
    return this.connection.connected;
  }

  getConnection(): IDEConnection {
    return { ...this.connection };
  }

  async connect(name: string, options?: { version?: string; workspace?: string }): Promise<IDEConnection> {
    if (!this.config.enabled) throw new Error("IDE integration is disabled");

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

  async disconnect(): Promise<void> {
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

  async openFile(filePath: string, line?: number): Promise<boolean> {
    if (!this.connection.connected) return false;
    const loc = line ? `:${line}` : "";
    for (const cb of this.messageCallbacks) {
      cb(`open:${filePath}${loc}`);
    }
    return true;
  }

  async highlightLine(filePath: string, line: number): Promise<boolean> {
    if (!this.connection.connected) return false;
    for (const cb of this.messageCallbacks) {
      cb(`highlight:${filePath}:${line}`);
    }
    return true;
  }

  async showMessage(message: string, type?: "info" | "warning" | "error"): Promise<boolean> {
    if (!this.connection.connected) return false;
    for (const cb of this.messageCallbacks) {
      cb(`message:${type || "info"}:${message}`);
    }
    return true;
  }

  onConnect(callback: (connection: IDEConnection) => void): void {
    this.connectionCallbacks.push(callback);
  }

  onDisconnect(callback: () => void): void {
    this.disconnectionCallbacks.push(callback);
  }

  onMessage(callback: (message: string) => void): void {
    this.messageCallbacks.push(callback);
  }

  detectIDE(): string[] {
    const detected: string[] = [];
    const env = process.env;
    if (env.TERM_PROGRAM === "vscode") detected.push("vscode");
    if (env.VSCODE_PID) detected.push("vscode");
    if (env.JETBRAINS_IDE) detected.push(env.JETBRAINS_IDE);
    if (env.INTELLIJ_IDEA) detected.push("intellij");
    if (detected.length === 0) detected.push("terminal");
    return detected;
  }

  destroy(): void {
    this.disconnect();
    this.connectionCallbacks = [];
    this.disconnectionCallbacks = [];
    this.messageCallbacks = [];
  }
}

export const ideManager = new IDEManager();
