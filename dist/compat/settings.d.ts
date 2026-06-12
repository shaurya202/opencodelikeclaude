import { ClaudeCodeSettings } from "./types";
export declare function loadClaudeSettings(cwd?: string): ClaudeCodeSettings | null;
export declare function detectClaudeConfig(cwd?: string): {
    hasSettings: boolean;
    hasCommands: boolean;
    hasSkills: boolean;
    hasAgents: boolean;
    hasMcp: boolean;
    settingsPath?: string;
};
//# sourceMappingURL=settings.d.ts.map