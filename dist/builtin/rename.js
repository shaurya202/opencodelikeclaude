import { commandRegistry } from "../commands/registry";
import { sessionManager } from "../session/manager";
import { renameSession, autoNameSession } from "../session/naming";
export const renameCommand = {
    name: "rename",
    description: "Rename the current session",
    usage: "/rename [name] [--auto]",
    aliases: ["rn"],
    category: "session",
    flags: [
        { name: "auto", description: "Auto-generate name from first message", type: "boolean", default: false },
    ],
    arguments: [
        { name: "name", description: "New session name (optional with --auto)", required: false },
    ],
    handler: async (context) => {
        const { args, flags } = context;
        const session = sessionManager.getCurrentSession();
        if (!session) {
            return { error: "No active session", exitCode: 1 };
        }
        if (flags.auto) {
            const result = autoNameSession(session.metadata.id);
            if (!result.success) {
                return { error: result.error, exitCode: 1 };
            }
            return { output: `Auto-renamed session to: ${result.name}` };
        }
        if (!args[0]) {
            return { error: "Name required (or use --auto)", exitCode: 1 };
        }
        const result = renameSession(session.metadata.id, args[0]);
        if (!result.success) {
            return { error: result.error, exitCode: 1 };
        }
        return { output: `Renamed session to: ${result.name}` };
    },
};
commandRegistry.register({ ...renameCommand, source: "builtin" });
//# sourceMappingURL=rename.js.map