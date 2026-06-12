export const delegateTaskTool = {
    name: "delegate_task",
    description: "Delegate a task to a background agent for async execution",
    parameters: {
        type: "object",
        properties: {
            agent: { type: "string", description: "Name of the agent to delegate to" },
            task: { type: "string", description: "Task description" },
            background: { type: "boolean", description: "Run in background", default: true },
            waitForResult: { type: "boolean", description: "Wait for result before returning", default: false },
        },
        required: ["agent", "task"],
    },
    handler: async (input) => {
        const agent = input.agent;
        const task = input.task;
        const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        return {
            output: `Delegated task ${taskId} to agent ${agent}: ${task}`,
            metadata: {
                taskId,
                agent,
                task,
                background: input.background ?? true,
                waitForResult: input.waitForResult ?? false,
            },
        };
    },
};
//# sourceMappingURL=delegate-task.js.map