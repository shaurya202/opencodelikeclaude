import { hookRegistry } from "../registry";
import { UserPromptSubmitHookInput, UserPromptSubmitHookOutput } from "../types";

const thinkKeywords = ["think deeply", "ultrathink", "deep analysis", "carefully", "step by step", "reasoning"];

hookRegistry.register<UserPromptSubmitHookInput, UserPromptSubmitHookOutput>(
  "user-prompt-submit",
  async (input) => {
    const lower = input.prompt.toLowerCase();
    const matched = thinkKeywords.filter(k => lower.includes(k));
    if (matched.length > 0) {
      const modifiedPrompt = `[Think Mode: ${matched.join(", ")} detected]\n${input.prompt}\n\nTake your time to reason through this thoroughly. Think step by step and verify your reasoning before responding.`;
      return { modifiedPrompt, message: `Think mode triggered by: ${matched.join(", ")}` };
    }
    return { modifiedPrompt: input.prompt };
  },
  { priority: 50, match: (input) => {
    const lower = input.prompt.toLowerCase();
    return thinkKeywords.some(k => lower.includes(k));
  }}
);
