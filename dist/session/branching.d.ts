export interface BranchResult {
    success: boolean;
    sessionId?: string;
    error?: string;
}
export declare function createBranch(sourceSessionId: string, options?: {
    name?: string;
    fromCheckpoint?: string;
    fromMessageIndex?: number;
}): BranchResult;
export declare function listBranches(sessionId: string): string[];
export declare function mergeBranches(targetSessionId: string, sourceSessionId: string, strategy?: "append" | "replace"): BranchResult;
//# sourceMappingURL=branching.d.ts.map