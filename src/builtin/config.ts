import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { loadConfig } from "../config/loader";

export const configCommand: CommandDefinition = {
  name: "config",
  description: "View or edit configuration",
  usage: "/config [get|set|edit] [key] [value]",
  aliases: ["cfg"],
  category: "config",
  arguments: [
    { name: "subcommand", description: "Subcommand: get, set, edit", required: false },
    { name: "key", description: "Config key (dot notation)", required: false },
    { name: "value", description: "Value to set", required: false },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, cwd } = context;
    const subcommand = args[0];
    const key = args[1];
    const value = args[2];
    const config = loadConfig(cwd);
    
    switch (subcommand) {
      case "get": {
        if (!key) {
          return { output: JSON.stringify(config, null, 2), metadata: { action: "config", subcommand: "get" } };
        }
        const keys = key.split(".");
        let val: unknown = config;
        for (const k of keys) {
          val = (val as Record<string, unknown>)?.[k];
        }
        return { output: JSON.stringify(val, null, 2), metadata: { action: "config", subcommand: "get", key } };
      }
      case "set":
        return { output: `Set ${key} = ${value} (not persisted)`, metadata: { action: "config", subcommand: "set", key, value } };
      case "edit":
        return { output: "Opening config in editor... (not implemented)", metadata: { action: "config", subcommand: "edit" } };
      default:
        return { output: JSON.stringify(config, null, 2), metadata: { action: "config", subcommand: "show" } };
    }
  },
};

commandRegistry.register({ ...configCommand, source: "builtin" });