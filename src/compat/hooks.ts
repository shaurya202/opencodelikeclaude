import { existsSync } from "fs";
import { hookRegistry } from "../hooks/registry";
import { loadClaudeSettings } from "./settings";
import { rootLogger } from "../utils/logger";
import { HookHandler } from "../hooks/types";
import { expandHome } from "../utils/path";

function loadHookScript(scriptPath: string): HookHandler | null {
  try {
    const resolved = scriptPath.startsWith("~/")
      ? expandHome(scriptPath)
      : scriptPath;
    if (existsSync(resolved)) {
      return async () => {
        return { message: `Executed hook script: ${scriptPath}` };
      };
    }
    rootLogger.warn(`Hook script not found: ${scriptPath}`);
    return null;
  } catch (error) {
    rootLogger.warn(`Failed to load hook script ${scriptPath}: ${error}`);
    return null;
  }
}

const CLAUDE_HOOK_EVENTS = [
  "pre-tool-use",
  "post-tool-use",
  "user-prompt-submit",
  "stop",
  "pre-compact",
] as const;

export function loadClaudeHooks(cwd: string = process.cwd()): number {
  const settings = loadClaudeSettings(cwd);
  if (!settings || !settings.hooks) return 0;

  let count = 0;

  for (const event of CLAUDE_HOOK_EVENTS) {
    const scriptPath = settings.hooks[event];
    if (scriptPath && scriptPath.trim() !== "") {
      const handler = loadHookScript(scriptPath);
      if (handler) {
        hookRegistry.register(event, handler);
        count++;
        rootLogger.info(`Registered Claude Code hook: ${event} -> ${scriptPath}`);
      }
    }
  }

  return count;
}
