import { LoadedCommand, CommandContext, CommandResult } from "./types";
export declare class CommandRegistry {
    private commands;
    private aliases;
    register(command: LoadedCommand): void;
    unregister(name: string): void;
    get(name: string): LoadedCommand | undefined;
    getAll(): LoadedCommand[];
    getByCategory(category: string): LoadedCommand[];
    getVisible(): LoadedCommand[];
    execute(name: string, context: CommandContext): Promise<CommandResult>;
    findMatches(prefix: string): LoadedCommand[];
}
export declare const commandRegistry: CommandRegistry;
//# sourceMappingURL=registry.d.ts.map