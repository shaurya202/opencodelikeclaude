import { z } from "zod";
export const compatibilitySchema = z.object({
    mcp: z.boolean().default(true),
    commands: z.boolean().default(true),
    skills: z.boolean().default(true),
    agents: z.boolean().default(true),
    hooks: z.boolean().default(true),
    plugins: z.boolean().default(true),
});
export const agentConfigSchema = z.object({
    model: z.string().optional(),
    variant: z.string().optional(),
    fallbackModels: z.array(z.string()).optional(),
    temperature: z.number().optional(),
    toolPermissions: z.array(z.string()).optional(),
    prompt: z.string().optional(),
});
export const agentsSchema = z.object({
    orchestrator: agentConfigSchema.optional(),
    planner: agentConfigSchema.optional(),
    reviewer: agentConfigSchema.optional(),
    researcher: agentConfigSchema.optional(),
    explorer: agentConfigSchema.optional(),
    frontend: agentConfigSchema.optional(),
    gitMaster: agentConfigSchema.optional(),
    multimodal: agentConfigSchema.optional(),
});
export const categoryConfigSchema = z.object({
    model: z.string().optional(),
    variant: z.string().optional(),
});
export const categoriesSchema = z.object({
    quick: categoryConfigSchema.optional(),
    visual: categoryConfigSchema.optional(),
    businessLogic: categoryConfigSchema.optional(),
    deep: categoryConfigSchema.optional(),
    writing: categoryConfigSchema.optional(),
});
export const permissionModeSchema = z.enum([
    "default",
    "acceptEdits",
    "plan",
    "auto",
    "bypassPermissions",
]);
export const permissionsSchema = z.object({
    defaultMode: permissionModeSchema.default("default"),
    allowedTools: z.array(z.string()).default([]),
    deniedTools: z.array(z.string()).default([]),
    rules: z.array(z.object({
        pattern: z.string(),
        action: z.enum(["allow", "deny"]),
        scope: z.enum(["user", "project", "local"]).optional(),
    })).default([]),
});
export const mcpBuiltinSchema = z.object({
    websearch: z.boolean().default(true),
    context7: z.boolean().default(true),
    grepApp: z.boolean().default(true),
    lsp: z.boolean().default(true),
    astGrep: z.boolean().default(true),
});
export const mcpSchema = z.object({
    builtin: mcpBuiltinSchema.default({}),
    servers: z.record(z.object({
        command: z.string(),
        args: z.array(z.string()).optional(),
        env: z.record(z.string()).optional(),
    })).default({}),
});
export const skillsBuiltinSchema = z.object({
    playwright: z.boolean().default(true),
    gitMaster: z.boolean().default(true),
    frontendUiUx: z.boolean().default(true),
});
export const skillsSchema = z.object({
    builtin: skillsBuiltinSchema.default({}),
    paths: z.array(z.string()).default([]),
});
export const hooksSchema = z.object({
    disabled: z.array(z.string()).default([]),
    claudeSettings: z.boolean().default(true),
});
export const uiSchema = z.object({
    theme: z.string().default("default"),
    color: z.string().default("default"),
    vimMode: z.boolean().default(false),
    voiceEnabled: z.boolean().default(false),
    pushToTalkKey: z.string().default("Space"),
    leaderKey: z.string().default("ctrl+x"),
    keybindings: z.record(z.string()).default({}),
    diffStyle: z.enum(["auto", "stacked", "inline"]).default("auto"),
    mouseCapture: z.boolean().default(false),
    scrollSpeed: z.number().min(1).max(10).default(3),
    scrollAcceleration: z.boolean().default(true),
    terminal: z.string().default(""),
    notificationSounds: z.boolean().default(true),
    commandPaletteEnabled: z.boolean().default(true),
});
export const backgroundSchema = z.object({
    maxConcurrent: z.number().default(5),
    concurrencyByProvider: z.record(z.number()).default({}),
});
export const goalSchema = z.object({
    maxActive: z.number().default(5),
    autoTrack: z.boolean().default(true),
    notifyOnComplete: z.boolean().default(true),
});
export const loopSchema = z.object({
    maxLoops: z.number().default(100),
    defaultInterval: z.number().default(60000),
    persistent: z.boolean().default(false),
});
export const reviewSchema = z.object({
    defaultEffort: z.number().min(1).max(10).default(5),
    autoFix: z.boolean().default(false),
    comment: z.boolean().default(true),
    securityScan: z.boolean().default(true),
});
export const thinkModeSchema = z.object({
    enabled: z.boolean().default(true),
    autoDetect: z.boolean().default(true),
    keywords: z.array(z.string()).default(["think deeply", "ultrathink", "deep analysis", "carefully"]),
});
export const keywordDetectorSchema = z.object({
    enabled: z.boolean().default(true),
    modes: z.array(z.string()).default(["ultrawork", "search", "analyze", "review"]),
});
export const experimentalSchema = z.object({
    aggressiveTruncation: z.boolean().default(false),
    autoResume: z.boolean().default(false),
    teamMode: z.boolean().default(false),
    hashEditing: z.boolean().default(true),
    useRealImplementations: z.boolean().default(true),
    goal: goalSchema.default({}),
    loop: loopSchema.default({}),
    review: reviewSchema.default({}),
    thinkMode: thinkModeSchema.default({}),
    keywordDetector: keywordDetectorSchema.default({}),
});
export const costSchema = z.object({
    trackUsage: z.boolean().default(true),
    breakdown: z.boolean().default(true),
    alerts: z.record(z.object({
        threshold: z.number(),
        action: z.enum(["warn", "block"]),
    })).default({}),
});
export const remoteSchema = z.object({
    control: z.object({
        enabled: z.boolean().default(false),
        port: z.number().min(1024).max(65535).default(9447),
        host: z.string().default("localhost"),
        authToken: z.string().optional(),
    }).default({}),
    teleport: z.object({
        enabled: z.boolean().default(true),
        defaultClient: z.string().default("claude.ai"),
    }).default({}),
    ide: z.object({
        enabled: z.boolean().default(false),
        extension: z.string().default("opencode"),
        autoConnect: z.boolean().default(true),
    }).default({}),
    chrome: z.object({
        enabled: z.boolean().default(false),
        headless: z.boolean().default(false),
        remoteDebugPort: z.number().default(9222),
    }).default({}),
    sync: z.object({
        enabled: z.boolean().default(false),
        autoSync: z.boolean().default(true),
        endpoint: z.string().optional(),
    }).default({}),
});
export const configSchema = z.object({
    $schema: z.string().optional(),
    compatibility: compatibilitySchema.default({}),
    agents: agentsSchema.default({}),
    categories: categoriesSchema.default({}),
    permissions: permissionsSchema.default({}),
    mcp: mcpSchema.default({}),
    skills: skillsSchema.default({}),
    hooks: hooksSchema.default({}),
    ui: uiSchema.default({}),
    background: backgroundSchema.default({}),
    experimental: experimentalSchema.default({}),
    cost: costSchema.default({}),
    remote: remoteSchema.default({}),
});
export function validateConfig(data) {
    const result = configSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const formatted = result.error.issues.map(issue => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
    return {
        success: false,
        error: `Config validation failed:\n${formatted}`,
        details: result.error,
    };
}
//# sourceMappingURL=schema.js.map