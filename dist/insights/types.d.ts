export interface InsightReport {
    id: string;
    timestamp: number;
    sessionId: string;
    duration: number;
    messageCount: number;
    toolCalls: number;
    filesChanged: number;
    topCommands: {
        command: string;
        count: number;
    }[];
    topFiles: {
        file: string;
        edits: number;
    }[];
    tokenUsage: {
        input: number;
        output: number;
    };
    cost: number;
    efficiency: number;
    patterns: string[];
    suggestions: string[];
}
export interface InsightsConfig {
    trackPatterns: boolean;
    maxHistory: number;
}
//# sourceMappingURL=types.d.ts.map