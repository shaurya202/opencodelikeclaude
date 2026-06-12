import { HookEventType } from "./types";
export declare const HOOK_EVENTS: HookEventType[];
export declare const CLAUDE_CODE_HOOK_EVENTS: HookEventType[];
export declare const EXPERIMENTAL_HOOK_EVENTS: HookEventType[];
export declare function isClaudeCodeHookEvent(event: string): event is HookEventType;
export declare function isExperimentalHookEvent(event: string): event is HookEventType;
//# sourceMappingURL=events.d.ts.map