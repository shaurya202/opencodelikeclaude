export class CommandRegistry {
    commands = new Map();
    aliases = new Map();
    register(command) {
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
    unregister(name) {
        const command = this.commands.get(name);
        if (!command)
            return;
        this.commands.delete(name);
        if (command.aliases) {
            for (const alias of command.aliases) {
                this.aliases.delete(alias);
            }
        }
    }
    get(name) {
        const resolvedName = this.aliases.get(name) || name;
        return this.commands.get(resolvedName);
    }
    getAll() {
        return Array.from(this.commands.values());
    }
    getByCategory(category) {
        return this.getAll().filter(cmd => cmd.category === category);
    }
    getVisible() {
        return this.getAll().filter(cmd => !cmd.hidden);
    }
    async execute(name, context) {
        const command = this.get(name);
        if (!command) {
            return {
                error: `Command not found: ${name}`,
                exitCode: 1,
            };
        }
        try {
            return await command.handler(context);
        }
        catch (error) {
            return {
                error: error instanceof Error ? error.message : String(error),
                exitCode: 1,
            };
        }
    }
    findMatches(prefix) {
        const all = this.getVisible();
        return all.filter(cmd => cmd.name.startsWith(prefix) ||
            cmd.aliases?.some(alias => alias.startsWith(prefix)));
    }
}
export const commandRegistry = new CommandRegistry();
//# sourceMappingURL=registry.js.map