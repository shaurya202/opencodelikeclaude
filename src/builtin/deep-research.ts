import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { researchRunner } from "../research/runner";

export const deepResearchCommand: CommandDefinition = {
  name: "deep-research",
  description: "Perform deep research with web search fan-out",
  usage: "/deep-research <query> [--sources <count>] [--depth <count>] [list|get]",
  aliases: ["dr", "research"],
  category: "advanced",
  flags: [
    { name: "sources", short: "s", description: "Max sources per query", type: "number" },
    { name: "depth", short: "d", description: "Research depth", type: "number" },
    { name: "list", short: "l", description: "List research instances", type: "boolean" },
    { name: "get", short: "g", description: "Get research results by ID", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.list) {
      const instances = researchRunner.getAllInstances();
      if (instances.length === 0) return { output: "No research instances." };
      let output = "Research instances:\n\n";
      for (const inst of instances) {
        output += `  [${inst.status}] ${inst.id.slice(0, 8)}: ${inst.query.slice(0, 60)}${inst.query.length > 60 ? "..." : ""}\n`;
        output += `    Sub-queries: ${inst.subQueries.length}  Results: ${inst.results.length}\n`;
      }
      return { output };
    }

    if (flags.get) {
      const instance = researchRunner.getInstance(flags.get as string);
      if (!instance) return { error: "Research instance not found", exitCode: 1 };
      let output = `Research: ${instance.query}\n`;
      output += `Status: ${instance.status}\n`;
      if (instance.summary) output += `\n${instance.summary}\n\n`;

      for (const result of instance.results) {
        output += `\n--- ${result.query} ---\n`;
        output += `Confidence: ${(result.confidence * 100).toFixed(0)}%  Sources: ${result.sources.length}\n`;
        for (const finding of result.findings) {
          output += `  • ${finding}\n`;
        }
      }
      return { output };
    }

    const query = args.join(" ");
    if (!query) {
      return { output: "Usage: /deep-research <query> [--sources <count>] [--depth <count>]" };
    }

    researchRunner.updateConfig({
      maxSources: Number(flags.sources) || 10,
      maxDepth: Number(flags.depth) || 3,
    });

    const instance = await researchRunner.deepResearch(query);

    let output = `Deep research: "${instance.query}"\n`;
    output += `Sub-queries explored: ${instance.subQueries.length}\n\n`;

    for (const result of instance.results) {
      output += `[${result.status}] ${result.query}\n`;
      output += `  Sources: ${result.sources.length}  Confidence: ${(result.confidence * 100).toFixed(0)}%\n`;
      output += `  Duration: ${result.duration}ms\n`;
    }

    if (instance.summary) {
      output += `\n${instance.summary}\n`;
    }

    output += `\nResearch ID: ${instance.id.slice(0, 8)} - use /deep-research --get ${instance.id.slice(0, 8)} for full results`;

    return { output };
  },
};

commandRegistry.register({ ...deepResearchCommand, source: "builtin" });
