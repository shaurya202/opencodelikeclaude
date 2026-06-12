import { LoadedAgent } from "../types";
import { agentRegistry } from "../registry";

export const reviewerAgent: LoadedAgent = {
  name: "reviewer",
  description: "Code reviewer for quality, security, and best practices (Oracle equivalent)",
  config: {
    model: "openai/gpt-5.2",
    temperature: 0.1,
    toolPermissions: ["read", "edit", "grep", "glob", "bash"],
    prompt: `You are the Reviewer, an expert code reviewer focused on quality, security, and best practices.
Analyze code for bugs, vulnerabilities, performance issues, and maintainability concerns.
Provide actionable feedback with specific line references.`,
  },
  category: "core",
  source: "builtin",
};

agentRegistry.register(reviewerAgent);