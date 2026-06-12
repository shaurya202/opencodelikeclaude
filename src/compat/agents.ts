import { join } from "path";
import { loadAgentsFromDir } from "../agents/loader";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";

const CLAUDE_AGENT_DIRS = [
  "~/.claude/agents",
  ".claude/agents",
];

export function loadClaudeAgents(cwd: string = process.cwd()): number {
  let count = 0;

  for (const dir of CLAUDE_AGENT_DIRS) {
    const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
    const loaded = loadAgentsFromDir(fullPath, "claude-compat");
    count += loaded;
    if (loaded > 0) {
      rootLogger.info(`Loaded ${loaded} Claude Code agents from ${fullPath}`);
    }
  }

  return count;
}
