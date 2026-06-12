export const callAgentTool = {
    name: "call_omo_agent",
    description: "Call another agent to perform a task and return the result",
    parameters: {
        type: "object",
        properties: {
            agent: { type: "string", description: "Name of the agent to call" },
            task: { type: "string", description: "Task description for the agent" },
            context: { type: "object", description: "Additional context to pass to the agent" },
        },
        required: ["agent", "task"],
    },
    handler: async (input) => {
        const agent = input.agent;
        const task = input.task;
        return {
            output: `Called agent ${agent} with task: ${task}`,
            metadata: { agent, task },
        };
    },
};
//# sourceMappingURL=call-agent.js.map