import { MCPServerConfig, BuiltinMCPConfig } from "./types";
export declare function loadMCPConfig(cwd?: string): {
    builtin: BuiltinMCPConfig;
    servers: Record<string, MCPServerConfig>;
};
export declare function getBuiltinMCPConfigs(builtin: BuiltinMCPConfig): Record<string, MCPServerConfig>;
//# sourceMappingURL=loader.d.ts.map