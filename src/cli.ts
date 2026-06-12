#!/usr/bin/env node
import { loadConfig } from "./config/loader";
import { migrateFromClaudeCode, generateMigrationReport, getCompatSummary } from "./compat";
import { rootLogger } from "./utils/logger";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  switch (command) {
    case "migrate": {
      const cwd = process.cwd();
      const apply = args.includes("--apply");
      const verbose = args.includes("--verbose") || args.includes("-v");

      if (apply) {
        rootLogger.info("Running Claude Code migration...");
        const result = migrateFromClaudeCode({ cwd, verbose, dryRun: false });
        if (result.success) {
          console.log(`Migration complete: ${result.migrated.length} items migrated`);
          if (result.warnings.length > 0) {
            result.warnings.forEach(w => console.warn(`  ⚠ ${w}`));
          }
        } else {
          console.error("Migration failed:");
          result.errors.forEach(e => console.error(`  ✗ ${e}`));
          process.exit(1);
        }
      } else {
        console.log(generateMigrationReport(cwd, verbose));
      }
      break;
    }

    case "check": {
      const cwd = process.cwd();
      const summary = getCompatSummary(cwd);
      console.log("Claude Code Compatibility Check\n");

      console.log("Detection:");
      console.log(`  Settings:        ${summary.detection.hasSettings ? "✓" : "—"}`);
      console.log(`  Commands dir:    ${summary.detection.hasCommands ? "✓" : "—"}`);
      console.log(`  Skills dir:      ${summary.detection.hasSkills ? "✓" : "—"}`);
      console.log(`  Agents dir:      ${summary.detection.hasAgents ? "✓" : "—"}`);
      console.log(`  MCP config:      ${summary.detection.hasMcp ? "✓" : "—"}`);
      console.log("");

      console.log("Migration:");
      if (summary.migration.migrated.length > 0) {
        summary.migration.migrated.forEach(m => console.log(`  ✓ ${m}`));
      } else {
        console.log("  No settings to migrate");
      }
      break;
    }

    case "config": {
      const cwd = process.cwd();
      const config = loadConfig(cwd);
      console.log(JSON.stringify(config, null, 2));
      break;
    }

    case "help":
    default: {
      console.log("opencode-claude-parity CLI\n");
      console.log("Usage:");
      console.log("  opencode-claude-parity migrate         Generate migration report");
      console.log("  opencode-claude-parity migrate --apply  Apply migration");
      console.log("  opencode-claude-parity check            Check Claude Code compatibility");
      console.log("  opencode-claude-parity config           Show current config");
      console.log("  opencode-claude-parity help             Show this help");
      break;
    }
  }
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
