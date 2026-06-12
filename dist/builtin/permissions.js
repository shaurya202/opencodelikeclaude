import { commandRegistry } from "../commands/registry";
export const permissionsCommand = {
    name: "permissions",
    description: "Manage permission settings",
    usage: "/permissions [mode|list|add|remove]",
    aliases: ["perms"],
    category: "config",
    arguments: [
        { name: "subcommand", description: "Subcommand: mode, list, add, remove", required: false },
        { name: "args", description: "Subcommand arguments", required: false, variadic: true },
    ],
    handler: async (context) => {
        const { args } = context;
        const subcommand = args[0];
        const subArgs = args.slice(1);
        switch (subcommand) {
            case "mode":
                return {
                    output: `Permission mode: default\nAvailable modes: default, acceptEdits, plan, auto, bypassPermissions`,
                    metadata: { action: "permissions", subcommand: "mode" },
                };
            case "list":
                return {
                    output: "Allowed tools: (none)\nDenied tools: (none)\nRules: (none)",
                    metadata: { action: "permissions", subcommand: "list" },
                };
            case "add":
                return {
                    output: `Adding permission rule: ${subArgs.join(" ")}`,
                    metadata: { action: "permissions", subcommand: "add", args: subArgs },
                };
            case "remove":
                return {
                    output: `Removing permission rule: ${subArgs.join(" ")}`,
                    metadata: { action: "permissions", subcommand: "remove", args: subArgs },
                };
            default:
                return {
                    output: "Usage: /permissions [mode|list|add|remove]",
                    metadata: { action: "permissions", subcommand: "help" },
                };
        }
    },
};
commandRegistry.register({ ...permissionsCommand, source: "builtin" });
//# sourceMappingURL=permissions.js.map