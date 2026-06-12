import { RemoteControlConfig, RemoteControlSession, RemoteControlStatus } from "./types";
export declare class RemoteControlServer {
    private config;
    private status;
    private sessions;
    private messageCallbacks;
    private connectionCallbacks;
    private disconnectionCallbacks;
    private serverRef;
    constructor(config?: Partial<RemoteControlConfig>);
    getConfig(): RemoteControlConfig;
    updateConfig(config: Partial<RemoteControlConfig>): void;
    getStatus(): RemoteControlStatus;
    start(): Promise<void>;
    stop(): Promise<void>;
    getSessions(): RemoteControlSession[];
    getSession(id: string): RemoteControlSession | undefined;
    disconnectSession(id: string): boolean;
    broadcast(message: string): void;
    sendToSession(sessionId: string, message: string): boolean;
    onMessage(callback: (sessionId: string, message: string) => void): void;
    onConnection(callback: (session: RemoteControlSession) => void): void;
    onDisconnection(callback: (sessionId: string) => void): void;
    registerSession(session: RemoteControlSession): void;
    private generateId;
    destroy(): void;
}
export declare const remoteControlServer: RemoteControlServer;
//# sourceMappingURL=control.d.ts.map