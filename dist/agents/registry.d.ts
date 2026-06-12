import { LoadedAgent, AgentContext, AgentResult } from "./types";
export declare class AgentRegistry {
    private agents;
    private categories;
    register(agent: LoadedAgent): void;
    unregister(name: string): void;
    get(name: string): LoadedAgent | undefined;
    getAll(): LoadedAgent[];
    getByCategory(category: string): LoadedAgent[];
    getCategories(): string[];
    execute(name: string, context: AgentContext): Promise<AgentResult>;
    private runAgent;
}
export declare const agentRegistry: AgentRegistry;
//# sourceMappingURL=registry.d.ts.map