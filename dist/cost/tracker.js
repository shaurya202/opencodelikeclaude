const MODEL_RATES = {
    "anthropic/claude-sonnet-4-5": { input: 3e-6, output: 15e-6 },
    "anthropic/claude-opus-4-5": { input: 15e-6, output: 75e-6 },
    "openai/gpt-5.2": { input: 10e-6, output: 40e-6 },
    "opencode/gpt-5-nano": { input: 0.5e-6, output: 2e-6 },
    "google/gemini-3-pro": { input: 1.25e-6, output: 5e-6 },
    "google/gemini-3-flash": { input: 0.5e-6, output: 2e-6 },
    default: { input: 3e-6, output: 15e-6 },
};
const PLAN_LIMITS = {
    free: { tier: "free", maxInputTokens: 200000, maxOutputTokens: 100000, maxCost: 0, features: ["basic chat"] },
    pro: { tier: "pro", maxInputTokens: 2000000, maxOutputTokens: 1000000, maxCost: 20, features: ["basic chat", "agents", "mcp"] },
    max: { tier: "max", maxInputTokens: 10000000, maxOutputTokens: 5000000, maxCost: 100, features: ["all features", "parallel agents", "batch"] },
    team: { tier: "team", maxInputTokens: 50000000, maxOutputTokens: 25000000, maxCost: 500, features: ["all features", "team mode", "admin"] },
    enterprise: { tier: "enterprise", maxInputTokens: 500000000, maxOutputTokens: 250000000, maxCost: 5000, features: ["unlimited", "dedicated", "on-prem"] },
};
export class CostTracker {
    entries = [];
    config = {
        trackUsage: true,
        breakdown: true,
        alerts: {},
    };
    changeCallbacks = [];
    alertCallbacks = [];
    constructor(config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    record(model, inputTokens, outputTokens, category, label) {
        const rates = MODEL_RATES[model] || MODEL_RATES.default;
        const cost = (inputTokens * rates.input) + (outputTokens * rates.output);
        const entry = {
            id: this.generateId(),
            timestamp: Date.now(),
            model,
            tokens: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens },
            cost,
            category,
            label,
        };
        this.entries.push(entry);
        for (const cb of this.changeCallbacks) {
            cb(entry);
        }
        this.checkAlerts();
        return entry;
    }
    getSummary() {
        const totalTokens = { input: 0, output: 0, total: 0 };
        let totalCost = 0;
        const byCategory = {};
        const byModel = {};
        for (const entry of this.entries) {
            totalTokens.input += entry.tokens.input;
            totalTokens.output += entry.tokens.output;
            totalTokens.total += entry.tokens.total;
            totalCost += entry.cost;
            if (!byCategory[entry.category]) {
                byCategory[entry.category] = { tokens: { input: 0, output: 0, total: 0 }, cost: 0 };
            }
            byCategory[entry.category].tokens.input += entry.tokens.input;
            byCategory[entry.category].tokens.output += entry.tokens.output;
            byCategory[entry.category].tokens.total += entry.tokens.total;
            byCategory[entry.category].cost += entry.cost;
            if (!byModel[entry.model]) {
                byModel[entry.model] = { tokens: { input: 0, output: 0, total: 0 }, cost: 0 };
            }
            byModel[entry.model].tokens.input += entry.tokens.input;
            byModel[entry.model].tokens.output += entry.tokens.output;
            byModel[entry.model].tokens.total += entry.tokens.total;
            byModel[entry.model].cost += entry.cost;
        }
        const uniqueSessions = new Set(this.entries.map(e => e.id.split("-")[0])).size;
        return {
            totalTokens,
            totalCost,
            sessionCount: uniqueSessions,
            entries: this.entries.length,
            byCategory,
            byModel,
        };
    }
    getPlanLimits(tier = "pro") {
        return PLAN_LIMITS[tier];
    }
    getEntries(category) {
        if (category) {
            return this.entries.filter(e => e.category === category);
        }
        return [...this.entries];
    }
    clear() {
        this.entries = [];
    }
    onChange(callback) {
        this.changeCallbacks.push(callback);
    }
    onAlert(callback) {
        this.alertCallbacks.push(callback);
    }
    checkAlerts() {
        const summary = this.getSummary();
        for (const [name, alert] of Object.entries(this.config.alerts)) {
            if (summary.totalCost >= alert.threshold) {
                for (const cb of this.alertCallbacks) {
                    cb(`Cost alert "${name}": ${summary.totalCost.toFixed(4)} exceeds threshold ${alert.threshold}`);
                }
            }
        }
    }
    formatCost(cost) {
        if (cost < 0.001)
            return `${(cost * 1000000).toFixed(0)}μ¢`;
        if (cost < 0.01)
            return `${(cost * 1000).toFixed(1)}m¢`;
        return `$${cost.toFixed(4)}`;
    }
    generateId() {
        return `cost-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.entries = [];
        this.changeCallbacks = [];
        this.alertCallbacks = [];
    }
}
export const costTracker = new CostTracker();
//# sourceMappingURL=tracker.js.map