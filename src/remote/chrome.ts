import { ChromeConfig } from "./types";

export class ChromeManager {
  private config: ChromeConfig = {
    enabled: false,
    headless: false,
    remoteDebugPort: 9222,
  };
  private isRunning: boolean = false;
  private statusCallbacks: Array<(running: boolean) => void> = [];

  constructor(config?: Partial<ChromeConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): ChromeConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ChromeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isActive(): boolean {
    return this.isRunning;
  }

  async launch(_options?: { url?: string; headless?: boolean }): Promise<void> {
    if (!this.config.enabled) throw new Error("Chrome integration is disabled");
    if (this.isRunning) return;

    this.isRunning = true;
    for (const cb of this.statusCallbacks) {
      cb(true);
    }
  }

  async close(): Promise<void> {
    if (!this.isRunning) return;
    this.isRunning = false;
    for (const cb of this.statusCallbacks) {
      cb(false);
    }
  }

  async navigate(_url: string): Promise<boolean> {
    if (!this.isRunning) return false;
    return true;
  }

  async screenshot(options?: { fullPage?: boolean; path?: string }): Promise<string | undefined> {
    if (!this.isRunning) return undefined;
    return options?.path || undefined;
  }

  async evaluate(script: string): Promise<unknown> {
    if (!this.isRunning) return null;
    return `Evaluated: ${script.slice(0, 50)}`;
  }

  onStatusChange(callback: (running: boolean) => void): void {
    this.statusCallbacks.push(callback);
  }

  private generateId(): string {
    return `chrome-${Date.now()}`;
  }

  destroy(): void {
    this.close();
    this.statusCallbacks = [];
  }
}

export const chromeManager = new ChromeManager();
