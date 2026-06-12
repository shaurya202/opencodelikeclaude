import { commandRegistry } from "../commands/registry";
export const copyCommand = {
    name: "copy",
    description: "Copy conversation content to clipboard",
    usage: "/copy [N|last|all] [--session <id>]",
    aliases: ["cp"],
    category: "session",
    flags: [
        { name: "session", short: "s", description: "Session ID", type: "string" },
        { name: "last", short: "l", description: "Copy last message", type: "boolean" },
        { name: "all", short: "a", description: "Copy all messages", type: "boolean" },
    ],
    handler: async (context) => {
        const { args, flags } = context;
        let target = "last";
        if (flags.last)
            target = "last";
        else if (flags.all)
            target = "all";
        else if (args[0])
            target = args[0];
        const index = target === "all" ? -1 : target === "last" ? -1 : parseInt(target, 10);
        const description = index === -1 && target === "all"
            ? "all messages"
            : index === -1
                ? "last message"
                : `code block #${index}`;
        return {
            output: `Copied ${description} to clipboard`,
            metadata: { action: "copy", target },
        };
    },
};
commandRegistry.register({ ...copyCommand, source: "builtin" });
//# sourceMappingURL=copy.js.map