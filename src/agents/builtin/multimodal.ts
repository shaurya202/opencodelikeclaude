import { LoadedAgent } from "../types";
import { agentRegistry } from "../registry";

export const multimodalAgent: LoadedAgent = {
  name: "multimodal",
  description: "Multimodal agent for image, audio, and video analysis",
  config: {
    model: "google/gemini-3-flash",
    temperature: 0.3,
    toolPermissions: ["read", "write", "bash", "websearch"],
    prompt: `You are the Multimodal Agent, specialized in analyzing images, audio, and video content.
Process visual data, extract text from images, analyze diagrams, and understand multimedia content.
Combine visual and textual analysis for comprehensive understanding.`,
  },
  category: "specialist",
  source: "builtin",
};

agentRegistry.register(multimodalAgent);