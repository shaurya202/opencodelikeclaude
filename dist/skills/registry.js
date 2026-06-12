class SkillRegistry {
    skills = new Map();
    definitions = new Map();
    register(skill) {
        if (this.skills.has(skill.metadata.name)) {
            console.warn(`[SkillRegistry] Skill "${skill.metadata.name}" already registered, overwriting`);
        }
        this.skills.set(skill.metadata.name, skill);
    }
    unregister(name) {
        this.skills.delete(name);
        this.definitions.delete(name);
    }
    get(name) {
        return this.skills.get(name);
    }
    getAll() {
        return Array.from(this.skills.values());
    }
    registerDefinition(definition) {
        this.definitions.set(definition.name, definition);
    }
    getDefinition(name) {
        return this.definitions.get(name);
    }
    getAllDefinitions() {
        return Array.from(this.definitions.values());
    }
    async executeSkill(name, params) {
        const definition = this.definitions.get(name);
        if (!definition) {
            throw new Error(`Skill not found: ${name}`);
        }
        // Validate parameters
        for (const param of definition.parameters) {
            if (param.required && !(param.name in params)) {
                throw new Error(`Missing required parameter: ${param.name}`);
            }
            if (param.name in params && param.default !== undefined && params[param.name] === undefined) {
                params[param.name] = param.default;
            }
        }
        return await definition.handler(params);
    }
}
export const skillRegistry = new SkillRegistry();
//# sourceMappingURL=registry.js.map