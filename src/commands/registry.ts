import { LoadedCommand, CommandContext, CommandResult } from "./types";

export class CommandRegistry {
  private commands: Map<string, LoadedCommand> = new Map();
  private aliases: Map<string, string> = new Map();

  register(command: LoadedCommand): void {
    if (this.commands.has(command.name)) {
      console.warn(`[CommandRegistry] Command "${command.name}" already registered, overwriting`);
    }
    this.commands.set(command.name, command);
    
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.aliases.set(alias, command.name);
      }
    }
  }

  unregister(name: string): void {
    const command = this.commands.get(name);
    if (!command) return;
    
    this.commands.delete(name);
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.aliases.delete(alias);
      }
    }
  }

  get(name: string): LoadedCommand | undefined {
    const resolvedName = this.aliases.get(name) || name;
    return this.commands.get(resolvedName);
  }

  getAll(): LoadedCommand[] {
    return Array.from(this.commands.values());
  }

  getByCategory(category: string): LoadedCommand[] {
    return this.getAll().filter(cmd => cmd.category === category);
  }

  getVisible(): LoadedCommand[] {
    return this.getAll().filter(cmd => !cmd.hidden);
  }

  async execute(name: string, context: CommandContext): Promise<CommandResult> {
    const command = this.get(name);
    if (!command) {
      return {
        error: `Command not found: ${name}`,
        exitCode: 1,
      };
    }

    try {
      return await command.handler(context);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
        exitCode: 1,
      };
    }
  }

  findMatches(prefix: string): LoadedCommand[] {
    const all = this.getVisible();
    return all.filter(cmd => 
      cmd.name.startsWith(prefix) || 
      cmd.aliases?.some(alias => alias.startsWith(prefix))
    );
  }
}

export const commandRegistry = new CommandRegistry();