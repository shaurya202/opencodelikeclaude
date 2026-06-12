import { hookRegistry } from "../registry";
hookRegistry.register("stop", async (input) => {
    if (input.reason === "complete" || input.reason === "done") {
        return { message: "Stop requested. Use /tasks to verify all tasks are complete before concluding." };
    }
    return {};
}, { priority: 50 });
//# sourceMappingURL=todo-enforcer.js.map