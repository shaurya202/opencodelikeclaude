import { ClaudePackageJson } from "./types";
interface PluginDescriptor {
    name: string;
    packagePath: string;
    packageJson: ClaudePackageJson;
    source: string;
}
export declare function discoverClaudePlugins(cwd?: string): PluginDescriptor[];
export declare function loadClaudePlugins(cwd?: string): number;
export declare function getPluginPaths(cwd?: string): string[];
export {};
//# sourceMappingURL=plugins.d.ts.map