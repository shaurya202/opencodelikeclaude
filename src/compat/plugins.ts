import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { ClaudePackageJson } from "./types";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";

const CLAUDE_PLUGIN_DIRS = [
  "~/.claude/plugins",
  ".claude/plugins",
];

interface PluginDescriptor {
  name: string;
  packagePath: string;
  packageJson: ClaudePackageJson;
  source: string;
}

export function discoverClaudePlugins(cwd: string = process.cwd()): PluginDescriptor[] {
  const plugins: PluginDescriptor[] = [];

  for (const dir of CLAUDE_PLUGIN_DIRS) {
    const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
    if (!existsSync(fullPath)) continue;

    const entries = readdirSync(fullPath);
    for (const entry of entries) {
      const pluginDir = join(fullPath, entry);
      const stat = statSync(pluginDir);
      if (!stat.isDirectory()) continue;

      const packagePath = join(pluginDir, "package.json");
      if (!existsSync(packagePath)) continue;

      try {
        const content = readFileSync(packagePath, "utf-8");
        const pkg = JSON.parse(content) as ClaudePackageJson;
        if (pkg.name) {
          plugins.push({
            name: pkg.name,
            packagePath,
            packageJson: pkg,
            source: fullPath,
          });
        }
      } catch (error) {
        rootLogger.warn(`Failed to parse plugin package.json at ${packagePath}: ${error}`);
      }
    }
  }

  return plugins;
}

export function loadClaudePlugins(cwd: string = process.cwd()): number {
  const plugins = discoverClaudePlugins(cwd);
  let count = 0;

  for (const plugin of plugins) {
    const contributes = plugin.packageJson.contributes;
    if (contributes) {
      if (contributes.hooks) {
        rootLogger.info(`Plugin "${plugin.name}" contributes ${contributes.hooks.length} hooks`);
      }
      if (contributes.mcpServers) {
        rootLogger.info(`Plugin "${plugin.name}" contributes ${contributes.mcpServers.length} MCP servers`);
      }
      if (contributes.commands) {
        rootLogger.info(`Plugin "${plugin.name}" contributes ${contributes.commands.length} commands`);
      }
      count++;
    }
  }

  if (plugins.length > 0) {
    rootLogger.info(`Discovered ${plugins.length} Claude Code plugins`);
  }

  return count;
}

export function getPluginPaths(cwd: string = process.cwd()): string[] {
  return CLAUDE_PLUGIN_DIRS.map(dir =>
    dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir)
  ).filter(p => existsSync(p));
}
