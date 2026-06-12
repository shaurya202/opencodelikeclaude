import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { insightsAnalyzer } from "../insights/analyzer";

export const insightsCommand: CommandDefinition = {
  name: "insights",
  description: "Session analysis report",
  usage: "/insights [--get <id>] [--list] [--clear]",
  aliases: ["insight", "report"],
  category: "dev",
  flags: [
    { name: "list", short: "l", description: "List insight reports", type: "boolean" },
    { name: "get", short: "g", description: "Get insight report by ID", type: "string" },
    { name: "clear", short: "c", description: "Clear all reports", type: "boolean" },
    { name: "generate", short: "n", description: "Generate new report for session", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags } = context;

    if (flags.list) {
      const reports = insightsAnalyzer.getAllReports();
      if (reports.length === 0) return { output: "No insight reports. Use /insights --generate <sessionId> to create one." };
      let output = "Insight reports:\n\n";
      for (const r of reports) {
        output += `  ${r.id.slice(0, 8)}: Session ${r.sessionId.slice(0, 8)} - ${r.efficiency}% efficiency\n`;
        output += `    Duration: ${r.duration}s  Messages: ${r.messageCount}  Cost: $${r.cost.toFixed(4)}\n`;
      }
      return { output };
    }

    if (flags.get) {
      const report = insightsAnalyzer.getReport(flags.get as string);
      if (!report) return { error: "Report not found", exitCode: 1 };
      let output = `Insight Report: ${report.id.slice(0, 8)}\n`;
      output += `Session: ${report.sessionId.slice(0, 8)}\n`;
      output += `Duration: ${report.duration}s  Messages: ${report.messageCount}  Tool calls: ${report.toolCalls}\n`;
      output += `Files changed: ${report.filesChanged}\n`;
      output += `Tokens: ${report.tokenUsage.input.toLocaleString()} in / ${report.tokenUsage.output.toLocaleString()} out\n`;
      output += `Cost: $${report.cost.toFixed(4)}  Efficiency: ${report.efficiency}%\n\n`;
      output += "Top commands:\n";
      for (const cmd of report.topCommands) {
        output += `  ${cmd.command}: ${cmd.count}x\n`;
      }
      output += "\nSuggestions:\n";
      for (const s of report.suggestions) {
        output += `  • ${s}\n`;
      }
      return { output };
    }

    if (flags.clear) {
      insightsAnalyzer.clear();
      return { output: "Insight reports cleared" };
    }

    if (flags.generate) {
      const report = insightsAnalyzer.generateReport(flags.generate as string);
      return { output: `Insight report generated: ${report.id.slice(0, 8)}\nEfficiency: ${report.efficiency}%\nCost: $${report.cost.toFixed(4)}` };
    }

    return { output: "Usage: /insights --generate <sessionId> | --list | --get <id> | --clear" };
  },
};

commandRegistry.register({ ...insightsCommand, source: "builtin" });
