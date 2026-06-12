export const HOOK_EVENTS = [
    "pre-tool-use",
    "post-tool-use",
    "user-prompt-submit",
    "stop",
    "pre-compact",
    "session-start",
    "chat.message",
    "chat.params",
    "permission.ask",
    "tool.execute.before",
    "tool.execute.after",
    "text.complete",
    "session.compacting",
    "config",
    "tool",
    "event",
];
export const CLAUDE_CODE_HOOK_EVENTS = [
    "pre-tool-use",
    "post-tool-use",
    "user-prompt-submit",
    "stop",
    "pre-compact",
    "session-start",
];
export const EXPERIMENTAL_HOOK_EVENTS = [
    "chat.message",
    "chat.params",
    "permission.ask",
    "tool.execute.before",
    "tool.execute.after",
    "text.complete",
    "session.compacting",
];
export function isClaudeCodeHookEvent(event) {
    return CLAUDE_CODE_HOOK_EVENTS.includes(event);
}
export function isExperimentalHookEvent(event) {
    return EXPERIMENTAL_HOOK_EVENTS.includes(event);
}
//# sourceMappingURL=events.js.map