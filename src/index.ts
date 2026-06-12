import { loadConfig, clearConfigCache } from "./config/loader";
import { hookRegistry } from "./hooks/registry";
import { commandRegistry } from "./commands/registry";
import { loadAllCommands } from "./commands/loader";
import { agentRegistry, loadAllAgents } from "./agents";
import { mcpRegistry, loadMCPConfig } from "./mcp";
import { skillRegistry, loadAllSkills } from "./skills";
import { loadClaudeCodeCompat } from "./compat";
import { rootLogger } from "./utils/logger";
import { sdk, LlmCall, LlmResponse } from "./sdk";
import { costTracker } from "./cost/tracker";
import {
  ConfigHookInput,
  ConfigHookOutput,
  PreToolUseHookInput,
  PreToolUseHookOutput,
  PostToolUseHookInput,
  PostToolUseHookOutput,
  UserPromptSubmitHookInput,
  UserPromptSubmitHookOutput,
  StopHookInput,
  PreCompactHookInput,
  PreCompactHookOutput,
  SessionStartHookInput
} from "./hooks/types";
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

let pluginInstance: PluginAPI | null = null;

export function createPlugin(cwd: string = process.cwd(), sessionId: string = "default"): PluginAPI {
  rootLogger.info(`Initializing plugin (cwd=${cwd}, session=${sessionId.slice(0, 8)})`);

  const config = loadConfig(cwd);
  sdk.configure(config);

  const commandCount = loadAllCommands(cwd);
  const agentCount = loadAllAgents(cwd);
  loadMCPConfig(cwd);
  const skillCount = loadAllSkills(cwd);

  rootLogger.info(`Loaded ${commandCount} commands, ${agentCount} agents, ${skillCount} skills`);

  const compatResult = loadClaudeCodeCompat(cwd);
  if (Object.values(compatResult).some((v: number) => v > 0)) {
    rootLogger.info(`Claude Code compat loaded: commands=${compatResult.commands}, skills=${compatResult.skills}, agents=${compatResult.agents}, mcp=${compatResult.mcp}, hooks=${compatResult.hooks}, plugins=${compatResult.plugins}`);
  }

  const context: PluginContext = { cwd, sessionId, config };

  const api: PluginAPI = {
    config,
    hooks: hookRegistry,
    commands: commandRegistry,
    agents: agentRegistry,
    mcp: mcpRegistry,
    skills: skillRegistry,
    sdk,
    context,
  };

  pluginInstance = api;

  if (sdk.shouldUseRealImplementations()) {
    sdk.enableNvidiaNim();
    if (process.env.NVIDIA_NIM_API_KEY) {
      rootLogger.info("NVIDIA NIM LLM provider enabled");
    } else {
      rootLogger.warn("useRealImplementations=true but NVIDIA_NIM_API_KEY not set — LLM calls will fail");
    }
  }

  return api;
}

export function getPlugin(): PluginAPI | null {
  return pluginInstance;
}

export function reloadPlugin(cwd?: string, sessionId?: string): PluginAPI {
  clearConfigCache();
  const resolvedCwd = cwd || (pluginInstance?.context.cwd ?? process.cwd());
  const resolvedSessionId = sessionId || (pluginInstance?.context.sessionId ?? "default");
  return createPlugin(resolvedCwd, resolvedSessionId);
}

export interface OpenCodePlugin {
  name: string;
  version: string;
  hooks: {
    config?: (input: { config: Record<string, unknown> }) => Promise<{ modifiedConfig?: Record<string, unknown> }>;
    "pre-tool-use"?: (input: { toolName: string; toolInput: Record<string, unknown> }) => Promise<{ allow?: boolean; modifiedInput?: Record<string, unknown> }>;
    "post-tool-use"?: (input: { toolName: string; toolInput: Record<string, unknown>; toolOutput: unknown }) => Promise<{ modifiedOutput?: unknown }>;
    "user-prompt-submit"?: (input: { prompt: string }) => Promise<{ modifiedPrompt?: string }>;
    stop?: (input: { reason: string }) => Promise<void>;
    "pre-compact"?: (input: { trigger: "manual" | "auto"; customPrompt?: string }) => Promise<{ modifiedPrompt?: string }>;
    "session-start"?: (input: { source: "new" | "resume" | "branch"; parentSessionId?: string }) => Promise<void>;
    initialize?: (input: { callLlm: (call: LlmCall) => Promise<LlmResponse> }) => Promise<void>;
  };
  commands: Record<string, {
    description: string;
    usage?: string;
    handler: (args: string[], flags: Record<string, string | boolean>) => Promise<{ output?: string; error?: string }>;
  }>;
}

function envToRecord(env: NodeJS.ProcessEnv): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

export function createOpenCodePlugin(cwd: string = process.cwd(), sessionId: string = "default"): OpenCodePlugin {
  const plugin = createPlugin(cwd, sessionId);
  const { hooks, commands } = plugin;

  const commandDefs = commands.getAll();
  const commandMap: OpenCodePlugin["commands"] = {};

  for (const cmd of commandDefs) {
    commandMap[cmd.name] = {
      description: cmd.description,
      usage: cmd.usage,
      handler: async (args: string[], flags: Record<string, string | boolean>) => {
        const result = await commands.execute(cmd.name, {
          sessionId,
          cwd,
          args,
          flags,
        });
        return { output: result.output, error: result.error };
      },
    };

    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        commandMap[alias] = commandMap[cmd.name];
      }
    }
  }

  return {
    name: "opencode-claude-parity",
    version: "1.0.0",
    hooks: {
      config: async (input) => {
        let currentConfig = input.config;
        const results = await hooks.dispatch<ConfigHookInput, ConfigHookOutput>("config", {
          sessionId, cwd, env: envToRecord(process.env), config: currentConfig,
        });
        for (const r of results) {
          if (r.modifiedConfig) currentConfig = r.modifiedConfig;
        }
        return { modifiedConfig: currentConfig };
      },
      "pre-tool-use": async (input) => {
        let allow = true;
        let currentInput = input.toolInput;
        const results = await hooks.dispatch<PreToolUseHookInput, PreToolUseHookOutput>("pre-tool-use", {
          sessionId, cwd, env: envToRecord(process.env),
          toolName: input.toolName, toolInput: currentInput,
        });
        for (const r of results) {
          if (r.allow === false) { allow = false; break; }
          if (r.modifiedInput) currentInput = r.modifiedInput;
        }
        return { allow, modifiedInput: currentInput };
      },
      "post-tool-use": async (input) => {
        let currentOutput = input.toolOutput;
        const results = await hooks.dispatch<PostToolUseHookInput, PostToolUseHookOutput>("post-tool-use", {
          sessionId, cwd, env: envToRecord(process.env),
          toolName: input.toolName, toolInput: input.toolInput, toolOutput: currentOutput,
        });
        for (const r of results) {
          if (r.modifiedOutput !== undefined) currentOutput = r.modifiedOutput;
        }
        if (sdk.shouldUseRealImplementations()) {
          const toolOutput = currentOutput as Record<string, unknown> | undefined;
          const usage = toolOutput?.usage as Record<string, number> | undefined;
          if (usage?.inputTokens || usage?.outputTokens) {
            costTracker.record(
              (toolOutput?.model as string) || "opencode/default",
              usage?.inputTokens || 0,
              usage?.outputTokens || 0,
              "tool",
              input.toolName,
            );
          }
        }
        return { modifiedOutput: currentOutput };
      },
      "user-prompt-submit": async (input) => {
        let currentPrompt = input.prompt;
        const results = await hooks.dispatch<UserPromptSubmitHookInput, UserPromptSubmitHookOutput>("user-prompt-submit", {
          sessionId, cwd, env: envToRecord(process.env), prompt: currentPrompt,
        });
        for (const r of results) {
          if (r.modifiedPrompt) currentPrompt = r.modifiedPrompt;
        }
        return { modifiedPrompt: currentPrompt };
      },
      stop: async (input) => {
        await hooks.dispatch<StopHookInput, { message?: string }>("stop", {
          sessionId, cwd, env: envToRecord(process.env), reason: input.reason,
        });
      },
      "pre-compact": async (input) => {
        let currentPrompt = input.customPrompt;
        const results = await hooks.dispatch<PreCompactHookInput, PreCompactHookOutput>("pre-compact", {
          sessionId, cwd, env: envToRecord(process.env),
          trigger: input.trigger, customPrompt: currentPrompt,
        });
        for (const r of results) {
          if (r.modifiedPrompt) currentPrompt = r.modifiedPrompt;
        }
        return { modifiedPrompt: currentPrompt };
      },
      "session-start": async (input) => {
        await hooks.dispatch<SessionStartHookInput, { message?: string }>("session-start", {
          sessionId, cwd, env: envToRecord(process.env),
          source: input.source, parentSessionId: input.parentSessionId,
        });
      },
      initialize: async (input) => {
        sdk.setLlmProvider(input.callLlm);
      },
    },
    commands: commandMap,
  };
}

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
