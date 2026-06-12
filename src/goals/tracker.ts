import { Goal, GoalStatus, GoalPriority, GoalCondition, GoalStep, GoalConfig } from "./types";

export class GoalTracker {
  private goals: Map<string, Goal> = new Map();
  private config: GoalConfig = {
    maxActive: 5,
    autoTrack: true,
    notifyOnComplete: true,
  };
  private changeCallbacks: Array<(goal: Goal) => void> = [];

  constructor(config?: Partial<GoalConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): GoalConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<GoalConfig>): void {
    this.config = { ...this.config, ...config };
  }

  createGoal(target: string, options?: {
    description?: string;
    priority?: GoalPriority;
    condition?: GoalCondition;
    steps?: string[];
    metadata?: Record<string, unknown>;
  }): Goal {
    const activeCount = this.getActiveGoals().length;
    if (activeCount >= this.config.maxActive) {
      throw new Error(`Maximum active goals (${this.config.maxActive}) reached. Complete or cancel existing goals first.`);
    }

    const goal: Goal = {
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

  getGoal(id: string): Goal | undefined {
    return this.goals.get(id);
  }

  getAllGoals(): Goal[] {
    return Array.from(this.goals.values());
  }

  getActiveGoals(): Goal[] {
    return this.getAllGoals().filter(g => g.status === "active");
  }

  getGoalsByStatus(status: GoalStatus): Goal[] {
    return this.getAllGoals().filter(g => g.status === status);
  }

  updateProgress(id: string, progress: number): Goal | undefined {
    const goal = this.goals.get(id);
    if (!goal || goal.status !== "active") return undefined;
    goal.progress = Math.min(100, Math.max(0, progress));
    goal.updatedAt = Date.now();
    if (goal.progress >= 100) {
      goal.status = "completed";
      goal.completedAt = Date.now();
    }
    this.notifyChange(goal);
    return goal;
  }

  completeStep(goalId: string, stepId: string, result?: string): Goal | undefined {
    const goal = this.goals.get(goalId);
    if (!goal) return undefined;
    const step = goal.steps.find(s => s.id === stepId);
    if (!step) return undefined;
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

  cancelGoal(id: string): Goal | undefined {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    goal.status = "cancelled";
    goal.updatedAt = Date.now();
    this.notifyChange(goal);
    return goal;
  }

  failGoal(id: string, reason?: string): Goal | undefined {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    goal.status = "failed";
    goal.updatedAt = Date.now();
    if (reason) {
      goal.metadata.failReason = reason;
    }
    this.notifyChange(goal);
    return goal;
  }

  removeGoal(id: string): boolean {
    const existed = this.goals.delete(id);
    return existed;
  }

  clearCompleted(): void {
    for (const [id, goal] of this.goals) {
      if (goal.status === "completed" || goal.status === "cancelled" || goal.status === "failed") {
        this.goals.delete(id);
      }
    }
  }

  addStep(goalId: string, description: string): GoalStep | undefined {
    const goal = this.goals.get(goalId);
    if (!goal) return undefined;
    const step: GoalStep = {
      id: this.generateId(),
      description,
      status: "pending",
    };
    goal.steps.push(step);
    goal.updatedAt = Date.now();
    this.notifyChange(goal);
    return step;
  }

  onChange(callback: (goal: Goal) => void): void {
    this.changeCallbacks.push(callback);
  }

  private notifyChange(goal: Goal): void {
    for (const cb of this.changeCallbacks) {
      cb(goal);
    }
  }

  private generateId(): string {
    return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.goals.clear();
    this.changeCallbacks = [];
  }
}

export const goalTracker = new GoalTracker();
