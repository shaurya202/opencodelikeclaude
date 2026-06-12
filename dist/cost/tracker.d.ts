import { CostEntry, CostSummary, CostConfig, PlanTier, PlanLimits } from "./types";
export declare class CostTracker {
    private entries;
    private config;
    private changeCallbacks;
    private alertCallbacks;
    constructor(config?: Partial<CostConfig>);
    getConfig(): CostConfig;
    updateConfig(config: Partial<CostConfig>): void;
    record(model: string, inputTokens: number, outputTokens: number, category: CostEntry["category"], label?: string): CostEntry;
    getSummary(): CostSummary;
    getPlanLimits(tier?: PlanTier): PlanLimits;
    getEntries(category?: string): CostEntry[];
    clear(): void;
    onChange(callback: (entry: CostEntry) => void): void;
    onAlert(callback: (message: string) => void): void;
    private checkAlerts;
    formatCost(cost: number): string;
    private generateId;
    destroy(): void;
}
export declare const costTracker: CostTracker;
//# sourceMappingURL=tracker.d.ts.map