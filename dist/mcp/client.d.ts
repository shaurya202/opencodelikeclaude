import { MCPServerConfig, MCPTool, MCPToolResult, MCPResource } from "./types";
export declare class MCPClient {
    private process;
    private buffer;
    private pending;
    private nextId;
    private _connected;
    get connected(): boolean;
    connect(config: MCPServerConfig): Promise<void>;
    private processBuffer;
    private send;
    listTools(): Promise<MCPTool[]>;
    listResources(): Promise<MCPResource[]>;
    callTool(name: string, args: Record<string, unknown>): Promise<MCPToolResult>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map