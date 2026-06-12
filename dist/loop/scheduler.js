export class Scheduler {
    loops = new Map();
    schedules = new Map();
    ralphLoops = new Map();
    loopChangeCallbacks = [];
    scheduleChangeCallbacks = [];
    createLoop(prompt, options) {
        const loop = {
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
    getLoop(id) {
        return this.loops.get(id);
    }
    getAllLoops() {
        return Array.from(this.loops.values());
    }
    getLoopsByStatus(status) {
        return this.getAllLoops().filter(l => l.status === status);
    }
    startLoop(id) {
        const loop = this.loops.get(id);
        if (!loop || loop.status === "running")
            return undefined;
        loop.status = "running";
        loop.lastRunAt = Date.now();
        this.notifyLoopChange(loop);
        return loop;
    }
    pauseLoop(id) {
        const loop = this.loops.get(id);
        if (!loop || loop.status !== "running")
            return undefined;
        loop.status = "paused";
        this.notifyLoopChange(loop);
        return loop;
    }
    cancelLoop(id) {
        const loop = this.loops.get(id);
        if (!loop)
            return undefined;
        loop.status = "cancelled";
        this.notifyLoopChange(loop);
        return loop;
    }
    recordIteration(id, output) {
        const loop = this.loops.get(id);
        if (!loop)
            return undefined;
        loop.currentIteration++;
        loop.lastRunAt = Date.now();
        loop.results.push(output);
        if (loop.currentIteration >= loop.maxIterations) {
            loop.status = "completed";
        }
        this.notifyLoopChange(loop);
        return loop;
    }
    removeLoop(id) {
        return this.loops.delete(id);
    }
    createSchedule(config) {
        const schedule = {
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
    getSchedule(id) {
        return this.schedules.get(id);
    }
    getAllSchedules() {
        return Array.from(this.schedules.values());
    }
    enableSchedule(id) {
        const schedule = this.schedules.get(id);
        if (!schedule)
            return undefined;
        schedule.enabled = true;
        this.notifyScheduleChange(schedule);
        return schedule;
    }
    disableSchedule(id) {
        const schedule = this.schedules.get(id);
        if (!schedule)
            return undefined;
        schedule.enabled = false;
        this.notifyScheduleChange(schedule);
        return schedule;
    }
    recordScheduleRun(id, output) {
        const schedule = this.schedules.get(id);
        if (!schedule)
            return undefined;
        schedule.currentRuns++;
        schedule.lastRunAt = Date.now();
        schedule.results.push(output);
        if (schedule.currentRuns >= schedule.maxRuns) {
            schedule.enabled = false;
        }
        this.notifyScheduleChange(schedule);
        return schedule;
    }
    removeSchedule(id) {
        return this.schedules.delete(id);
    }
    createRalphLoop(config) {
        const id = this.generateId("ralph");
        this.ralphLoops.set(id, { ...config });
        return id;
    }
    getRalphLoop(id) {
        return this.ralphLoops.get(id);
    }
    updateRalphLoopProgress(id, progress) {
        const loop = this.ralphLoops.get(id);
        if (!loop)
            return undefined;
        const updated = { ...loop, currentProgress: progress };
        this.ralphLoops.set(id, updated);
        return updated;
    }
    removeRalphLoop(id) {
        return this.ralphLoops.delete(id);
    }
    onLoopChange(callback) {
        this.loopChangeCallbacks.push(callback);
    }
    onScheduleChange(callback) {
        this.scheduleChangeCallbacks.push(callback);
    }
    notifyLoopChange(loop) {
        for (const cb of this.loopChangeCallbacks) {
            cb(loop);
        }
    }
    notifyScheduleChange(schedule) {
        for (const cb of this.scheduleChangeCallbacks) {
            cb(schedule);
        }
    }
    generateId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.loops.clear();
        this.schedules.clear();
        this.ralphLoops.clear();
        this.loopChangeCallbacks = [];
        this.scheduleChangeCallbacks = [];
    }
}
export const scheduler = new Scheduler();
//# sourceMappingURL=scheduler.js.map