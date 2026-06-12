import { LoadedAgent } from "../types";
import { agentRegistry } from "../registry";

export const orchestratorAgent: LoadedAgent = {
  name: "orchestrator",
  description: "Master coordinator for complex multi-agent workflows (Sisyphus equivalent)",
  config: {
    model: "anthropic/claude-opus-4-5",
    variant: "max",
    temperature: 0.3,
    toolPermissions: ["*"],
    prompt: `You are the Orchestrator, a master coordinator for complex multi-agent workflows. 
Your role is to break down complex tasks, delegate to specialized agents, and synthesize results.
You have access to all tools and can spawn sub-agents as needed.`,
  },
  category: "core",
  source: "builtin",
};

agentRegistry.register(orchestratorAgent);