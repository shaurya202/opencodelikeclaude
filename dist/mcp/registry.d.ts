import { MCPServer, MCPServerConfig, MCPTool, MCPToolResult } from "./types";
declare class MCPRegistry {
    private servers;
    private clients;
    private initialized;
    initialize(cwd?: string): Promise<void>;
    registerServer(name: string, config: MCPServerConfig): void;
    unregisterServer(name: string): boolean;
    getServer(name: string): MCPServer | undefined;
    getAllServers(): MCPServer[];
    getConnectedServers(): MCPServer[];
    connectServer(name: string): Promise<boolean>;
    disconnectServer(name: string): Promise<void>;
    connectAll(): Promise<void>;
    disconnectAll(): Promise<void>;
    callTool(serverName: string, toolName: string, args: Record<string, unknown>): Promise<MCPToolResult>;
    getAllTools(): {
        server: string;
        tool: MCPTool;
    }[];
    private getMockTools;
}
export declare const mcpRegistry: MCPRegistry;
export {};
//# sourceMappingURL=registry.d.ts.map