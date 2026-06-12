import { hookRegistry } from "../registry";
import { StopHookInput, StopHookOutput } from "../types";

hookRegistry.register<StopHookInput, StopHookOutput>(
  "stop",
  async (input) => {
    if (input.reason === "complete" || input.reason === "done") {
      return { message: "Stop requested. Use /tasks to verify all tasks are complete before concluding." };
    }
    return {};
  },
  { priority: 50 }
);
