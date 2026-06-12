export interface CheckpointInfo {
    id: string;
    timestamp: Date;
    messageIndex: number;
    description: string;
}
export declare function createCheckpoint(sessionId: string, description: string): CheckpointInfo | null;
export declare function listCheckpoints(sessionId: string): CheckpointInfo[];
export declare function rewindToCheckpoint(sessionId: string, checkpointId: string): boolean;
export declare function deleteCheckpoint(sessionId: string, checkpointId: string): boolean;
export declare function getCheckpointDetails(sessionId: string, checkpointId: string): {
    messageCount: number;
    tokenUsage: {
        input: number;
        output: number;
    };
    id: string;
    sessionId: string;
    timestamp: Date;
    messageIndex: number;
    description: string;
    snapshot: import("./types").SessionSnapshot;
} | null;
//# sourceMappingURL=checkpoints.d.ts.map