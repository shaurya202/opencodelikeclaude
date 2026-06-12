export interface WorktreeConfig {
    baseBranch: string;
    prefix: string;
    autoCreate: boolean;
}
export interface Worktree {
    name: string;
    path: string;
    branch: string;
    createdAt: number;
    lastActiveAt: number;
    status: "active" | "stale" | "merged" | "abandoned";
    sessionId?: string;
    prUrl?: string;
}
export interface GitDiff {
    file: string;
    additions: number;
    deletions: number;
    hunks: GitDiffHunk[];
}
export interface GitDiffHunk {
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    content: string;
}
//# sourceMappingURL=types.d.ts.map