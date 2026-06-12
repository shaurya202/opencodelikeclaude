import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { createBranch } from "../session/branching";
import { sessionManager } from "../session/manager";

export const branchCommand: CommandDefinition = {
  name: "branch",
  description: "Create a new branch from the current session",
  usage: "/branch [name] [--from-checkpoint <id>] [--from-message <index>]",
  aliases: ["br"],
  category: "session",
  flags: [
    { name: "from-checkpoint", description: "Checkpoint ID to branch from", type: "string" },
    { name: "from-message", description: "Message index to branch from", type: "number" },
  ],
  arguments: [
    { name: "name", description: "Branch name (optional)", required: false },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;
    const session = sessionManager.getCurrentSession();
    
    if (!session) {
      return { error: "No active session", exitCode: 1 };
    }

    const fromMessageFlag = flags["from-message"];
    const fromMessageIndex = typeof fromMessageFlag === "number" ? fromMessageFlag : 
      typeof fromMessageFlag === "string" ? parseInt(fromMessageFlag, 10) : undefined;

    const result = createBranch(session.metadata.id, {
      name: args[0],
      fromCheckpoint: typeof flags["from-checkpoint"] === "string" ? flags["from-checkpoint"] : undefined,
      fromMessageIndex,
    });

    if (!result.success) {
      return { error: result.error, exitCode: 1 };
    }

    return {
      output: `Created branch session: ${result.sessionId}`,
      metadata: { action: "branch", sessionId: result.sessionId },
    };
  },
};

commandRegistry.register({ ...branchCommand, source: "builtin" });