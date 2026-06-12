export interface KeyBinding {
    key: string;
    command: string;
    description: string;
    when?: string;
}
export declare const defaultKeyBindings: KeyBinding[];
export declare class KeyBindingManager {
    private bindings;
    private leaderKey;
    constructor(bindings?: KeyBinding[]);
    setLeaderKey(key: string): void;
    getLeaderKey(): string;
    addBinding(binding: KeyBinding): void;
    removeBinding(key: string): boolean;
    getBinding(key: string): KeyBinding | undefined;
    getAllBindings(): KeyBinding[];
    findBindingsForCommand(command: string): KeyBinding[];
    resolveKey(key: string, context?: string): KeyBinding | undefined;
}
export declare const keyBindingManager: KeyBindingManager;
//# sourceMappingURL=keybindings.d.ts.map