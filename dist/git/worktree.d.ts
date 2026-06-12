import { Worktree, WorktreeConfig } from "./types";
export declare class WorktreeManager {
    private worktrees;
    private config;
    constructor(config?: Partial<WorktreeConfig>);
    getConfig(): WorktreeConfig;
    updateConfig(config: Partial<WorktreeConfig>): void;
    create(name: string, options?: {
        baseBranch?: string;
        sessionId?: string;
    }): Promise<Worktree>;
    get(name: string): Worktree | undefined;
    getAll(): Worktree[];
    getActive(): Worktree[];
    markMerged(name: string, prUrl?: string): Worktree | undefined;
    markAbandoned(name: string): Worktree | undefined;
    remove(name: string): boolean;
    updateActivity(name: string): Worktree | undefined;
    destroy(): void;
}
export declare const worktreeManager: WorktreeManager;
//# sourceMappingURL=worktree.d.ts.map