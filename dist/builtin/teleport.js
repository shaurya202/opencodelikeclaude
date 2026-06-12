import { commandRegistry } from "../commands/registry";
import { teleportManager } from "../remote/teleport";
export const teleportCommand = {
    name: "teleport",
    description: "Pull web sessions into the terminal",
    usage: "/teleport <url> [--session <name>] [list|remove|push <session> <content>|clear]",
    aliases: ["tp"],
    category: "remote",
    flags: [
        { name: "list", short: "l", description: "List teleported sessions", type: "boolean" },
        { name: "get", short: "g", description: "Get teleported session by ID", type: "string" },
        { name: "remove", short: "r", description: "Remove session by ID", type: "string" },
        { name: "push", short: "p", description: "Push content to web session", type: "string" },
        { name: "source", short: "s", description: "Source client name", type: "string" },
        { name: "clear", short: "c", description: "Clear all sessions", type: "boolean" },
        { name: "fetch", short: "f", description: "Fetch from web URL", type: "string" },
    ],
    handler: async (context) => {
        const { args, flags } = context;
        if (flags.list) {
            const sessions = teleportManager.getAllSessions();
            if (sessions.length === 0)
                return { output: "No teleported sessions. Use /teleport <url> to import one." };
            let output = "Teleported sessions:\n\n";
            for (const s of sessions) {
                output += `  ${s.id.slice(0, 8)}: ${s.title}\n`;
                output += `    Source: ${s.source}  Messages: ${s.messages}  Imported: ${new Date(s.importedAt).toLocaleString()}\n`;
            }
            return { output };
        }
        if (flags.get) {
            const session = teleportManager.getSession(flags.get);
            if (!session)
                return { error: "Session not found", exitCode: 1 };
            return {
                output: `Session: ${session.title}\nURL: ${session.url}\nSource: ${session.source}\nMessages: ${session.messages}\nImported: ${new Date(session.importedAt).toLocaleString()}\n\nContent preview:\n${session.content.slice(0, 500)}${session.content.length > 500 ? "..." : ""}`,
            };
        }
        if (flags.remove) {
            const found = teleportManager.removeSession(flags.remove);
            return { output: found ? "Session removed" : "Session not found" };
        }
        if (flags.clear) {
            teleportManager.clearSessions();
            return { output: "All teleported sessions cleared" };
        }
        if (flags.fetch) {
            const result = await teleportManager.fetchFromWeb(flags.fetch);
            return { output: `Fetched: ${result.title}\n\n${result.content.slice(0, 1000)}${result.content.length > 1000 ? "..." : ""}` };
        }
        if (flags.push) {
            const [sessionId, ...contentParts] = flags.push.split(" ");
            const content = contentParts.join(" ");
            if (!sessionId || !content) {
                return { error: "Usage: --push '<sessionId> <content>'", exitCode: 1 };
            }
            const result = await teleportManager.pushToWeb(sessionId, content);
            return { output: result };
        }
        const url = args.join(" ");
        if (!url) {
            return { output: "Usage: /teleport <url> [--source <name>]\nUse /teleport --list to see imported sessions." };
        }
        const session = await teleportManager.importSession(url, flags.source || undefined);
        return { output: `Session imported: ${session.title}\nID: ${session.id.slice(0, 8)}\nSource: ${session.source}\nURL: ${url}\n\nUse /teleport --get ${session.id.slice(0, 8)} to view details.` };
    },
};
commandRegistry.register({ ...teleportCommand, source: "builtin" });
//# sourceMappingURL=teleport.js.map