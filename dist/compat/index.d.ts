import { migrateFromClaudeCode, generateMigrationReport } from "./migrate";
import { detectClaudeConfig } from "./settings";
import { MigrationResult, CompatibilityOptions } from "./types";
export interface LoadResult {
    commands: number;
    skills: number;
    agents: number;
    mcp: number;
    hooks: number;
    plugins: number;
}
export declare function loadClaudeCodeCompat(cwd?: string, compatOverrides?: Partial<CompatibilityOptions>): LoadResult;
export declare function getCompatSummary(cwd?: string): {
    detection: ReturnType<typeof detectClaudeConfig>;
    compat: LoadResult;
    migration: MigrationResult;
};
export { migrateFromClaudeCode, generateMigrationReport, detectClaudeConfig };
export type { MigrationResult, CompatibilityOptions } from "./types";
//# sourceMappingURL=index.d.ts.map