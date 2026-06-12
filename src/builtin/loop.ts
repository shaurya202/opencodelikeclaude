import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { scheduler } from "../loop/scheduler";

export const loopCommand: CommandDefinition = {
  name: "loop",
  description: "Run recurring tasks",
  usage: "/loop <prompt> [--interval <ms>] [--max <count>] [list|start|pause|cancel]",
  aliases: ["lp"],
  category: "advanced",
  flags: [
    { name: "list", short: "l", description: "List loops", type: "boolean" },
    { name: "start", short: "s", description: "Start loop by ID", type: "string" },
    { name: "pause", description: "Pause loop by ID", type: "string" },
    { name: "cancel", short: "c", description: "Cancel loop by ID", type: "string" },
    { name: "interval", short: "i", description: "Interval in milliseconds (default: 60000)", type: "number" },
    { name: "max", short: "m", description: "Max iterations (default: 100)", type: "number" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.list) {
      const loops = scheduler.getAllLoops();
      if (loops.length === 0) return { output: "No loops running. Use /loop <prompt> to create one." };
      let output = "Loops:\n\n";
      for (const l of loops) {
        output += `  [${l.status}] ${l.id.slice(0, 8)}: ${l.prompt.slice(0, 50)}${l.prompt.length > 50 ? "..." : ""}\n`;
        output += `    Iterations: ${l.currentIteration}/${l.maxIterations}  Interval: ${l.interval}ms\n`;
      }
      return { output };
    }

    if (flags.start) {
      const loop = scheduler.startLoop(flags.start as string);
      if (!loop) return { error: "Loop not found or already running", exitCode: 1 };
      return { output: `Started loop: ${loop.id.slice(0, 8)}` };
    }

    if (flags.pause) {
      const loop = scheduler.pauseLoop(flags.pause as string);
      if (!loop) return { error: "Loop not found or not running", exitCode: 1 };
      return { output: `Paused loop: ${loop.id.slice(0, 8)}` };
    }

    if (flags.cancel) {
      const loop = scheduler.cancelLoop(flags.cancel as string);
      if (!loop) return { error: "Loop not found", exitCode: 1 };
      return { output: `Cancelled loop: ${loop.id.slice(0, 8)}` };
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return { output: "Usage: /loop <prompt> [--interval <ms>] [--max <count>]\nUse /loop --list to see running loops." };
    }

    const loop = scheduler.createLoop(prompt, {
      interval: Number(flags.interval) || 60000,
      maxIterations: Number(flags.max) || 100,
    });
    scheduler.startLoop(loop.id);

    return { output: `Loop created: ${loop.id.slice(0, 8)}\nPrompt: ${prompt}\nInterval: ${loop.interval}ms  Max iterations: ${loop.maxIterations}` };
  },
};

export const scheduleCommand: CommandDefinition = {
  name: "schedule",
  description: "Schedule recurring tasks with cron",
  usage: "/schedule <cron> <prompt> [--max <count>] [list|enable|disable|remove]",
  aliases: ["sc"],
  category: "advanced",
  flags: [
    { name: "list", short: "l", description: "List schedules", type: "boolean" },
    { name: "enable", short: "e", description: "Enable schedule by ID", type: "string" },
    { name: "disable", short: "d", description: "Disable schedule by ID", type: "string" },
    { name: "remove", short: "r", description: "Remove schedule by ID", type: "string" },
    { name: "max", short: "m", description: "Max runs", type: "number" },
    { name: "label", description: "Schedule label", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.list) {
      const schedules = scheduler.getAllSchedules();
      if (schedules.length === 0) return { output: "No schedules. Use /schedule <cron> <prompt> to create one." };
      let output = "Schedules:\n\n";
      for (const s of schedules) {
        output += `  [${s.enabled ? "active" : "disabled"}] ${s.id.slice(0, 8)}${s.label ? ` (${s.label})` : ""}\n`;
        output += `    Cron: ${s.cron}  Runs: ${s.currentRuns}/${s.maxRuns}\n`;
        output += `    Prompt: ${s.prompt.slice(0, 50)}${s.prompt.length > 50 ? "..." : ""}\n`;
      }
      return { output };
    }

    if (flags.enable) {
      const s = scheduler.enableSchedule(flags.enable as string);
      if (!s) return { error: "Schedule not found", exitCode: 1 };
      return { output: `Enabled schedule: ${s.id.slice(0, 8)}` };
    }

    if (flags.disable) {
      const s = scheduler.disableSchedule(flags.disable as string);
      if (!s) return { error: "Schedule not found", exitCode: 1 };
      return { output: `Disabled schedule: ${s.id.slice(0, 8)}` };
    }

    if (flags.remove) {
      const found = scheduler.removeSchedule(flags.remove as string);
      if (!found) return { error: "Schedule not found", exitCode: 1 };
      return { output: "Schedule removed" };
    }

    const cron = args[0];
    const prompt = args.slice(1).join(" ");
    if (!cron || !prompt) {
      return { output: "Usage: /schedule <cron> <prompt> [--max <count>] [--label <name>]\nExample: /schedule \"0 9 * * 1\" Weekly code review" };
    }

    const schedule = scheduler.createSchedule({
      cron,
      prompt,
      label: flags.label as string || undefined,
      enabled: true,
      maxRuns: Number(flags.max) || 999,
    });

    return { output: `Schedule created: ${schedule.id.slice(0, 8)}\nCron: ${cron}\nPrompt: ${prompt}\nMax runs: ${schedule.maxRuns}` };
  },
};

export const ralphLoopCommand: CommandDefinition = {
  name: "ralph-loop",
  description: "Self-referential improvement loop until target is met",
  usage: "/ralph-loop <prompt> --target <target> [--threshold <percent>] [--max <count>]",
  aliases: ["rl", "ulw-loop"],
  category: "advanced",
  flags: [
    { name: "target", short: "t", description: "Target completion condition", type: "string", required: true },
    { name: "threshold", short: "p", description: "Success threshold (0-100)", type: "number" },
    { name: "max", short: "m", description: "Max iterations", type: "number" },
    { name: "list", short: "l", description: "List active ralph loops", type: "boolean" },
    { name: "cancel", short: "c", description: "Cancel ralph loop by ID", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.list) {
      return { output: "Active Ralph Loops: (use /loop --list to see all loops)" };
    }

    if (flags.cancel) {
      const found = scheduler.removeRalphLoop(flags.cancel as string);
      return { output: found ? "Ralph loop cancelled" : "Ralph loop not found" };
    }

    const prompt = args.join(" ");
    const target = flags.target as string;
    if (!prompt || !target) {
      return { output: "Usage: /ralph-loop <prompt> --target <target> [--threshold <percent>] [--max <count>]" };
    }

    const id = scheduler.createRalphLoop({
      prompt,
      target,
      currentProgress: 0,
      threshold: Number(flags.threshold) || 100,
      maxIterations: Number(flags.max) || 50,
      refinementStrategy: "moderate",
    });

    return { output: `Ralph Loop created: ${id.slice(0, 8)}\nPrompt: ${prompt}\nTarget: ${target}\nThreshold: ${Number(flags.threshold) || 100}%\nMax iterations: ${Number(flags.max) || 50}\n\nSelf-referential improvement loop initialized.` };
  },
};

commandRegistry.register({ ...loopCommand, source: "builtin" });
commandRegistry.register({ ...scheduleCommand, source: "builtin" });
commandRegistry.register({ ...ralphLoopCommand, source: "builtin" });
