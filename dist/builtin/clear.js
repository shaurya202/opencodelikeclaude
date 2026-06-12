import { commandRegistry } from "../commands/registry";
export const clearCommand = {
    name: "clear",
    description: "Start a new conversation, preserving the old one",
    usage: "/clear [name]",
    aliases: [],
    category: "session",
    arguments: [
        { name: "name", description: "Optional name for the new conversation", required: false },
    ],
    handler: async (context) => {
        const { args } = context;
        const name = args[0];
        return {
            output: `Starting new conversation${name ? ` named "${name}"` : ""}...`,
            metadata: { action: "clear", name },
        };
    },
};
commandRegistry.register({ ...clearCommand, source: "builtin" });
//# sourceMappingURL=clear.js.map