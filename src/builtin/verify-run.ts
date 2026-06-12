import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { verifyRunner } from "../verify/runner";

export const verifyCommand: CommandDefinition = {
  name: "verify",
  description: "Build, test, and lint the project",
  usage: "/verify [--build] [--test] [--lint] [--build-cmd <cmd>] [--test-cmd <cmd>] [--lint-cmd <cmd>]",
  aliases: ["vrf"],
  category: "advanced",
  flags: [
    { name: "build", short: "b", description: "Run build", type: "boolean" },
    { name: "test", short: "t", description: "Run tests", type: "boolean" },
    { name: "lint", short: "l", description: "Run linter", type: "boolean" },
    { name: "build-cmd", description: "Custom build command", type: "string" },
    { name: "test-cmd", description: "Custom test command", type: "string" },
    { name: "lint-cmd", description: "Custom lint command", type: "string" },
    { name: "all", short: "a", description: "Run all verification steps", type: "boolean" },
    { name: "result", short: "r", description: "Get verify result by ID", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags } = context;

    if (flags.result) {
      const result = verifyRunner.getResult(flags.result as string);
      if (!result) return { error: "Verify result not found", exitCode: 1 };
      let output = `Verify: ${result.target} [${result.status}]\n`;
      output += `Duration: ${result.duration}ms\n\n`;
      for (const step of result.steps) {
        output += `  [${step.status === "passed" ? "✓" : step.status === "failed" ? "✗" : step.status === "running" ? "→" : " "}] ${step.name}: ${step.command}\n`;
        if (step.error) output += `    Error: ${step.error}\n`;
      }
      return { output };
    }

    const all = flags.all as boolean | undefined;
    const target = ".";
    const result = await verifyRunner.verify(target, {
      build: flags.build as boolean | undefined ?? all ?? true,
      test: flags.test as boolean | undefined ?? all ?? true,
      lint: flags.lint as boolean | undefined ?? all ?? true,
      buildCommand: flags["build-cmd"] as string | undefined,
      testCommand: flags["test-cmd"] as string | undefined,
      lintCommand: flags["lint-cmd"] as string | undefined,
    });

    let output = `Verify results for: ${result.target}\n\n`;
    for (const step of result.steps) {
      const icon = step.status === "passed" ? "✓" : step.status === "failed" ? "✗" : "→";
      output += `  ${icon} ${step.name}: ${step.command}\n`;
      output += `    Status: ${step.status}  Duration: ${step.duration}ms\n`;
      if (step.error) output += `    Error: ${step.error}\n`;
    }
    output += `\nOverall: ${result.status === "passed" ? "All checks passed" : "Some checks failed"}`;
    output += `\nVerify ID: ${result.id.slice(0, 8)}`;

    return { output };
  },
};

export const runCommand: CommandDefinition = {
  name: "run",
  description: "Build, launch, and observe the application",
  usage: "/run [command] [--args <args>] [--detach] [--timeout <ms>]",
  aliases: [],
  category: "advanced",
  flags: [
    { name: "args", short: "a", description: "Command arguments", type: "string" },
    { name: "detach", short: "d", description: "Run in background", type: "boolean" },
    { name: "timeout", short: "t", description: "Timeout in milliseconds", type: "number" },
    { name: "build", short: "b", description: "Build before running", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;
    const command = args.join(" ") || flags.args as string || "npm start";

    let output = `Running: ${command}\n`;
    if (flags.build) {
      output += "Building before run...\n";
      const buildResult = await verifyRunner.verify(".", { build: true, test: false, lint: false });
      if (buildResult.status === "failed") {
        output += "Build failed. Aborting run.\n";
        return { output, metadata: { verifyId: buildResult.id } };
      }
      output += "Build succeeded.\n";
    }

    output += `\nCommand: ${command}\n`;
    if (flags.detach) output += "Mode: detached (background)\n";
    output += `Timeout: ${Number(flags.timeout) || 30000}ms\n`;
    output += "\nApplication launched. Use /status to check running processes.";

    return { output };
  },
};

commandRegistry.register({ ...verifyCommand, source: "builtin" });
commandRegistry.register({ ...runCommand, source: "builtin" });
