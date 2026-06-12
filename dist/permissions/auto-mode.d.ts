import { PermissionEvaluation, ToolPermissionCheck } from "./types";
interface SafetyCheck {
    check: (toolName: string, toolInput: Record<string, unknown>) => Promise<{
        safe: boolean;
        reason: string;
    }>;
    weight: number;
}
export declare function evaluateWithAI(check: ToolPermissionCheck): Promise<PermissionEvaluation>;
export declare function getSafetyChecks(): SafetyCheck[];
export {};
//# sourceMappingURL=auto-mode.d.ts.map