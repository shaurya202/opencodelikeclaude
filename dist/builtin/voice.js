import { commandRegistry } from "../commands/registry";
import { loadConfig } from "../config/loader";
import { configSchema } from "../config/schema";
import { voiceManager } from "../ui/voice";
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
export const voiceCommand = {
    name: "voice",
    description: "Toggle voice dictation mode",
    usage: "/voice [on|off|toggle|key <key>]",
    aliases: ["vc"],
    category: "ui",
    flags: [
        { name: "on", description: "Enable voice mode", type: "boolean" },
        { name: "off", description: "Disable voice mode", type: "boolean" },
        { name: "toggle", short: "t", description: "Toggle voice mode", type: "boolean" },
        { name: "key", description: "Set push-to-talk key", type: "string" },
        { name: "status", short: "s", description: "Show voice mode status", type: "boolean" },
    ],
    handler: async (context) => {
        const { flags, cwd } = context;
        const config = loadConfig(cwd);
        if (flags.status) {
            const state = voiceManager.getState();
            return {
                output: `Voice mode: ${config.ui.voiceEnabled ? "enabled" : "disabled"}\nState: ${state}\nPush-to-talk key: ${config.ui.pushToTalkKey}`,
            };
        }
        if (flags.key) {
            voiceManager.updateConfig({ pushToTalkKey: flags.key });
            try {
                saveConfig(cwd, { ...config, ui: { ...config.ui, pushToTalkKey: flags.key } });
                return { output: `Push-to-talk key set to: ${flags.key}` };
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
            }
        }
        let newValue;
        if (flags.on)
            newValue = true;
        else if (flags.off)
            newValue = false;
        else if (flags.toggle)
            newValue = !config.ui.voiceEnabled;
        else
            newValue = !config.ui.voiceEnabled;
        voiceManager.updateConfig({ enabled: newValue });
        if (newValue) {
            voiceManager.startListening().catch(() => { });
        }
        else {
            voiceManager.stopListening();
        }
        try {
            saveConfig(cwd, { ...config, ui: { ...config.ui, voiceEnabled: newValue } });
            return { output: `Voice mode ${newValue ? "enabled" : "disabled"}` };
        }
        catch (error) {
            return { error: error instanceof Error ? error.message : String(error), exitCode: 1 };
        }
    },
};
commandRegistry.register({ ...voiceCommand, source: "builtin" });
//# sourceMappingURL=voice.js.map