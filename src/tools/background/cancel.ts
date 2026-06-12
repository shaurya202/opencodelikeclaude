import { ToolDefinition } from "../types";

export const backgroundCancelTool: ToolDefinition = {
  name: "background_cancel",
  description: "Cancel a running background agent task",
  parameters: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "ID of the background task to cancel" },
    },
    required: ["taskId"],
  },
  handler: async (input: Record<string, unknown>) => {
    const taskId = input.taskId as string;
    return {
      output: `Cancelled background task ${taskId}`,
      metadata: { taskId, status: "cancelled" },
    };
  },
};