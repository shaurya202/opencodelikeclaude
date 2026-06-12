export type HookEventType = "pre-tool-use" | "post-tool-use" | "user-prompt-submit" | "stop" | "pre-compact" | "session-start" | "chat.message" | "chat.params" | "permission.ask" | "tool.execute.before" | "tool.execute.after" | "text.complete" | "session.compacting" | "config" | "tool" | "event";
export interface HookContext {
    sessionId: string;
    cwd: string;
    env: Record<string, string>;
}
export interface PreToolUseHookInput extends HookContext {
    toolName: string;
    toolInput: Record<string, unknown>;
}
export interface PreToolUseHookOutput {
    allow?: boolean;
    modifiedInput?: Record<string, unknown>;
    message?: string;
}
export interface PostToolUseHookInput extends HookContext {
    toolName: string;
    toolInput: Record<string, unknown>;
    toolOutput: unknown;
    toolError?: Error;
}
export interface PostToolUseHookOutput {
    modifiedOutput?: unknown;
    message?: string;
}
export interface UserPromptSubmitHookInput extends HookContext {
    prompt: string;
}
export interface UserPromptSubmitHookOutput {
    modifiedPrompt?: string;
    message?: string;
}
export interface StopHookInput extends HookContext {
    reason: string;
}
export interface StopHookOutput {
    message?: string;
}
export interface PreCompactHookInput extends HookContext {
    trigger: "manual" | "auto";
    customPrompt?: string;
}
export interface PreCompactHookOutput {
    modifiedPrompt?: string;
    message?: string;
}
export interface SessionStartHookInput extends HookContext {
    source: "new" | "resume" | "branch";
    parentSessionId?: string;
}
export interface SessionStartHookOutput {
    message?: string;
}
export interface ChatMessageHookInput extends HookContext {
    role: "user" | "assistant" | "system";
    content: string;
}
export interface ChatMessageHookOutput {
    modifiedContent?: string;
    message?: string;
}
export interface ChatParamsHookInput extends HookContext {
    params: Record<string, unknown>;
}
export interface ChatParamsHookOutput {
    modifiedParams?: Record<string, unknown>;
    message?: string;
}
export interface PermissionAskHookInput extends HookContext {
    toolName: string;
    toolInput: Record<string, unknown>;
    description: string;
}
export interface PermissionAskHookOutput {
    allow?: boolean;
    message?: string;
}
export interface ToolExecuteBeforeHookInput extends HookContext {
    toolName: string;
    toolInput: Record<string, unknown>;
}
export interface ToolExecuteBeforeHookOutput {
    allow?: boolean;
    modifiedInput?: Record<string, unknown>;
    message?: string;
}
export interface ToolExecuteAfterHookInput extends HookContext {
    toolName: string;
    toolInput: Record<string, unknown>;
    toolOutput: unknown;
    toolError?: Error;
}
export interface ToolExecuteAfterHookOutput {
    modifiedOutput?: unknown;
    message?: string;
}
export interface TextCompleteHookInput extends HookContext {
    text: string;
    prefix: string;
}
export interface TextCompleteHookOutput {
    completions?: string[];
    message?: string;
}
export interface SessionCompactingHookInput extends HookContext {
    reason: string;
}
export interface SessionCompactingHookOutput {
    message?: string;
}
export interface ConfigHookInput extends HookContext {
    config: Record<string, unknown>;
}
export interface ConfigHookOutput {
    modifiedConfig?: Record<string, unknown>;
    message?: string;
}
export interface ToolHookInput extends HookContext {
    toolName: string;
    toolDefinition: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    };
}
export interface ToolHookOutput {
    modifiedDefinition?: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    };
    message?: string;
}
export interface EventHookInput extends HookContext {
    event: string;
    data: unknown;
}
export interface EventHookOutput {
    message?: string;
}
export type HookInput = PreToolUseHookInput | PostToolUseHookInput | UserPromptSubmitHookInput | StopHookInput | PreCompactHookInput | SessionStartHookInput | ChatMessageHookInput | ChatParamsHookInput | PermissionAskHookInput | ToolExecuteBeforeHookInput | ToolExecuteAfterHookInput | TextCompleteHookInput | SessionCompactingHookInput | ConfigHookInput | ToolHookInput | EventHookInput;
export type HookOutput = PreToolUseHookOutput | PostToolUseHookOutput | UserPromptSubmitHookOutput | StopHookOutput | PreCompactHookOutput | SessionStartHookOutput | ChatMessageHookOutput | ChatParamsHookOutput | PermissionAskHookOutput | ToolExecuteBeforeHookOutput | ToolExecuteAfterHookOutput | TextCompleteHookOutput | SessionCompactingHookOutput | ConfigHookOutput | ToolHookOutput | EventHookOutput;
export type HookHandler<T extends HookInput = HookInput, R extends HookOutput = HookOutput> = (input: T) => Promise<R> | R;
export interface HookRegistration<T extends HookInput = HookInput, R extends HookOutput = HookOutput> {
    event: HookEventType;
    handler: HookHandler<T, R>;
    priority?: number;
    match?: (input: T) => boolean;
}
//# sourceMappingURL=types.d.ts.map