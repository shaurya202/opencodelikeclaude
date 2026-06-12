import { commandRegistry } from "../commands/registry";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { detectClaudeConfig } from "../compat/settings";
import { migrateFromClaudeCode } from "../compat/migrate";
import { rootLogger } from "../utils/logger";
export const initCommand = {
    name: "init",
    description: "Initialize opencode-claude-parity configuration",
    usage: "/init [--force] [--migrate]",
    aliases: [],
    category: "core",
    flags: [
        { name: "force", short: "f", description: "Overwrite existing config", type: "boolean", default: false },
        { name: "migrate", short: "m", description: "Migrate from Claude Code settings", type: "boolean", default: false },
    ],
    handler: async (context) => {
        const { flags, cwd } = context;
        const force = flags.force;
        const configDir = join(cwd, ".opencode");
        const configPath = join(configDir, "opencode-claude-parity.jsonc");
        if (existsSync(configPath) && !force) {
            const detect = detectClaudeConfig(cwd);
            let hint = "";
            if (detect.hasSettings || detect.hasCommands || detect.hasSkills || detect.hasAgents || detect.hasMcp) {
                hint = "\n\nClaude Code configuration detected! Run with --migrate to import settings.";
            }
            return {
                error: `Config already exists at ${configPath}. Use --force to overwrite.${hint}`,
                exitCode: 1,
            };
        }
        const migrate = flags.migrate;
        let migrationNote = "";
        if (migrate) {
            rootLogger.info("Migrating from Claude Code settings...");
            const result = migrateFromClaudeCode({ cwd, dryRun: false, verbose: false });
            if (result.success && result.migrated.length > 1) {
                migrationNote = `\n\nMigrated from Claude Code: ${result.migrated.filter(m => m !== configPath).join(", ")}`;
            }
            else {
                migrationNote = "\n\nNo Claude Code settings found to migrate.";
            }
            return {
                output: migrationNote.trim(),
            };
        }
        if (!existsSync(configDir)) {
            mkdirSync(configDir, { recursive: true });
        }
        const configContent = `{
  "$schema": "https://raw.githubusercontent.com/opencode/opencode-claude-parity/main/schema.json",

  // Compatibility toggles
  "compatibility": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "agents": true,
    "hooks": true,
    "plugins": true
  },

  // Agent configuration
  "agents": {
    "orchestrator": { "model": "anthropic/claude-opus-4-5", "variant": "max" },
    "planner": { "model": "anthropic/claude-sonnet-4-5" },
    "reviewer": { "model": "openai/gpt-5.2" },
    "researcher": { "model": "anthropic/claude-sonnet-4-5" },
    "explorer": { "model": "opencode/gpt-5-nano" },
    "frontend": { "model": "google/gemini-3-pro" },
    "gitMaster": { "model": "anthropic/claude-sonnet-4-5" },
    "multimodal": { "model": "google/gemini-3-flash" }
  },

  // Category-based delegation
  "categories": {
    "quick": { "model": "opencode/gpt-5-nano" },
    "visual": { "model": "google/gemini-3-pro" },
    "businessLogic": { "model": "anthropic/claude-sonnet-4-5" },
    "deep": { "model": "anthropic/claude-opus-4-5", "variant": "max" },
    "writing": { "model": "anthropic/claude-sonnet-4-5" }
  },

  // Permission settings
  "permissions": {
    "defaultMode": "default",
    "allowedTools": [],
    "deniedTools": [],
    "rules": []
  },

  // MCP servers
  "mcp": {
    "builtin": {
      "websearch": true,
      "context7": true,
      "grepApp": true,
      "lsp": true,
      "astGrep": true
    },
    "servers": {}
  },

  // Skills
  "skills": {
    "builtin": {
      "playwright": true,
      "gitMaster": true,
      "frontendUiUx": true
    },
    "paths": []
  },

  // Hooks
  "hooks": {
    "disabled": [],
    "claudeSettings": true
  },

  // UI
  "ui": {
    "theme": "default",
    "color": "default",
    "vimMode": false,
    "leaderKey": "ctrl+x",
    "keybindings": {}
  },

  // Background agents
  "background": {
    "maxConcurrent": 5,
    "concurrencyByProvider": {}
  },

  // Experimental
  "experimental": {
    "aggressiveTruncation": false,
    "autoResume": false,
    "teamMode": false,
    "hashEditing": true
  },

  // Cost tracking
  "cost": {
    "trackUsage": true,
    "breakdown": true,
    "alerts": {}
  }
}`;
        writeFileSync(configPath, configContent);
        const detect = detectClaudeConfig(cwd);
        let note = "";
        if (detect.hasSettings || detect.hasCommands || detect.hasSkills || detect.hasAgents || detect.hasMcp) {
            note = "\n\nClaude Code configuration detected! Run with --migrate to import settings.";
        }
        return {
            output: `Created config at ${configPath}${note}`,
        };
    },
};
commandRegistry.register({ ...initCommand, source: "builtin" });
//# sourceMappingURL=init.js.map