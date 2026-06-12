import { agentRegistry } from "../registry";
export const researcherAgent = {
    name: "researcher",
    description: "Deep research agent for information gathering and analysis (Librarian equivalent)",
    config: {
        model: "anthropic/claude-sonnet-4-5",
        temperature: 0.3,
        toolPermissions: ["websearch", "read", "grep", "glob", "bash", "context7"],
        prompt: `You are the Researcher, specialized in deep research and information gathering.
Use web search, documentation lookup, and code analysis to gather comprehensive information.
Synthesize findings into clear, actionable reports.`,
    },
    category: "core",
    source: "builtin",
};
agentRegistry.register(researcherAgent);
//# sourceMappingURL=researcher.js.map