const NVIDIA_NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL_MAP = {
    "opencode/gpt-5-nano": "meta/llama-3.2-3b-instruct",
    "google/gemini-3-flash": "meta/llama-3.1-8b-instruct",
    "opencode/default": "meta/llama-3.1-70b-instruct",
    "anthropic/claude-sonnet-4-5": "meta/llama-3.1-70b-instruct",
    "openai/gpt-5.2": "meta/llama-3.1-405b-instruct",
    "anthropic/claude-opus-4-5": "meta/llama-3.1-405b-instruct",
    "google/gemini-3-pro": "meta/llama-3.1-405b-instruct",
};
function mapModel(pluginModel) {
    if (!pluginModel)
        return MODEL_MAP["opencode/default"];
    return MODEL_MAP[pluginModel] || MODEL_MAP["opencode/default"];
}
async function callNvidiaNim(systemPrompt, userMessage, model) {
    const apiKey = process.env.NVIDIA_NIM_API_KEY;
    if (!apiKey) {
        throw new Error("NVIDIA_NIM_API_KEY environment variable not set");
    }
    const nvidiaModel = mapModel(model);
    const body = {
        model: nvidiaModel,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
        ],
        max_tokens: 4096,
        temperature: 0.7,
    };
    const response = await fetch(NVIDIA_NIM_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`NVIDIA NIM error ${response.status}: ${text}`);
    }
    const data = await response.json();
    return {
        content: data.choices[0]?.message?.content || "",
        model: data.model,
        usage: {
            input: data.usage?.prompt_tokens || 0,
            output: data.usage?.completion_tokens || 0,
        },
    };
}
class OpenCodeSDK {
    config = null;
    provider = null;
    configure(config) {
        this.config = config;
    }
    getConfig() {
        if (!this.config)
            throw new Error("SDK not configured");
        return this.config;
    }
    shouldUseRealImplementations() {
        return this.config?.experimental?.useRealImplementations ?? false;
    }
    setLlmProvider(handler) {
        this.provider = handler;
    }
    enableNvidiaNim() {
        if (this.provider)
            return;
        this.provider = async (call) => callNvidiaNim(call.systemPrompt, call.userMessage, call.model);
    }
    async callLlm(call) {
        if (this.provider) {
            try {
                return await this.provider(call);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return {
                    content: `[LLM call failed: ${message}]`,
                    model: call.model || "opencode/default",
                    usage: { input: 0, output: 0 },
                };
            }
        }
        const model = call.model || "opencode/default";
        return {
            content: `[OpenCode SDK response — model: ${model}]`,
            model,
            usage: { input: call.systemPrompt.length + call.userMessage.length, output: 200 },
        };
    }
}
export const sdk = new OpenCodeSDK();
//# sourceMappingURL=sdk.js.map