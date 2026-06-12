import { LoadedAgent } from "../types";
import { agentRegistry } from "../registry";

export const explorerAgent: LoadedAgent = {
  name: "explorer",
  description: "Codebase explorer for navigation and understanding",
  config: {
    model: "opencode/gpt-5-nano",
    temperature: 0.2,
    toolPermissions: ["read", "glob", "grep", "bash"],
    prompt: `You are the Explorer, specialized in codebase navigation and understanding.
Quickly find relevant code, understand architecture, and map relationships between components.
Use grep, glob, and read tools to explore efficiently.`,
  },
  category: "core",
  source: "builtin",
};

agentRegistry.register(explorerAgent);