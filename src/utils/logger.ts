export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

const LOG_LEVELS: Record<string, LogLevel> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  silent: LogLevel.SILENT,
};

export class Logger {
  private level: LogLevel;
  private name: string;

  constructor(name: string, level?: LogLevel | string) {
    this.name = name;
    if (typeof level === "string") {
      this.level = LOG_LEVELS[level.toLowerCase()] ?? LogLevel.INFO;
    } else {
      this.level = level ?? LogLevel.INFO;
    }
  }

  private prefix(level: string): string {
    return `[${this.name}/${level}]`;
  }

  debug(message: string, ...data: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(this.prefix("DEBUG"), message, ...data);
    }
  }

  info(message: string, ...data: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(this.prefix("INFO"), message, ...data);
    }
  }

  warn(message: string, ...data: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.prefix("WARN"), message, ...data);
    }
  }

  error(message: string, ...data: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.prefix("ERROR"), message, ...data);
    }
  }

  child(name: string): Logger {
    return new Logger(`${this.name}:${name}`, this.level);
  }
}

const LOG_LEVEL_ENV = (process.env.OPENCODE_LOG_LEVEL || "info").toLowerCase();
export const rootLogger = new Logger("opencode-claude-parity", LOG_LEVEL_ENV);
