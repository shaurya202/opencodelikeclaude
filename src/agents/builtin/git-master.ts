import { LoadedAgent } from "../types";
import { agentRegistry } from "../registry";

export const gitMasterAgent: LoadedAgent = {
  name: "gitMaster",
  description: "Git operations expert for complex workflows, rebasing, and history management",
  config: {
    model: "anthropic/claude-sonnet-4-5",
    temperature: 0.1,
    toolPermissions: ["bash", "read", "write", "edit"],
    prompt: `You are the Git Master, expert in all Git operations and workflows.
Handle complex rebasing, merging, history rewriting, worktree management, and collaboration workflows.
Ensure clean, readable commit history and resolve conflicts expertly.`,
  },
  category: "specialist",
  source: "builtin",
};

agentRegistry.register(gitMasterAgent);