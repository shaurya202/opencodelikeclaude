import { WebSyncConfig } from "./types";

interface SyncRecord {
  id: string;
  sessionId: string;
  action: "push" | "pull" | "branch" | "merge";
  timestamp: number;
  status: "pending" | "synced" | "failed";
  data?: unknown;
  error?: string;
}

export class WebSyncManager {
  private config: WebSyncConfig = {
    enabled: false,
    autoSync: true,
  };
  private records: SyncRecord[] = [];
  private syncCallbacks: Array<(record: SyncRecord) => void> = [];

  constructor(config?: Partial<WebSyncConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): WebSyncConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<WebSyncConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async push(sessionId: string, data: unknown): Promise<SyncRecord> {
    if (!this.config.enabled) throw new Error("Web sync is disabled");

    const record: SyncRecord = {
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

  async pull(sessionId: string): Promise<SyncRecord | undefined> {
    if (!this.config.enabled) throw new Error("Web sync is disabled");

    const record: SyncRecord = {
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

  async branch(sessionId: string, _parentSessionId: string): Promise<SyncRecord> {
    if (!this.config.enabled) throw new Error("Web sync is disabled");

    const record: SyncRecord = {
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

  getRecords(sessionId?: string): SyncRecord[] {
    if (sessionId) {
      return this.records.filter(r => r.sessionId === sessionId);
    }
    return [...this.records];
  }

  clearRecords(): void {
    this.records = [];
  }

  onSync(callback: (record: SyncRecord) => void): void {
    this.syncCallbacks.push(callback);
  }

  private generateId(): string {
    return `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.records = [];
    this.syncCallbacks = [];
  }
}

export const webSyncManager = new WebSyncManager();
