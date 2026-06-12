import { ChromeConfig } from "./types";
export declare class ChromeManager {
    private config;
    private isRunning;
    private statusCallbacks;
    constructor(config?: Partial<ChromeConfig>);
    getConfig(): ChromeConfig;
    updateConfig(config: Partial<ChromeConfig>): void;
    isActive(): boolean;
    launch(_options?: {
        url?: string;
        headless?: boolean;
    }): Promise<void>;
    close(): Promise<void>;
    navigate(_url: string): Promise<boolean>;
    screenshot(options?: {
        fullPage?: boolean;
        path?: string;
    }): Promise<string | undefined>;
    evaluate(script: string): Promise<unknown>;
    onStatusChange(callback: (running: boolean) => void): void;
    private generateId;
    destroy(): void;
}
export declare const chromeManager: ChromeManager;
//# sourceMappingURL=chrome.d.ts.map