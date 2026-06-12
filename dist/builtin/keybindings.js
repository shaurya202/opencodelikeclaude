import { commandRegistry } from "../commands/registry";
import { loadConfig } from "../config/loader";
import { configSchema } from "../config/schema";
import { KeyBindingManager } from "../ui/keybindings";
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
export const keybindingsCommand = {
    name: "keybindings",
    description: "Manage custom keybindings",
    usage: "/keybindings [list|add|remove|reset|leader <key>]",
    aliases: ["kb", "keys"],
    category: "ui",
    flags: [
        { name: "list", short: "l", description: "List all keybindings", type: "boolean" },
        { name: "add", short: "a", description: "Add keybinding (format: key:command:description)", type: "string" },
        { name: "remove", short: "r", description: "Remove keybinding by key", type: "string" },
        { name: "reset", description: "Reset to default keybindings", type: "boolean" },
        { name: "leader", description: "Set leader key", type: "string" },
    ],
    handler: async (context) => {
        const { args, flags, cwd } = context;
        const config = loadConfig(cwd);
        const manager = new KeyBindingManager();
        if (flags.reset) {
            try {
                saveConfig(cwd, { ...config, ui: { ...config.ui, keybindings: {} } });
                return { output: "Keybindings reset to defaults" };
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
            }
        }
        if (flags.leader) {
            manager.setLeaderKey(flags.leader);
            try {
                saveConfig(cwd, { ...config, ui: { ...config.ui, leaderKey: flags.leader } });
                return { output: `Leader key set to: ${flags.leader}` };
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
            }
        }
        if (flags.add) {
            const parts = flags.add.split(":");
            if (parts.length < 2) {
                return { error: "Format: key:command[:description]", exitCode: 1 };
            }
            const [key, command, ...descParts] = parts;
            const description = descParts.join(":") || `Custom: ${command}`;
            const binding = { key, command, description };
            manager.addBinding(binding);
            const currentBindings = config.ui.keybindings || {};
            currentBindings[key] = JSON.stringify({ command, description });
            try {
                saveConfig(cwd, { ...config, ui: { ...config.ui, keybindings: currentBindings } });
                return { output: `Added keybinding: ${key} -> ${command}` };
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
            }
        }
        if (flags.remove) {
            const key = flags.remove;
            manager.removeBinding(key);
            const currentBindings = { ...config.ui.keybindings };
            delete currentBindings[key];
            try {
                saveConfig(cwd, { ...config, ui: { ...config.ui, keybindings: currentBindings } });
                return { output: `Removed keybinding: ${key}` };
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
            }
        }
        if (flags.list || args[0] === "list") {
            const bindings = manager.getAllBindings();
            let output = "Current keybindings:\n\n";
            for (const binding of bindings) {
                const when = binding.when ? ` [${binding.when}]` : "";
                output += `  ${binding.key}${when}: ${binding.command} - ${binding.description}\n`;
            }
            output += `\nLeader key: ${manager.getLeaderKey()}`;
            return { output };
        }
        return { output: "Use /keybindings --list to see current keybindings" };
    },
};
export const vimCommand = {
    name: "vim",
    description: "Toggle vim mode",
    usage: "/vim [on|off|toggle]",
    aliases: [],
    category: "ui",
    flags: [
        { name: "on", description: "Enable vim mode", type: "boolean" },
        { name: "off", description: "Disable vim mode", type: "boolean" },
        { name: "toggle", short: "t", description: "Toggle vim mode", type: "boolean" },
    ],
    handler: async (context) => {
        const { flags, cwd } = context;
        const config = loadConfig(cwd);
        let newValue;
        if (flags.on)
            newValue = true;
        else if (flags.off)
            newValue = false;
        else if (flags.toggle)
            newValue = !config.ui.vimMode;
        else
            newValue = !config.ui.vimMode;
        try {
            saveConfig(cwd, { ...config, ui: { ...config.ui, vimMode: newValue } });
            return { output: `Vim mode ${newValue ? "enabled" : "disabled"}` };
        }
        catch (error) {
            return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
        }
    },
};
export const fastCommand = {
    name: "fast",
    description: "Toggle fast mode (minimal UI)",
    usage: "/fast [on|off|toggle]",
    aliases: [],
    category: "ui",
    flags: [
        { name: "on", description: "Enable fast mode", type: "boolean" },
        { name: "off", description: "Disable fast mode", type: "boolean" },
        { name: "toggle", short: "t", description: "Toggle fast mode", type: "boolean" },
    ],
    handler: async (context) => {
        const { flags } = context;
        const config = loadConfig(context.cwd);
        let newValue;
        if (flags.on)
            newValue = true;
        else if (flags.off)
            newValue = false;
        else if (flags.toggle)
            newValue = !config.experimental.aggressiveTruncation;
        else
            newValue = !config.experimental.aggressiveTruncation;
        try {
            saveConfig(context.cwd, {
                ...config,
                experimental: { ...config.experimental, aggressiveTruncation: newValue }
            });
            return { output: `Fast mode ${newValue ? "enabled" : "disabled"}` };
        }
        catch (error) {
            return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
        }
    },
};
commandRegistry.register({ ...keybindingsCommand, source: "builtin" });
commandRegistry.register({ ...vimCommand, source: "builtin" });
commandRegistry.register({ ...fastCommand, source: "builtin" });
//# sourceMappingURL=keybindings.js.map