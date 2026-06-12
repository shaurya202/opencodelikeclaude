export interface RenameResult {
    success: boolean;
    sessionId?: string;
    name?: string;
    error?: string;
}
export declare function renameSession(sessionId: string, name: string): RenameResult;
export declare function generateSessionName(sessionId: string): string;
export declare function autoNameSession(sessionId: string): RenameResult;
export declare function addTag(sessionId: string, tag: string): boolean;
export declare function removeTag(sessionId: string, tag: string): boolean;
export declare function listTags(sessionId: string): string[];
//# sourceMappingURL=naming.d.ts.map