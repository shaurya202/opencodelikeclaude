export declare class PluginError extends Error {
    code: string;
    recoverable: boolean;
    constructor(message: string, code?: string, recoverable?: boolean);
}
export declare class ConfigError extends PluginError {
    constructor(message: string, recoverable?: boolean);
}
export declare class CommandError extends PluginError {
    constructor(message: string, recoverable?: boolean);
}
export declare class AgentError extends PluginError {
    constructor(message: string, recoverable?: boolean);
}
export declare class SessionError extends PluginError {
    constructor(message: string, recoverable?: boolean);
}
export declare class MCPError extends PluginError {
    constructor(message: string, recoverable?: boolean);
}
export declare class PermissionError extends PluginError {
    constructor(message: string, recoverable?: boolean);
}
export declare class MigrationError extends PluginError {
    sourceFile?: string;
    constructor(message: string, sourceFile?: string);
}
export interface ErrorBoundaryOptions {
    componentName: string;
    fallbackMessage?: string;
    rethrow?: boolean;
}
export declare class ErrorBoundary {
    static wrap<T>(fn: () => Promise<T>, options: ErrorBoundaryOptions): Promise<{
        result?: T;
        error?: string;
        success: boolean;
    }>;
    static wrapSync<T>(fn: () => T, options: ErrorBoundaryOptions): {
        result?: T;
        error?: string;
        success: boolean;
    };
}
//# sourceMappingURL=errors.d.ts.map