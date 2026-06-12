export type GoalStatus = "active" | "completed" | "cancelled" | "failed";
export type GoalPriority = "low" | "medium" | "high" | "critical";
export type GoalCondition = "all" | "any" | "auto";
export interface Goal {
    id: string;
    target: string;
    description: string;
    status: GoalStatus;
    priority: GoalPriority;
    condition: GoalCondition;
    createdAt: number;
    updatedAt: number;
    completedAt?: number;
    progress: number;
    steps: GoalStep[];
    metadata: Record<string, unknown>;
}
export interface GoalStep {
    id: string;
    description: string;
    status: "pending" | "in_progress" | "completed" | "skipped";
    result?: string;
}
export interface GoalConfig {
    maxActive: number;
    autoTrack: boolean;
    notifyOnComplete: boolean;
}
//# sourceMappingURL=types.d.ts.map