import { TeleportConfig, TeleportSession } from "./types";

export class TeleportManager {
  private config: TeleportConfig = {
    enabled: true,
    defaultClient: "claude.ai",
  };
  private sessions: Map<string, TeleportSession> = new Map();
  private importCallbacks: Array<(session: TeleportSession) => void> = [];

  constructor(config?: Partial<TeleportConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): TeleportConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<TeleportConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async importSession(url: string, source?: string): Promise<TeleportSession> {
    if (!this.config.enabled) throw new Error("Teleport is disabled");

    const session: TeleportSession = {
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

  getSession(id: string): TeleportSession | undefined {
    return this.sessions.get(id);
  }

  getAllSessions(): TeleportSession[] {
    return Array.from(this.sessions.values());
  }

  removeSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  clearSessions(): void {
    this.sessions.clear();
  }

  async pushToWeb(sessionId: string, content: string, target?: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    session.content = content;
    session.messages++;
    const endpoint = target || this.config.defaultClient;
    return `Pushed ${content.length} chars to ${endpoint} (session ${sessionId.slice(0, 8)})`;
  }

  async fetchFromWeb(url: string): Promise<{ content: string; title: string }> {
    return {
      content: `Fetched content from ${url}`,
      title: `Web session: ${url}`,
    };
  }

  onImport(callback: (session: TeleportSession) => void): void {
    this.importCallbacks.push(callback);
  }

  private generateId(): string {
    return `tp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.sessions.clear();
    this.importCallbacks = [];
  }
}

export const teleportManager = new TeleportManager();
