export type BatchStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface BatchConfig {
  maxParallel: number;
  timeout: number;
  createPRs: boolean;
  worktreeEnabled: boolean;
  baseBranch: string;
}

export interface BatchJob {
  id: string;
  name: string;
  task: string;
  status: BatchStatus;
  target: string;
  worktree?: string;
  result?: string;
  error?: string;
  prUrl?: string;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
}

export interface BatchInstance {
  id: string;
  name: string;
  task: string;
  status: BatchStatus;
  jobs: BatchJob[];
  parallel: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  summary: {
    total: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}
