import { Goal, GoalStatus, GoalPriority, GoalCondition, GoalStep, GoalConfig } from "./types";
export declare class GoalTracker {
    private goals;
    private config;
    private changeCallbacks;
    constructor(config?: Partial<GoalConfig>);
    getConfig(): GoalConfig;
    updateConfig(config: Partial<GoalConfig>): void;
    createGoal(target: string, options?: {
        description?: string;
        priority?: GoalPriority;
        condition?: GoalCondition;
        steps?: string[];
        metadata?: Record<string, unknown>;
    }): Goal;
    getGoal(id: string): Goal | undefined;
    getAllGoals(): Goal[];
    getActiveGoals(): Goal[];
    getGoalsByStatus(status: GoalStatus): Goal[];
    updateProgress(id: string, progress: number): Goal | undefined;
    completeStep(goalId: string, stepId: string, result?: string): Goal | undefined;
    cancelGoal(id: string): Goal | undefined;
    failGoal(id: string, reason?: string): Goal | undefined;
    removeGoal(id: string): boolean;
    clearCompleted(): void;
    addStep(goalId: string, description: string): GoalStep | undefined;
    onChange(callback: (goal: Goal) => void): void;
    private notifyChange;
    private generateId;
    destroy(): void;
}
export declare const goalTracker: GoalTracker;
//# sourceMappingURL=tracker.d.ts.map