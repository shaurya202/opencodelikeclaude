import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { exportSession, listExports } from "../session/persistence";

export const exportCommand: CommandDefinition = {
  name: "export",
  description: "Export conversation to markdown or JSON",
  usage: "/export [--session <id>] [--format <json|markdown>] [--file <path>] [--list]",
  aliases: ["ex"],
  category: "session",
  flags: [
    { name: "session", short: "s", description: "Session ID to export (default: current)", type: "string" },
    { name: "format", short: "f", description: "Export format (json, markdown)", type: "string" },
    { name: "file", short: "o", description: "Output file path", type: "string" },
    { name: "list", short: "l", description: "List previous exports", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags } = context;

    if (flags.list) {
      const exports = listExports();
      if (exports.length === 0) return { output: "No previous exports found." };
      let output = "Previous exports:\n\n";
      for (const f of exports) {
        output += `  ${f}\n`;
      }
      return { output };
    }

    const sessionId = (flags.session as string) || context.sessionId;
    const format = (flags.format as "json" | "markdown") || "markdown";

    const filepath = exportSession(sessionId, format);
    if (!filepath) {
      return { error: `Session "${sessionId.slice(0, 8)}" not found`, exitCode: 1 };
    }

    return { output: `Exported session ${sessionId.slice(0, 8)} to ${format} format\nFile: ${filepath}` };
  },
};

commandRegistry.register({ ...exportCommand, source: "builtin" });
