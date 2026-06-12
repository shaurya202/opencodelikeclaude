import { rootLogger } from "./logger";
export class PluginError extends Error {
    code;
    recoverable;
    constructor(message, code = "PLUGIN_ERROR", recoverable = true) {
        super(message);
        this.name = "PluginError";
        this.code = code;
        this.recoverable = recoverable;
    }
}
export class ConfigError extends PluginError {
    constructor(message, recoverable = true) {
        super(message, "CONFIG_ERROR", recoverable);
        this.name = "ConfigError";
    }
}
export class CommandError extends PluginError {
    constructor(message, recoverable = true) {
        super(message, "COMMAND_ERROR", recoverable);
        this.name = "CommandError";
    }
}
export class AgentError extends PluginError {
    constructor(message, recoverable = true) {
        super(message, "AGENT_ERROR", recoverable);
        this.name = "AgentError";
    }
}
export class SessionError extends PluginError {
    constructor(message, recoverable = true) {
        super(message, "SESSION_ERROR", recoverable);
        this.name = "SessionError";
    }
}
export class MCPError extends PluginError {
    constructor(message, recoverable = true) {
        super(message, "MCP_ERROR", recoverable);
        this.name = "MCPError";
    }
}
export class PermissionError extends PluginError {
    constructor(message, recoverable = false) {
        super(message, "PERMISSION_DENIED", recoverable);
        this.name = "PermissionError";
    }
}
export class MigrationError extends PluginError {
    sourceFile;
    constructor(message, sourceFile) {
        super(message, "MIGRATION_ERROR", true);
        this.name = "MigrationError";
        this.sourceFile = sourceFile;
    }
}
export class ErrorBoundary {
    static async wrap(fn, options) {
        try {
            const result = await fn();
            return { result, success: true };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            rootLogger.error(`${options.componentName} failed: ${message}`);
            if (options.rethrow) {
                throw error;
            }
            return {
                error: options.fallbackMessage || message,
                success: false,
            };
        }
    }
    static wrapSync(fn, options) {
        try {
            const result = fn();
            return { result, success: true };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            rootLogger.error(`${options.componentName} failed: ${message}`);
            return {
                error: options.fallbackMessage || message,
                success: false,
            };
        }
    }
}
//# sourceMappingURL=errors.js.map