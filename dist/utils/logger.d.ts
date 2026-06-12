export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    SILENT = 4
}
export declare class Logger {
    private level;
    private name;
    constructor(name: string, level?: LogLevel | string);
    private prefix;
    debug(message: string, ...data: unknown[]): void;
    info(message: string, ...data: unknown[]): void;
    warn(message: string, ...data: unknown[]): void;
    error(message: string, ...data: unknown[]): void;
    child(name: string): Logger;
}
export declare const rootLogger: Logger;
//# sourceMappingURL=logger.d.ts.map