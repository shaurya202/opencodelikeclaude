import { z } from "zod";
export declare const compatibilitySchema: z.ZodObject<{
    mcp: z.ZodDefault<z.ZodBoolean>;
    commands: z.ZodDefault<z.ZodBoolean>;
    skills: z.ZodDefault<z.ZodBoolean>;
    agents: z.ZodDefault<z.ZodBoolean>;
    hooks: z.ZodDefault<z.ZodBoolean>;
    plugins: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    mcp: boolean;
    commands: boolean;
    skills: boolean;
    agents: boolean;
    hooks: boolean;
    plugins: boolean;
}, {
    mcp?: boolean | undefined;
    commands?: boolean | undefined;
    skills?: boolean | undefined;
    agents?: boolean | undefined;
    hooks?: boolean | undefined;
    plugins?: boolean | undefined;
}>;
export declare const agentConfigSchema: z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    variant: z.ZodOptional<z.ZodString>;
    fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    temperature: z.ZodOptional<z.ZodNumber>;
    toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model?: string | undefined;
    variant?: string | undefined;
    fallbackModels?: string[] | undefined;
    temperature?: number | undefined;
    toolPermissions?: string[] | undefined;
    prompt?: string | undefined;
}, {
    model?: string | undefined;
    variant?: string | undefined;
    fallbackModels?: string[] | undefined;
    temperature?: number | undefined;
    toolPermissions?: string[] | undefined;
    prompt?: string | undefined;
}>;
export declare const agentsSchema: z.ZodObject<{
    orchestrator: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
    planner: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
    reviewer: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
    researcher: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
    explorer: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
    frontend: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
    gitMaster: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
    multimodal: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    orchestrator?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    planner?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    reviewer?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    researcher?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    explorer?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    frontend?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    gitMaster?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    multimodal?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
}, {
    orchestrator?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    planner?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    reviewer?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    researcher?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    explorer?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    frontend?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    gitMaster?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
    multimodal?: {
        model?: string | undefined;
        variant?: string | undefined;
        fallbackModels?: string[] | undefined;
        temperature?: number | undefined;
        toolPermissions?: string[] | undefined;
        prompt?: string | undefined;
    } | undefined;
}>;
export declare const categoryConfigSchema: z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    variant: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model?: string | undefined;
    variant?: string | undefined;
}, {
    model?: string | undefined;
    variant?: string | undefined;
}>;
export declare const categoriesSchema: z.ZodObject<{
    quick: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
    }>>;
    visual: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
    }>>;
    businessLogic: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
    }>>;
    deep: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
    }>>;
    writing: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        variant?: string | undefined;
    }, {
        model?: string | undefined;
        variant?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    quick?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    visual?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    businessLogic?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    deep?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    writing?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
}, {
    quick?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    visual?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    businessLogic?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    deep?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
    writing?: {
        model?: string | undefined;
        variant?: string | undefined;
    } | undefined;
}>;
export declare const permissionModeSchema: z.ZodEnum<["default", "acceptEdits", "plan", "auto", "bypassPermissions"]>;
export declare const permissionsSchema: z.ZodObject<{
    defaultMode: z.ZodDefault<z.ZodEnum<["default", "acceptEdits", "plan", "auto", "bypassPermissions"]>>;
    allowedTools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    deniedTools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    rules: z.ZodDefault<z.ZodArray<z.ZodObject<{
        pattern: z.ZodString;
        action: z.ZodEnum<["allow", "deny"]>;
        scope: z.ZodOptional<z.ZodEnum<["user", "project", "local"]>>;
    }, "strip", z.ZodTypeAny, {
        pattern: string;
        action: "allow" | "deny";
        scope?: "user" | "project" | "local" | undefined;
    }, {
        pattern: string;
        action: "allow" | "deny";
        scope?: "user" | "project" | "local" | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    defaultMode: "default" | "acceptEdits" | "plan" | "auto" | "bypassPermissions";
    allowedTools: string[];
    deniedTools: string[];
    rules: {
        pattern: string;
        action: "allow" | "deny";
        scope?: "user" | "project" | "local" | undefined;
    }[];
}, {
    defaultMode?: "default" | "acceptEdits" | "plan" | "auto" | "bypassPermissions" | undefined;
    allowedTools?: string[] | undefined;
    deniedTools?: string[] | undefined;
    rules?: {
        pattern: string;
        action: "allow" | "deny";
        scope?: "user" | "project" | "local" | undefined;
    }[] | undefined;
}>;
export declare const mcpBuiltinSchema: z.ZodObject<{
    websearch: z.ZodDefault<z.ZodBoolean>;
    context7: z.ZodDefault<z.ZodBoolean>;
    grepApp: z.ZodDefault<z.ZodBoolean>;
    lsp: z.ZodDefault<z.ZodBoolean>;
    astGrep: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    websearch: boolean;
    context7: boolean;
    grepApp: boolean;
    lsp: boolean;
    astGrep: boolean;
}, {
    websearch?: boolean | undefined;
    context7?: boolean | undefined;
    grepApp?: boolean | undefined;
    lsp?: boolean | undefined;
    astGrep?: boolean | undefined;
}>;
export declare const mcpSchema: z.ZodObject<{
    builtin: z.ZodDefault<z.ZodObject<{
        websearch: z.ZodDefault<z.ZodBoolean>;
        context7: z.ZodDefault<z.ZodBoolean>;
        grepApp: z.ZodDefault<z.ZodBoolean>;
        lsp: z.ZodDefault<z.ZodBoolean>;
        astGrep: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        websearch: boolean;
        context7: boolean;
        grepApp: boolean;
        lsp: boolean;
        astGrep: boolean;
    }, {
        websearch?: boolean | undefined;
        context7?: boolean | undefined;
        grepApp?: boolean | undefined;
        lsp?: boolean | undefined;
        astGrep?: boolean | undefined;
    }>>;
    servers: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
    }, {
        command: string;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    builtin: {
        websearch: boolean;
        context7: boolean;
        grepApp: boolean;
        lsp: boolean;
        astGrep: boolean;
    };
    servers: Record<string, {
        command: string;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
    }>;
}, {
    builtin?: {
        websearch?: boolean | undefined;
        context7?: boolean | undefined;
        grepApp?: boolean | undefined;
        lsp?: boolean | undefined;
        astGrep?: boolean | undefined;
    } | undefined;
    servers?: Record<string, {
        command: string;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
    }> | undefined;
}>;
export declare const skillsBuiltinSchema: z.ZodObject<{
    playwright: z.ZodDefault<z.ZodBoolean>;
    gitMaster: z.ZodDefault<z.ZodBoolean>;
    frontendUiUx: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    gitMaster: boolean;
    playwright: boolean;
    frontendUiUx: boolean;
}, {
    gitMaster?: boolean | undefined;
    playwright?: boolean | undefined;
    frontendUiUx?: boolean | undefined;
}>;
export declare const skillsSchema: z.ZodObject<{
    builtin: z.ZodDefault<z.ZodObject<{
        playwright: z.ZodDefault<z.ZodBoolean>;
        gitMaster: z.ZodDefault<z.ZodBoolean>;
        frontendUiUx: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        gitMaster: boolean;
        playwright: boolean;
        frontendUiUx: boolean;
    }, {
        gitMaster?: boolean | undefined;
        playwright?: boolean | undefined;
        frontendUiUx?: boolean | undefined;
    }>>;
    paths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    builtin: {
        gitMaster: boolean;
        playwright: boolean;
        frontendUiUx: boolean;
    };
    paths: string[];
}, {
    builtin?: {
        gitMaster?: boolean | undefined;
        playwright?: boolean | undefined;
        frontendUiUx?: boolean | undefined;
    } | undefined;
    paths?: string[] | undefined;
}>;
export declare const hooksSchema: z.ZodObject<{
    disabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    claudeSettings: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    disabled: string[];
    claudeSettings: boolean;
}, {
    disabled?: string[] | undefined;
    claudeSettings?: boolean | undefined;
}>;
export declare const uiSchema: z.ZodObject<{
    theme: z.ZodDefault<z.ZodString>;
    color: z.ZodDefault<z.ZodString>;
    vimMode: z.ZodDefault<z.ZodBoolean>;
    voiceEnabled: z.ZodDefault<z.ZodBoolean>;
    pushToTalkKey: z.ZodDefault<z.ZodString>;
    leaderKey: z.ZodDefault<z.ZodString>;
    keybindings: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    diffStyle: z.ZodDefault<z.ZodEnum<["auto", "stacked", "inline"]>>;
    mouseCapture: z.ZodDefault<z.ZodBoolean>;
    scrollSpeed: z.ZodDefault<z.ZodNumber>;
    scrollAcceleration: z.ZodDefault<z.ZodBoolean>;
    terminal: z.ZodDefault<z.ZodString>;
    notificationSounds: z.ZodDefault<z.ZodBoolean>;
    commandPaletteEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    theme: string;
    color: string;
    vimMode: boolean;
    voiceEnabled: boolean;
    pushToTalkKey: string;
    leaderKey: string;
    keybindings: Record<string, string>;
    diffStyle: "auto" | "stacked" | "inline";
    mouseCapture: boolean;
    scrollSpeed: number;
    scrollAcceleration: boolean;
    terminal: string;
    notificationSounds: boolean;
    commandPaletteEnabled: boolean;
}, {
    theme?: string | undefined;
    color?: string | undefined;
    vimMode?: boolean | undefined;
    voiceEnabled?: boolean | undefined;
    pushToTalkKey?: string | undefined;
    leaderKey?: string | undefined;
    keybindings?: Record<string, string> | undefined;
    diffStyle?: "auto" | "stacked" | "inline" | undefined;
    mouseCapture?: boolean | undefined;
    scrollSpeed?: number | undefined;
    scrollAcceleration?: boolean | undefined;
    terminal?: string | undefined;
    notificationSounds?: boolean | undefined;
    commandPaletteEnabled?: boolean | undefined;
}>;
export declare const backgroundSchema: z.ZodObject<{
    maxConcurrent: z.ZodDefault<z.ZodNumber>;
    concurrencyByProvider: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    maxConcurrent: number;
    concurrencyByProvider: Record<string, number>;
}, {
    maxConcurrent?: number | undefined;
    concurrencyByProvider?: Record<string, number> | undefined;
}>;
export declare const goalSchema: z.ZodObject<{
    maxActive: z.ZodDefault<z.ZodNumber>;
    autoTrack: z.ZodDefault<z.ZodBoolean>;
    notifyOnComplete: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    maxActive: number;
    autoTrack: boolean;
    notifyOnComplete: boolean;
}, {
    maxActive?: number | undefined;
    autoTrack?: boolean | undefined;
    notifyOnComplete?: boolean | undefined;
}>;
export declare const loopSchema: z.ZodObject<{
    maxLoops: z.ZodDefault<z.ZodNumber>;
    defaultInterval: z.ZodDefault<z.ZodNumber>;
    persistent: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    maxLoops: number;
    defaultInterval: number;
    persistent: boolean;
}, {
    maxLoops?: number | undefined;
    defaultInterval?: number | undefined;
    persistent?: boolean | undefined;
}>;
export declare const reviewSchema: z.ZodObject<{
    defaultEffort: z.ZodDefault<z.ZodNumber>;
    autoFix: z.ZodDefault<z.ZodBoolean>;
    comment: z.ZodDefault<z.ZodBoolean>;
    securityScan: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    defaultEffort: number;
    autoFix: boolean;
    comment: boolean;
    securityScan: boolean;
}, {
    defaultEffort?: number | undefined;
    autoFix?: boolean | undefined;
    comment?: boolean | undefined;
    securityScan?: boolean | undefined;
}>;
export declare const thinkModeSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    autoDetect: z.ZodDefault<z.ZodBoolean>;
    keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    autoDetect: boolean;
    keywords: string[];
}, {
    enabled?: boolean | undefined;
    autoDetect?: boolean | undefined;
    keywords?: string[] | undefined;
}>;
export declare const keywordDetectorSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    modes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    modes: string[];
}, {
    enabled?: boolean | undefined;
    modes?: string[] | undefined;
}>;
export declare const experimentalSchema: z.ZodObject<{
    aggressiveTruncation: z.ZodDefault<z.ZodBoolean>;
    autoResume: z.ZodDefault<z.ZodBoolean>;
    teamMode: z.ZodDefault<z.ZodBoolean>;
    hashEditing: z.ZodDefault<z.ZodBoolean>;
    useRealImplementations: z.ZodDefault<z.ZodBoolean>;
    goal: z.ZodDefault<z.ZodObject<{
        maxActive: z.ZodDefault<z.ZodNumber>;
        autoTrack: z.ZodDefault<z.ZodBoolean>;
        notifyOnComplete: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        maxActive: number;
        autoTrack: boolean;
        notifyOnComplete: boolean;
    }, {
        maxActive?: number | undefined;
        autoTrack?: boolean | undefined;
        notifyOnComplete?: boolean | undefined;
    }>>;
    loop: z.ZodDefault<z.ZodObject<{
        maxLoops: z.ZodDefault<z.ZodNumber>;
        defaultInterval: z.ZodDefault<z.ZodNumber>;
        persistent: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        maxLoops: number;
        defaultInterval: number;
        persistent: boolean;
    }, {
        maxLoops?: number | undefined;
        defaultInterval?: number | undefined;
        persistent?: boolean | undefined;
    }>>;
    review: z.ZodDefault<z.ZodObject<{
        defaultEffort: z.ZodDefault<z.ZodNumber>;
        autoFix: z.ZodDefault<z.ZodBoolean>;
        comment: z.ZodDefault<z.ZodBoolean>;
        securityScan: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        defaultEffort: number;
        autoFix: boolean;
        comment: boolean;
        securityScan: boolean;
    }, {
        defaultEffort?: number | undefined;
        autoFix?: boolean | undefined;
        comment?: boolean | undefined;
        securityScan?: boolean | undefined;
    }>>;
    thinkMode: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        autoDetect: z.ZodDefault<z.ZodBoolean>;
        keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        autoDetect: boolean;
        keywords: string[];
    }, {
        enabled?: boolean | undefined;
        autoDetect?: boolean | undefined;
        keywords?: string[] | undefined;
    }>>;
    keywordDetector: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        modes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        modes: string[];
    }, {
        enabled?: boolean | undefined;
        modes?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    review: {
        defaultEffort: number;
        autoFix: boolean;
        comment: boolean;
        securityScan: boolean;
    };
    aggressiveTruncation: boolean;
    autoResume: boolean;
    teamMode: boolean;
    hashEditing: boolean;
    useRealImplementations: boolean;
    goal: {
        maxActive: number;
        autoTrack: boolean;
        notifyOnComplete: boolean;
    };
    loop: {
        maxLoops: number;
        defaultInterval: number;
        persistent: boolean;
    };
    thinkMode: {
        enabled: boolean;
        autoDetect: boolean;
        keywords: string[];
    };
    keywordDetector: {
        enabled: boolean;
        modes: string[];
    };
}, {
    review?: {
        defaultEffort?: number | undefined;
        autoFix?: boolean | undefined;
        comment?: boolean | undefined;
        securityScan?: boolean | undefined;
    } | undefined;
    aggressiveTruncation?: boolean | undefined;
    autoResume?: boolean | undefined;
    teamMode?: boolean | undefined;
    hashEditing?: boolean | undefined;
    useRealImplementations?: boolean | undefined;
    goal?: {
        maxActive?: number | undefined;
        autoTrack?: boolean | undefined;
        notifyOnComplete?: boolean | undefined;
    } | undefined;
    loop?: {
        maxLoops?: number | undefined;
        defaultInterval?: number | undefined;
        persistent?: boolean | undefined;
    } | undefined;
    thinkMode?: {
        enabled?: boolean | undefined;
        autoDetect?: boolean | undefined;
        keywords?: string[] | undefined;
    } | undefined;
    keywordDetector?: {
        enabled?: boolean | undefined;
        modes?: string[] | undefined;
    } | undefined;
}>;
export declare const costSchema: z.ZodObject<{
    trackUsage: z.ZodDefault<z.ZodBoolean>;
    breakdown: z.ZodDefault<z.ZodBoolean>;
    alerts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        threshold: z.ZodNumber;
        action: z.ZodEnum<["warn", "block"]>;
    }, "strip", z.ZodTypeAny, {
        action: "warn" | "block";
        threshold: number;
    }, {
        action: "warn" | "block";
        threshold: number;
    }>>>;
}, "strip", z.ZodTypeAny, {
    trackUsage: boolean;
    breakdown: boolean;
    alerts: Record<string, {
        action: "warn" | "block";
        threshold: number;
    }>;
}, {
    trackUsage?: boolean | undefined;
    breakdown?: boolean | undefined;
    alerts?: Record<string, {
        action: "warn" | "block";
        threshold: number;
    }> | undefined;
}>;
export declare const remoteSchema: z.ZodObject<{
    control: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        port: z.ZodDefault<z.ZodNumber>;
        host: z.ZodDefault<z.ZodString>;
        authToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        port: number;
        host: string;
        authToken?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        port?: number | undefined;
        host?: string | undefined;
        authToken?: string | undefined;
    }>>;
    teleport: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        defaultClient: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        defaultClient: string;
    }, {
        enabled?: boolean | undefined;
        defaultClient?: string | undefined;
    }>>;
    ide: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        extension: z.ZodDefault<z.ZodString>;
        autoConnect: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        extension: string;
        autoConnect: boolean;
    }, {
        enabled?: boolean | undefined;
        extension?: string | undefined;
        autoConnect?: boolean | undefined;
    }>>;
    chrome: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        headless: z.ZodDefault<z.ZodBoolean>;
        remoteDebugPort: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        headless: boolean;
        remoteDebugPort: number;
    }, {
        enabled?: boolean | undefined;
        headless?: boolean | undefined;
        remoteDebugPort?: number | undefined;
    }>>;
    sync: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        autoSync: z.ZodDefault<z.ZodBoolean>;
        endpoint: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        autoSync: boolean;
        endpoint?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        autoSync?: boolean | undefined;
        endpoint?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    control: {
        enabled: boolean;
        port: number;
        host: string;
        authToken?: string | undefined;
    };
    teleport: {
        enabled: boolean;
        defaultClient: string;
    };
    ide: {
        enabled: boolean;
        extension: string;
        autoConnect: boolean;
    };
    chrome: {
        enabled: boolean;
        headless: boolean;
        remoteDebugPort: number;
    };
    sync: {
        enabled: boolean;
        autoSync: boolean;
        endpoint?: string | undefined;
    };
}, {
    control?: {
        enabled?: boolean | undefined;
        port?: number | undefined;
        host?: string | undefined;
        authToken?: string | undefined;
    } | undefined;
    teleport?: {
        enabled?: boolean | undefined;
        defaultClient?: string | undefined;
    } | undefined;
    ide?: {
        enabled?: boolean | undefined;
        extension?: string | undefined;
        autoConnect?: boolean | undefined;
    } | undefined;
    chrome?: {
        enabled?: boolean | undefined;
        headless?: boolean | undefined;
        remoteDebugPort?: number | undefined;
    } | undefined;
    sync?: {
        enabled?: boolean | undefined;
        autoSync?: boolean | undefined;
        endpoint?: string | undefined;
    } | undefined;
}>;
export declare const configSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    compatibility: z.ZodDefault<z.ZodObject<{
        mcp: z.ZodDefault<z.ZodBoolean>;
        commands: z.ZodDefault<z.ZodBoolean>;
        skills: z.ZodDefault<z.ZodBoolean>;
        agents: z.ZodDefault<z.ZodBoolean>;
        hooks: z.ZodDefault<z.ZodBoolean>;
        plugins: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        mcp: boolean;
        commands: boolean;
        skills: boolean;
        agents: boolean;
        hooks: boolean;
        plugins: boolean;
    }, {
        mcp?: boolean | undefined;
        commands?: boolean | undefined;
        skills?: boolean | undefined;
        agents?: boolean | undefined;
        hooks?: boolean | undefined;
        plugins?: boolean | undefined;
    }>>;
    agents: z.ZodDefault<z.ZodObject<{
        orchestrator: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
        planner: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
        reviewer: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
        researcher: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
        explorer: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
        frontend: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
        gitMaster: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
        multimodal: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            fallbackModels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temperature: z.ZodOptional<z.ZodNumber>;
            toolPermissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        orchestrator?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        planner?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        reviewer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        researcher?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        explorer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        frontend?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        gitMaster?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        multimodal?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
    }, {
        orchestrator?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        planner?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        reviewer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        researcher?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        explorer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        frontend?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        gitMaster?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        multimodal?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
    }>>;
    categories: z.ZodDefault<z.ZodObject<{
        quick: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
        }>>;
        visual: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
        }>>;
        businessLogic: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
        }>>;
        deep: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
        }>>;
        writing: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            variant?: string | undefined;
        }, {
            model?: string | undefined;
            variant?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        quick?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        visual?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        businessLogic?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        deep?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        writing?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
    }, {
        quick?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        visual?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        businessLogic?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        deep?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        writing?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
    }>>;
    permissions: z.ZodDefault<z.ZodObject<{
        defaultMode: z.ZodDefault<z.ZodEnum<["default", "acceptEdits", "plan", "auto", "bypassPermissions"]>>;
        allowedTools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        deniedTools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        rules: z.ZodDefault<z.ZodArray<z.ZodObject<{
            pattern: z.ZodString;
            action: z.ZodEnum<["allow", "deny"]>;
            scope: z.ZodOptional<z.ZodEnum<["user", "project", "local"]>>;
        }, "strip", z.ZodTypeAny, {
            pattern: string;
            action: "allow" | "deny";
            scope?: "user" | "project" | "local" | undefined;
        }, {
            pattern: string;
            action: "allow" | "deny";
            scope?: "user" | "project" | "local" | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        defaultMode: "default" | "acceptEdits" | "plan" | "auto" | "bypassPermissions";
        allowedTools: string[];
        deniedTools: string[];
        rules: {
            pattern: string;
            action: "allow" | "deny";
            scope?: "user" | "project" | "local" | undefined;
        }[];
    }, {
        defaultMode?: "default" | "acceptEdits" | "plan" | "auto" | "bypassPermissions" | undefined;
        allowedTools?: string[] | undefined;
        deniedTools?: string[] | undefined;
        rules?: {
            pattern: string;
            action: "allow" | "deny";
            scope?: "user" | "project" | "local" | undefined;
        }[] | undefined;
    }>>;
    mcp: z.ZodDefault<z.ZodObject<{
        builtin: z.ZodDefault<z.ZodObject<{
            websearch: z.ZodDefault<z.ZodBoolean>;
            context7: z.ZodDefault<z.ZodBoolean>;
            grepApp: z.ZodDefault<z.ZodBoolean>;
            lsp: z.ZodDefault<z.ZodBoolean>;
            astGrep: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            websearch: boolean;
            context7: boolean;
            grepApp: boolean;
            lsp: boolean;
            astGrep: boolean;
        }, {
            websearch?: boolean | undefined;
            context7?: boolean | undefined;
            grepApp?: boolean | undefined;
            lsp?: boolean | undefined;
            astGrep?: boolean | undefined;
        }>>;
        servers: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
            command: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
        }, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        builtin: {
            websearch: boolean;
            context7: boolean;
            grepApp: boolean;
            lsp: boolean;
            astGrep: boolean;
        };
        servers: Record<string, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
        }>;
    }, {
        builtin?: {
            websearch?: boolean | undefined;
            context7?: boolean | undefined;
            grepApp?: boolean | undefined;
            lsp?: boolean | undefined;
            astGrep?: boolean | undefined;
        } | undefined;
        servers?: Record<string, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
        }> | undefined;
    }>>;
    skills: z.ZodDefault<z.ZodObject<{
        builtin: z.ZodDefault<z.ZodObject<{
            playwright: z.ZodDefault<z.ZodBoolean>;
            gitMaster: z.ZodDefault<z.ZodBoolean>;
            frontendUiUx: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            gitMaster: boolean;
            playwright: boolean;
            frontendUiUx: boolean;
        }, {
            gitMaster?: boolean | undefined;
            playwright?: boolean | undefined;
            frontendUiUx?: boolean | undefined;
        }>>;
        paths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        builtin: {
            gitMaster: boolean;
            playwright: boolean;
            frontendUiUx: boolean;
        };
        paths: string[];
    }, {
        builtin?: {
            gitMaster?: boolean | undefined;
            playwright?: boolean | undefined;
            frontendUiUx?: boolean | undefined;
        } | undefined;
        paths?: string[] | undefined;
    }>>;
    hooks: z.ZodDefault<z.ZodObject<{
        disabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claudeSettings: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        disabled: string[];
        claudeSettings: boolean;
    }, {
        disabled?: string[] | undefined;
        claudeSettings?: boolean | undefined;
    }>>;
    ui: z.ZodDefault<z.ZodObject<{
        theme: z.ZodDefault<z.ZodString>;
        color: z.ZodDefault<z.ZodString>;
        vimMode: z.ZodDefault<z.ZodBoolean>;
        voiceEnabled: z.ZodDefault<z.ZodBoolean>;
        pushToTalkKey: z.ZodDefault<z.ZodString>;
        leaderKey: z.ZodDefault<z.ZodString>;
        keybindings: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
        diffStyle: z.ZodDefault<z.ZodEnum<["auto", "stacked", "inline"]>>;
        mouseCapture: z.ZodDefault<z.ZodBoolean>;
        scrollSpeed: z.ZodDefault<z.ZodNumber>;
        scrollAcceleration: z.ZodDefault<z.ZodBoolean>;
        terminal: z.ZodDefault<z.ZodString>;
        notificationSounds: z.ZodDefault<z.ZodBoolean>;
        commandPaletteEnabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        theme: string;
        color: string;
        vimMode: boolean;
        voiceEnabled: boolean;
        pushToTalkKey: string;
        leaderKey: string;
        keybindings: Record<string, string>;
        diffStyle: "auto" | "stacked" | "inline";
        mouseCapture: boolean;
        scrollSpeed: number;
        scrollAcceleration: boolean;
        terminal: string;
        notificationSounds: boolean;
        commandPaletteEnabled: boolean;
    }, {
        theme?: string | undefined;
        color?: string | undefined;
        vimMode?: boolean | undefined;
        voiceEnabled?: boolean | undefined;
        pushToTalkKey?: string | undefined;
        leaderKey?: string | undefined;
        keybindings?: Record<string, string> | undefined;
        diffStyle?: "auto" | "stacked" | "inline" | undefined;
        mouseCapture?: boolean | undefined;
        scrollSpeed?: number | undefined;
        scrollAcceleration?: boolean | undefined;
        terminal?: string | undefined;
        notificationSounds?: boolean | undefined;
        commandPaletteEnabled?: boolean | undefined;
    }>>;
    background: z.ZodDefault<z.ZodObject<{
        maxConcurrent: z.ZodDefault<z.ZodNumber>;
        concurrencyByProvider: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        maxConcurrent: number;
        concurrencyByProvider: Record<string, number>;
    }, {
        maxConcurrent?: number | undefined;
        concurrencyByProvider?: Record<string, number> | undefined;
    }>>;
    experimental: z.ZodDefault<z.ZodObject<{
        aggressiveTruncation: z.ZodDefault<z.ZodBoolean>;
        autoResume: z.ZodDefault<z.ZodBoolean>;
        teamMode: z.ZodDefault<z.ZodBoolean>;
        hashEditing: z.ZodDefault<z.ZodBoolean>;
        useRealImplementations: z.ZodDefault<z.ZodBoolean>;
        goal: z.ZodDefault<z.ZodObject<{
            maxActive: z.ZodDefault<z.ZodNumber>;
            autoTrack: z.ZodDefault<z.ZodBoolean>;
            notifyOnComplete: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            maxActive: number;
            autoTrack: boolean;
            notifyOnComplete: boolean;
        }, {
            maxActive?: number | undefined;
            autoTrack?: boolean | undefined;
            notifyOnComplete?: boolean | undefined;
        }>>;
        loop: z.ZodDefault<z.ZodObject<{
            maxLoops: z.ZodDefault<z.ZodNumber>;
            defaultInterval: z.ZodDefault<z.ZodNumber>;
            persistent: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            maxLoops: number;
            defaultInterval: number;
            persistent: boolean;
        }, {
            maxLoops?: number | undefined;
            defaultInterval?: number | undefined;
            persistent?: boolean | undefined;
        }>>;
        review: z.ZodDefault<z.ZodObject<{
            defaultEffort: z.ZodDefault<z.ZodNumber>;
            autoFix: z.ZodDefault<z.ZodBoolean>;
            comment: z.ZodDefault<z.ZodBoolean>;
            securityScan: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            defaultEffort: number;
            autoFix: boolean;
            comment: boolean;
            securityScan: boolean;
        }, {
            defaultEffort?: number | undefined;
            autoFix?: boolean | undefined;
            comment?: boolean | undefined;
            securityScan?: boolean | undefined;
        }>>;
        thinkMode: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            autoDetect: z.ZodDefault<z.ZodBoolean>;
            keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            autoDetect: boolean;
            keywords: string[];
        }, {
            enabled?: boolean | undefined;
            autoDetect?: boolean | undefined;
            keywords?: string[] | undefined;
        }>>;
        keywordDetector: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            modes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            modes: string[];
        }, {
            enabled?: boolean | undefined;
            modes?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        review: {
            defaultEffort: number;
            autoFix: boolean;
            comment: boolean;
            securityScan: boolean;
        };
        aggressiveTruncation: boolean;
        autoResume: boolean;
        teamMode: boolean;
        hashEditing: boolean;
        useRealImplementations: boolean;
        goal: {
            maxActive: number;
            autoTrack: boolean;
            notifyOnComplete: boolean;
        };
        loop: {
            maxLoops: number;
            defaultInterval: number;
            persistent: boolean;
        };
        thinkMode: {
            enabled: boolean;
            autoDetect: boolean;
            keywords: string[];
        };
        keywordDetector: {
            enabled: boolean;
            modes: string[];
        };
    }, {
        review?: {
            defaultEffort?: number | undefined;
            autoFix?: boolean | undefined;
            comment?: boolean | undefined;
            securityScan?: boolean | undefined;
        } | undefined;
        aggressiveTruncation?: boolean | undefined;
        autoResume?: boolean | undefined;
        teamMode?: boolean | undefined;
        hashEditing?: boolean | undefined;
        useRealImplementations?: boolean | undefined;
        goal?: {
            maxActive?: number | undefined;
            autoTrack?: boolean | undefined;
            notifyOnComplete?: boolean | undefined;
        } | undefined;
        loop?: {
            maxLoops?: number | undefined;
            defaultInterval?: number | undefined;
            persistent?: boolean | undefined;
        } | undefined;
        thinkMode?: {
            enabled?: boolean | undefined;
            autoDetect?: boolean | undefined;
            keywords?: string[] | undefined;
        } | undefined;
        keywordDetector?: {
            enabled?: boolean | undefined;
            modes?: string[] | undefined;
        } | undefined;
    }>>;
    cost: z.ZodDefault<z.ZodObject<{
        trackUsage: z.ZodDefault<z.ZodBoolean>;
        breakdown: z.ZodDefault<z.ZodBoolean>;
        alerts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
            threshold: z.ZodNumber;
            action: z.ZodEnum<["warn", "block"]>;
        }, "strip", z.ZodTypeAny, {
            action: "warn" | "block";
            threshold: number;
        }, {
            action: "warn" | "block";
            threshold: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        trackUsage: boolean;
        breakdown: boolean;
        alerts: Record<string, {
            action: "warn" | "block";
            threshold: number;
        }>;
    }, {
        trackUsage?: boolean | undefined;
        breakdown?: boolean | undefined;
        alerts?: Record<string, {
            action: "warn" | "block";
            threshold: number;
        }> | undefined;
    }>>;
    remote: z.ZodDefault<z.ZodObject<{
        control: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            port: z.ZodDefault<z.ZodNumber>;
            host: z.ZodDefault<z.ZodString>;
            authToken: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            port: number;
            host: string;
            authToken?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            port?: number | undefined;
            host?: string | undefined;
            authToken?: string | undefined;
        }>>;
        teleport: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            defaultClient: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            defaultClient: string;
        }, {
            enabled?: boolean | undefined;
            defaultClient?: string | undefined;
        }>>;
        ide: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            extension: z.ZodDefault<z.ZodString>;
            autoConnect: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            extension: string;
            autoConnect: boolean;
        }, {
            enabled?: boolean | undefined;
            extension?: string | undefined;
            autoConnect?: boolean | undefined;
        }>>;
        chrome: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            headless: z.ZodDefault<z.ZodBoolean>;
            remoteDebugPort: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            headless: boolean;
            remoteDebugPort: number;
        }, {
            enabled?: boolean | undefined;
            headless?: boolean | undefined;
            remoteDebugPort?: number | undefined;
        }>>;
        sync: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            autoSync: z.ZodDefault<z.ZodBoolean>;
            endpoint: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            autoSync: boolean;
            endpoint?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            autoSync?: boolean | undefined;
            endpoint?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        control: {
            enabled: boolean;
            port: number;
            host: string;
            authToken?: string | undefined;
        };
        teleport: {
            enabled: boolean;
            defaultClient: string;
        };
        ide: {
            enabled: boolean;
            extension: string;
            autoConnect: boolean;
        };
        chrome: {
            enabled: boolean;
            headless: boolean;
            remoteDebugPort: number;
        };
        sync: {
            enabled: boolean;
            autoSync: boolean;
            endpoint?: string | undefined;
        };
    }, {
        control?: {
            enabled?: boolean | undefined;
            port?: number | undefined;
            host?: string | undefined;
            authToken?: string | undefined;
        } | undefined;
        teleport?: {
            enabled?: boolean | undefined;
            defaultClient?: string | undefined;
        } | undefined;
        ide?: {
            enabled?: boolean | undefined;
            extension?: string | undefined;
            autoConnect?: boolean | undefined;
        } | undefined;
        chrome?: {
            enabled?: boolean | undefined;
            headless?: boolean | undefined;
            remoteDebugPort?: number | undefined;
        } | undefined;
        sync?: {
            enabled?: boolean | undefined;
            autoSync?: boolean | undefined;
            endpoint?: string | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    mcp: {
        builtin: {
            websearch: boolean;
            context7: boolean;
            grepApp: boolean;
            lsp: boolean;
            astGrep: boolean;
        };
        servers: Record<string, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
        }>;
    };
    skills: {
        builtin: {
            gitMaster: boolean;
            playwright: boolean;
            frontendUiUx: boolean;
        };
        paths: string[];
    };
    agents: {
        orchestrator?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        planner?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        reviewer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        researcher?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        explorer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        frontend?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        gitMaster?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        multimodal?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
    };
    hooks: {
        disabled: string[];
        claudeSettings: boolean;
    };
    compatibility: {
        mcp: boolean;
        commands: boolean;
        skills: boolean;
        agents: boolean;
        hooks: boolean;
        plugins: boolean;
    };
    categories: {
        quick?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        visual?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        businessLogic?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        deep?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        writing?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
    };
    permissions: {
        defaultMode: "default" | "acceptEdits" | "plan" | "auto" | "bypassPermissions";
        allowedTools: string[];
        deniedTools: string[];
        rules: {
            pattern: string;
            action: "allow" | "deny";
            scope?: "user" | "project" | "local" | undefined;
        }[];
    };
    ui: {
        theme: string;
        color: string;
        vimMode: boolean;
        voiceEnabled: boolean;
        pushToTalkKey: string;
        leaderKey: string;
        keybindings: Record<string, string>;
        diffStyle: "auto" | "stacked" | "inline";
        mouseCapture: boolean;
        scrollSpeed: number;
        scrollAcceleration: boolean;
        terminal: string;
        notificationSounds: boolean;
        commandPaletteEnabled: boolean;
    };
    background: {
        maxConcurrent: number;
        concurrencyByProvider: Record<string, number>;
    };
    experimental: {
        review: {
            defaultEffort: number;
            autoFix: boolean;
            comment: boolean;
            securityScan: boolean;
        };
        aggressiveTruncation: boolean;
        autoResume: boolean;
        teamMode: boolean;
        hashEditing: boolean;
        useRealImplementations: boolean;
        goal: {
            maxActive: number;
            autoTrack: boolean;
            notifyOnComplete: boolean;
        };
        loop: {
            maxLoops: number;
            defaultInterval: number;
            persistent: boolean;
        };
        thinkMode: {
            enabled: boolean;
            autoDetect: boolean;
            keywords: string[];
        };
        keywordDetector: {
            enabled: boolean;
            modes: string[];
        };
    };
    cost: {
        trackUsage: boolean;
        breakdown: boolean;
        alerts: Record<string, {
            action: "warn" | "block";
            threshold: number;
        }>;
    };
    remote: {
        control: {
            enabled: boolean;
            port: number;
            host: string;
            authToken?: string | undefined;
        };
        teleport: {
            enabled: boolean;
            defaultClient: string;
        };
        ide: {
            enabled: boolean;
            extension: string;
            autoConnect: boolean;
        };
        chrome: {
            enabled: boolean;
            headless: boolean;
            remoteDebugPort: number;
        };
        sync: {
            enabled: boolean;
            autoSync: boolean;
            endpoint?: string | undefined;
        };
    };
    $schema?: string | undefined;
}, {
    mcp?: {
        builtin?: {
            websearch?: boolean | undefined;
            context7?: boolean | undefined;
            grepApp?: boolean | undefined;
            lsp?: boolean | undefined;
            astGrep?: boolean | undefined;
        } | undefined;
        servers?: Record<string, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
        }> | undefined;
    } | undefined;
    skills?: {
        builtin?: {
            gitMaster?: boolean | undefined;
            playwright?: boolean | undefined;
            frontendUiUx?: boolean | undefined;
        } | undefined;
        paths?: string[] | undefined;
    } | undefined;
    agents?: {
        orchestrator?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        planner?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        reviewer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        researcher?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        explorer?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        frontend?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        gitMaster?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
        multimodal?: {
            model?: string | undefined;
            variant?: string | undefined;
            fallbackModels?: string[] | undefined;
            temperature?: number | undefined;
            toolPermissions?: string[] | undefined;
            prompt?: string | undefined;
        } | undefined;
    } | undefined;
    hooks?: {
        disabled?: string[] | undefined;
        claudeSettings?: boolean | undefined;
    } | undefined;
    $schema?: string | undefined;
    compatibility?: {
        mcp?: boolean | undefined;
        commands?: boolean | undefined;
        skills?: boolean | undefined;
        agents?: boolean | undefined;
        hooks?: boolean | undefined;
        plugins?: boolean | undefined;
    } | undefined;
    categories?: {
        quick?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        visual?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        businessLogic?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        deep?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
        writing?: {
            model?: string | undefined;
            variant?: string | undefined;
        } | undefined;
    } | undefined;
    permissions?: {
        defaultMode?: "default" | "acceptEdits" | "plan" | "auto" | "bypassPermissions" | undefined;
        allowedTools?: string[] | undefined;
        deniedTools?: string[] | undefined;
        rules?: {
            pattern: string;
            action: "allow" | "deny";
            scope?: "user" | "project" | "local" | undefined;
        }[] | undefined;
    } | undefined;
    ui?: {
        theme?: string | undefined;
        color?: string | undefined;
        vimMode?: boolean | undefined;
        voiceEnabled?: boolean | undefined;
        pushToTalkKey?: string | undefined;
        leaderKey?: string | undefined;
        keybindings?: Record<string, string> | undefined;
        diffStyle?: "auto" | "stacked" | "inline" | undefined;
        mouseCapture?: boolean | undefined;
        scrollSpeed?: number | undefined;
        scrollAcceleration?: boolean | undefined;
        terminal?: string | undefined;
        notificationSounds?: boolean | undefined;
        commandPaletteEnabled?: boolean | undefined;
    } | undefined;
    background?: {
        maxConcurrent?: number | undefined;
        concurrencyByProvider?: Record<string, number> | undefined;
    } | undefined;
    experimental?: {
        review?: {
            defaultEffort?: number | undefined;
            autoFix?: boolean | undefined;
            comment?: boolean | undefined;
            securityScan?: boolean | undefined;
        } | undefined;
        aggressiveTruncation?: boolean | undefined;
        autoResume?: boolean | undefined;
        teamMode?: boolean | undefined;
        hashEditing?: boolean | undefined;
        useRealImplementations?: boolean | undefined;
        goal?: {
            maxActive?: number | undefined;
            autoTrack?: boolean | undefined;
            notifyOnComplete?: boolean | undefined;
        } | undefined;
        loop?: {
            maxLoops?: number | undefined;
            defaultInterval?: number | undefined;
            persistent?: boolean | undefined;
        } | undefined;
        thinkMode?: {
            enabled?: boolean | undefined;
            autoDetect?: boolean | undefined;
            keywords?: string[] | undefined;
        } | undefined;
        keywordDetector?: {
            enabled?: boolean | undefined;
            modes?: string[] | undefined;
        } | undefined;
    } | undefined;
    cost?: {
        trackUsage?: boolean | undefined;
        breakdown?: boolean | undefined;
        alerts?: Record<string, {
            action: "warn" | "block";
            threshold: number;
        }> | undefined;
    } | undefined;
    remote?: {
        control?: {
            enabled?: boolean | undefined;
            port?: number | undefined;
            host?: string | undefined;
            authToken?: string | undefined;
        } | undefined;
        teleport?: {
            enabled?: boolean | undefined;
            defaultClient?: string | undefined;
        } | undefined;
        ide?: {
            enabled?: boolean | undefined;
            extension?: string | undefined;
            autoConnect?: boolean | undefined;
        } | undefined;
        chrome?: {
            enabled?: boolean | undefined;
            headless?: boolean | undefined;
            remoteDebugPort?: number | undefined;
        } | undefined;
        sync?: {
            enabled?: boolean | undefined;
            autoSync?: boolean | undefined;
            endpoint?: string | undefined;
        } | undefined;
    } | undefined;
}>;
export type Config = z.infer<typeof configSchema>;
export type Compatibility = z.infer<typeof compatibilitySchema>;
export type Agents = z.infer<typeof agentsSchema>;
export type Categories = z.infer<typeof categoriesSchema>;
export type Permissions = z.infer<typeof permissionsSchema>;
export type Mcp = z.infer<typeof mcpSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Hooks = z.infer<typeof hooksSchema>;
export type Ui = z.infer<typeof uiSchema>;
export type Background = z.infer<typeof backgroundSchema>;
export type Experimental = z.infer<typeof experimentalSchema>;
export type Cost = z.infer<typeof costSchema>;
export type Remote = z.infer<typeof remoteSchema>;
export declare function validateConfig(data: unknown): {
    success: true;
    data: Config;
} | {
    success: false;
    error: string;
    details: z.ZodError;
};
//# sourceMappingURL=schema.d.ts.map