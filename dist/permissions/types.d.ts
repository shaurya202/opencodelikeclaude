export type PermissionMode = "default" | "acceptEdits" | "plan" | "auto" | "bypassPermissions";
export interface PermissionRule {
    pattern: string;
    action: "allow" | "deny";
    scope: "user" | "project" | "local";
    description?: string;
}
export interface PermissionConfig {
    defaultMode: PermissionMode;
    allowedTools: string[];
    deniedTools: string[];
    rules: PermissionRule[];
}
export interface PermissionPromptOptions {
    toolName: string;
    toolInput: Record<string, unknown>;
    description: string;
    mode: PermissionMode;
    rules: PermissionRule[];
}
export interface PermissionPromptResult {
    allow: boolean;
    remember: boolean;
    scope?: "user" | "project" | "local";
}
export interface ToolPermissionCheck {
    toolName: string;
    toolInput: Record<string, unknown>;
    mode: PermissionMode;
    allowedTools: string[];
    deniedTools: string[];
    rules: PermissionRule[];
}
export interface PermissionEvaluation {
    allowed: boolean;
    reason: string;
    matchedRule?: PermissionRule;
    mode: PermissionMode;
}
//# sourceMappingURL=types.d.ts.map