import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { mcpRegistry } from "../mcp/registry";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";
import { parseJsonc } from "../utils/jsonc";
const CLAUDE_MCP_PATHS = [
    ".mcp.json",
    "~/.claude.json",
    ".claude/.mcp.json",
];
export function loadClaudeMCP(cwd = process.cwd()) {
    let count = 0;
    for (const relPath of CLAUDE_MCP_PATHS) {
        const fullPath = relPath.startsWith("~/") ? expandHome(relPath) : join(cwd, relPath);
        if (existsSync(fullPath)) {
            try {
                const content = readFileSync(fullPath, "utf-8");
                const parsed = parseJsonc(content);
                const mcpServers = parsed.mcpServers;
                if (mcpServers) {
                    for (const [name, server] of Object.entries(mcpServers)) {
                        if (server.disabled)
                            continue;
                        mcpRegistry.registerServer(name, {
                            name,
                            command: server.command,
                            args: server.args,
                            env: server.env,
                        });
                        count++;
                    }
                    if (Object.keys(mcpServers).length > 0) {
                        rootLogger.info(`Loaded ${Object.keys(mcpServers).length} MCP servers from ${fullPath}`);
                    }
                }
            }
            catch (error) {
                rootLogger.warn(`Failed to load MCP config from ${fullPath}: ${error}`);
            }
        }
    }
    return count;
}
export function getClaudeMCPServerPaths(cwd = process.cwd()) {
    const found = [];
    for (const relPath of CLAUDE_MCP_PATHS) {
        const fullPath = relPath.startsWith("~/") ? expandHome(relPath) : join(cwd, relPath);
        if (existsSync(fullPath)) {
            found.push(fullPath);
        }
    }
    return found;
}
//# sourceMappingURL=mcp.js.map