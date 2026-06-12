import { BackgroundAgent } from "./types";
declare class BackgroundAgentManager {
    private agents;
    private maxConcurrent;
    setMaxConcurrent(max: number): void;
    getMaxConcurrent(): number;
    spawn(agentName: string, task: string, sessionId: string, cwd: string): Promise<string>;
    private executeBackgroundTask;
    get(id: string): BackgroundAgent | undefined;
    getAll(): BackgroundAgent[];
    getRunning(): BackgroundAgent[];
    getRunningCount(): number;
    cancel(id: string): Promise<boolean>;
    attach(id: string): BackgroundAgent | undefined;
    list(status?: BackgroundAgent["status"]): BackgroundAgent[];
    clearCompleted(): number;
}
export declare const backgroundAgentManager: BackgroundAgentManager;
export {};
//# sourceMappingURL=background.d.ts.map