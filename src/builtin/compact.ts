import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";

export const compactCommand: CommandDefinition = {
  name: "compact",
  description: "Compact the conversation history",
  usage: "/compact [focus]",
  aliases: [],
  category: "session",
  arguments: [
    { name: "focus", description: "Focus area for compaction (optional)", required: false },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args } = context;
    const focus = args.join(" ");
    
    return {
      output: `Compacting conversation${focus ? ` with focus: ${focus}` : ""}...`,
      metadata: { action: "compact", focus },
    };
  },
};

commandRegistry.register({ ...compactCommand, source: "builtin" });