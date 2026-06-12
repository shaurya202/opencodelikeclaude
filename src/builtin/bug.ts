import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  steps: string[];
  expected: string;
  actual: string;
  timestamp: number;
  logs?: string;
}

const submittedBugs: BugReport[] = [];

export const bugCommand: CommandDefinition = {
  name: "bug",
  description: "Submit a bug report with logs",
  usage: "/bug <title> --description <text> [--severity <level>] [--steps <steps>] [--expected <text>] [--actual <text>] [list]",
  aliases: ["report-bug"],
  category: "dev",
  flags: [
    { name: "description", short: "d", description: "Bug description", type: "string" },
    { name: "severity", short: "s", description: "Severity (low, medium, high, critical)", type: "string" },
    { name: "steps", short: "t", description: "Steps to reproduce (comma-separated)", type: "string" },
    { name: "expected", short: "e", description: "Expected behavior", type: "string" },
    { name: "actual", short: "a", description: "Actual behavior", type: "string" },
    { name: "list", short: "l", description: "List submitted bug reports", type: "boolean" },
    { name: "get", short: "g", description: "Get bug report by ID", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.list) {
      if (submittedBugs.length === 0) return { output: "No bug reports submitted." };
      let output = "Bug reports:\n\n";
      for (const b of submittedBugs) {
        output += `  [${b.severity}] ${b.id.slice(0, 8)}: ${b.title} (${new Date(b.timestamp).toLocaleDateString()})\n`;
      }
      return { output };
    }

    if (flags.get) {
      const bug = submittedBugs.find(b => b.id === flags.get);
      if (!bug) return { error: "Bug report not found", exitCode: 1 };
      let output = `Bug: ${bug.title} [${bug.severity}]\n`;
      output += `ID: ${bug.id}\n`;
      output += `Description: ${bug.description}\n\n`;
      output += "Steps to reproduce:\n";
      for (let i = 0; i < bug.steps.length; i++) {
        output += `  ${i + 1}. ${bug.steps[i]}\n`;
      }
      output += `\nExpected: ${bug.expected}\nActual: ${bug.actual}\n`;
      output += `\nSubmitted: ${new Date(bug.timestamp).toLocaleString()}`;
      if (bug.logs) output += `\nLogs: ${bug.logs.slice(0, 500)}`;
      return { output };
    }

    const title = args.join(" ");
    if (!title || !flags.description) {
      return { output: "Usage: /bug <title> --description <text> [--severity <level>] [--steps <steps>]\nUse /bug --list to see submitted reports." };
    }

    const bug: BugReport = {
      id: `BUG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      title,
      description: flags.description as string,
      severity: (flags.severity as "low" | "medium" | "high" | "critical") || "medium",
      steps: (flags.steps as string || "").split(",").map(s => s.trim()).filter(Boolean),
      expected: (flags.expected as string) || "Expected behavior not specified",
      actual: (flags.actual as string) || "Actual behavior not specified",
      timestamp: Date.now(),
      logs: `Session context included at ${new Date().toISOString()}`,
    };

    submittedBugs.push(bug);
    return { output: `Bug report submitted: ${bug.id}\nTitle: ${bug.title}\nSeverity: ${bug.severity}\n\nUse /bug --get ${bug.id} to view details.` };
  },
};

commandRegistry.register({ ...bugCommand, source: "builtin" });
