export interface VoiceConfig {
    enabled: boolean;
    pushToTalkKey: string;
    language: string;
    continuous: boolean;
}
export interface VoiceResult {
    transcript: string;
    confidence: number;
    final: boolean;
}
export interface VoiceEngine {
    startListening(config: VoiceConfig): Promise<void>;
    stopListening(): Promise<void>;
    isListening(): boolean;
    onResult(callback: (result: VoiceResult) => void): void;
    onError(callback: (error: Error) => void): void;
    onStateChange(callback: (state: VoiceState) => void): void;
}
export type VoiceState = "idle" | "listening" | "processing" | "error";
export declare class VoiceManager {
    private engine;
    private config;
    private state;
    private resultCallbacks;
    private errorCallbacks;
    private stateCallbacks;
    constructor(config?: Partial<VoiceConfig>);
    getConfig(): VoiceConfig;
    updateConfig(config: Partial<VoiceConfig>): void;
    getState(): VoiceState;
    setEngine(engine: VoiceEngine): void;
    startListening(): Promise<void>;
    stopListening(): Promise<void>;
    isListening(): boolean;
    onResult(callback: (result: VoiceResult) => void): void;
    onError(callback: (error: Error) => void): void;
    onStateChange(callback: (state: VoiceState) => void): void;
    private setState;
    destroy(): void;
}
export declare const voiceManager: VoiceManager;
//# sourceMappingURL=voice.d.ts.map