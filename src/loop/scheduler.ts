import { LoopInstance, LoopStatus, ScheduleInstance, ScheduleConfig, RalphLoopConfig } from "./types";

export class Scheduler {
  private loops: Map<string, LoopInstance> = new Map();
  private schedules: Map<string, ScheduleInstance> = new Map();
  private ralphLoops: Map<string, RalphLoopConfig> = new Map();
  private loopChangeCallbacks: Array<(loop: LoopInstance) => void> = [];
  private scheduleChangeCallbacks: Array<(schedule: ScheduleInstance) => void> = [];

  createLoop(prompt: string, options?: {
    interval?: number;
    maxIterations?: number;
    metadata?: Record<string, unknown>;
  }): LoopInstance {
    const loop: LoopInstance = {
      id: this.generateId("loop"),
      prompt,
      interval: options?.interval ?? 60000,
      status: "idle",
      currentIteration: 0,
      maxIterations: options?.maxIterations ?? 100,
      startedAt: Date.now(),
      results: [],
      metadata: options?.metadata || {},
    };
    this.loops.set(loop.id, loop);
    this.notifyLoopChange(loop);
    return loop;
  }

  getLoop(id: string): LoopInstance | undefined {
    return this.loops.get(id);
  }

  getAllLoops(): LoopInstance[] {
    return Array.from(this.loops.values());
  }

  getLoopsByStatus(status: LoopStatus): LoopInstance[] {
    return this.getAllLoops().filter(l => l.status === status);
  }

  startLoop(id: string): LoopInstance | undefined {
    const loop = this.loops.get(id);
    if (!loop || loop.status === "running") return undefined;
    loop.status = "running";
    loop.lastRunAt = Date.now();
    this.notifyLoopChange(loop);
    return loop;
  }

  pauseLoop(id: string): LoopInstance | undefined {
    const loop = this.loops.get(id);
    if (!loop || loop.status !== "running") return undefined;
    loop.status = "paused";
    this.notifyLoopChange(loop);
    return loop;
  }

  cancelLoop(id: string): LoopInstance | undefined {
    const loop = this.loops.get(id);
    if (!loop) return undefined;
    loop.status = "cancelled";
    this.notifyLoopChange(loop);
    return loop;
  }

  recordIteration(id: string, output: string): LoopInstance | undefined {
    const loop = this.loops.get(id);
    if (!loop) return undefined;
    loop.currentIteration++;
    loop.lastRunAt = Date.now();
    loop.results.push(output);
    if (loop.currentIteration >= loop.maxIterations) {
      loop.status = "completed";
    }
    this.notifyLoopChange(loop);
    return loop;
  }

  removeLoop(id: string): boolean {
    return this.loops.delete(id);
  }

  createSchedule(config: ScheduleConfig): ScheduleInstance {
    const schedule: ScheduleInstance = {
      id: this.generateId("sched"),
      cron: config.cron,
      prompt: config.prompt,
      label: config.label,
      enabled: config.enabled,
      maxRuns: config.maxRuns,
      currentRuns: 0,
      results: [],
    };
    this.schedules.set(schedule.id, schedule);
    this.notifyScheduleChange(schedule);
    return schedule;
  }

  getSchedule(id: string): ScheduleInstance | undefined {
    return this.schedules.get(id);
  }

  getAllSchedules(): ScheduleInstance[] {
    return Array.from(this.schedules.values());
  }

  enableSchedule(id: string): ScheduleInstance | undefined {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    schedule.enabled = true;
    this.notifyScheduleChange(schedule);
    return schedule;
  }

  disableSchedule(id: string): ScheduleInstance | undefined {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    schedule.enabled = false;
    this.notifyScheduleChange(schedule);
    return schedule;
  }

  recordScheduleRun(id: string, output: string): ScheduleInstance | undefined {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    schedule.currentRuns++;
    schedule.lastRunAt = Date.now();
    schedule.results.push(output);
    if (schedule.currentRuns >= schedule.maxRuns) {
      schedule.enabled = false;
    }
    this.notifyScheduleChange(schedule);
    return schedule;
  }

  removeSchedule(id: string): boolean {
    return this.schedules.delete(id);
  }

  createRalphLoop(config: RalphLoopConfig): string {
    const id = this.generateId("ralph");
    this.ralphLoops.set(id, { ...config });
    return id;
  }

  getRalphLoop(id: string): RalphLoopConfig | undefined {
    return this.ralphLoops.get(id);
  }

  updateRalphLoopProgress(id: string, progress: number): RalphLoopConfig | undefined {
    const loop = this.ralphLoops.get(id);
    if (!loop) return undefined;
    const updated = { ...loop, currentProgress: progress };
    this.ralphLoops.set(id, updated);
    return updated;
  }

  removeRalphLoop(id: string): boolean {
    return this.ralphLoops.delete(id);
  }

  onLoopChange(callback: (loop: LoopInstance) => void): void {
    this.loopChangeCallbacks.push(callback);
  }

  onScheduleChange(callback: (schedule: ScheduleInstance) => void): void {
    this.scheduleChangeCallbacks.push(callback);
  }

  private notifyLoopChange(loop: LoopInstance): void {
    for (const cb of this.loopChangeCallbacks) {
      cb(loop);
    }
  }

  private notifyScheduleChange(schedule: ScheduleInstance): void {
    for (const cb of this.scheduleChangeCallbacks) {
      cb(schedule);
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.loops.clear();
    this.schedules.clear();
    this.ralphLoops.clear();
    this.loopChangeCallbacks = [];
    this.scheduleChangeCallbacks = [];
  }
}

export const scheduler = new Scheduler();
