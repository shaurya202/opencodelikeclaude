import { IDEConfig, IDEConnection } from "./types";
export declare class IDEManager {
    private config;
    private connection;
    private connectionCallbacks;
    private disconnectionCallbacks;
    private messageCallbacks;
    constructor(config?: Partial<IDEConfig>);
    getConfig(): IDEConfig;
    updateConfig(config: Partial<IDEConfig>): void;
    isConnected(): boolean;
    getConnection(): IDEConnection;
    connect(name: string, options?: {
        version?: string;
        workspace?: string;
    }): Promise<IDEConnection>;
    disconnect(): Promise<void>;
    openFile(filePath: string, line?: number): Promise<boolean>;
    highlightLine(filePath: string, line: number): Promise<boolean>;
    showMessage(message: string, type?: "info" | "warning" | "error"): Promise<boolean>;
    onConnect(callback: (connection: IDEConnection) => void): void;
    onDisconnect(callback: () => void): void;
    onMessage(callback: (message: string) => void): void;
    detectIDE(): string[];
    destroy(): void;
}
export declare const ideManager: IDEManager;
//# sourceMappingURL=ide.d.ts.map