import { commandRegistry } from "../commands/registry";
import { sessionManager } from "../session/manager";
import { rewindToCheckpoint, listCheckpoints } from "../session/checkpoints";
export const rewindCommand = {
    name: "rewind",
    description: "Rewind session to a previous checkpoint",
    usage: "/rewind [checkpoint-id]",
    aliases: [],
    category: "session",
    arguments: [
        { name: "checkpoint-id", description: "Checkpoint ID to rewind to (optional, shows list if omitted)", required: false },
    ],
    handler: async (context) => {
        const { args } = context;
        const session = sessionManager.getCurrentSession();
        if (!session) {
            return { error: "No active session", exitCode: 1 };
        }
        if (!args[0]) {
            const checkpoints = listCheckpoints(session.metadata.id);
            if (checkpoints.length === 0) {
                return { output: "No checkpoints available" };
            }
            let output = "Available checkpoints:\n";
            for (const cp of checkpoints) {
                output += `  ${cp.id}: ${cp.description} (message #${cp.messageIndex}, ${cp.timestamp.toISOString()})\n`;
            }
            output += "\nRun /rewind <checkpoint-id> to rewind";
            return { output };
        }
        const success = rewindToCheckpoint(session.metadata.id, args[0]);
        if (!success) {
            return { error: `Checkpoint not found: ${args[0]}`, exitCode: 1 };
        }
        return {
            output: `Rewound to checkpoint: ${args[0]}`,
            metadata: { action: "rewind", checkpointId: args[0] },
        };
    },
};
commandRegistry.register({ ...rewindCommand, source: "builtin" });
//# sourceMappingURL=rewind.js.map