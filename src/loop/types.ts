export type LoopStatus = "idle" | "running" | "paused" | "completed" | "cancelled";

export interface LoopConfig {
  maxLoops: number;
  defaultInterval: number;
  persistent: boolean;
  interval: number;
  prompt: string;
  onIteration?: (iteration: number, output: string) => Promise<void>;
}

export interface LoopInstance {
  id: string;
  prompt: string;
  interval: number;
  status: LoopStatus;
  currentIteration: number;
  maxIterations: number;
  startedAt: number;
  lastRunAt?: number;
  results: string[];
  metadata: Record<string, unknown>;
}

export interface ScheduleConfig {
  cron: string;
  prompt: string;
  enabled: boolean;
  maxRuns: number;
  label?: string;
}

export interface ScheduleInstance {
  id: string;
  cron: string;
  prompt: string;
  label?: string;
  enabled: boolean;
  maxRuns: number;
  currentRuns: number;
  lastRunAt?: number;
  nextRunAt?: number;
  results: string[];
}

export interface RalphLoopConfig {
  prompt: string;
  target: string;
  currentProgress: number;
  threshold: number;
  maxIterations: number;
  refinementStrategy: "aggressive" | "moderate" | "conservative";
}
