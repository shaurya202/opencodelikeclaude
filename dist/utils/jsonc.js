export function parseJsonc(content) {
    const lines = content.split("\n");
    const cleaned = lines
        .map(line => {
        const commentIndex = line.indexOf("//");
        if (commentIndex >= 0) {
            const before = line.slice(0, commentIndex);
            if (before.trim() !== "" && !before.trim().endsWith(",")) {
                return line;
            }
            return before;
        }
        return line;
    })
        .join("\n");
    return JSON.parse(cleaned);
}
//# sourceMappingURL=jsonc.js.map