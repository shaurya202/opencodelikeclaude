import { commandRegistry } from "../commands/registry";
export const modelCommand = {
    name: "model",
    description: "View or change the current model",
    usage: "/model [model-name]",
    aliases: [],
    category: "config",
    arguments: [
        { name: "model-name", description: "Model to switch to (optional, shows current if omitted)", required: false },
    ],
    handler: async (context) => {
        const { args } = context;
        const model = args[0];
        if (model) {
            return {
                output: `Switching to model: ${model}`,
                metadata: { action: "model", model },
            };
        }
        return {
            output: "Current model: anthropic/claude-sonnet-4-5 (default)",
            metadata: { action: "model", current: "anthropic/claude-sonnet-4-5" },
        };
    },
};
commandRegistry.register({ ...modelCommand, source: "builtin" });
//# sourceMappingURL=model.js.map