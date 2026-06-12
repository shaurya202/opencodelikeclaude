export class VimModeManager {
    config = {
        enabled: false,
        mode: "normal",
        showModeIndicator: true,
        useSystemClipboard: false,
        leaderKey: "ctrl+x",
    };
    modeStack = [];
    buffer = [];
    registerMap = new Map();
    history = [];
    historyIndex = -1;
    modeChangeCallbacks = [];
    actionCallbacks = [];
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
    }
    isEnabled() {
        return this.config.enabled;
    }
    getMode() {
        return this.config.mode;
    }
    setMode(mode) {
        const previous = this.config.mode;
        this.config.mode = mode;
        this.modeStack.push(previous);
        if (this.modeStack.length > 10) {
            this.modeStack.shift();
        }
        for (const cb of this.modeChangeCallbacks) {
            cb(mode);
        }
    }
    popMode() {
        const mode = this.modeStack.pop();
        if (mode) {
            this.config.mode = mode;
            for (const cb of this.modeChangeCallbacks) {
                cb(mode);
            }
        }
        return mode;
    }
    processKey(key) {
        if (!this.config.enabled)
            return null;
        switch (this.config.mode) {
            case "normal":
                return this.processNormalModeKey(key);
            case "insert":
                return this.processInsertModeKey(key);
            case "visual":
                return this.processVisualModeKey(key);
            case "visual-line":
                return this.processVisualLineModeKey(key);
            case "command":
                return this.processCommandModeKey(key);
        }
    }
    processNormalModeKey(key) {
        switch (key) {
            case "i": return { type: "insert" };
            case "a": return { type: "insert", target: "append" };
            case "I": return { type: "insert", target: "line-start" };
            case "A": return { type: "insert", target: "line-end" };
            case "o": return { type: "insert", target: "below" };
            case "O": return { type: "insert", target: "above" };
            case "v": return { type: "visual" };
            case "V": return { type: "visual", target: "line" };
            case "u": return { type: "undo" };
            case "r": return { type: "redo" };
            case "x": return { type: "delete", target: "char" };
            case "d": return { type: "delete" };
            case "dd": return { type: "delete", target: "line" };
            case "y": return { type: "yank" };
            case "yy": return { type: "yank", target: "line" };
            case "p": return { type: "paste", target: "below" };
            case "P": return { type: "paste", target: "above" };
            case "h":
            case "j":
            case "k":
            case "l":
                return { type: "move", target: key };
            case "w": return { type: "move", target: "word-next" };
            case "b": return { type: "move", target: "word-back" };
            case "e": return { type: "move", target: "word-end" };
            case "0": return { type: "move", target: "line-start" };
            case "$": return { type: "move", target: "line-end" };
            case ":": return { type: "command" };
            default: return null;
        }
    }
    processInsertModeKey(key) {
        if (key === "escape") {
            return { type: "move" };
        }
        return null;
    }
    processVisualModeKey(key) {
        switch (key) {
            case "escape": return { type: "move" };
            case "d": return { type: "delete" };
            case "y": return { type: "yank" };
            case "x": return { type: "delete", target: "char" };
            case "h":
            case "j":
            case "k":
            case "l":
                return { type: "move", target: key };
            default: return null;
        }
    }
    processVisualLineModeKey(key) {
        switch (key) {
            case "escape": return { type: "move" };
            case "d": return { type: "delete" };
            case "y": return { type: "yank" };
            case "j":
            case "k": return { type: "move", target: key };
            default: return null;
        }
    }
    processCommandModeKey(key) {
        if (key === "escape") {
            return { type: "command", target: "cancel" };
        }
        if (key === "enter") {
            return { type: "command", target: "execute" };
        }
        this.buffer.push(key);
        return null;
    }
    getBuffer() {
        return this.buffer.join("");
    }
    clearBuffer() {
        this.buffer = [];
    }
    pushAction(action) {
        this.history.push(action);
        this.historyIndex = this.history.length - 1;
        for (const cb of this.actionCallbacks) {
            cb(action);
        }
    }
    onModeChange(callback) {
        this.modeChangeCallbacks.push(callback);
    }
    onAction(callback) {
        this.actionCallbacks.push(callback);
    }
    setRegister(name, content) {
        this.registerMap.set(name, content);
    }
    getRegister(name) {
        return this.registerMap.get(name);
    }
    destroy() {
        this.modeStack = [];
        this.buffer = [];
        this.registerMap.clear();
        this.history = [];
        this.modeChangeCallbacks = [];
        this.actionCallbacks = [];
    }
}
export const vimModeManager = new VimModeManager();
//# sourceMappingURL=vim-mode.js.map