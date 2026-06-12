import { commandRegistry } from "../commands/registry";
import { sessionManager } from "../session/manager";
export const contextCommand = {
    name: "context",
    description: "View session context and token usage",
    usage: "/context [--all]",
    aliases: ["ctx"],
    category: "session",
    flags: [
        { name: "all", short: "a", description: "Show full message history", type: "boolean", default: false },
    ],
    handler: async (context) => {
        const { flags } = context;
        const session = sessionManager.getCurrentSession();
        if (!session) {
            return { error: "No active session", exitCode: 1 };
        }
        const showAll = flags.all;
        const messages = session.messages;
        const displayMessages = showAll ? messages : messages.slice(-20);
        let output = `Session: ${session.metadata.name || session.metadata.id.slice(0, 8)}\n`;
        output += `Messages: ${session.metadata.messageCount} (showing ${displayMessages.length})\n`;
        output += `Tokens: ${session.metadata.tokenUsage.input} in / ${session.metadata.tokenUsage.output} out\n`;
        output += `Checkpoints: ${session.checkpoints.length}\n\n`;
        if (displayMessages.length > 0) {
            output += "Recent messages:\n";
            for (const msg of displayMessages) {
                const role = msg.role === "user" ? "👤" : msg.role === "assistant" ? "🤖" : "⚙️";
                const preview = msg.content.slice(0, 100).replace(/\n/g, " ");
                output += `  ${role} ${preview}${msg.content.length > 100 ? "..." : ""}\n`;
            }
        }
        return { output };
    },
};
commandRegistry.register({ ...contextCommand, source: "builtin" });
//# sourceMappingURL=context.js.map