export interface AgentConfig {
    model: string;
    variant?: string;
    fallbackModels?: string[];
    temperature?: number;
    toolPermissions?: string[];
    prompt?: string;
    description?: string;
}
export interface AgentDefinition {
    name: string;
    description: string;
    config: AgentConfig;
    category?: string;
}
export interface AgentFile {
    name: string;
    description: string;
    model: string;
    variant?: string;
    fallbackModels?: string[];
    temperature?: number;
    toolPermissions?: string[];
    prompt?: string;
    category?: string;
}
export interface LoadedAgent extends AgentDefinition {
    source: "builtin" | "filesystem" | "claude-compat";
    filePath?: string;
}
export interface AgentContext {
    sessionId: string;
    cwd: string;
    task: string;
    parentAgent?: string;
}
export interface AgentResult {
    output: string;
    error?: string;
    metadata?: Record<string, unknown>;
}
export type AgentHandler = (context: AgentContext) => Promise<AgentResult> | AgentResult;
export interface DelegationOptions {
    agent: string;
    task: string;
    background?: boolean;
    waitForResult?: boolean;
}
export interface BackgroundAgent {
    id: string;
    agent: string;
    task: string;
    status: "pending" | "running" | "completed" | "failed" | "cancelled";
    startedAt: Date;
    completedAt?: Date;
    result?: AgentResult;
    pid?: number;
}
//# sourceMappingURL=types.d.ts.map