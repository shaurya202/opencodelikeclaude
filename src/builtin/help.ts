import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";

export const helpCommand: CommandDefinition = {
  name: "help",
  description: "Show help for commands",
  usage: "/help [command]",
  aliases: ["h", "?"],
  category: "core",
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const commands = commandRegistry.getVisible();
    const { args } = context;

    if (args.length > 0) {
      const cmdName = args[0];
      const command = commandRegistry.get(cmdName);
      
      if (!command) {
        return {
          error: `Command not found: ${cmdName}`,
          exitCode: 1,
        };
      }

      let output = `${command.name}`;
      if (command.aliases?.length) {
        output += ` (${command.aliases.join(", ")})`;
      }
      output += `\n${command.description}\n`;
      
      if (command.usage) {
        output += `\nUsage: ${command.usage}\n`;
      }
      
      if (command.flags?.length) {
        output += "\nFlags:\n";
        for (const flag of command.flags) {
          const short = flag.short ? `-${flag.short}, ` : "    ";
          const req = flag.required ? " (required)" : "";
          output += `  ${short}--${flag.name}${req}: ${flag.description}\n`;
        }
      }
      
      if (command.arguments?.length) {
        output += "\nArguments:\n";
        for (const arg of command.arguments) {
          const req = arg.required ? " (required)" : arg.variadic ? " (variadic)" : "";
          output += `  ${arg.name}${req}: ${arg.description}\n`;
        }
      }

      return { output };
    }

    const categories = new Map<string, typeof commands>();
    for (const cmd of commands) {
      const cat = cmd.category || "other";
      if (!categories.has(cat)) {
        categories.set(cat, []);
      }
      categories.get(cat)!.push(cmd);
    }

    let output = "Available commands:\n\n";
    for (const [cat, cmds] of categories) {
      output += `=== ${cat.toUpperCase()} ===\n`;
      for (const cmd of cmds) {
        const aliases = cmd.aliases?.length ? ` (${cmd.aliases.join(", ")})` : "";
        output += `  /${cmd.name}${aliases}: ${cmd.description}\n`;
      }
      output += "\n";
    }
    output += "Run /help <command> for detailed usage.";

    return { output };
  },
};

commandRegistry.register({ ...helpCommand, source: "builtin" });