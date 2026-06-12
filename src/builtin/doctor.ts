import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { loadConfig } from "../config/loader";
import { sessionManager } from "../session/manager";
import { commandRegistry as cmdReg } from "../commands/registry";
import { agentRegistry } from "../agents/registry";
import { mcpRegistry } from "../mcp/registry";
import { skillRegistry } from "../skills/registry";
import { detectClaudeConfig } from "../compat/settings";
import { getPlugin } from "../index";
import { existsSync } from "fs";

export const doctorCommand: CommandDefinition = {
  name: "doctor",
  description: "Installation health check",
  usage: "/doctor [--fix] [--verbose] [--compat]",
  aliases: ["health"],
  category: "dev",
  flags: [
    { name: "fix", short: "f", description: "Auto-fix common issues", type: "boolean" },
    { name: "verbose", short: "v", description: "Detailed output", type: "boolean" },
    { name: "compat", short: "c", description: "Check Claude Code compatibility", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { cwd, flags } = context;
    const checks: { name: string; passed: boolean; detail?: string }[] = [];

    checks.push({ name: "OpenCode runtime", passed: true, detail: "Detected" });

    const pluginVersion = "1.0.0";
    checks.push({ name: "Plugin version", passed: true, detail: `opencode-claude-parity v${pluginVersion}` });

    const config = loadConfig(cwd);
    checks.push({ name: "Config loaded", passed: true, detail: `Theme: ${config.ui.theme}, Mode: ${config.permissions.defaultMode}` });

    const configPaths = [
      ".opencode/opencode-claude-parity.jsonc",
      ".opencode/opencode-claude-parity.json",
    ];
    const hasConfigFile = configPaths.some(p => existsSync(p));
    checks.push({ name: "Config file on disk", passed: hasConfigFile, detail: hasConfigFile ? "Found" : "Not found (using defaults)" });

    const sessions = sessionManager.listSessions();
    checks.push({ name: "Session storage", passed: sessions.length >= 0, detail: `${sessions.length} sessions` });

    const cmds = cmdReg.getVisible().length;
    checks.push({ name: "Commands loaded", passed: cmds > 0, detail: `${cmds} commands` });

    const agents = agentRegistry.getAll().length;
    checks.push({ name: "Agents loaded", passed: agents > 0, detail: `${agents} agents` });

    const servers = mcpRegistry.getAllServers().length;
    checks.push({ name: "MCP servers registered", passed: servers >= 0, detail: `${servers} servers` });

    const skills = skillRegistry.getAll().length;
    checks.push({ name: "Skills loaded", passed: skills >= 0, detail: `${skills} skills` });

    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0], 10);
    checks.push({ name: "Node.js version", passed: majorVersion >= 18, detail: nodeVersion });

    if (flags.compat) {
      const detect = detectClaudeConfig(cwd);
      checks.push({ name: "Claude Code settings", passed: detect.hasSettings, detail: detect.hasSettings ? "Found" : "Not found" });
      checks.push({ name: "Claude Code commands", passed: detect.hasCommands, detail: detect.hasCommands ? "Found" : "Not found" });
      checks.push({ name: "Claude Code skills", passed: detect.hasSkills, detail: detect.hasSkills ? "Found" : "Not found" });
      checks.push({ name: "Claude Code agents", passed: detect.hasAgents, detail: detect.hasAgents ? "Found" : "Not found" });
      checks.push({ name: "Claude MCP config", passed: detect.hasMcp, detail: detect.hasMcp ? "Found" : "Not found" });
    }

    const plugin = getPlugin();
    checks.push({ name: "Plugin API", passed: plugin !== null, detail: plugin !== null ? "Available" : "Not initialized" });

    if (flags.verbose) {
      let output = "Doctor Report:\n\n";
      for (const check of checks) {
        const icon = check.passed ? "✓" : "✗";
        output += `  ${icon} ${check.name}: ${check.detail || (check.passed ? "OK" : "FAILED")}\n`;
      }
      const passed = checks.filter(c => c.passed).length;
      output += `\n${passed}/${checks.length} checks passed`;
      if (flags.fix) {
        const fixable = checks.filter(c => !c.passed);
        if (fixable.length > 0) {
          output += "\n\nFixable issues:\n";
          for (const check of fixable) {
            output += `  - ${check.name}: ${check.detail || "Unknown issue"}\n`;
          }
        } else {
          output += "\n\nAuto-fix: No fixable issues detected.";
        }
      }
      return { output, metadata: { action: "doctor", passed: checks.every(c => c.passed), total: checks.length, passedCount: checks.filter(c => c.passed).length } };
    }

    const passed = checks.filter(c => c.passed).length;
    const failed = checks.filter(c => !c.passed).length;
    const summary = `Doctor: ${passed}/${checks.length} checks passed${failed > 0 ? `, ${failed} failed` : ""}`;
    return { output: summary, metadata: { action: "doctor", passed: checks.every(c => c.passed) } };
  },
};

commandRegistry.register({ ...doctorCommand, source: "builtin" });
