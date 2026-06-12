import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { reviewRunner } from "../review/runner";

export const codeReviewCommand: CommandDefinition = {
  name: "code-review",
  description: "Review code for issues and improvements",
  usage: "/code-review [--effort <1-10>] [--fix] [--comment] [--security] [target]",
  aliases: ["cr", "review"],
  category: "advanced",
  flags: [
    { name: "effort", short: "e", description: "Review effort (1-10)", type: "number" },
    { name: "fix", short: "f", description: "Auto-fix issues", type: "boolean" },
    { name: "comment", short: "c", description: "Add review comments", type: "boolean" },
    { name: "security", short: "s", description: "Include security scan", type: "boolean" },
    { name: "result", short: "r", description: "Get review result by ID", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.result) {
      const result = reviewRunner.getResult(flags.result as string);
      if (!result) return { error: "Review result not found", exitCode: 1 };
      let output = `Review: ${result.target} (${result.type})\n`;
      output += `Score: ${result.score}/100  Duration: ${result.duration}ms\n`;
      output += `Findings: ${result.summary.total} (critical: ${result.summary.critical}, high: ${result.summary.high}, medium: ${result.summary.medium}, low: ${result.summary.low})\n`;
      output += `Passed: ${result.passed ? "Yes" : "No"}\n\n`;
      for (const finding of result.findings) {
        output += `[${finding.severity.toUpperCase()}] ${finding.message}\n`;
        if (finding.suggestion) output += `  Suggestion: ${finding.suggestion}\n`;
        output += "\n";
      }
      return { output };
    }

    const target = args.join(" ") || ".";
    const result = await reviewRunner.runCodeReview(target, {
      effort: Number(flags.effort) || undefined,
      autoFix: flags.fix as boolean | undefined,
      comment: flags.comment as boolean | undefined,
    });

    let output = `Code review for: ${result.target}\n`;
    output += `Effort: ${result.effort}/10  Score: ${result.score}/100\n`;
    output += `Findings: ${result.summary.total} (${result.summary.critical} critical, ${result.summary.high} high)\n`;
    output += `Duration: ${result.duration}ms\n\n`;

    if (result.findings.length === 0) {
      output += "No issues found. Great code!";
    } else {
      const critical = result.findings.filter(f => f.severity === "critical" || f.severity === "high");
      if (critical.length > 0) {
        output += "Top issues:\n";
        for (const f of critical.slice(0, 5)) {
          output += `  [${f.severity.toUpperCase()}] ${f.message}\n`;
        }
        output += `\nReview ID: ${result.id.slice(0, 8)} - use /code-review --result ${result.id.slice(0, 8)} for full details\n`;
      }
    }

    return { output };
  },
};

export const simplifyCommand: CommandDefinition = {
  name: "simplify",
  description: "Simplify and clean up code",
  usage: "/simplify [target]",
  aliases: ["smp"],
  category: "advanced",
  flags: [
    { name: "dry-run", short: "d", description: "Preview changes without applying", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;
    const target = args.join(" ") || ".";
    const result = await reviewRunner.simplify(target);
    let output = `Simplify analysis for: ${result.original}\n\n`;
    output += "Suggested changes:\n";
    for (const change of result.changes) {
      output += `  ${change}\n`;
    }
    output += `\nEstimated lines removed: ${result.linesRemoved}`;
    if (flags["dry-run"]) {
      output += "\n\nDry run mode – no changes applied.";
    }
    return { output };
  },
};

export const securityReviewCommand: CommandDefinition = {
  name: "security-review",
  description: "Scan for security vulnerabilities",
  usage: "/security-review [target]",
  aliases: ["sec", "audit"],
  category: "advanced",
  flags: [
    { name: "full", short: "f", description: "Full security audit", type: "boolean" },
    { name: "result", short: "r", description: "Get result by ID", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.result) {
      const result = reviewRunner.getResult(flags.result as string);
      if (!result) return { error: "Security review result not found", exitCode: 1 };
      let output = `Security review: ${result.target}\n\n`;
      for (const f of result.findings) {
        if (f.type === "security") {
          output += `[${f.severity.toUpperCase()}] ${f.message}\n`;
          if (f.description) output += `  ${f.description}\n`;
          if (f.suggestion) output += `  Fix: ${f.suggestion}\n`;
          output += "\n";
        }
      }
      return { output };
    }

    const target = args.join(" ") || ".";
    const result = await reviewRunner.runCodeReview(target, { type: "security" });
    const secFindings = result.findings.filter(f => f.type === "security");

    let output = `Security scan: ${target}\n`;
    output += `Findings: ${secFindings.length}\n\n`;

    if (secFindings.length === 0) {
      output += "No security issues detected.";
    } else {
      const bySeverity = (sev: string) => secFindings.filter(f => f.severity === sev);
      const critical = bySeverity("critical");
      const high = bySeverity("high");
      output += `Critical: ${critical.length}  High: ${high.length}  Medium: ${bySeverity("medium").length}  Low: ${bySeverity("low").length}\n\n`;
      if (critical.length > 0) {
        output += "Critical findings:\n";
        for (const f of critical) {
          output += `  ${f.message}\n`;
        }
      }
      output += `\nReview ID: ${result.id.slice(0, 8)} - use /security-review --result ${result.id.slice(0, 8)} for full details\n`;
    }

    return { output };
  },
};

commandRegistry.register({ ...codeReviewCommand, source: "builtin" });
commandRegistry.register({ ...simplifyCommand, source: "builtin" });
commandRegistry.register({ ...securityReviewCommand, source: "builtin" });
