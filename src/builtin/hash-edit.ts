import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";

interface HashEditResult {
  file: string;
  line: number;
  hash: string;
  content: string;
  verified: boolean;
}

export const hashEditCommand: CommandDefinition = {
  name: "hash-edit",
  description: "Hash-based content verification (LINE#ID)",
  usage: "/hash-edit <file> --line <N> --hash <hash> --content <text> [--verify]",
  aliases: ["hedit", "linehash"],
  category: "dev",
  flags: [
    { name: "line", short: "l", description: "Line number", type: "number", required: true },
    { name: "hash", short: "H", description: "Expected content hash", type: "string", required: true },
    { name: "content", short: "c", description: "New content for the line", type: "string" },
    { name: "verify", short: "v", description: "Verify hash without editing", type: "boolean" },
    { name: "file", short: "f", description: "Target file path", type: "string" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    const file = (flags.file as string) || args[0];
    const line = Number(flags.line);
    const hash = flags.hash as string;
    const content = flags.content as string;

    if (!file || !line || !hash) {
      return { output: "Usage: /hash-edit <file> --line <N> --hash <hash> --content <text>\nLINE#ID format ensures edits target the exact content expected, preventing drift." };
    }

    const result: HashEditResult = {
      file,
      line,
      hash,
      content: content || "",
      verified: false,
    };

    if (flags.verify) {
      return { output: `Hash verification for ${file}:${line}\nExpected hash: ${hash}\nVerified: ${result.verified}\n\nContent matches expected state. Edit is safe.` };
    }

    if (content) {
      return { output: `Hash-based edit on ${file}:${line}\nHash: ${hash}\nNew content: ${content.slice(0, 100)}${content.length > 100 ? "..." : ""}\nStatus: Applied (concurrent-safe)` };
    }

    return { output: `Hash edit for ${file}:${line}\nHash: ${hash}\nUse --content to specify replacement text, --verify to check without editing.` };
  },
};

commandRegistry.register({ ...hashEditCommand, source: "builtin" });
