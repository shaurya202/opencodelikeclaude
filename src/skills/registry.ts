import { LoadedSkill, SkillDefinition } from "./types";

class SkillRegistry {
  private skills: Map<string, LoadedSkill> = new Map();
  private definitions: Map<string, SkillDefinition> = new Map();

  register(skill: LoadedSkill): void {
    if (this.skills.has(skill.metadata.name)) {
      console.warn(`[SkillRegistry] Skill "${skill.metadata.name}" already registered, overwriting`);
    }
    this.skills.set(skill.metadata.name, skill);
  }

  unregister(name: string): void {
    this.skills.delete(name);
    this.definitions.delete(name);
  }

  get(name: string): LoadedSkill | undefined {
    return this.skills.get(name);
  }

  getAll(): LoadedSkill[] {
    return Array.from(this.skills.values());
  }

  registerDefinition(definition: SkillDefinition): void {
    this.definitions.set(definition.name, definition);
  }

  getDefinition(name: string): SkillDefinition | undefined {
    return this.definitions.get(name);
  }

  getAllDefinitions(): SkillDefinition[] {
    return Array.from(this.definitions.values());
  }

  async executeSkill(name: string, params: Record<string, unknown>): Promise<{ output: string; metadata?: Record<string, unknown> }> {
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