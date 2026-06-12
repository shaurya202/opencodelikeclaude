import { VerifyResult, VerifyConfig } from "./types";
export declare class VerifyRunner {
    private config;
    private results;
    constructor(config?: Partial<VerifyConfig>);
    getConfig(): VerifyConfig;
    updateConfig(config: Partial<VerifyConfig>): void;
    verify(target: string, options?: {
        build?: boolean;
        test?: boolean;
        lint?: boolean;
        buildCommand?: string;
        testCommand?: string;
        lintCommand?: string;
    }): Promise<VerifyResult>;
    private runStep;
    getResult(id: string): VerifyResult | undefined;
    getAllResults(): VerifyResult[];
    private generateId;
    destroy(): void;
}
export declare const verifyRunner: VerifyRunner;
//# sourceMappingURL=runner.d.ts.map