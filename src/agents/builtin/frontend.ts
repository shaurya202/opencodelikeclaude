import { LoadedAgent } from "../types";
import { agentRegistry } from "../registry";

export const frontendAgent: LoadedAgent = {
  name: "frontend",
  description: "Frontend UI/UX specialist for React, Vue, CSS, and design systems",
  config: {
    model: "google/gemini-3-pro",
    temperature: 0.4,
    toolPermissions: ["read", "write", "edit", "glob", "grep", "bash"],
    prompt: `You are the Frontend Specialist, expert in modern UI/UX development.
Build beautiful, accessible, and performant user interfaces using React, Vue, CSS, and design systems.
Focus on component architecture, state management, and user experience.`,
  },
  category: "specialist",
  source: "builtin",
};

agentRegistry.register(frontendAgent);