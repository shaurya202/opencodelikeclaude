export type VerifyStatus = "pending" | "running" | "passed" | "failed" | "error";
export interface VerifyConfig {
    buildCommand: string;
    testCommand: string;
    lintCommand: string;
    timeout: number;
    autoFix: boolean;
}
export interface VerifyResult {
    id: string;
    target: string;
    status: VerifyStatus;
    steps: VerifyStep[];
    duration: number;
    timestamp: number;
    error?: string;
}
export interface VerifyStep {
    name: string;
    command: string;
    status: VerifyStatus;
    output: string;
    duration: number;
    error?: string;
}
export interface RunConfig {
    command: string;
    args: string[];
    env: Record<string, string>;
    cwd: string;
    timeout: number;
    detach: boolean;
}
//# sourceMappingURL=types.d.ts.map