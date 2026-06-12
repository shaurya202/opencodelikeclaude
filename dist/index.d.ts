import { loadConfig } from "./config/loader";
import { hookRegistry } from "./hooks/registry";
import { commandRegistry } from "./commands/registry";
import { agentRegistry } from "./agents";
import { mcpRegistry } from "./mcp";
import { skillRegistry } from "./skills";
import { sdk, LlmCall, LlmResponse } from "./sdk";
import "./builtin";
import "./agents/builtin";
import "./mcp/loader";
import "./skills/builtin";
import "./hooks/builtin";
export interface PluginContext {
    cwd: string;
    sessionId: string;
    config: ReturnType<typeof loadConfig>;
}
export interface PluginAPI {
    config: ReturnType<typeof loadConfig>;
    hooks: typeof hookRegistry;
    commands: typeof commandRegistry;
    agents: typeof agentRegistry;
    mcp: typeof mcpRegistry;
    skills: typeof skillRegistry;
    sdk: typeof sdk;
    context: PluginContext;
}
export declare function createPlugin(cwd?: string, sessionId?: string): PluginAPI;
export declare function getPlugin(): PluginAPI | null;
export declare function reloadPlugin(cwd?: string, sessionId?: string): PluginAPI;
export interface OpenCodePlugin {
    name: string;
    version: string;
    hooks: {
        config?: (input: {
            config: Record<string, unknown>;
        }) => Promise<{
            modifiedConfig?: Record<string, unknown>;
        }>;
        "pre-tool-use"?: (input: {
            toolName: string;
            toolInput: Record<string, unknown>;
        }) => Promise<{
            allow?: boolean;
            modifiedInput?: Record<string, unknown>;
        }>;
        "post-tool-use"?: (input: {
            toolName: string;
            toolInput: Record<string, unknown>;
            toolOutput: unknown;
        }) => Promise<{
            modifiedOutput?: unknown;
        }>;
        "user-prompt-submit"?: (input: {
            prompt: string;
        }) => Promise<{
            modifiedPrompt?: string;
        }>;
        stop?: (input: {
            reason: string;
        }) => Promise<void>;
        "pre-compact"?: (input: {
            trigger: "manual" | "auto";
            customPrompt?: string;
        }) => Promise<{
            modifiedPrompt?: string;
        }>;
        "session-start"?: (input: {
            source: "new" | "resume" | "branch";
            parentSessionId?: string;
        }) => Promise<void>;
        initialize?: (input: {
            callLlm: (call: LlmCall) => Promise<LlmResponse>;
        }) => Promise<void>;
    };
    commands: Record<string, {
        description: string;
        usage?: string;
        handler: (args: string[], flags: Record<string, string | boolean>) => Promise<{
            output?: string;
            error?: string;
        }>;
    }>;
}
export declare function createOpenCodePlugin(cwd?: string, sessionId?: string): OpenCodePlugin;
export { loadConfig, clearConfigCache } from "./config/loader";
export { validateConfig, configSchema } from "./config/schema";
export { hookRegistry } from "./hooks/registry";
export { commandRegistry } from "./commands/registry";
export { loadAllCommands } from "./commands/loader";
export { agentRegistry, loadAllAgents } from "./agents";
export { backgroundAgentManager } from "./agents/background";
export { teamManager } from "./agents/team";
export * from "./agents/types";
export { mcpRegistry, loadMCPConfig, getBuiltinMCPConfigs } from "./mcp";
export * from "./mcp/types";
export { skillRegistry, loadAllSkills } from "./skills";
export * from "./skills/types";
export { remoteControlServer } from "./remote/control";
export { teleportManager } from "./remote/teleport";
export { ideManager } from "./remote/ide";
export { chromeManager } from "./remote/chrome";
export { webSyncManager } from "./remote/sync";
export * from "./remote/types";
export { worktreeManager } from "./git/worktree";
export * from "./git/types";
export { costTracker } from "./cost/tracker";
export * from "./cost/types";
export { authManager } from "./auth/manager";
export * from "./auth/types";
export { buddyPet } from "./buddy/pet";
export * from "./buddy/types";
export { insightsAnalyzer } from "./insights/analyzer";
export * from "./insights/types";
export { loadClaudeCodeCompat, migrateFromClaudeCode, generateMigrationReport, detectClaudeConfig } from "./compat";
export { rootLogger, Logger, LogLevel } from "./utils/logger";
export { PluginError, ConfigError, CommandError, SessionError, ErrorBoundary } from "./utils/errors";
export { memoizer } from "./utils/memoize";
//# sourceMappingURL=index.d.ts.map