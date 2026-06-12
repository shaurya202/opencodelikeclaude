import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { goalTracker } from "../goals/tracker";

export const goalCommand: CommandDefinition = {
  name: "goal",
  description: "Set and track completion goals",
  usage: "/goal <target> [--priority <low|medium|high|critical>] [--steps <steps>] [list|cancel|status]",
  aliases: ["gl"],
  category: "advanced",
  flags: [
    { name: "list", short: "l", description: "List all goals", type: "boolean" },
    { name: "get", short: "g", description: "Get goal details by ID", type: "string" },
    { name: "cancel", short: "c", description: "Cancel goal by ID", type: "string" },
    { name: "priority", short: "p", description: "Set priority (low, medium, high, critical)", type: "string" },
    { name: "steps", short: "s", description: "Comma-separated step descriptions", type: "string" },
    { name: "status", description: "Show overall goal status", type: "boolean" },
    { name: "clear", description: "Clear completed goals", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.list) {
      const goals = goalTracker.getAllGoals();
      if (goals.length === 0) {
        return { output: "No goals set. Use /goal <target> to create one." };
      }
      let output = "Goals:\n\n";
      for (const g of goals) {
        const bar = "█".repeat(Math.round(g.progress / 10)) + "░".repeat(10 - Math.round(g.progress / 10));
        output += `  [${g.status}] ${g.id.slice(0, 8)}: ${g.target} (${g.progress}%)\n`;
        output += `    ${bar}  Priority: ${g.priority}  Steps: ${g.steps.filter(s => s.status === "completed").length}/${g.steps.length}\n`;
      }
      return { output };
    }

    if (flags.get) {
      const goal = goalTracker.getGoal(flags.get as string);
      if (!goal) return { error: "Goal not found", exitCode: 1 };
      let output = `Goal: ${goal.target}\n`;
      output += `Status: ${goal.status}  Progress: ${goal.progress}%  Priority: ${goal.priority}\n\n`;
      output += "Steps:\n";
      for (const step of goal.steps) {
        output += `  [${step.status === "completed" ? "✓" : step.status === "in_progress" ? "→" : " "}] ${step.description}\n`;
        if (step.result) output += `    Result: ${step.result}\n`;
      }
      return { output };
    }

    if (flags.cancel) {
      const goal = goalTracker.cancelGoal(flags.cancel as string);
      if (!goal) return { error: "Goal not found", exitCode: 1 };
      return { output: `Cancelled goal: ${goal.target}` };
    }

    if (flags.status) {
      const all = goalTracker.getAllGoals();
      const active = all.filter(g => g.status === "active");
      const completed = all.filter(g => g.status === "completed");
      return { output: `Active: ${active.length}  Completed: ${completed.length}  Total: ${all.length}` };
    }

    if (flags.clear) {
      goalTracker.clearCompleted();
      return { output: "Cleared completed goals" };
    }

    const target = args.join(" ");
    if (!target) {
      return { output: "Usage: /goal <target> [--priority <level>] [--steps <steps>]\nUse /goal --list to see existing goals." };
    }

    try {
      const steps = flags.steps ? (flags.steps as string).split(",").map(s => s.trim()) : undefined;
      const goal = goalTracker.createGoal(target, {
        priority: (flags.priority as "low" | "medium" | "high" | "critical") || "medium",
        steps,
      });
      return { output: `Goal created: ${goal.target} (ID: ${goal.id.slice(0, 8)})\nProgress: ${goal.progress}%  Steps: ${goal.steps.length}` };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
    }
  },
};

commandRegistry.register({ ...goalCommand, source: "builtin" });
