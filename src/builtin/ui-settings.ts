import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { loadConfig } from "../config/loader";
import { configSchema } from "../config/schema";
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

export const diffCommand: CommandDefinition = {
  name: "diff",
  description: "Configure diff display style",
  usage: "/diff [auto|stacked|inline]",
  aliases: [],
  category: "ui",
  flags: [
    { name: "set", short: "s", description: "Set diff style (auto, stacked, inline)", type: "string" },
    { name: "get", short: "g", description: "Show current diff style", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags, cwd } = context;
    const config = loadConfig(cwd);

    if (flags.get || args[0] === "get") {
      return { output: `Current diff style: ${config.ui.diffStyle}` };
    }

    const style = (flags.set as string) || args[0];
    if (!style) {
      return { output: `Current diff style: ${config.ui.diffStyle}\nAvailable: auto, stacked, inline` };
    }

    const validStyles = ["auto", "stacked", "inline"];
    if (!validStyles.includes(style)) {
      return { error: `Invalid diff style: ${style}. Choose from: auto, stacked, inline`, exitCode: 1 };
    }

    try {
      saveConfig(cwd, { ...config, ui: { ...config.ui, diffStyle: style as "auto" | "stacked" | "inline" } });
      return { output: `Diff style set to: ${style}` };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
    }
  },
};

export const mouseCommand: CommandDefinition = {
  name: "mouse",
  description: "Toggle mouse capture",
  usage: "/mouse [on|off|toggle]",
  aliases: [],
  category: "ui",
  flags: [
    { name: "on", description: "Enable mouse capture", type: "boolean" },
    { name: "off", description: "Disable mouse capture", type: "boolean" },
    { name: "toggle", short: "t", description: "Toggle mouse capture", type: "boolean" },
    { name: "status", short: "s", description: "Show mouse capture status", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags, cwd } = context;
    const config = loadConfig(cwd);

    if (flags.status) {
      return { output: `Mouse capture: ${config.ui.mouseCapture ? "enabled" : "disabled"}` };
    }

    let newValue: boolean;
    if (flags.on) newValue = true;
    else if (flags.off) newValue = false;
    else if (flags.toggle) newValue = !config.ui.mouseCapture;
    else newValue = !config.ui.mouseCapture;

    try {
      saveConfig(cwd, { ...config, ui: { ...config.ui, mouseCapture: newValue } });
      return { output: `Mouse capture ${newValue ? "enabled" : "disabled"}` };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
    }
  },
};

export const scrollCommand: CommandDefinition = {
  name: "scroll",
  description: "Configure scroll behavior",
  usage: "/scroll [speed <1-10>|acceleration on|off|toggle]",
  aliases: [],
  category: "ui",
  flags: [
    { name: "speed", description: "Set scroll speed (1-10)", type: "number" },
    { name: "acceleration", description: "Toggle scroll acceleration", type: "boolean" },
    { name: "status", short: "s", description: "Show scroll settings", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags, cwd } = context;
    const config = loadConfig(cwd);

    if (flags.status) {
      return {
        output: `Scroll speed: ${config.ui.scrollSpeed}/10\nScroll acceleration: ${config.ui.scrollAcceleration ? "enabled" : "disabled"}`,
      };
    }

    if (flags.speed !== undefined) {
      const speed = Number(flags.speed);
      if (isNaN(speed) || speed < 1 || speed > 10) {
        return { error: "Speed must be a number between 1 and 10", exitCode: 1 };
      }
      try {
        saveConfig(cwd, { ...config, ui: { ...config.ui, scrollSpeed: speed } });
        return { output: `Scroll speed set to: ${speed}/10` };
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
      }
    }

    if (flags.acceleration !== undefined) {
      const newValue = !config.ui.scrollAcceleration;
      try {
        saveConfig(cwd, { ...config, ui: { ...config.ui, scrollAcceleration: newValue } });
        return { output: `Scroll acceleration ${newValue ? "enabled" : "disabled"}` };
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
      }
    }

    return {
      output: `Scroll speed: ${config.ui.scrollSpeed}/10\nScroll acceleration: ${config.ui.scrollAcceleration ? "enabled" : "disabled"}\n\nUse /scroll speed <1-10> or /scroll acceleration [on|off|toggle]`,
    };
  },
};

export const soundCommand: CommandDefinition = {
  name: "sound",
  description: "Toggle notification sounds",
  usage: "/sound [on|off|toggle]",
  aliases: [],
  category: "ui",
  flags: [
    { name: "on", description: "Enable notification sounds", type: "boolean" },
    { name: "off", description: "Disable notification sounds", type: "boolean" },
    { name: "toggle", short: "t", description: "Toggle notification sounds", type: "boolean" },
    { name: "status", short: "s", description: "Show sound settings", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags, cwd } = context;
    const config = loadConfig(cwd);

    if (flags.status) {
      return { output: `Notification sounds: ${config.ui.notificationSounds ? "enabled" : "disabled"}` };
    }

    let newValue: boolean;
    if (flags.on) newValue = true;
    else if (flags.off) newValue = false;
    else if (flags.toggle) newValue = !config.ui.notificationSounds;
    else newValue = !config.ui.notificationSounds;

    try {
      saveConfig(cwd, { ...config, ui: { ...config.ui, notificationSounds: newValue } });
      return { output: `Notification sounds ${newValue ? "enabled" : "disabled"}` };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
    }
  },
};

commandRegistry.register({ ...diffCommand, source: "builtin" });
commandRegistry.register({ ...mouseCommand, source: "builtin" });
commandRegistry.register({ ...scrollCommand, source: "builtin" });
commandRegistry.register({ ...soundCommand, source: "builtin" });
