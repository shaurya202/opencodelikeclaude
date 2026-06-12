import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { ClaudeCodeSettings, MigrationResult } from "./types";
import { loadClaudeSettings, detectClaudeConfig } from "./settings";
import { rootLogger } from "../utils/logger";

interface MigrationConfig {
  cwd: string;
  outputDir?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

function migratePermissions(settings: ClaudeCodeSettings): Record<string, unknown> {
  const permissions: Record<string, unknown> = {};
  const sp = settings.permissions;
  if (!sp) return permissions;

  if (sp.defaultMode) permissions.defaultMode = sp.defaultMode;
  if (sp.allowedTools || sp.alwaysAllow) {
    permissions.allowedTools = sp.allowedTools || sp.alwaysAllow || [];
  }
  if (sp.deniedTools || sp.deny) {
    permissions.deniedTools = sp.deniedTools || sp.deny || [];
  }

  if (sp.allow || sp.deny) {
    const rules: Array<Record<string, string>> = [];
    if (sp.allow) {
      for (const pattern of sp.allow) {
        rules.push({ pattern, action: "allow" });
      }
    }
    if (sp.deny) {
      for (const pattern of sp.deny) {
        rules.push({ pattern, action: "deny" });
      }
    }
    if (rules.length > 0) permissions.rules = rules;
  }

  return permissions;
}

function migrateHooks(settings: ClaudeCodeSettings): Record<string, unknown> {
  const hooks: Record<string, unknown> = {};
  if (settings.hooks) {
    hooks.claudeSettings = true;
    const disabled: string[] = [];
    for (const [event, hookPath] of Object.entries(settings.hooks)) {
      if (!hookPath || (typeof hookPath === "string" && hookPath.trim() === "")) {
        disabled.push(event);
      }
    }
    if (disabled.length > 0) hooks.disabled = disabled;
  }
  return hooks;
}

function migrateUI(settings: ClaudeCodeSettings): Record<string, unknown> {
  const ui: Record<string, unknown> = {};
  if (settings.theme) ui.theme = settings.theme;
  if (settings.vimMode !== undefined) ui.vimMode = settings.vimMode;
  if (settings.voiceEnabled !== undefined) ui.voiceEnabled = settings.voiceEnabled;
  if (settings.terminal) ui.terminal = settings.terminal;
  if (settings.keys) ui.keybindings = settings.keys as Record<string, string>;
  return Object.keys(ui).length > 0 ? ui : {};
}

function migrateMCPServers(settings: ClaudeCodeSettings): Record<string, unknown> {
  const mcp: Record<string, unknown> = {};
  if (settings.mcpServers && Object.keys(settings.mcpServers).length > 0) {
    mcp.servers = {};
    for (const [name, server] of Object.entries(settings.mcpServers)) {
      (mcp.servers as Record<string, unknown>)[name] = server;
    }
  }
  if (settings.disableMcp !== undefined) {
    mcp.builtin = {
      websearch: !settings.disableMcp,
      context7: !settings.disableMcp,
      grepApp: !settings.disableMcp,
      lsp: !settings.disableMcp,
      astGrep: !settings.disableMcp,
    };
  }
  return mcp;
}

export function migrateFromClaudeCode(config: MigrationConfig): MigrationResult {
  const result: MigrationResult = {
    success: true,
    migrated: [],
    skipped: [],
    errors: [],
    warnings: [],
  };

  const cwd = config.cwd;
  const settings = loadClaudeSettings(cwd);

  if (!settings) {
    result.warnings.push("No Claude Code settings.json found");
    result.success = true;
    return result;
  }

  result.migrated.push("settings.json");

  const newConfig: Record<string, unknown> = {
    $schema: "https://raw.githubusercontent.com/opencode/opencode-claude-parity/main/schema.json",
  };

  const permissions = migratePermissions(settings);
  if (Object.keys(permissions).length > 0) {
    newConfig.permissions = permissions;
    result.migrated.push("permissions");
  }

  const hooks = migrateHooks(settings);
  if (Object.keys(hooks).length > 0) {
    newConfig.hooks = hooks;
    result.migrated.push("hooks");
  }

  const ui = migrateUI(settings);
  if (Object.keys(ui).length > 0) {
    newConfig.ui = ui;
    result.migrated.push("ui");
  }

  const mcp = migrateMCPServers(settings);
  if (Object.keys(mcp).length > 0) {
    newConfig.mcp = mcp;
    result.migrated.push("mcp");
  }

  if (config.verbose) {
    rootLogger.info("Migrated configuration:", JSON.stringify(newConfig, null, 2));
  }

  if (!config.dryRun) {
    const outputDir = config.outputDir || join(cwd, ".opencode");
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = join(outputDir, "opencode-claude-parity.jsonc");
    writeFileSync(outputPath, JSON.stringify(newConfig, null, 2), "utf-8");
    result.migrated.push(outputPath);
    rootLogger.info(`Migration written to ${outputPath}`);
  }

  return result;
}

export function generateMigrationReport(cwd: string = process.cwd(), verbose: boolean = false): string {
  const detection = detectClaudeConfig(cwd);
  const result = migrateFromClaudeCode({ cwd, dryRun: true, verbose });

  let report = "Claude Code to opencode-claude-parity Migration Report\n";
  report += "--------------------------------------------------\n\n";

  report += "Detection Results:\n";
  report += `  Settings.json: ${detection.hasSettings ? "[found]" : "[not found]"}${detection.settingsPath ? ` (${detection.settingsPath})` : ""}\n`;
  report += `  Claude commands dir: ${detection.hasCommands ? "[found]" : "[not found]"}\n`;
  report += `  Claude skills dir: ${detection.hasSkills ? "[found]" : "[not found]"}\n`;
  report += `  Claude agents dir: ${detection.hasAgents ? "[found]" : "[not found]"}\n`;
  report += `  MCP config files: ${detection.hasMcp ? "[found]" : "[not found]"}\n\n`;

  report += "Migration Items:\n";
  for (const item of result.migrated) {
    report += `  [migrated] ${item}\n`;
  }
  for (const item of result.warnings) {
    report += `  [warning] ${item}\n`;
  }
  for (const item of result.errors) {
    report += `  [error] ${item}\n`;
  }

  if (result.migrated.length > 1) {
    report += `\nRun without --dry-run to write the migrated config to .opencode/opencode-claude-parity.jsonc\n`;
  }

  return report;
}
