import { agentRegistry } from "../registry";
export const plannerAgent = {
    name: "planner",
    description: "Strategic planner for task decomposition and execution planning (Prometheus equivalent)",
    config: {
        model: "anthropic/claude-sonnet-4-5",
        temperature: 0.2,
        toolPermissions: ["read", "write", "edit", "glob", "grep", "task"],
        prompt: `You are the Planner, responsible for strategic task decomposition and execution planning.
Break down complex goals into actionable steps, create detailed plans, and coordinate with other agents.`,
    },
    category: "core",
    source: "builtin",
};
agentRegistry.register(plannerAgent);
//# sourceMappingURL=planner.js.map