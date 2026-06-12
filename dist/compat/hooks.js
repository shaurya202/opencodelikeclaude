import { existsSync } from "fs";
import { hookRegistry } from "../hooks/registry";
import { loadClaudeSettings } from "./settings";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";
function loadHookScript(scriptPath) {
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
    }
    catch (error) {
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
];
export function loadClaudeHooks(cwd = process.cwd()) {
    const settings = loadClaudeSettings(cwd);
    if (!settings || !settings.hooks)
        return 0;
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
//# sourceMappingURL=hooks.js.map