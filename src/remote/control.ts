import { RemoteControlConfig, RemoteControlSession, RemoteControlStatus } from "./types";

export class RemoteControlServer {
  private config: RemoteControlConfig = {
    enabled: false,
    port: 9447,
    host: "localhost",
  };
  private status: RemoteControlStatus = "stopped";
  private sessions: Map<string, RemoteControlSession> = new Map();
  private messageCallbacks: Array<(sessionId: string, message: string) => void> = [];
  private connectionCallbacks: Array<(session: RemoteControlSession) => void> = [];
  private disconnectionCallbacks: Array<(sessionId: string) => void> = [];
  private serverRef: { close: () => void } | null = null;

  constructor(config?: Partial<RemoteControlConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): RemoteControlConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<RemoteControlConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getStatus(): RemoteControlStatus {
    return this.status;
  }

  async start(): Promise<void> {
    if (this.status === "running") return;
    if (!this.config.enabled) throw new Error("Remote control is disabled");

    this.status = "running";
    this.serverRef = {
      close: () => {
        this.status = "stopped";
      },
    };
  }

  async stop(): Promise<void> {
    if (this.serverRef) {
      this.serverRef.close();
      this.serverRef = null;
    }
    this.status = "stopped";
    this.sessions.clear();
  }

  getSessions(): RemoteControlSession[] {
    return Array.from(this.sessions.values());
  }

  getSession(id: string): RemoteControlSession | undefined {
    return this.sessions.get(id);
  }

  disconnectSession(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;
    this.sessions.delete(id);
    for (const cb of this.disconnectionCallbacks) {
      cb(id);
    }
    return true;
  }

  broadcast(message: string): void {
    for (const [sessionId] of this.sessions) {
      for (const cb of this.messageCallbacks) {
        cb(sessionId, message);
      }
    }
  }

  sendToSession(sessionId: string, message: string): boolean {
    if (!this.sessions.has(sessionId)) return false;
    for (const cb of this.messageCallbacks) {
      cb(sessionId, message);
    }
    return true;
  }

  onMessage(callback: (sessionId: string, message: string) => void): void {
    this.messageCallbacks.push(callback);
  }

  onConnection(callback: (session: RemoteControlSession) => void): void {
    this.connectionCallbacks.push(callback);
  }

  onDisconnection(callback: (sessionId: string) => void): void {
    this.disconnectionCallbacks.push(callback);
  }

  registerSession(session: RemoteControlSession): void {
    this.sessions.set(session.id, session);
    for (const cb of this.connectionCallbacks) {
      cb(session);
    }
  }

  private generateId(): string {
    return `rc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.stop();
    this.messageCallbacks = [];
    this.connectionCallbacks = [];
    this.disconnectionCallbacks = [];
  }
}

export const remoteControlServer = new RemoteControlServer();
