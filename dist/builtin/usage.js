import { commandRegistry } from "../commands/registry";
import { costTracker } from "../cost/tracker";
export const usageCommand = {
    name: "usage",
    description: "Show usage statistics and cost tracking",
    usage: "/usage [--breakdown] [--model] [--plan <tier>] [--clear] [--alerts]",
    aliases: ["cost", "stats"],
    category: "session",
    flags: [
        { name: "breakdown", short: "b", description: "Show per-category breakdown", type: "boolean" },
        { name: "model", short: "m", description: "Show per-model breakdown", type: "boolean" },
        { name: "plan", short: "p", description: "Show plan limits (free, pro, max, team, enterprise)", type: "string" },
        { name: "clear", short: "c", description: "Clear usage history", type: "boolean" },
        { name: "alerts", short: "a", description: "Show cost alerts config", type: "boolean" },
    ],
    handler: async (context) => {
        const { flags } = context;
        if (flags.clear) {
            costTracker.clear();
            return { output: "Usage history cleared" };
        }
        if (flags.plan) {
            const tier = flags.plan;
            const valid = ["free", "pro", "max", "team", "enterprise"];
            if (!valid.includes(tier)) {
                return { error: `Invalid plan: ${tier}. Valid: ${valid.join(", ")}`, exitCode: 1 };
            }
            const limits = costTracker.getPlanLimits(tier);
            let output = `Plan: ${limits.tier.toUpperCase()}\n`;
            output += `Max input tokens: ${limits.maxInputTokens.toLocaleString()}\n`;
            output += `Max output tokens: ${limits.maxOutputTokens.toLocaleString()}\n`;
            output += `Max cost: ${limits.maxCost > 0 ? `$${limits.maxCost}/month` : "N/A"}\n`;
            output += `Features:\n`;
            for (const f of limits.features) {
                output += `  • ${f}\n`;
            }
            return { output };
        }
        if (flags.alerts) {
            const config = costTracker.getConfig();
            const alerts = Object.entries(config.alerts);
            if (alerts.length === 0)
                return { output: "No cost alerts configured." };
            let output = "Cost alerts:\n\n";
            for (const [name, alert] of alerts) {
                output += `  ${name}: $${alert.threshold} → ${alert.action}\n`;
            }
            return { output };
        }
        const summary = costTracker.getSummary();
        let output = `Usage Summary:\n`;
        output += `  Total tokens: ${summary.totalTokens.total.toLocaleString()} (${summary.totalTokens.input.toLocaleString()} in / ${summary.totalTokens.output.toLocaleString()} out)\n`;
        output += `  Total cost: ${costTracker.formatCost(summary.totalCost)}\n`;
        output += `  Sessions: ${summary.sessionCount}\n`;
        output += `  Entries: ${summary.entries}\n`;
        if (flags.breakdown) {
            output += "\nBreakdown by category:\n";
            for (const [cat, data] of Object.entries(summary.byCategory)) {
                output += `  ${cat}: ${data.tokens.total.toLocaleString()} tokens (${costTracker.formatCost(data.cost)})\n`;
            }
        }
        if (flags.model) {
            output += "\nBreakdown by model:\n";
            for (const [model, data] of Object.entries(summary.byModel)) {
                const short = model.split("/").pop() || model;
                output += `  ${short}: ${data.tokens.total.toLocaleString()} tokens (${costTracker.formatCost(data.cost)})\n`;
            }
        }
        return { output, metadata: { action: "usage", ...summary } };
    },
};
commandRegistry.register({ ...usageCommand, source: "builtin" });
//# sourceMappingURL=usage.js.map