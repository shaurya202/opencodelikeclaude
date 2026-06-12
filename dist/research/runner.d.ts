import { ResearchResult, ResearchConfig, DeepResearchInstance } from "./types";
export declare class ResearchRunner {
    private config;
    private instances;
    private results;
    constructor(config?: Partial<ResearchConfig>);
    getConfig(): ResearchConfig;
    updateConfig(config: Partial<ResearchConfig>): void;
    deepResearch(query: string): Promise<DeepResearchInstance>;
    runSingleResearch(query: string): Promise<ResearchResult>;
    private parseSearchResults;
    getInstance(id: string): DeepResearchInstance | undefined;
    getAllInstances(): DeepResearchInstance[];
    getResult(id: string): ResearchResult | undefined;
    private generateSubQueries;
    private generateSummary;
    private getStubFindings;
    private generateId;
    destroy(): void;
}
export declare const researchRunner: ResearchRunner;
//# sourceMappingURL=runner.d.ts.map