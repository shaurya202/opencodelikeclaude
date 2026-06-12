import { Worktree, WorktreeConfig } from "./types";

export class WorktreeManager {
  private worktrees: Map<string, Worktree> = new Map();
  private config: WorktreeConfig = {
    baseBranch: "main",
    prefix: "wip",
    autoCreate: true,
  };

  constructor(config?: Partial<WorktreeConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): WorktreeConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<WorktreeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async create(name: string, options?: { baseBranch?: string; sessionId?: string }): Promise<Worktree> {
    const worktree: Worktree = {
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

  get(name: string): Worktree | undefined {
    return this.worktrees.get(name);
  }

  getAll(): Worktree[] {
    return Array.from(this.worktrees.values());
  }

  getActive(): Worktree[] {
    return this.getAll().filter(w => w.status === "active");
  }

  markMerged(name: string, prUrl?: string): Worktree | undefined {
    const wt = this.worktrees.get(name);
    if (!wt) return undefined;
    wt.status = "merged";
    wt.prUrl = prUrl;
    return wt;
  }

  markAbandoned(name: string): Worktree | undefined {
    const wt = this.worktrees.get(name);
    if (!wt) return undefined;
    wt.status = "abandoned";
    return wt;
  }

  remove(name: string): boolean {
    return this.worktrees.delete(name);
  }

  updateActivity(name: string): Worktree | undefined {
    const wt = this.worktrees.get(name);
    if (!wt) return undefined;
    wt.lastActiveAt = Date.now();
    return wt;
  }

  destroy(): void {
    this.worktrees.clear();
  }
}

export const worktreeManager = new WorktreeManager();
