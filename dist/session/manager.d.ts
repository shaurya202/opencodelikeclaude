import { Session, SessionMetadata, SessionMessage, Checkpoint, BranchOptions, SessionManagerConfig } from "./types";
export declare class SessionManager {
    private config;
    private sessions;
    private currentSessionId;
    constructor(config?: Partial<SessionManagerConfig>);
    private loadSessions;
    createSession(name?: string, parentSessionId?: string): Session;
    getSession(id: string): Session | undefined;
    getCurrentSession(): Session | undefined;
    setCurrentSession(id: string): boolean;
    listSessions(): SessionMetadata[];
    deleteSession(id: string): boolean;
    renameSession(id: string, name: string): boolean;
    addMessage(sessionId: string, message: Omit<SessionMessage, "id" | "timestamp">): SessionMessage | null;
    createCheckpoint(sessionId: string, description: string): Checkpoint | null;
    getCheckpoints(sessionId: string): Checkpoint[];
    rewindToCheckpoint(sessionId: string, checkpointId: string): boolean;
    branchSession(sessionId: string, options?: BranchOptions): Session | null;
    updateTokenUsage(sessionId: string, inputTokens: number, outputTokens: number): void;
    addTag(sessionId: string, tag: string): void;
    private persistSession;
    exportSession(sessionId: string): string | null;
}
export declare const sessionManager: SessionManager;
//# sourceMappingURL=manager.d.ts.map