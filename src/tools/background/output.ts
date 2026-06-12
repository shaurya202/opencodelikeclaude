import { ToolDefinition } from "../types";

export const backgroundOutputTool: ToolDefinition = {
  name: "background_output",
  description: "Get output from a background agent task",
  parameters: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "ID of the background task" },
    },
    required: ["taskId"],
  },
  handler: async (input: Record<string, unknown>) => {
    const taskId = input.taskId as string;
    return {
      output: `Background task ${taskId} output: [task completed]`,
      metadata: { taskId, status: "completed" },
    };
  },
};