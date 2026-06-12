import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { remoteControlServer } from "../remote/control";
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
  const merged = { ...result.data, remote: { ...result.data.remote, ...config.remote } };
  writeFileSync(configPath, JSON.stringify(merged, null, 2));
}

export const remoteControlCommand: CommandDefinition = {
  name: "remote-control",
  description: "Manage remote control server for app control",
  usage: "/remote-control [start|stop|status|port <port>|host <host>]",
  aliases: ["rc", "remote"],
  category: "remote",
  flags: [
    { name: "start", short: "s", description: "Start remote control server", type: "boolean" },
    { name: "stop", short: "t", description: "Stop remote control server", type: "boolean" },
    { name: "status", short: "u", description: "Show server status", type: "boolean" },
    { name: "port", short: "p", description: "Set server port", type: "number" },
    { name: "host", description: "Set server host", type: "string" },
    { name: "sessions", short: "l", description: "List connected sessions", type: "boolean" },
    { name: "disconnect", short: "d", description: "Disconnect session by ID", type: "string" },
    { name: "broadcast", short: "b", description: "Broadcast message to all sessions", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags, cwd } = context;
    const config = loadConfig(cwd);

    if (flags.status) {
      const status = remoteControlServer.getStatus();
      const sessions = remoteControlServer.getSessions();
      return {
        output: `Remote control: ${config.remote.control.enabled ? "enabled" : "disabled"}\nServer: ${status}\nHost: ${config.remote.control.host}:${config.remote.control.port}\nConnected sessions: ${sessions.length}`,
      };
    }

    if (flags.sessions) {
      const sessions = remoteControlServer.getSessions();
      if (sessions.length === 0) return { output: "No connected sessions." };
      let output = "Connected sessions:\n\n";
      for (const s of sessions) {
        output += `  ${s.id.slice(0, 8)}: ${s.clientId} (${s.ip}) - ${new Date(s.connectedAt).toLocaleString()}\n`;
      }
      return { output };
    }

    if (flags.disconnect) {
      const found = remoteControlServer.disconnectSession(flags.disconnect as string);
      return { output: found ? "Session disconnected" : "Session not found" };
    }

    if (flags.broadcast) {
      remoteControlServer.broadcast(flags.broadcast as string);
      return { output: "Message broadcast to all sessions" };
    }

    if (flags.start) {
      remoteControlServer.updateConfig({ enabled: true, port: Number(flags.port) || config.remote.control.port, host: (flags.host as string) || config.remote.control.host });
      await remoteControlServer.start();
      try { saveConfig(cwd, { ...config, remote: { ...config.remote, control: { ...config.remote.control, enabled: true } } }); } catch { /* ignore */ }
      return { output: `Remote control server started on ${config.remote.control.host}:${config.remote.control.port}` };
    }

    if (flags.stop) {
      await remoteControlServer.stop();
      return { output: "Remote control server stopped" };
    }

    if (flags.port) {
      remoteControlServer.updateConfig({ port: Number(flags.port) });
      try { saveConfig(cwd, { ...config, remote: { ...config.remote, control: { ...config.remote.control, port: Number(flags.port) } } }); } catch { /* ignore */ }
      return { output: `Remote control port set to: ${flags.port}` };
    }

    const status = remoteControlServer.getStatus();
    const sessions = remoteControlServer.getSessions();
    return {
      output: `Remote control server: ${status}\nHost: ${config.remote.control.host}:${config.remote.control.port}\nSessions: ${sessions.length}\n\nUse /remote-control --start to start, --status for details, --sessions to list connections.`,
    };
  },
};

commandRegistry.register({ ...remoteControlCommand, source: "builtin" });
