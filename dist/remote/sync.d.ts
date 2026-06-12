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
export declare class WebSyncManager {
    private config;
    private records;
    private syncCallbacks;
    constructor(config?: Partial<WebSyncConfig>);
    getConfig(): WebSyncConfig;
    updateConfig(config: Partial<WebSyncConfig>): void;
    push(sessionId: string, data: unknown): Promise<SyncRecord>;
    pull(sessionId: string): Promise<SyncRecord | undefined>;
    branch(sessionId: string, _parentSessionId: string): Promise<SyncRecord>;
    getRecords(sessionId?: string): SyncRecord[];
    clearRecords(): void;
    onSync(callback: (record: SyncRecord) => void): void;
    private generateId;
    destroy(): void;
}
export declare const webSyncManager: WebSyncManager;
export {};
//# sourceMappingURL=sync.d.ts.map