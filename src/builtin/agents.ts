import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";

export const agentsCommand: CommandDefinition = {
  name: "agents",
  description: "Manage agents",
  usage: "/agents [list|create|edit|delete]",
  aliases: [],
  category: "agents",
  arguments: [
    { name: "subcommand", description: "Subcommand: list, create, edit, delete", required: false },
    { name: "args", description: "Subcommand arguments", required: false, variadic: true },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args } = context;
    const subcommand = args[0];
    
    switch (subcommand) {
      case "list":
        return { output: "Built-in agents: orchestrator, planner, reviewer, researcher, explorer, frontend, gitMaster, multimodal", metadata: { action: "agents", subcommand: "list" } };
      case "create":
        return { output: `Creating agent: ${args.slice(1).join(" ")}`, metadata: { action: "agents", subcommand: "create" } };
      case "edit":
        return { output: `Editing agent: ${args.slice(1).join(" ")}`, metadata: { action: "agents", subcommand: "edit" } };
      case "delete":
        return { output: `Deleting agent: ${args.slice(1).join(" ")}`, metadata: { action: "agents", subcommand: "delete" } };
      default:
        return { output: "Usage: /agents [list|create|edit|delete]", metadata: { action: "agents", subcommand: "help" } };
    }
  },
};

commandRegistry.register({ ...agentsCommand, source: "builtin" });