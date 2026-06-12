import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";

export const resumeCommand: CommandDefinition = {
  name: "resume",
  description: "Resume a previous session",
  usage: "/resume [session-id]",
  aliases: [],
  category: "session",
  arguments: [
    { name: "session-id", description: "Session ID to resume (optional, shows picker if omitted)", required: false },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args } = context;
    const sessionId = args[0];
    
    return {
      output: sessionId ? `Resuming session ${sessionId}...` : "Opening session picker...",
      metadata: { action: "resume", sessionId },
    };
  },
};

commandRegistry.register({ ...resumeCommand, source: "builtin" });