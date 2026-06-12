import { commandRegistry } from "../commands/registry";
import { ideManager } from "../remote/ide";
import { chromeManager } from "../remote/chrome";
import { webSyncManager } from "../remote/sync";
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
    const merged = { ...result.data, remote: { ...result.data.remote, ...config.remote } };
    writeFileSync(configPath, JSON.stringify(merged, null, 2));
}
export const ideCommand = {
    name: "ide",
    description: "Manage IDE integration and browser connection",
    usage: "/ide [connect|disconnect|status|detect] [--name <name>] [chrome|sync <command>]",
    aliases: [],
    category: "remote",
    flags: [
        { name: "connect", short: "c", description: "Connect to IDE", type: "string" },
        { name: "disconnect", short: "d", description: "Disconnect from IDE", type: "boolean" },
        { name: "status", short: "s", description: "Show IDE status", type: "boolean" },
        { name: "detect", description: "Detect running IDEs", type: "boolean" },
        { name: "name", short: "n", description: "IDE name for connection", type: "string" },
        { name: "chrome", description: "Chrome integration action (launch, close, status)", type: "string" },
        { name: "sync", description: "Web sync action (push, pull, status)", type: "string" },
        { name: "session", description: "Session ID for sync operations", type: "string" },
        { name: "enable", short: "e", description: "Enable IDE integration", type: "boolean" },
        { name: "disable", short: "x", description: "Disable IDE integration", type: "boolean" },
    ],
    handler: async (context) => {
        const { flags, cwd } = context;
        const config = loadConfig(cwd);
        if (flags.detect) {
            const detected = ideManager.detectIDE();
            return { output: `Detected IDEs: ${detected.join(", ") || "none"}` };
        }
        if (flags.chrome) {
            const action = flags.chrome;
            switch (action) {
                case "launch":
                    chromeManager.updateConfig({ enabled: true });
                    await chromeManager.launch();
                    return { output: "Chrome launched with remote debugging" };
                case "close":
                    await chromeManager.close();
                    return { output: "Chrome closed" };
                case "status":
                    return { output: `Chrome: ${chromeManager.isActive() ? "running" : "stopped"}` };
                default:
                    return { output: "Chrome actions: launch, close, status" };
            }
        }
        if (flags.sync) {
            const action = flags.sync;
            const sessionId = flags.session || "default";
            switch (action) {
                case "push":
                    webSyncManager.updateConfig({ enabled: true });
                    await webSyncManager.push(sessionId, { synced: true });
                    return { output: `Session ${sessionId.slice(0, 8)} pushed to web` };
                case "pull":
                    webSyncManager.updateConfig({ enabled: true });
                    await webSyncManager.pull(sessionId);
                    return { output: `Session ${sessionId.slice(0, 8)} pulled from web` };
                case "status": {
                    const records = webSyncManager.getRecords(sessionId);
                    return { output: `Web sync: ${records.length} records\nLast: ${records.length > 0 ? new Date(records[records.length - 1].timestamp).toLocaleString() : "never"}` };
                }
                default:
                    return { output: "Sync actions: push, pull, status" };
            }
        }
        if (flags.connect) {
            ideManager.updateConfig({ enabled: true });
            const name = flags.connect || flags.name || "IDE";
            await ideManager.connect(name);
            try {
                saveConfig(cwd, { ...config, remote: { ...config.remote, ide: { ...config.remote.ide, enabled: true } } });
            }
            catch { /* ignore */ }
            return { output: `Connected to IDE: ${name}` };
        }
        if (flags.disconnect) {
            await ideManager.disconnect();
            return { output: "Disconnected from IDE" };
        }
        if (flags.enable) {
            ideManager.updateConfig({ enabled: true });
            try {
                saveConfig(cwd, { ...config, remote: { ...config.remote, ide: { ...config.remote.ide, enabled: true } } });
            }
            catch { /* ignore */ }
            return { output: "IDE integration enabled" };
        }
        if (flags.disable) {
            ideManager.updateConfig({ enabled: false });
            await ideManager.disconnect();
            try {
                saveConfig(cwd, { ...config, remote: { ...config.remote, ide: { ...config.remote.ide, enabled: false } } });
            }
            catch { /* ignore */ }
            return { output: "IDE integration disabled" };
        }
        const connected = ideManager.isConnected();
        const conn = ideManager.getConnection();
        const chromeActive = chromeManager.isActive();
        const syncRecords = webSyncManager.getRecords().length;
        const detected = ideManager.detectIDE();
        return {
            output: `IDE integration: ${config.remote.ide.enabled ? "enabled" : "disabled"}\nConnected: ${connected ? `yes (${conn.name} v${conn.version})` : "no"}\nDetected: ${detected.join(", ")}\nChrome: ${chromeActive ? "running" : "stopped"}\nWeb sync records: ${syncRecords}\n\nCommands: /ide --connect <name>, --disconnect, --detect, --chrome launch|close|status, --sync push|pull|status`,
        };
    },
};
commandRegistry.register({ ...ideCommand, source: "builtin" });
//# sourceMappingURL=ide.js.map