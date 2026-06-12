export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["SILENT"] = 4] = "SILENT";
})(LogLevel || (LogLevel = {}));
const LOG_LEVELS = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
    silent: LogLevel.SILENT,
};
export class Logger {
    level;
    name;
    constructor(name, level) {
        this.name = name;
        if (typeof level === "string") {
            this.level = LOG_LEVELS[level.toLowerCase()] ?? LogLevel.INFO;
        }
        else {
            this.level = level ?? LogLevel.INFO;
        }
    }
    prefix(level) {
        return `[${this.name}/${level}]`;
    }
    debug(message, ...data) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(this.prefix("DEBUG"), message, ...data);
        }
    }
    info(message, ...data) {
        if (this.level <= LogLevel.INFO) {
            console.info(this.prefix("INFO"), message, ...data);
        }
    }
    warn(message, ...data) {
        if (this.level <= LogLevel.WARN) {
            console.warn(this.prefix("WARN"), message, ...data);
        }
    }
    error(message, ...data) {
        if (this.level <= LogLevel.ERROR) {
            console.error(this.prefix("ERROR"), message, ...data);
        }
    }
    child(name) {
        return new Logger(`${this.name}:${name}`, this.level);
    }
}
const LOG_LEVEL_ENV = (process.env.OPENCODE_LOG_LEVEL || "info").toLowerCase();
export const rootLogger = new Logger("opencode-claude-parity", LOG_LEVEL_ENV);
//# sourceMappingURL=logger.js.map