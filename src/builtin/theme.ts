import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { loadConfig } from "../config/loader";
import { configSchema } from "../config/schema";
import { getTheme, listThemes } from "../ui/themes";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

const CONFIG_PATHS = [
  ".opencode/opencode-claude-parity.jsonc",
  ".opencode/opencode-claude-parity.json",
  "~/.config/opencode/opencode-claude-parity.jsonc",
  "~/.config/opencode/opencode-claude-parity.json",
];

function expandHome(path: string): string {
  if (path.startsWith("~/")) {
    return join(process.env.HOME || process.env.USERPROFILE || "", path.slice(2));
  }
  return path;
}

function findConfigFile(cwd: string): string | null {
  for (const relPath of CONFIG_PATHS) {
    const fullPath = expandHome(relPath.startsWith("~/") ? relPath : join(cwd, relPath));
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

function parseJsonc(content: string): unknown {
  const lines = content.split("\n");
  const cleaned = lines
    .map(line => {
      const commentIndex = line.indexOf("//");
      return commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    })
    .join("\n");
  return JSON.parse(cleaned);
}

function saveConfig(cwd: string, config: ReturnType<typeof loadConfig>): void {
  const configPath = findConfigFile(cwd);
  if (!configPath) {
    throw new Error("No config file found. Run /init to create one.");
  }
  
  const content = readFileSync(configPath, "utf-8");
  const parsed = parseJsonc(content);
  const result = configSchema.safeParse(parsed);
  
  if (!result.success) {
    throw new Error(`Config validation failed: ${result.error.message}`);
  }
  
  const merged = {
    ...result.data,
    ui: {
      ...result.data.ui,
      ...config.ui,
    },
  };
  
  const output = JSON.stringify(merged, null, 2);
  writeFileSync(configPath, output);
}

export const themeCommand: CommandDefinition = {
  name: "theme",
  description: "Manage UI themes",
  usage: "/theme [list|get|set <name>]",
  aliases: ["th"],
  category: "ui",
  flags: [
    { name: "list", short: "l", description: "List available themes", type: "boolean" },
    { name: "get", short: "g", description: "Get current theme", type: "boolean" },
    { name: "set", short: "s", description: "Set theme by name", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags, cwd } = context;
    const config = loadConfig(cwd);
    
    if (flags.list || args[0] === "list") {
      const themes = listThemes();
      let output = "Available themes:\n\n";
      for (const themeName of themes) {
        const theme = getTheme(themeName);
        const current = themeName === config.ui.theme ? " (current)" : "";
        output += `  ${themeName}${current}: ${theme?.displayName}\n`;
      }
      return { output };
    }
    
    if (flags.get || args[0] === "get") {
      const theme = getTheme(config.ui.theme);
      return { output: `Current theme: ${config.ui.theme} (${theme?.displayName})` };
    }
    
    const themeName = (flags.set as string) || args[0];
    if (!themeName) {
      return { error: "Theme name required. Use /theme list to see available themes.", exitCode: 1 };
    }
    
    const theme = getTheme(themeName);
    if (!theme) {
      return { error: `Theme not found: ${themeName}. Use /theme list to see available themes.`, exitCode: 1 };
    }
    
    try {
      saveConfig(cwd, { ...config, ui: { ...config.ui, theme: themeName } });
      return { output: `Theme set to: ${themeName} (${theme.displayName})` };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
    }
  },
};

export const colorCommand: CommandDefinition = {
  name: "color",
  description: "Customize prompt bar color",
  usage: "/color [get|set <color>]",
  aliases: ["clr"],
  category: "ui",
  flags: [
    { name: "list", short: "l", description: "List available colors", type: "boolean" },
    { name: "get", short: "g", description: "Get current color", type: "boolean" },
    { name: "set", short: "s", description: "Set color by name", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags, cwd } = context;
    const config = loadConfig(cwd);
    
    const builtinColors = ["default", "red", "green", "blue", "yellow", "purple", "cyan", "orange", "pink"];
    
    if (flags.list || args[0] === "list") {
      let output = "Available colors:\n\n";
      for (const color of builtinColors) {
        const current = color === config.ui.color ? " (current)" : "";
        output += `  ${color}${current}\n`;
      }
      return { output };
    }
    
    if (flags.get || args[0] === "get") {
      return { output: `Current color: ${config.ui.color}` };
    }
    
    const colorName = (flags.set as string) || args[0];
    if (!colorName) {
      return { error: "Color name required. Use /color list to see available colors.", exitCode: 1 };
    }
    
    if (!builtinColors.includes(colorName)) {
      return { error: `Color not found: ${colorName}. Use /color list to see available colors.`, exitCode: 1 };
    }
    
    try {
      saveConfig(cwd, { ...config, ui: { ...config.ui, color: colorName } });
      return { output: `Prompt color set to: ${colorName}` };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
    }
  },
};

commandRegistry.register({ ...themeCommand, source: "builtin" });
commandRegistry.register({ ...colorCommand, source: "builtin" });