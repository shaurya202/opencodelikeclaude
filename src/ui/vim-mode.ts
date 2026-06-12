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

export class VimModeManager {
  private config: VimConfig = {
    enabled: false,
    mode: "normal",
    showModeIndicator: true,
    useSystemClipboard: false,
    leaderKey: "ctrl+x",
  };
  private modeStack: VimMode[] = [];
  private buffer: string[] = [];
  private registerMap: Map<string, string> = new Map();
  private history: VimAction[] = [];
  private historyIndex: number = -1;
  private modeChangeCallbacks: Array<(mode: VimMode) => void> = [];
  private actionCallbacks: Array<(action: VimAction) => void> = [];

  constructor(config?: Partial<VimConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): VimConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<VimConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getMode(): VimMode {
    return this.config.mode;
  }

  setMode(mode: VimMode): void {
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

  popMode(): VimMode | undefined {
    const mode = this.modeStack.pop();
    if (mode) {
      this.config.mode = mode;
      for (const cb of this.modeChangeCallbacks) {
        cb(mode);
      }
    }
    return mode;
  }

  processKey(key: string): VimAction | null {
    if (!this.config.enabled) return null;

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

  private processNormalModeKey(key: string): VimAction | null {
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
      case "h": case "j": case "k": case "l":
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

  private processInsertModeKey(key: string): VimAction | null {
    if (key === "escape") {
      return { type: "move" };
    }
    return null;
  }

  private processVisualModeKey(key: string): VimAction | null {
    switch (key) {
      case "escape": return { type: "move" };
      case "d": return { type: "delete" };
      case "y": return { type: "yank" };
      case "x": return { type: "delete", target: "char" };
      case "h": case "j": case "k": case "l":
        return { type: "move", target: key };
      default: return null;
    }
  }

  private processVisualLineModeKey(key: string): VimAction | null {
    switch (key) {
      case "escape": return { type: "move" };
      case "d": return { type: "delete" };
      case "y": return { type: "yank" };
      case "j": case "k": return { type: "move", target: key };
      default: return null;
    }
  }

  private processCommandModeKey(key: string): VimAction | null {
    if (key === "escape") {
      return { type: "command", target: "cancel" };
    }
    if (key === "enter") {
      return { type: "command", target: "execute" };
    }
    this.buffer.push(key);
    return null;
  }

  getBuffer(): string {
    return this.buffer.join("");
  }

  clearBuffer(): void {
    this.buffer = [];
  }

  pushAction(action: VimAction): void {
    this.history.push(action);
    this.historyIndex = this.history.length - 1;
    for (const cb of this.actionCallbacks) {
      cb(action);
    }
  }

  onModeChange(callback: (mode: VimMode) => void): void {
    this.modeChangeCallbacks.push(callback);
  }

  onAction(callback: (action: VimAction) => void): void {
    this.actionCallbacks.push(callback);
  }

  setRegister(name: string, content: string): void {
    this.registerMap.set(name, content);
  }

  getRegister(name: string): string | undefined {
    return this.registerMap.get(name);
  }

  destroy(): void {
    this.modeStack = [];
    this.buffer = [];
    this.registerMap.clear();
    this.history = [];
    this.modeChangeCallbacks = [];
    this.actionCallbacks = [];
  }
}

export const vimModeManager = new VimModeManager();
