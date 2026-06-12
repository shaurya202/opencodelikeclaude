import { LoadedAgent, AgentContext, AgentResult } from "./types";
import { sdk } from "../sdk";

export class AgentRegistry {
  private agents: Map<string, LoadedAgent> = new Map();
  private categories: Map<string, LoadedAgent[]> = new Map();

  register(agent: LoadedAgent): void {
    if (this.agents.has(agent.name)) {
      console.warn(`[AgentRegistry] Agent "${agent.name}" already registered, overwriting`);
    }
    this.agents.set(agent.name, agent);
    
    const category = agent.category || "general";
    const categoryAgents = this.categories.get(category) || [];
    categoryAgents.push(agent);
    this.categories.set(category, categoryAgents);
  }

  unregister(name: string): void {
    const agent = this.agents.get(name);
    if (!agent) return;
    
    this.agents.delete(name);
    const category = agent.category || "general";
    const categoryAgents = this.categories.get(category) || [];
    const filtered = categoryAgents.filter(a => a.name !== name);
    this.categories.set(category, filtered);
  }

  get(name: string): LoadedAgent | undefined {
    return this.agents.get(name);
  }

  getAll(): LoadedAgent[] {
    return Array.from(this.agents.values());
  }

  getByCategory(category: string): LoadedAgent[] {
    return this.categories.get(category) || [];
  }

  getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  async execute(name: string, context: AgentContext): Promise<AgentResult> {
    const agent = this.get(name);
    if (!agent) {
      return {
        output: "",
        error: `Agent not found: ${name}`,
      };
    }

    try {
      return await this.runAgent(agent, context);
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async runAgent(agent: LoadedAgent, context: AgentContext): Promise<AgentResult> {
    if (sdk.shouldUseRealImplementations()) {
      const systemPrompt = agent.config.prompt
        ? `You are ${agent.name}. ${agent.config.prompt}`
        : `You are ${agent.name}, a specialized AI agent. ${agent.description}. Execute the given task.`;
      const response = await sdk.callLlm({
        systemPrompt,
        userMessage: context.task,
        model: agent.config.model,
      });
      return {
        output: response.content,
        metadata: { agent: agent.name, model: response.model, usage: response.usage },
      };
    }
    return {
      output: `Agent ${agent.name} executed task: ${context.task}`,
      metadata: { agent: agent.name, model: agent.config.model },
    };
  }
}

export const agentRegistry = new AgentRegistry();