export type VimMode = "normal" | "insert" | "visual" | "visual-line" | "command";
export type VimDirection = "h" | "j" | "k" | "l" | "w" | "b" | "e" | "0" | "$" | "gg" | "G";
export interface VimConfig {
    enabled: boolean;
    mode: VimMode;
    showModeIndicator: boolean;
    useSystemClipboard: boolean;
    leaderKey: string;
}
export interface VimAction {
    type: "move" | "delete" | "change" | "yank" | "paste" | "undo" | "redo" | "insert" | "visual" | "command";
    count?: number;
    target?: string;
    register?: string;
}
export declare class VimModeManager {
    private config;
    private modeStack;
    private buffer;
    private registerMap;
    private history;
    private historyIndex;
    private modeChangeCallbacks;
    private actionCallbacks;
    constructor(config?: Partial<VimConfig>);
    getConfig(): VimConfig;
    updateConfig(config: Partial<VimConfig>): void;
    isEnabled(): boolean;
    getMode(): VimMode;
    setMode(mode: VimMode): void;
    popMode(): VimMode | undefined;
    processKey(key: string): VimAction | null;
    private processNormalModeKey;
    private processInsertModeKey;
    private processVisualModeKey;
    private processVisualLineModeKey;
    private processCommandModeKey;
    getBuffer(): string;
    clearBuffer(): void;
    pushAction(action: VimAction): void;
    onModeChange(callback: (mode: VimMode) => void): void;
    onAction(callback: (action: VimAction) => void): void;
    setRegister(name: string, content: string): void;
    getRegister(name: string): string | undefined;
    destroy(): void;
}
export declare const vimModeManager: VimModeManager;
//# sourceMappingURL=vim-mode.d.ts.map