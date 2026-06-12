import { hookRegistry } from "../registry";
import { UserPromptSubmitHookInput, UserPromptSubmitHookOutput } from "../types";

interface KeywordMode {
  keyword: string;
  prefix: string;
}

const modes: KeywordMode[] = [
  { keyword: "ultrawork", prefix: "[Ultrawork Mode]" },
  { keyword: "deep work", prefix: "[Deep Work Mode]" },
  { keyword: "search", prefix: "[Search Mode]" },
  { keyword: "analyze", prefix: "[Analysis Mode]" },
  { keyword: "review", prefix: "[Review Mode]" },
  { keyword: "debug", prefix: "[Debug Mode]" },
  { keyword: "research", prefix: "[Research Mode]" },
  { keyword: "brainstorm", prefix: "[Brainstorm Mode]" },
  { keyword: "explain", prefix: "[Explain Mode]" },
  { keyword: "refactor", prefix: "[Refactor Mode]" },
];

hookRegistry.register<UserPromptSubmitHookInput, UserPromptSubmitHookOutput>(
  "user-prompt-submit",
  async (input) => {
    const lower = input.prompt.toLowerCase();
    for (const mode of modes) {
      if (lower.includes(mode.keyword)) {
        const modifiedPrompt = `${mode.prefix}\n${input.prompt}`;
        return { modifiedPrompt, message: `Keyword detector: "${mode.keyword}" → ${mode.prefix}` };
      }
    }
    return { modifiedPrompt: input.prompt };
  },
  { priority: 40, match: (input) => {
    const lower = input.prompt.toLowerCase();
    return modes.some(m => lower.includes(m.keyword));
  }}
);
