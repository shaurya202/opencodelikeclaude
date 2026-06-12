import { existsSync } from "fs";
import { join } from "path";
import { loadCommandsFromDir } from "../commands/loader";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";

const CLAUDE_COMMAND_DIRS = [
  "~/.claude/commands",
  ".claude/commands",
];

export function detectClaudeCommands(cwd: string = process.cwd()): string[] {
  const found: string[] = [];

  for (const dir of CLAUDE_COMMAND_DIRS) {
    const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
    if (existsSync(fullPath)) {
      found.push(fullPath);
    }
  }

  return found;
}

export function loadClaudeCommands(cwd: string = process.cwd()): number {
  let count = 0;

  for (const dir of CLAUDE_COMMAND_DIRS) {
    const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
    const loaded = loadCommandsFromDir(fullPath, "claude-compat");
    count += loaded;
    if (loaded > 0) {
      rootLogger.info(`Loaded ${loaded} Claude Code commands from ${fullPath}`);
    }
  }

  return count;
}
