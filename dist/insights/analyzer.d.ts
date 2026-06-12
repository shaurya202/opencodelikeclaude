import { InsightReport, InsightsConfig } from "./types";
export declare class InsightsAnalyzer {
    private reports;
    private config;
    constructor(config?: Partial<InsightsConfig>);
    getConfig(): InsightsConfig;
    updateConfig(config: Partial<InsightsConfig>): void;
    generateReport(sessionId: string): InsightReport;
    getReport(id: string): InsightReport | undefined;
    getAllReports(): InsightReport[];
    clear(): void;
    private generateId;
    destroy(): void;
}
export declare const insightsAnalyzer: InsightsAnalyzer;
//# sourceMappingURL=analyzer.d.ts.map