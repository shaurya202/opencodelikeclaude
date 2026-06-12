import { MigrationResult } from "./types";
interface MigrationConfig {
    cwd: string;
    outputDir?: string;
    dryRun?: boolean;
    verbose?: boolean;
}
export declare function migrateFromClaudeCode(config: MigrationConfig): MigrationResult;
export declare function generateMigrationReport(cwd?: string, verbose?: boolean): string;
export {};
//# sourceMappingURL=migrate.d.ts.map