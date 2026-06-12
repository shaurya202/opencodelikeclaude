export interface CompactionOptions {
    focus?: string;
    preserveRecent?: number;
    customPrompt?: string;
}
export interface CompactionResult {
    success: boolean;
    originalMessageCount: number;
    compactedMessageCount: number;
    tokensSaved: number;
    error?: string;
}
export declare function compactSession(sessionId: string, options?: CompactionOptions): CompactionResult;
//# sourceMappingURL=compaction.d.ts.map