import { PermissionPromptOptions, PermissionPromptResult } from "./types";
export declare class PermissionPrompt {
    static show(options: PermissionPromptOptions): Promise<PermissionPromptResult>;
    private static simulateResponse;
    static formatToolDescription(toolName: string, toolInput: Record<string, unknown>): string;
}
//# sourceMappingURL=prompt.d.ts.map