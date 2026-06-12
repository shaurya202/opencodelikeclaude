import { PermissionMode, PermissionConfig, PermissionRule, ToolPermissionCheck, PermissionEvaluation } from "./types";
declare class PermissionManager {
    private config;
    private currentMode;
    constructor(cwd?: string);
    getMode(): PermissionMode;
    setMode(mode: PermissionMode): void;
    getConfig(): PermissionConfig;
    updateConfig(config: Partial<PermissionConfig>): void;
    addRule(rule: PermissionRule): void;
    removeRule(pattern: string): boolean;
    evaluateToolPermission(check: ToolPermissionCheck): PermissionEvaluation;
    private evaluateAutoMode;
    private matchPattern;
    getAllowedTools(): string[];
    getDeniedTools(): string[];
    getRules(): PermissionRule[];
}
export declare const permissionManager: PermissionManager;
export {};
//# sourceMappingURL=manager.d.ts.map