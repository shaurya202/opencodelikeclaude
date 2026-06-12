import { BatchInstance, BatchConfig } from "./types";
export declare class BatchRunner {
    private batches;
    private config;
    constructor(config?: Partial<BatchConfig>);
    getConfig(): BatchConfig;
    updateConfig(config: Partial<BatchConfig>): void;
    createBatch(name: string, task: string, units: {
        name: string;
        task: string;
        target: string;
    }[]): BatchInstance;
    getBatch(id: string): BatchInstance | undefined;
    getAllBatches(): BatchInstance[];
    startBatch(id: string): BatchInstance | undefined;
    completeJob(batchId: string, jobId: string, result: string): BatchInstance | undefined;
    failJob(batchId: string, jobId: string, error: string): BatchInstance | undefined;
    cancelBatch(id: string): BatchInstance | undefined;
    removeBatch(id: string): boolean;
    private checkBatchComplete;
    private generateId;
    destroy(): void;
}
export declare const batchRunner: BatchRunner;
//# sourceMappingURL=runner.d.ts.map