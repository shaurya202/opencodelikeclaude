declare class SkillExecutor {
    private runningSkills;
    execute(skillName: string, params: Record<string, unknown>): Promise<{
        output: string;
        metadata?: Record<string, unknown>;
    }>;
    private executeSkillContent;
    abort(skillName: string): boolean;
    executeWithMCP(skillName: string, mcpServer: string, toolName: string, args: Record<string, unknown>): Promise<unknown>;
}
export declare const skillExecutor: SkillExecutor;
export {};
//# sourceMappingURL=executor.d.ts.map