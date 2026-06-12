import { commandRegistry } from "../commands/registry";
export const hooksCommand = {
    name: "hooks",
    description: "Manage hooks",
    usage: "/hooks [list|enable|disable]",
    aliases: [],
    category: "config",
    arguments: [
        { name: "subcommand", description: "Subcommand: list, enable, disable", required: false },
        { name: "args", description: "Hook names", required: false, variadic: true },
    ],
    handler: async (context) => {
        const { args } = context;
        const subcommand = args[0];
        switch (subcommand) {
            case "list":
                return { output: "Hooks: pre-tool-use, post-tool-use, user-prompt-submit, stop, pre-compact, session-start, chat.message, chat.params, permission.ask, tool.execute.before, tool.execute.after, text.complete, session.compacting", metadata: { action: "hooks", subcommand: "list" } };
            case "enable":
                return { output: `Enabling hooks: ${args.slice(1).join(", ")}`, metadata: { action: "hooks", subcommand: "enable" } };
            case "disable":
                return { output: `Disabling hooks: ${args.slice(1).join(", ")}`, metadata: { action: "hooks", subcommand: "disable" } };
            default:
                return { output: "Usage: /hooks [list|enable|disable]", metadata: { action: "hooks", subcommand: "help" } };
        }
    },
};
commandRegistry.register({ ...hooksCommand, source: "builtin" });
//# sourceMappingURL=hooks.js.map