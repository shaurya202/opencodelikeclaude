export interface CommandContext {
    sessionId: string;
    cwd: string;
    args: string[];
    flags: Record<string, string | boolean>;
    stdin?: string;
}
export interface CommandResult {
    output?: string;
    error?: string;
    exitCode?: number;
    metadata?: Record<string, unknown>;
}
export type CommandHandler = (context: CommandContext) => Promise<CommandResult> | CommandResult;
export interface CommandDefinition {
    name: string;
    description: string;
    usage?: string;
    aliases?: string[];
    flags?: CommandFlag[];
    arguments?: CommandArgument[];
    handler: CommandHandler;
    hidden?: boolean;
    category?: string;
}
export interface CommandFlag {
    name: string;
    short?: string;
    description: string;
    type: "string" | "boolean" | "number";
    default?: string | boolean | number;
    required?: boolean;
}
export interface CommandArgument {
    name: string;
    description: string;
    required?: boolean;
    variadic?: boolean;
}
export interface CommandFile {
    name: string;
    description: string;
    usage?: string;
    aliases?: string[];
    flags?: CommandFlag[];
    arguments?: CommandArgument[];
    script: string;
    hidden?: boolean;
    category?: string;
}
export interface LoadedCommand extends CommandDefinition {
    source: "builtin" | "filesystem" | "claude-compat";
    filePath?: string;
}
//# sourceMappingURL=types.d.ts.map