import { HookEventType } from "./types";

export const HOOK_EVENTS: HookEventType[] = [
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

export const CLAUDE_CODE_HOOK_EVENTS: HookEventType[] = [
  "pre-tool-use",
  "post-tool-use",
  "user-prompt-submit",
  "stop",
  "pre-compact",
  "session-start",
];

export const EXPERIMENTAL_HOOK_EVENTS: HookEventType[] = [
  "chat.message",
  "chat.params",
  "permission.ask",
  "tool.execute.before",
  "tool.execute.after",
  "text.complete",
  "session.compacting",
];

export function isClaudeCodeHookEvent(event: string): event is HookEventType {
  return CLAUDE_CODE_HOOK_EVENTS.includes(event as HookEventType);
}

export function isExperimentalHookEvent(event: string): event is HookEventType {
  return EXPERIMENTAL_HOOK_EVENTS.includes(event as HookEventType);
}