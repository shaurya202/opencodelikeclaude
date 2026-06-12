import { LoadedSkill, SkillDefinition } from "./types";
declare class SkillRegistry {
    private skills;
    private definitions;
    register(skill: LoadedSkill): void;
    unregister(name: string): void;
    get(name: string): LoadedSkill | undefined;
    getAll(): LoadedSkill[];
    registerDefinition(definition: SkillDefinition): void;
    getDefinition(name: string): SkillDefinition | undefined;
    getAllDefinitions(): SkillDefinition[];
    executeSkill(name: string, params: Record<string, unknown>): Promise<{
        output: string;
        metadata?: Record<string, unknown>;
    }>;
}
export declare const skillRegistry: SkillRegistry;
export {};
//# sourceMappingURL=registry.d.ts.map