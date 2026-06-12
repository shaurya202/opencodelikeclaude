import { commandRegistry } from "../commands/registry";
import { sessionManager } from "../session/manager";
import { loadConfig } from "../config/loader";
import { costTracker } from "../cost/tracker";
import { authManager } from "../auth/manager";
import { detectClaudeConfig } from "../compat/settings";
export const statusCommand = {
    name: "status",
    description: "Show session and system status",
    usage: "/status [--full]",
    aliases: ["st"],
    category: "session",
    flags: [
        { name: "full", short: "f", description: "Show detailed status", type: "boolean" },
    ],
    handler: async (context) => {
        const { cwd, flags } = context;
        const config = loadConfig(cwd);
        const current = sessionManager.getCurrentSession();
        const allSessions = sessionManager.listSessions();
        const summary = costTracker.getSummary();
        const isLoggedIn = authManager.isLoggedIn();
        const authSession = authManager.getSession();
        let output = "System Status:\n";
        output += `  Session: ${current ? current.metadata.id.slice(0, 8) : "none"} (${allSessions.length} total)\n`;
        if (current) {
            output += `  Messages: ${current.metadata.messageCount}\n`;
            output += `  Tokens: ${current.metadata.tokenUsage.input.toLocaleString()} in / ${current.metadata.tokenUsage.output.toLocaleString()} out\n`;
        }
        output += `\n  Model: ${config.agents.orchestrator?.model || "anthropic/claude-sonnet-4-5"}\n`;
        output += `  Permission mode: ${config.permissions.defaultMode}\n`;
        output += `  Theme: ${config.ui.theme}\n`;
        output += `\n  Cost: ${costTracker.formatCost(summary.totalCost)} (${summary.totalTokens.total.toLocaleString()} tokens)\n`;
        output += `  Auth: ${isLoggedIn ? `logged in as ${authSession?.displayName}` : "not logged in"}\n`;
        if (flags.full) {
            const detect = detectClaudeConfig(cwd);
            const compatParts = [];
            if (detect.hasSettings)
                compatParts.push("settings");
            if (detect.hasCommands)
                compatParts.push("commands");
            if (detect.hasSkills)
                compatParts.push("skills");
            if (detect.hasAgents)
                compatParts.push("agents");
            if (detect.hasMcp)
                compatParts.push("mcp");
            if (compatParts.length > 0) {
                output += `  Claude Code compat: ${compatParts.join(", ")}\n`;
            }
            else {
                output += `  Claude Code compat: none detected\n`;
            }
        }
        if (flags.full) {
            output += `\n  UI: vim=${config.ui.vimMode}, voice=${config.ui.voiceEnabled}, fast=${config.experimental.aggressiveTruncation}\n`;
            output += `  Diff style: ${config.ui.diffStyle}\n`;
            output += `  Scroll speed: ${config.ui.scrollSpeed}/10, acceleration: ${config.ui.scrollAcceleration}\n`;
            if (current) {
                output += `\n  Session created: ${current.metadata.createdAt.toLocaleString()}\n`;
                output += `  Last updated: ${current.metadata.updatedAt.toLocaleString()}\n`;
                if (current.metadata.branchName)
                    output += `  Branch: ${current.metadata.branchName}\n`;
            }
        }
        return { output, metadata: { action: "status" } };
    },
};
commandRegistry.register({ ...statusCommand, source: "builtin" });
//# sourceMappingURL=status.js.map