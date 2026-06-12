import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { configSchema, Config, validateConfig } from "./schema";
import { defaultConfig } from "./defaults";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";
import { parseJsonc } from "../utils/jsonc";

const CONFIG_PATHS = [
  ".opencode/opencode-claude-parity.jsonc",
  ".opencode/opencode-claude-parity.json",
  "~/.config/opencode/opencode-claude-parity.jsonc",
  "~/.config/opencode/opencode-claude-parity.json",
];

function findConfigFile(cwd: string): string | null {
  for (const relPath of CONFIG_PATHS) {
    const fullPath = relPath.startsWith("~/") ? expandHome(relPath) : join(cwd, relPath);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

function mergeConfig(defaults: Config, user: Partial<Config>): Config {
  return {
    $schema: user.$schema,
    compatibility: { ...defaults.compatibility, ...user.compatibility },
    agents: { ...defaults.agents, ...user.agents },
    categories: { ...defaults.categories, ...user.categories },
    permissions: { ...defaults.permissions, ...user.permissions },
    mcp: { ...defaults.mcp, ...user.mcp, builtin: { ...defaults.mcp.builtin, ...user.mcp?.builtin } },
    skills: { ...defaults.skills, ...user.skills, builtin: { ...defaults.skills.builtin, ...user.skills?.builtin } },
    hooks: { ...defaults.hooks, ...user.hooks },
    ui: { ...defaults.ui, ...user.ui },
    background: { ...defaults.background, ...user.background },
    experimental: {
      ...defaults.experimental,
      ...user.experimental,
      goal: { ...defaults.experimental.goal, ...user.experimental?.goal },
      loop: { ...defaults.experimental.loop, ...user.experimental?.loop },
      review: { ...defaults.experimental.review, ...user.experimental?.review },
      thinkMode: { ...defaults.experimental.thinkMode, ...user.experimental?.thinkMode },
      keywordDetector: { ...defaults.experimental.keywordDetector, ...user.experimental?.keywordDetector },
    },
    cost: { ...defaults.cost, ...user.cost },
    remote: {
      ...defaults.remote,
      ...user.remote,
      control: { ...defaults.remote.control, ...user.remote?.control },
      teleport: { ...defaults.remote.teleport, ...user.remote?.teleport },
      ide: { ...defaults.remote.ide, ...user.remote?.ide },
      chrome: { ...defaults.remote.chrome, ...user.remote?.chrome },
      sync: { ...defaults.remote.sync, ...user.remote?.sync },
    },
  };
}

let _configCache: { cwd: string; config: Config; timestamp: number } | null = null;
const CACHE_TTL = 5000;

export function loadConfig(cwd: string = process.cwd()): Config {
  if (_configCache && _configCache.cwd === cwd && Date.now() - _configCache.timestamp < CACHE_TTL) {
    return _configCache.config;
  }

  const config = _loadConfig(cwd);
  _configCache = { cwd, config, timestamp: Date.now() };
  return config;
}

export function clearConfigCache(): void {
  _configCache = null;
  rootLogger.debug("Config cache cleared");
}

function _loadConfig(cwd: string): Config {
  const configPath = findConfigFile(cwd);

  if (!configPath) {
    rootLogger.debug("No config file found, using defaults");
    return defaultConfig;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = parseJsonc<Record<string, unknown>>(content);

    const validation = validateConfig(parsed);
    if (!validation.success) {
      rootLogger.warn(`Config validation failed for ${configPath}:\n${validation.error}`);
      rootLogger.info("Falling back to default config");
      return defaultConfig;
    }

    rootLogger.info(`Loaded config from ${configPath}`);
    return mergeConfig(defaultConfig, validation.data);
  } catch (error) {
    rootLogger.warn(`Failed to load config from ${configPath}: ${error}`);
    return defaultConfig;
  }
}

export { configSchema, defaultConfig };
export type { Config } from "./schema";
