import { commandRegistry } from "../commands/registry";
export const mcpCommand = {
    name: "mcp",
    description: "Manage MCP servers",
    usage: "/mcp [list|add|remove|get]",
    aliases: [],
    category: "config",
    arguments: [
        { name: "subcommand", description: "Subcommand: list, add, remove, get", required: false },
        { name: "args", description: "Subcommand arguments", required: false, variadic: true },
    ],
    handler: async (context) => {
        const { args } = context;
        const subcommand = args[0];
        switch (subcommand) {
            case "list":
                return { output: "MCP Servers:\n  Built-in: websearch, context7, grepApp, lsp, astGrep\n  Custom: (none)", metadata: { action: "mcp", subcommand: "list" } };
            case "add":
                return { output: `Adding MCP server: ${args.slice(1).join(" ")}`, metadata: { action: "mcp", subcommand: "add" } };
            case "remove":
                return { output: `Removing MCP server: ${args.slice(1).join(" ")}`, metadata: { action: "mcp", subcommand: "remove" } };
            case "get":
                return { output: `Getting MCP server: ${args.slice(1).join(" ")}`, metadata: { action: "mcp", subcommand: "get" } };
            default:
                return { output: "Usage: /mcp [list|add|remove|get]", metadata: { action: "mcp", subcommand: "help" } };
        }
    },
};
commandRegistry.register({ ...mcpCommand, source: "builtin" });
//# sourceMappingURL=mcp.js.map