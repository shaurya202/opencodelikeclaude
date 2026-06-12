import { rootLogger } from "./logger";

export class PluginError extends Error {
  public code: string;
  public recoverable: boolean;

  constructor(message: string, code: string = "PLUGIN_ERROR", recoverable: boolean = true) {
    super(message);
    this.name = "PluginError";
    this.code = code;
    this.recoverable = recoverable;
  }
}

export class ConfigError extends PluginError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "CONFIG_ERROR", recoverable);
    this.name = "ConfigError";
  }
}

export class CommandError extends PluginError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "COMMAND_ERROR", recoverable);
    this.name = "CommandError";
  }
}

export class AgentError extends PluginError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "AGENT_ERROR", recoverable);
    this.name = "AgentError";
  }
}

export class SessionError extends PluginError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "SESSION_ERROR", recoverable);
    this.name = "SessionError";
  }
}

export class MCPError extends PluginError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "MCP_ERROR", recoverable);
    this.name = "MCPError";
  }
}

export class PermissionError extends PluginError {
  constructor(message: string, recoverable: boolean = false) {
    super(message, "PERMISSION_DENIED", recoverable);
    this.name = "PermissionError";
  }
}

export class MigrationError extends PluginError {
  public sourceFile?: string;

  constructor(message: string, sourceFile?: string) {
    super(message, "MIGRATION_ERROR", true);
    this.name = "MigrationError";
    this.sourceFile = sourceFile;
  }
}

export interface ErrorBoundaryOptions {
  componentName: string;
  fallbackMessage?: string;
  rethrow?: boolean;
}

export class ErrorBoundary {
  static async wrap<T>(
    fn: () => Promise<T>,
    options: ErrorBoundaryOptions
  ): Promise<{ result?: T; error?: string; success: boolean }> {
    try {
      const result = await fn();
      return { result, success: true };
    } catch (error) {
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

  static wrapSync<T>(
    fn: () => T,
    options: ErrorBoundaryOptions
  ): { result?: T; error?: string; success: boolean } {
    try {
      const result = fn();
      return { result, success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      rootLogger.error(`${options.componentName} failed: ${message}`);

      return {
        error: options.fallbackMessage || message,
        success: false,
      };
    }
  }
}
