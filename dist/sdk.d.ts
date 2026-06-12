import { Config } from "./config/schema";
export interface LlmCall {
    systemPrompt: string;
    userMessage: string;
    model?: string;
}
export interface LlmResponse {
    content: string;
    model: string;
    usage: {
        input: number;
        output: number;
    };
}
declare class OpenCodeSDK {
    private config;
    private provider;
    configure(config: Config): void;
    getConfig(): Config;
    shouldUseRealImplementations(): boolean;
    setLlmProvider(handler: (call: LlmCall) => Promise<LlmResponse>): void;
    enableNvidiaNim(): void;
    callLlm(call: LlmCall): Promise<LlmResponse>;
}
export declare const sdk: OpenCodeSDK;
export {};
//# sourceMappingURL=sdk.d.ts.map