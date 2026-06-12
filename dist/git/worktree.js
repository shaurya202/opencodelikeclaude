export class WorktreeManager {
    worktrees = new Map();
    config = {
        baseBranch: "main",
        prefix: "wip",
        autoCreate: true,
    };
    constructor(config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    async create(name, options) {
        const worktree = {
            name,
            path: `.worktrees/${name}`,
            branch: `${this.config.prefix}/${name}`,
            createdAt: Date.now(),
            lastActiveAt: Date.now(),
            status: "active",
            sessionId: options?.sessionId,
        };
        this.worktrees.set(name, worktree);
        return worktree;
    }
    get(name) {
        return this.worktrees.get(name);
    }
    getAll() {
        return Array.from(this.worktrees.values());
    }
    getActive() {
        return this.getAll().filter(w => w.status === "active");
    }
    markMerged(name, prUrl) {
        const wt = this.worktrees.get(name);
        if (!wt)
            return undefined;
        wt.status = "merged";
        wt.prUrl = prUrl;
        return wt;
    }
    markAbandoned(name) {
        const wt = this.worktrees.get(name);
        if (!wt)
            return undefined;
        wt.status = "abandoned";
        return wt;
    }
    remove(name) {
        return this.worktrees.delete(name);
    }
    updateActivity(name) {
        const wt = this.worktrees.get(name);
        if (!wt)
            return undefined;
        wt.lastActiveAt = Date.now();
        return wt;
    }
    destroy() {
        this.worktrees.clear();
    }
}
export const worktreeManager = new WorktreeManager();
//# sourceMappingURL=worktree.js.map