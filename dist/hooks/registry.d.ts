import { HookEventType, HookHandler, HookInput, HookOutput, HookRegistration } from "./types";
export declare class HookRegistry {
    private hooks;
    register<T extends HookInput, R extends HookOutput>(event: HookEventType, handler: HookHandler<T, R>, options?: {
        priority?: number;
        match?: (input: T) => boolean;
    }): void;
    unregister(event: HookEventType, handler: HookHandler): void;
    dispatch<T extends HookInput, R extends HookOutput>(event: HookEventType, input: T): Promise<R[]>;
    dispatchFirst<T extends HookInput, R extends HookOutput>(event: HookEventType, input: T): Promise<R | undefined>;
    getHooks(event: HookEventType): Array<HookRegistration<HookInput, HookOutput>>;
    clear(event?: HookEventType): void;
}
export declare const hookRegistry: HookRegistry;
//# sourceMappingURL=registry.d.ts.map