import { commandRegistry } from "../commands/registry";
import { batchRunner } from "../batch/runner";
export const batchCommand = {
    name: "batch",
    description: "Run parallel tasks across worktrees",
    usage: "/batch <task> --units <count> [--name <name>] [--prs] [list|start|cancel|status]",
    aliases: ["bt"],
    category: "advanced",
    flags: [
        { name: "units", short: "u", description: "Number of parallel units (5-30)", type: "number" },
        { name: "name", short: "n", description: "Batch name", type: "string" },
        { name: "prs", short: "p", description: "Create PRs for completed jobs", type: "boolean" },
        { name: "list", short: "l", description: "List batches", type: "boolean" },
        { name: "get", short: "g", description: "Get batch details by ID", type: "string" },
        { name: "start", short: "s", description: "Start batch by ID", type: "string" },
        { name: "cancel", short: "c", description: "Cancel batch by ID", type: "string" },
        { name: "remove", short: "r", description: "Remove batch by ID", type: "string" },
    ],
    handler: async (context) => {
        const { args, flags } = context;
        if (flags.list) {
            const batches = batchRunner.getAllBatches();
            if (batches.length === 0)
                return { output: "No batches. Use /batch <task> --units <count> to create one." };
            let output = "Batches:\n\n";
            for (const b of batches) {
                output += `  [${b.status}] ${b.id.slice(0, 8)}: ${b.name}\n`;
                output += `    Jobs: ${b.summary.completed + b.summary.failed + b.summary.cancelled}/${b.jobs.length}  (${b.summary.completed} done, ${b.summary.failed} failed)\n`;
            }
            return { output };
        }
        if (flags.get) {
            const batch = batchRunner.getBatch(flags.get);
            if (!batch)
                return { error: "Batch not found", exitCode: 1 };
            let output = `Batch: ${batch.name} [${batch.status}]\n`;
            output += `Task: ${batch.task}\n`;
            output += `Jobs: ${batch.summary.completed + batch.summary.failed + batch.summary.cancelled}/${batch.jobs.length}\n\n`;
            for (const job of batch.jobs) {
                output += `  [${job.status === "completed" ? "✓" : job.status === "running" ? "→" : job.status === "failed" ? "✗" : " "}] ${job.name}: ${job.task}\n`;
                if (job.result)
                    output += `    Result: ${job.result.slice(0, 100)}${job.result.length > 100 ? "..." : ""}\n`;
                if (job.error)
                    output += `    Error: ${job.error}\n`;
            }
            return { output };
        }
        if (flags.start) {
            const batch = batchRunner.startBatch(flags.start);
            if (!batch)
                return { error: "Batch not found or already started", exitCode: 1 };
            return { output: `Started batch: ${batch.name} (${batch.id.slice(0, 8)}) with ${batch.parallel} parallel jobs` };
        }
        if (flags.cancel) {
            const batch = batchRunner.cancelBatch(flags.cancel);
            if (!batch)
                return { error: "Batch not found", exitCode: 1 };
            return { output: `Cancelled batch: ${batch.name}` };
        }
        if (flags.remove) {
            const found = batchRunner.removeBatch(flags.remove);
            return { output: found ? "Batch removed" : "Batch not found" };
        }
        const task = args.join(" ");
        const units = Number(flags.units);
        if (!task || !units || units < 1 || units > 30) {
            return { output: "Usage: /batch <task> --units <count>\nUnits must be between 1 and 30." };
        }
        const unitsList = Array.from({ length: units }, (_, i) => ({
            name: `unit-${i + 1}`,
            task: `${task} (unit ${i + 1}/${units})`,
            target: `.`,
        }));
        const batch = batchRunner.createBatch(flags.name || `batch-${Date.now()}`, task, unitsList);
        return { output: `Batch created: ${batch.name} (${batch.id.slice(0, 8)})\nUnits: ${batch.jobs.length}  Parallel: ${batch.parallel}\n\nUse /batch --start ${batch.id.slice(0, 8)} to begin execution.` };
    },
};
commandRegistry.register({ ...batchCommand, source: "builtin" });
//# sourceMappingURL=batch.js.map