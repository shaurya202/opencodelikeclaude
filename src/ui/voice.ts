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

export class VoiceManager {
  private engine: VoiceEngine | null = null;
  private config: VoiceConfig = {
    enabled: false,
    pushToTalkKey: "Space",
    language: "en-US",
    continuous: false,
  };
  private state: VoiceState = "idle";
  private resultCallbacks: Array<(result: VoiceResult) => void> = [];
  private errorCallbacks: Array<(error: Error) => void> = [];
  private stateCallbacks: Array<(state: VoiceState) => void> = [];

  constructor(config?: Partial<VoiceConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): VoiceConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config };
    if (!this.config.enabled && this.state === "listening") {
      this.stopListening();
    }
  }

  getState(): VoiceState {
    return this.state;
  }

  setEngine(engine: VoiceEngine): void {
    this.engine = engine;
  }

  async startListening(): Promise<void> {
    if (!this.config.enabled) {
      throw new Error("Voice mode is disabled");
    }
    if (!this.engine) {
      throw new Error("No voice engine available");
    }
    this.setState("listening");
    try {
      await this.engine.startListening(this.config);
      this.engine.onResult((result) => {
        for (const cb of this.resultCallbacks) {
          cb(result);
        }
      });
      this.engine.onError((error) => {
        this.setState("error");
        for (const cb of this.errorCallbacks) {
          cb(error);
        }
      });
      this.engine.onStateChange((state) => {
        this.setState(state);
      });
    } catch (error) {
      this.setState("error");
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    if (this.engine && this.state === "listening") {
      await this.engine.stopListening();
    }
    this.setState("idle");
  }

  isListening(): boolean {
    return this.state === "listening";
  }

  onResult(callback: (result: VoiceResult) => void): void {
    this.resultCallbacks.push(callback);
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  onStateChange(callback: (state: VoiceState) => void): void {
    this.stateCallbacks.push(callback);
  }

  private setState(state: VoiceState): void {
    this.state = state;
    for (const cb of this.stateCallbacks) {
      cb(state);
    }
  }

  destroy(): void {
    this.stopListening();
    this.resultCallbacks = [];
    this.errorCallbacks = [];
    this.stateCallbacks = [];
    this.engine = null;
  }
}

export const voiceManager = new VoiceManager();
