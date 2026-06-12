import { loadConfig } from "../config/loader";
import { rootLogger } from "../utils/logger";
import { ErrorBoundary } from "../utils/errors";
import { loadClaudeCommands } from "./commands";
import { loadClaudeSkills } from "./skills";
import { loadClaudeAgents } from "./agents";
import { loadClaudeMCP } from "./mcp";
import { loadClaudeHooks } from "./hooks";
import { loadClaudePlugins } from "./plugins";
import { migrateFromClaudeCode, generateMigrationReport } from "./migrate";
import { detectClaudeConfig } from "./settings";
import { MigrationResult, CompatibilityOptions } from "./types";

export interface LoadResult {
  commands: number;
  skills: number;
  agents: number;
  mcp: number;
  hooks: number;
  plugins: number;
}

export function loadClaudeCodeCompat(cwd: string = process.cwd(), compatOverrides?: Partial<CompatibilityOptions>): LoadResult {
  const config = loadConfig(cwd);
  const compat: CompatibilityOptions = {
    commands: config.compatibility?.commands ?? true,
    skills: config.compatibility?.skills ?? true,
    agents: config.compatibility?.agents ?? true,
    mcp: config.compatibility?.mcp ?? true,
    hooks: config.compatibility?.hooks ?? true,
    plugins: config.compatibility?.plugins ?? true,
    ...compatOverrides,
  };

  const result: LoadResult = {
    commands: 0,
    skills: 0,
    agents: 0,
    mcp: 0,
    hooks: 0,
    plugins: 0,
  };

  if (compat.commands) {
    ErrorBoundary.wrap(() => {
      result.commands = loadClaudeCommands(cwd);
      return Promise.resolve();
    }, { componentName: "CompatCommands" });
  }

  if (compat.skills) {
    ErrorBoundary.wrap(() => {
      result.skills = loadClaudeSkills(cwd);
      return Promise.resolve();
    }, { componentName: "CompatSkills" });
  }

  if (compat.agents) {
    ErrorBoundary.wrap(() => {
      result.agents = loadClaudeAgents(cwd);
      return Promise.resolve();
    }, { componentName: "CompatAgents" });
  }

  if (compat.mcp) {
    ErrorBoundary.wrap(() => {
      result.mcp = loadClaudeMCP(cwd);
      return Promise.resolve();
    }, { componentName: "CompatMCP" });
  }

  if (compat.hooks) {
    ErrorBoundary.wrap(() => {
      result.hooks = loadClaudeHooks(cwd);
      return Promise.resolve();
    }, { componentName: "CompatHooks" });
  }

  if (compat.plugins) {
    ErrorBoundary.wrap(() => {
      result.plugins = loadClaudePlugins(cwd);
      return Promise.resolve();
    }, { componentName: "CompatPlugins" });
  }

  const total = Object.values(result).reduce((sum: number, v: number) => sum + v, 0);
  if (total > 0) {
    rootLogger.info(`Claude Code compat loaded: ${JSON.stringify(result)}`);
  }

  return result;
}

export function getCompatSummary(cwd: string = process.cwd()): {
  detection: ReturnType<typeof detectClaudeConfig>;
  compat: LoadResult;
  migration: MigrationResult;
} {
  const detection = detectClaudeConfig(cwd);
  const compat = loadClaudeCodeCompat(cwd, {
    commands: false,
    skills: false,
    agents: false,
    mcp: false,
    hooks: false,
    plugins: false,
  });
  const migration = migrateFromClaudeCode({ cwd, dryRun: true });

  return { detection, compat, migration };
}

export { migrateFromClaudeCode, generateMigrationReport, detectClaudeConfig };
export type { MigrationResult, CompatibilityOptions } from "./types";
