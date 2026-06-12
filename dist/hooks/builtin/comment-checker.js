import { hookRegistry } from "../registry";
const aiCommentPatterns = [
    /\/\/\s*(?:TODO|FIXME|HACK|XXX|NOTE|OPTIMIZE|REVIEW)/i,
    /\/\/\s*(?:This\s+(?:function|method|class|code)\s+(?:is|does|handles|will|should))/i,
    /\/\/\s*(?:Get|Set|Check|Validate|Create|Update|Delete|Process)\s/i,
    /\/\/\s*(?:Params?:|Returns?:|Throws?:|Example:)/i,
    /\/\/\s*---+/,
    /\/\/\s*\/\*/,
    /\*\s*(?:@param|@returns|@throws|@example|@type|@deprecated)/i,
];
hookRegistry.register("post-tool-use", async (input) => {
    if (input.toolName !== "write" && input.toolName !== "edit") {
        return {};
    }
    const content = typeof input.toolOutput === "string" ? input.toolOutput : JSON.stringify(input.toolOutput);
    const lines = content.split("\n");
    const suspiciousLines = [];
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        for (const pattern of aiCommentPatterns) {
            if (pattern.test(trimmed)) {
                suspiciousLines.push({ line: i + 1, text: trimmed });
                break;
            }
        }
    }
    if (suspiciousLines.length > 3) {
        const sample = suspiciousLines.slice(0, 3).map(l => `  Line ${l.line}: ${l.text}`).join("\n");
        const message = `[Comment Checker] Found ${suspiciousLines.length} AI-generated comments. Consider reviewing:\n${sample}`;
        return { message };
    }
    return {};
}, { priority: 30 });
//# sourceMappingURL=comment-checker.js.map