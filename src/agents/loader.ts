import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { AgentFile, LoadedAgent } from "./types";
import { agentRegistry } from "./registry";
import { expandHome } from "../utils/path";
import { parseJsonc } from "../utils/jsonc";

const AGENT_DIRS = [
  ".opencode/agents",
  "~/.config/opencode/agents",
  "~/.claude/agents",
  ".claude/agents",
];

function parseAgentFile(filePath: string): AgentFile | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    
    if (filePath.endsWith(".json") || filePath.endsWith(".jsonc")) {
      return parseJsonc<AgentFile>(content);
    }
    
    return null;
  } catch (error) {
    console.warn(`[AgentLoader] Failed to parse ${filePath}:`, error);
    return null;
  }
}

function loadAgentFromFile(filePath: string, source: "filesystem" | "claude-compat"): LoadedAgent | null {
  const agentFile = parseAgentFile(filePath);
  if (!agentFile) return null;

  const agent: LoadedAgent = {
    name: agentFile.name,
    description: agentFile.description,
    config: {
      model: agentFile.model,
      variant: agentFile.variant,
      fallbackModels: agentFile.fallbackModels,
      temperature: agentFile.temperature,
      toolPermissions: agentFile.toolPermissions,
      prompt: agentFile.prompt,
    },
    category: agentFile.category,
    source,
    filePath,
  };

  return agent;
}

export function loadAgentsFromDir(dir: string, source: "filesystem" | "claude-compat" = "filesystem"): number {
  const expandedDir = expandHome(dir);
  if (!existsSync(expandedDir)) return 0;

  let count = 0;
  const entries = readdirSync(expandedDir);

  for (const entry of entries) {
    const fullPath = join(expandedDir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      count += loadAgentsFromDir(fullPath, source);
    } else if (extname(entry) === ".json" || extname(entry) === ".jsonc") {
      const agent = loadAgentFromFile(fullPath, source);
      if (agent) {
        agentRegistry.register(agent);
        count++;
      }
    }
  }

  return count;
}

export function loadAllAgents(cwd: string = process.cwd()): number {
  let total = 0;
  
  for (const dir of AGENT_DIRS) {
    const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
    total += loadAgentsFromDir(fullPath, dir.includes(".claude") ? "claude-compat" : "filesystem");
  }
  
  return total;
}

export { agentRegistry };