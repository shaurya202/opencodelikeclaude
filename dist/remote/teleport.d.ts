import { TeleportConfig, TeleportSession } from "./types";
export declare class TeleportManager {
    private config;
    private sessions;
    private importCallbacks;
    constructor(config?: Partial<TeleportConfig>);
    getConfig(): TeleportConfig;
    updateConfig(config: Partial<TeleportConfig>): void;
    importSession(url: string, source?: string): Promise<TeleportSession>;
    getSession(id: string): TeleportSession | undefined;
    getAllSessions(): TeleportSession[];
    removeSession(id: string): boolean;
    clearSessions(): void;
    pushToWeb(sessionId: string, content: string, target?: string): Promise<string>;
    fetchFromWeb(url: string): Promise<{
        content: string;
        title: string;
    }>;
    onImport(callback: (session: TeleportSession) => void): void;
    private generateId;
    destroy(): void;
}
export declare const teleportManager: TeleportManager;
//# sourceMappingURL=teleport.d.ts.map