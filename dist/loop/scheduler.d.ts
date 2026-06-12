import { LoopInstance, LoopStatus, ScheduleInstance, ScheduleConfig, RalphLoopConfig } from "./types";
export declare class Scheduler {
    private loops;
    private schedules;
    private ralphLoops;
    private loopChangeCallbacks;
    private scheduleChangeCallbacks;
    createLoop(prompt: string, options?: {
        interval?: number;
        maxIterations?: number;
        metadata?: Record<string, unknown>;
    }): LoopInstance;
    getLoop(id: string): LoopInstance | undefined;
    getAllLoops(): LoopInstance[];
    getLoopsByStatus(status: LoopStatus): LoopInstance[];
    startLoop(id: string): LoopInstance | undefined;
    pauseLoop(id: string): LoopInstance | undefined;
    cancelLoop(id: string): LoopInstance | undefined;
    recordIteration(id: string, output: string): LoopInstance | undefined;
    removeLoop(id: string): boolean;
    createSchedule(config: ScheduleConfig): ScheduleInstance;
    getSchedule(id: string): ScheduleInstance | undefined;
    getAllSchedules(): ScheduleInstance[];
    enableSchedule(id: string): ScheduleInstance | undefined;
    disableSchedule(id: string): ScheduleInstance | undefined;
    recordScheduleRun(id: string, output: string): ScheduleInstance | undefined;
    removeSchedule(id: string): boolean;
    createRalphLoop(config: RalphLoopConfig): string;
    getRalphLoop(id: string): RalphLoopConfig | undefined;
    updateRalphLoopProgress(id: string, progress: number): RalphLoopConfig | undefined;
    removeRalphLoop(id: string): boolean;
    onLoopChange(callback: (loop: LoopInstance) => void): void;
    onScheduleChange(callback: (schedule: ScheduleInstance) => void): void;
    private notifyLoopChange;
    private notifyScheduleChange;
    private generateId;
    destroy(): void;
}
export declare const scheduler: Scheduler;
//# sourceMappingURL=scheduler.d.ts.map