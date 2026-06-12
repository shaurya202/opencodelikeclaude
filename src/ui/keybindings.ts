export interface KeyBinding {
  key: string;
  command: string;
  description: string;
  when?: string;
}

export const defaultKeyBindings: KeyBinding[] = [
  { key: "ctrl+c", command: "cancel", description: "Cancel current operation" },
  { key: "ctrl+d", command: "exit", description: "Exit the application" },
  { key: "ctrl+l", command: "clear", description: "Clear screen" },
  { key: "ctrl+p", command: "palette", description: "Open command palette" },
  { key: "ctrl+r", command: "history", description: "Search history" },
  { key: "ctrl+s", command: "save", description: "Save session" },
  { key: "ctrl+space", command: "complete", description: "Trigger completion" },
  { key: "tab", command: "indent", description: "Indent line", when: "editor" },
  { key: "shift+tab", command: "unindent", description: "Unindent line", when: "editor" },
  { key: "ctrl+/", command: "comment", description: "Toggle comment", when: "editor" },
  { key: "ctrl+enter", command: "submit", description: "Submit input" },
  { key: "escape", command: "escape", description: "Escape/Cancel" },
  { key: "up", command: "history-previous", description: "Previous history item", when: "input" },
  { key: "down", command: "history-next", description: "Next history item", when: "input" },
  { key: "ctrl+up", command: "scroll-up", description: "Scroll up" },
  { key: "ctrl+down", command: "scroll-down", description: "Scroll down" },
  { key: "pageup", command: "page-up", description: "Page up" },
  { key: "pagedown", command: "page-down", description: "Page down" },
  { key: "home", command: "line-start", description: "Go to line start", when: "editor" },
  { key: "end", command: "line-end", description: "Go to line end", when: "editor" },
  { key: "ctrl+home", command: "file-start", description: "Go to file start", when: "editor" },
  { key: "ctrl+end", command: "file-end", description: "Go to file end", when: "editor" },
];

export class KeyBindingManager {
  private bindings: Map<string, KeyBinding> = new Map();
  private leaderKey: string = "ctrl+x";

  constructor(bindings?: KeyBinding[]) {
    if (bindings) {
      for (const binding of bindings) {
        this.bindings.set(binding.key, binding);
      }
    } else {
      for (const binding of defaultKeyBindings) {
        this.bindings.set(binding.key, binding);
      }
    }
  }

  setLeaderKey(key: string): void {
    this.leaderKey = key;
  }

  getLeaderKey(): string {
    return this.leaderKey;
  }

  addBinding(binding: KeyBinding): void {
    this.bindings.set(binding.key, binding);
  }

  removeBinding(key: string): boolean {
    return this.bindings.delete(key);
  }

  getBinding(key: string): KeyBinding | undefined {
    return this.bindings.get(key);
  }

  getAllBindings(): KeyBinding[] {
    return Array.from(this.bindings.values());
  }

  findBindingsForCommand(command: string): KeyBinding[] {
    return this.getAllBindings().filter(b => b.command === command);
  }

  resolveKey(key: string, context?: string): KeyBinding | undefined {
    const binding = this.bindings.get(key);
    if (!binding) return undefined;
    if (binding.when && binding.when !== context) return undefined;
    return binding;
  }
}

export const keyBindingManager = new KeyBindingManager();