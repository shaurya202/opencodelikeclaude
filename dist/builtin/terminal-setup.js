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
function expandHome(path) {
    if (path.startsWith("~/")) {
        return join(process.env.HOME || process.env.USERPROFILE || "", path.slice(2));
    }
    return path;
}
function findConfigFile(cwd) {
    for (const relPath of CONFIG_PATHS) {
        const fullPath = expandHome(relPath.startsWith("~/") ? relPath : join(cwd, relPath));
        if (existsSync(fullPath)) {
            return fullPath;
        }
    }
    return null;
}
function parseJsonc(content) {
    const lines = content.split("\n");
    const cleaned = lines
        .map(line => {
        const commentIndex = line.indexOf("//");
        return commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    })
        .join("\n");
    return JSON.parse(cleaned);
}
function saveConfig(cwd, config) {
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
const terminalPresets = [
    {
        name: "iterm2",
        label: "iTerm2",
        description: "iTerm2 terminal emulator for macOS",
        shortcuts: [
            "Cmd+D: Split pane vertically",
            "Cmd+Shift+D: Split pane horizontally",
            "Cmd+[ / ]: Navigate panes",
            "Cmd+T: New tab",
            "Cmd+W: Close pane/tab",
            "Cmd+Enter: Toggle fullscreen",
        ],
        font: "JetBrains Mono",
    },
    {
        name: "vscode",
        label: "VS Code",
        description: "Visual Studio Code integrated terminal",
        shortcuts: [
            "Ctrl+`: Toggle terminal",
            "Ctrl+Shift+`: Create new terminal",
            "Ctrl+Shift+5: Split terminal",
            "Ctrl+PageUp/PageDown: Switch terminals",
            "Ctrl+Shift+F: Find in terminal",
            "Ctrl+C: Copy (when selected)",
        ],
        font: "JetBrains Mono",
    },
    {
        name: "windows-terminal",
        label: "Windows Terminal",
        description: "Windows Terminal for Windows 10/11",
        shortcuts: [
            "Alt+Shift+D: Split pane",
            "Alt+Shift+Minus: Split horizontal",
            "Alt+Shift+Plus: Split vertical",
            "Ctrl+Shift+T: New tab",
            "Ctrl+W: Close tab",
            "Ctrl+Tab: Next tab",
            "Ctrl+Shift+1-9: Switch to tab",
        ],
        font: "Cascadia Code",
    },
    {
        name: "tmux",
        label: "tmux",
        description: "Terminal multiplexer (cross-platform)",
        shortcuts: [
            "Ctrl+B %: Split vertical",
            "Ctrl+B \": Split horizontal",
            "Ctrl+B arrow: Navigate panes",
            "Ctrl+B c: New window",
            "Ctrl+B n/p: Next/previous window",
            "Ctrl+B [: Enter scroll mode",
            "Ctrl+B d: Detach session",
        ],
        font: "monospace",
    },
    {
        name: "kitty",
        label: "Kitty",
        description: "GPU-accelerated terminal emulator",
        shortcuts: [
            "Ctrl+Shift+Enter: New window",
            "Ctrl+Shift+]: Next window",
            "Ctrl+Shift+[: Previous window",
            "Ctrl+Shift+L: Split vertical",
            "Ctrl+Shift+E: Split horizontal",
            "Ctrl+Shift+T: New tab",
        ],
        font: "JetBrains Mono",
    },
];
export const terminalSetupCommand = {
    name: "terminal-setup",
    description: "Configure terminal emulator integration",
    usage: "/terminal-setup [list|set <name>|info]",
    aliases: ["term", "terminal"],
    category: "ui",
    flags: [
        { name: "list", short: "l", description: "List supported terminal emulators", type: "boolean" },
        { name: "set", short: "s", description: "Set terminal emulator", type: "string" },
        { name: "info", short: "i", description: "Show current terminal info", type: "boolean" },
    ],
    handler: async (context) => {
        const { args, flags, cwd } = context;
        const config = loadConfig(cwd);
        if (flags.list || args[0] === "list") {
            let output = "Supported terminal emulators:\n\n";
            for (const preset of terminalPresets) {
                const current = preset.name === config.ui.terminal ? " (current)" : "";
                output += `  ${preset.name}${current}: ${preset.label} - ${preset.description}\n`;
                output += `    Font: ${preset.font || "default"}\n`;
                output += `    Shortcuts:\n`;
                for (const shortcut of preset.shortcuts) {
                    output += `      ${shortcut}\n`;
                }
                output += "\n";
            }
            return { output };
        }
        if (flags.info || args[0] === "info") {
            if (!config.ui.terminal) {
                return { output: "No terminal emulator configured. Use /terminal-setup set <name> to configure." };
            }
            const preset = terminalPresets.find(p => p.name === config.ui.terminal);
            if (preset) {
                let output = `Current terminal: ${preset.label}\n\n`;
                output += `Shortcuts:\n`;
                for (const shortcut of preset.shortcuts) {
                    output += `  ${shortcut}\n`;
                }
                return { output };
            }
            return { output: `Current terminal: ${config.ui.terminal}` };
        }
        const terminalName = flags.set || args[0];
        if (!terminalName) {
            return { output: "Use /terminal-setup list to see available terminals." };
        }
        const preset = terminalPresets.find(p => p.name === terminalName);
        if (!preset) {
            return { error: `Unknown terminal: ${terminalName}. Use /terminal-setup list to see options.`, exitCode: 1 };
        }
        try {
            saveConfig(cwd, { ...config, ui: { ...config.ui, terminal: terminalName } });
            return { output: `Terminal set to: ${preset.label}\n\nConfigured shortcuts:\n${preset.shortcuts.map(s => `  ${s}`).join("\n")}` };
        }
        catch (error) {
            return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
        }
    },
};
commandRegistry.register({ ...terminalSetupCommand, source: "builtin" });
//# sourceMappingURL=terminal-setup.js.map