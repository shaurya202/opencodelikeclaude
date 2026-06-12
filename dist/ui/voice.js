export class VoiceManager {
    engine = null;
    config = {
        enabled: false,
        pushToTalkKey: "Space",
        language: "en-US",
        continuous: false,
    };
    state = "idle";
    resultCallbacks = [];
    errorCallbacks = [];
    stateCallbacks = [];
    constructor(config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        if (!this.config.enabled && this.state === "listening") {
            this.stopListening();
        }
    }
    getState() {
        return this.state;
    }
    setEngine(engine) {
        this.engine = engine;
    }
    async startListening() {
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
        }
        catch (error) {
            this.setState("error");
            throw error;
        }
    }
    async stopListening() {
        if (this.engine && this.state === "listening") {
            await this.engine.stopListening();
        }
        this.setState("idle");
    }
    isListening() {
        return this.state === "listening";
    }
    onResult(callback) {
        this.resultCallbacks.push(callback);
    }
    onError(callback) {
        this.errorCallbacks.push(callback);
    }
    onStateChange(callback) {
        this.stateCallbacks.push(callback);
    }
    setState(state) {
        this.state = state;
        for (const cb of this.stateCallbacks) {
            cb(state);
        }
    }
    destroy() {
        this.stopListening();
        this.resultCallbacks = [];
        this.errorCallbacks = [];
        this.stateCallbacks = [];
        this.engine = null;
    }
}
export const voiceManager = new VoiceManager();
//# sourceMappingURL=voice.js.map