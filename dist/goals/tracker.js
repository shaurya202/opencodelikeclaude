export class GoalTracker {
    goals = new Map();
    config = {
        maxActive: 5,
        autoTrack: true,
        notifyOnComplete: true,
    };
    changeCallbacks = [];
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
    createGoal(target, options) {
        const activeCount = this.getActiveGoals().length;
        if (activeCount >= this.config.maxActive) {
            throw new Error(`Maximum active goals (${this.config.maxActive}) reached. Complete or cancel existing goals first.`);
        }
        const goal = {
            id: this.generateId(),
            target,
            description: options?.description || target,
            status: "active",
            priority: options?.priority || "medium",
            condition: options?.condition || "auto",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            progress: 0,
            steps: (options?.steps || []).map(s => ({
                id: this.generateId(),
                description: s,
                status: "pending",
            })),
            metadata: options?.metadata || {},
        };
        this.goals.set(goal.id, goal);
        this.notifyChange(goal);
        return goal;
    }
    getGoal(id) {
        return this.goals.get(id);
    }
    getAllGoals() {
        return Array.from(this.goals.values());
    }
    getActiveGoals() {
        return this.getAllGoals().filter(g => g.status === "active");
    }
    getGoalsByStatus(status) {
        return this.getAllGoals().filter(g => g.status === status);
    }
    updateProgress(id, progress) {
        const goal = this.goals.get(id);
        if (!goal || goal.status !== "active")
            return undefined;
        goal.progress = Math.min(100, Math.max(0, progress));
        goal.updatedAt = Date.now();
        if (goal.progress >= 100) {
            goal.status = "completed";
            goal.completedAt = Date.now();
        }
        this.notifyChange(goal);
        return goal;
    }
    completeStep(goalId, stepId, result) {
        const goal = this.goals.get(goalId);
        if (!goal)
            return undefined;
        const step = goal.steps.find(s => s.id === stepId);
        if (!step)
            return undefined;
        step.status = "completed";
        step.result = result;
        goal.updatedAt = Date.now();
        const completed = goal.steps.filter(s => s.status === "completed").length;
        goal.progress = Math.round((completed / goal.steps.length) * 100);
        if (goal.progress >= 100) {
            goal.status = "completed";
            goal.completedAt = Date.now();
        }
        this.notifyChange(goal);
        return goal;
    }
    cancelGoal(id) {
        const goal = this.goals.get(id);
        if (!goal)
            return undefined;
        goal.status = "cancelled";
        goal.updatedAt = Date.now();
        this.notifyChange(goal);
        return goal;
    }
    failGoal(id, reason) {
        const goal = this.goals.get(id);
        if (!goal)
            return undefined;
        goal.status = "failed";
        goal.updatedAt = Date.now();
        if (reason) {
            goal.metadata.failReason = reason;
        }
        this.notifyChange(goal);
        return goal;
    }
    removeGoal(id) {
        const existed = this.goals.delete(id);
        return existed;
    }
    clearCompleted() {
        for (const [id, goal] of this.goals) {
            if (goal.status === "completed" || goal.status === "cancelled" || goal.status === "failed") {
                this.goals.delete(id);
            }
        }
    }
    addStep(goalId, description) {
        const goal = this.goals.get(goalId);
        if (!goal)
            return undefined;
        const step = {
            id: this.generateId(),
            description,
            status: "pending",
        };
        goal.steps.push(step);
        goal.updatedAt = Date.now();
        this.notifyChange(goal);
        return step;
    }
    onChange(callback) {
        this.changeCallbacks.push(callback);
    }
    notifyChange(goal) {
        for (const cb of this.changeCallbacks) {
            cb(goal);
        }
    }
    generateId() {
        return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.goals.clear();
        this.changeCallbacks = [];
    }
}
export const goalTracker = new GoalTracker();
//# sourceMappingURL=tracker.js.map