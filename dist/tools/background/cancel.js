export const backgroundCancelTool = {
    name: "background_cancel",
    description: "Cancel a running background agent task",
    parameters: {
        type: "object",
        properties: {
            taskId: { type: "string", description: "ID of the background task to cancel" },
        },
        required: ["taskId"],
    },
    handler: async (input) => {
        const taskId = input.taskId;
        return {
            output: `Cancelled background task ${taskId}`,
            metadata: { taskId, status: "cancelled" },
        };
    },
};
//# sourceMappingURL=cancel.js.map