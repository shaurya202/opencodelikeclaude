import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { ClaudeCodeSettings } from "./types";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";

const CLAUDE_SETTINGS_PATHS = [
  ".claude/settings.json",
  "~/.claude/settings.json",
];

function resolvePath(cwd: string, relPath: string): string {
  return relPath.startsWith("~/") ? expandHome(relPath) : join(cwd, relPath);
}

export function loadClaudeSettings(cwd: string = process.cwd()): ClaudeCodeSettings | null {
  for (const relPath of CLAUDE_SETTINGS_PATHS) {
    const fullPath = resolvePath(cwd, relPath);
    if (existsSync(fullPath)) {
      try {
        const content = readFileSync(fullPath, "utf-8");
        const parsed = JSON.parse(content);
        rootLogger.info(`Loaded Claude Code settings from ${fullPath}`);
        return parsed as ClaudeCodeSettings;
      } catch (error) {
        rootLogger.warn(`Failed to parse Claude Code settings at ${fullPath}: ${error}`);
      }
    }
  }
  return null;
}

export function detectClaudeConfig(cwd: string = process.cwd()): {
  hasSettings: boolean;
  hasCommands: boolean;
  hasSkills: boolean;
  hasAgents: boolean;
  hasMcp: boolean;
  settingsPath?: string;
} {
  const result = {
    hasSettings: false,
    hasCommands: false,
    hasSkills: false,
    hasAgents: false,
    hasMcp: false,
    settingsPath: undefined as string | undefined,
  };

  for (const relPath of CLAUDE_SETTINGS_PATHS) {
    const fullPath = resolvePath(cwd, relPath);
    if (existsSync(fullPath)) {
      result.hasSettings = true;
      result.settingsPath = fullPath;
      break;
    }
  }

  const claudeDirs = [
    ".claude/commands",
    "~/.claude/commands",
    ".claude/skills",
    "~/.claude/skills",
    ".claude/agents",
    "~/.claude/agents",
  ];

  for (const dir of claudeDirs) {
    const fullPath = resolvePath(cwd, dir);
    if (existsSync(fullPath)) {
      if (dir.includes("commands")) result.hasCommands = true;
      if (dir.includes("skills")) result.hasSkills = true;
      if (dir.includes("agents")) result.hasAgents = true;
    }
  }

  const mcpPaths = [".mcp.json", ".claude/.mcp.json", "~/.claude.json"];
  for (const relPath of mcpPaths) {
    const fullPath = resolvePath(cwd, relPath);
    if (existsSync(fullPath)) {
      result.hasMcp = true;
      break;
    }
  }

  return result;
}
