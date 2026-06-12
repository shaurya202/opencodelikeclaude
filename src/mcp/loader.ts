import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { MCPServerConfig, BuiltinMCPConfig } from "./types";
import { loadConfig } from "../config/loader";
import { expandHome } from "../utils/path";
import { parseJsonc } from "../utils/jsonc";

const MCP_CONFIG_PATHS = [
  ".mcp.json",
  "~/.claude.json",
  ".claude/.mcp.json",
];

interface MCPConfigFile {
  mcpServers?: Record<string, { command: string; args?: string[]; env?: Record<string, string> }>;
}

export function loadMCPConfig(cwd: string = process.cwd()): {
  builtin: BuiltinMCPConfig;
  servers: Record<string, MCPServerConfig>;
} {
  const config = loadConfig(cwd);
  const mcpConfig = config.mcp;

  // Load from .mcp.json files
  const fileServers: Record<string, MCPServerConfig> = {};
  
  for (const relPath of MCP_CONFIG_PATHS) {
    const fullPath = relPath.startsWith("~/") ? expandHome(relPath) : join(cwd, relPath);
    if (existsSync(fullPath)) {
      try {
        const content = readFileSync(fullPath, "utf-8");
        const parsed = parseJsonc<MCPConfigFile>(content);
        if (parsed.mcpServers) {
          for (const [name, serverConfig] of Object.entries(parsed.mcpServers)) {
            fileServers[name] = { name, ...serverConfig };
          }
        }
      } catch (error) {
        console.warn(`[MCPLoader] Failed to load ${fullPath}:`, error);
      }
    }
  }

  const mergedServers: Record<string, MCPServerConfig> = {};
  for (const [name, config] of Object.entries(mcpConfig.servers)) {
    mergedServers[name] = { name, ...config } as MCPServerConfig;
  }
  for (const [name, config] of Object.entries(fileServers)) {
    mergedServers[name] = config;
  }

  return {
    builtin: mcpConfig.builtin,
    servers: mergedServers,
  };
}

export function getBuiltinMCPConfigs(builtin: BuiltinMCPConfig): Record<string, MCPServerConfig> {
  const configs: Record<string, MCPServerConfig> = {};

  if (builtin.websearch) {
    configs.websearch = {
      name: "websearch",
      command: "npx",
      args: ["-y", "@exa-ai/mcp-server"],
      env: { EXA_API_KEY: process.env.EXA_API_KEY || "" },
    };
  }

  if (builtin.context7) {
    configs.context7 = {
      name: "context7",
      command: "npx",
      args: ["-y", "@context7/mcp-server"],
    };
  }

  if (builtin.grepApp) {
    configs.grepApp = {
      name: "grepApp",
      command: "npx",
      args: ["-y", "@grep-app/mcp-server"],
      env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN || "" },
    };
  }

  if (builtin.lsp) {
    configs.lsp = {
      name: "lsp",
      command: "npx",
      args: ["-y", "@opencode/lsp-mcp"],
    };
  }

  if (builtin.astGrep) {
    configs.astGrep = {
      name: "astGrep",
      command: "npx",
      args: ["-y", "@opencode/ast-grep-mcp"],
    };
  }

  return configs;
}