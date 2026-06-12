import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { sessionManager } from "../session/manager";
import { loadConfig } from "../config/loader";
import { hookRegistry } from "../hooks/registry";
import { commandRegistry as cmdReg } from "../commands/registry";

export const debugCommand: CommandDefinition = {
  name: "debug",
  description: "Session diagnostics and troubleshooting",
  usage: "/debug [--session <id>] [--hooks] [--commands] [--config] [--all] [description]",
  aliases: ["diag"],
  category: "dev",
  flags: [
    { name: "session", short: "s", description: "Debug specific session ID", type: "string" },
    { name: "hooks", short: "h", description: "Show registered hooks", type: "boolean" },
    { name: "commands", short: "c", description: "Show registered commands", type: "boolean" },
    { name: "config", short: "g", description: "Show current config", type: "boolean" },
    { name: "all", short: "a", description: "Show all debug info", type: "boolean" },
    { name: "sessions", description: "List all sessions", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags, cwd } = context;
    const description = args.join(" ");
    let output = "";

    if (flags.sessions || flags.all) {
      const sessions = sessionManager.listSessions();
      output += `Sessions (${sessions.length}):\n`;
      for (const s of sessions.slice(0, 5)) {
        output += `  ${s.id.slice(0, 8)}: ${s.name || "unnamed"} - ${s.messageCount} msgs, ${s.tokenUsage.input + s.tokenUsage.output} tokens\n`;
      }
      if (sessions.length > 5) output += `  ... and ${sessions.length - 5} more\n`;
      output += "\n";
    }

    const current = sessionManager.getCurrentSession();
    if (current) {
      output += `Current session: ${current.metadata.id.slice(0, 8)}\n`;
      output += `  Messages: ${current.metadata.messageCount}\n`;
      output += `  Tokens: ${current.metadata.tokenUsage.input} in / ${current.metadata.tokenUsage.output} out\n`;
      output += `  Created: ${current.metadata.createdAt.toISOString()}\n`;
      output += `  Updated: ${current.metadata.updatedAt.toISOString()}\n`;
      if (current.metadata.branchName) output += `  Branch: ${current.metadata.branchName}\n`;
      output += "\n";
    }

    if (flags.hooks || flags.all) {
      const hookTypes = ["pre-tool-use", "post-tool-use", "user-prompt-submit", "stop", "pre-compact", "session-start", "config", "event"] as const;
      output += "Hooks:\n";
      for (const type of hookTypes) {
        const hooks = hookRegistry.getHooks(type);
        if (hooks.length > 0) {
          output += `  ${type}: ${hooks.length} registered\n`;
        }
      }
      output += "\n";
    }

    if (flags.commands || flags.all) {
      const cmds = cmdReg.getVisible();
      output += `Commands (${cmds.length}):\n`;
      const byCat = new Map<string, number>();
      for (const cmd of cmds) {
        const cat = cmd.category || "other";
        byCat.set(cat, (byCat.get(cat) || 0) + 1);
      }
      for (const [cat, count] of byCat) {
        output += `  ${cat}: ${count}\n`;
      }
      output += "\n";
    }

    if (flags.config || flags.all) {
      const config = loadConfig(cwd);
      output += `Config:\n  Theme: ${config.ui.theme}\n  Vim: ${config.ui.vimMode}\n  Voice: ${config.ui.voiceEnabled}\n  Permission mode: ${config.permissions.defaultMode}\n`;
      output += "\n";
    }

    if (description) {
      output += `Debug description: ${description}\n`;
    }

    if (!output) {
      const config = loadConfig(cwd);
      output = `Debug info:\n  CWD: ${cwd}\n  Session: ${context.sessionId.slice(0, 8)}\n  Theme: ${config.ui.theme}\n  Permission mode: ${config.permissions.defaultMode}\n\nUse flags: --sessions, --hooks, --commands, --config, --all`;
    }

    return { output, metadata: { action: "debug", description } };
  },
};

commandRegistry.register({ ...debugCommand, source: "builtin" });
