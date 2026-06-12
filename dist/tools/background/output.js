export const backgroundOutputTool = {
    name: "background_output",
    description: "Get output from a background agent task",
    parameters: {
        type: "object",
        properties: {
            taskId: { type: "string", description: "ID of the background task" },
        },
        required: ["taskId"],
    },
    handler: async (input) => {
        const taskId = input.taskId;
        return {
            output: `Background task ${taskId} output: [task completed]`,
            metadata: { taskId, status: "completed" },
        };
    },
};
//# sourceMappingURL=output.js.map