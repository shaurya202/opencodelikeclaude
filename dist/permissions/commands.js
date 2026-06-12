import { commandRegistry } from "../commands/registry";
import { permissionManager } from "./manager";
export const permissionsCommand = {
    name: "permissions",
    description: "Manage permission settings",
    usage: "/permissions [mode|list|add|remove|reset]",
    aliases: ["perms"],
    category: "config",
    arguments: [
        { name: "subcommand", description: "Subcommand: mode, list, add, remove, reset", required: false },
        { name: "args", description: "Subcommand arguments", required: false, variadic: true },
    ],
    handler: async (context) => {
        const { args } = context;
        const subcommand = args[0];
        const subArgs = args.slice(1);
        switch (subcommand) {
            case "mode": {
                if (subArgs.length === 0) {
                    const mode = permissionManager.getMode();
                    return {
                        output: `Current mode: ${mode}\nAvailable modes: default, acceptEdits, plan, auto, bypassPermissions`,
                        metadata: { action: "permissions", subcommand: "mode", current: mode },
                    };
                }
                const mode = subArgs[0];
                const validModes = ["default", "acceptEdits", "plan", "auto", "bypassPermissions"];
                if (!validModes.includes(mode)) {
                    return { error: `Invalid mode: ${mode}. Valid: ${validModes.join(", ")}`, exitCode: 1 };
                }
                permissionManager.setMode(mode);
                return {
                    output: `Permission mode set to: ${mode}`,
                    metadata: { action: "permissions", subcommand: "mode", mode },
                };
            }
            case "list": {
                const config = permissionManager.getConfig();
                let output = `Permission Mode: ${config.defaultMode}\n\n`;
                output += `Allowed Tools: ${config.allowedTools.length > 0 ? config.allowedTools.join(", ") : "(none)"}\n`;
                output += `Denied Tools: ${config.deniedTools.length > 0 ? config.deniedTools.join(", ") : "(none)"}\n\n`;
                if (config.rules.length > 0) {
                    output += "Rules:\n";
                    for (const rule of config.rules) {
                        output += `  ${rule.action === "allow" ? "✅" : "❌"} ${rule.pattern} (${rule.scope})${rule.description ? ` - ${rule.description}` : ""}\n`;
                    }
                }
                else {
                    output += "Rules: (none)\n";
                }
                return { output, metadata: { action: "permissions", subcommand: "list" } };
            }
            case "add": {
                if (subArgs.length < 2) {
                    return { error: "Usage: /permissions add <pattern> <allow|deny> [scope] [description]", exitCode: 1 };
                }
                const pattern = subArgs[0];
                const action = subArgs[1];
                const scope = subArgs[2] || "project";
                const description = subArgs.slice(3).join(" ");
                if (!["allow", "deny"].includes(action)) {
                    return { error: "Action must be 'allow' or 'deny'", exitCode: 1 };
                }
                permissionManager.addRule({ pattern, action, scope, description });
                return {
                    output: `Added rule: ${action} ${pattern} (${scope})`,
                    metadata: { action: "permissions", subcommand: "add", pattern, ruleAction: action, scope },
                };
            }
            case "remove": {
                if (subArgs.length === 0) {
                    return { error: "Pattern required", exitCode: 1 };
                }
                const pattern = subArgs[0];
                const removed = permissionManager.removeRule(pattern);
                if (!removed) {
                    return { error: `Rule not found: ${pattern}`, exitCode: 1 };
                }
                return {
                    output: `Removed rule: ${pattern}`,
                    metadata: { action: "permissions", subcommand: "remove", pattern },
                };
            }
            case "reset": {
                permissionManager.updateConfig({
                    defaultMode: "default",
                    allowedTools: [],
                    deniedTools: [],
                    rules: [],
                });
                return {
                    output: "Permissions reset to defaults",
                    metadata: { action: "permissions", subcommand: "reset" },
                };
            }
            default: {
                const config = permissionManager.getConfig();
                let output = `Permission Mode: ${config.defaultMode}\n`;
                output += `Allowed: ${config.allowedTools.join(", ") || "(none)"}\n`;
                output += `Denied: ${config.deniedTools.join(", ") || "(none)"}\n`;
                output += `Rules: ${config.rules.length}\n\n`;
                output += "Usage: /permissions [mode|list|add|remove|reset]";
                return { output, metadata: { action: "permissions", subcommand: "help" } };
            }
        }
    },
};
commandRegistry.register({ ...permissionsCommand, source: "builtin" });
//# sourceMappingURL=commands.js.map