import { BatchInstance, BatchJob, BatchStatus, BatchConfig } from "./types";

export class BatchRunner {
  private batches: Map<string, BatchInstance> = new Map();
  private config: BatchConfig = {
    maxParallel: 5,
    timeout: 300000,
    createPRs: false,
    worktreeEnabled: true,
    baseBranch: "main",
  };

  constructor(config?: Partial<BatchConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): BatchConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<BatchConfig>): void {
    this.config = { ...this.config, ...config };
  }

  createBatch(name: string, task: string, units: { name: string; task: string; target: string }[]): BatchInstance {
    const jobs: BatchJob[] = units.map((u, _i) => ({
      id: this.generateId(),
      name: u.name,
      task: u.task,
      status: "pending" as BatchStatus,
      target: u.target,
    }));

    const batch: BatchInstance = {
      id: this.generateId(),
      name,
      task,
      status: "pending",
      jobs,
      parallel: Math.min(units.length, this.config.maxParallel),
      createdAt: Date.now(),
      summary: {
        total: jobs.length,
        completed: 0,
        failed: 0,
        cancelled: 0,
      },
    };

    this.batches.set(batch.id, batch);
    return batch;
  }

  getBatch(id: string): BatchInstance | undefined {
    return this.batches.get(id);
  }

  getAllBatches(): BatchInstance[] {
    return Array.from(this.batches.values());
  }

  startBatch(id: string): BatchInstance | undefined {
    const batch = this.batches.get(id);
    if (!batch || batch.status !== "pending") return undefined;
    batch.status = "running";
    batch.startedAt = Date.now();
    for (let i = 0; i < Math.min(batch.jobs.length, batch.parallel); i++) {
      batch.jobs[i].status = "running";
      batch.jobs[i].startedAt = Date.now();
    }
    return batch;
  }

  completeJob(batchId: string, jobId: string, result: string): BatchInstance | undefined {
    const batch = this.batches.get(batchId);
    if (!batch) return undefined;
    const job = batch.jobs.find(j => j.id === jobId);
    if (!job) return undefined;
    job.status = "completed";
    job.result = result;
    job.completedAt = Date.now();
    job.duration = job.completedAt - (job.startedAt || job.completedAt);
    batch.summary.completed++;
    this.checkBatchComplete(batch);
    return batch;
  }

  failJob(batchId: string, jobId: string, error: string): BatchInstance | undefined {
    const batch = this.batches.get(batchId);
    if (!batch) return undefined;
    const job = batch.jobs.find(j => j.id === jobId);
    if (!job) return undefined;
    job.status = "failed";
    job.error = error;
    job.completedAt = Date.now();
    job.duration = job.completedAt - (job.startedAt || job.completedAt);
    batch.summary.failed++;
    this.checkBatchComplete(batch);
    return batch;
  }

  cancelBatch(id: string): BatchInstance | undefined {
    const batch = this.batches.get(id);
    if (!batch) return undefined;
    batch.status = "cancelled";
    batch.completedAt = Date.now();
    for (const job of batch.jobs) {
      if (job.status === "pending" || job.status === "running") {
        job.status = "cancelled";
        batch.summary.cancelled++;
      }
    }
    return batch;
  }

  removeBatch(id: string): boolean {
    return this.batches.delete(id);
  }

  private checkBatchComplete(batch: BatchInstance): void {
    const total = batch.summary.completed + batch.summary.failed + batch.summary.cancelled;
    if (total >= batch.jobs.length) {
      batch.status = "completed";
      batch.completedAt = Date.now();
    }
  }

  private generateId(): string {
    return `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.batches.clear();
  }
}

export const batchRunner = new BatchRunner();
