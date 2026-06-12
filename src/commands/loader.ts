import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { execSync } from "child_process";
import { CommandFile, LoadedCommand, CommandContext, CommandResult } from "./types";
import { commandRegistry } from "./registry";
import { expandHome } from "../utils/path";
import { parseJsonc } from "../utils/jsonc";

const COMMAND_DIRS = [
  ".opencode/commands",
  "~/.config/opencode/commands",
  "~/.claude/commands",
  ".claude/commands",
];

function parseCommandFile(filePath: string): CommandFile | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    
    if (filePath.endsWith(".json") || filePath.endsWith(".jsonc")) {
      return parseJsonc<CommandFile>(content);
    }
    
    if (filePath.endsWith(".js") || filePath.endsWith(".ts")) {
      return null;
    }
    
    return null;
  } catch (error) {
    console.warn(`[CommandLoader] Failed to parse ${filePath}:`, error);
    return null;
  }
}

function executeScript(script: string, context: CommandContext, filePath: string, ext: string): CommandResult {
  if (ext === ".js") {
    try {
      const fn = new Function("context", script);
      const result = fn(context);
      if (result && typeof result === "object" && "output" in result) {
        return result as CommandResult;
      }
      return { output: String(result), exitCode: 0 };
    } catch (error) {
      return { error: `Script execution failed: ${error}`, exitCode: 1 };
    }
  }

  try {
    const output = execSync(script, {
      cwd: context.cwd,
      timeout: 120000,
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
      encoding: "utf-8",
    } as Record<string, unknown>) as unknown as string;
    return { output: output || "Script completed", exitCode: 0 };
  } catch (error) {
    const err = error as { stdout?: Buffer; stderr?: Buffer; message: string };
    return {
      error: err.stderr?.toString() || err.message,
      output: err.stdout?.toString(),
      exitCode: 1,
    };
  }
}

function loadCommandFromFile(filePath: string, source: "filesystem" | "claude-compat"): LoadedCommand | null {
  const ext = extname(filePath);
  const isScript = ext === ".js" || ext === "";

  if (isScript) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const name = filePath.split(/[/\\]/).pop()?.replace(/\.[^.]+$/, "") || "unknown";
      const command: LoadedCommand = {
        name,
        description: `Custom command: ${name}`,
        handler: async (context: CommandContext) => executeScript(content, context, filePath, ext),
        source,
        filePath,
      };
      return command;
    } catch (error) {
      console.warn(`[CommandLoader] Failed to load script ${filePath}:`, error);
      return null;
    }
  }

  const commandFile = parseCommandFile(filePath);
  if (!commandFile) return null;

  const command: LoadedCommand = {
    ...commandFile,
    handler: async (context: CommandContext) => {
      if (commandFile.script) {
        return executeScript(commandFile.script, context, filePath, ".js");
      }
      return { output: `Command ${commandFile.name} executed` };
    },
    source,
    filePath,
  };

  return command;
}

export function loadCommandsFromDir(dir: string, source: "filesystem" | "claude-compat" = "filesystem"): number {
  const expandedDir = expandHome(dir);
  if (!existsSync(expandedDir)) return 0;

  let count = 0;
  const entries = readdirSync(expandedDir);

  for (const entry of entries) {
    const fullPath = join(expandedDir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      count += loadCommandsFromDir(fullPath, source);
    } else if (extname(entry) === ".json" || extname(entry) === ".jsonc" || extname(entry) === ".js" || extname(entry) === "") {
      const command = loadCommandFromFile(fullPath, source);
      if (command) {
        commandRegistry.register(command);
        count++;
      }
    }
  }

  return count;
}

export function loadAllCommands(cwd: string = process.cwd()): number {
  let total = 0;
  
  for (const dir of COMMAND_DIRS) {
    const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
    total += loadCommandsFromDir(fullPath, dir.includes(".claude") ? "claude-compat" : "filesystem");
  }
  
  return total;
}

export { commandRegistry };