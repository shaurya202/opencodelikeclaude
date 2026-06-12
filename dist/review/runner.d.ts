import { ReviewResult, ReviewFinding, ReviewConfig, ReviewType, SimplifyResult } from "./types";
export declare class ReviewRunner {
    private config;
    private results;
    constructor(config?: Partial<ReviewConfig>);
    getConfig(): ReviewConfig;
    updateConfig(config: Partial<ReviewConfig>): void;
    runCodeReview(target: string, options?: {
        effort?: number;
        autoFix?: boolean;
        comment?: boolean;
        type?: ReviewType;
    }): Promise<ReviewResult>;
    runSecurityScan(target: string): Promise<ReviewFinding[]>;
    simplify(target: string): Promise<SimplifyResult>;
    getResult(id: string): ReviewResult | undefined;
    getAllResults(): ReviewResult[];
    private summarizeFindings;
    private calculateScore;
    private generateId;
    destroy(): void;
}
export declare const reviewRunner: ReviewRunner;
//# sourceMappingURL=runner.d.ts.map