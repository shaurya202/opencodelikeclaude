import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { sessionManager } from "./manager";
const EXPORT_DIR = join(process.cwd(), ".opencode", "exports");
export function ensureExportDir() {
    if (!existsSync(EXPORT_DIR)) {
        mkdirSync(EXPORT_DIR, { recursive: true });
    }
}
export function exportSession(sessionId, format = "json") {
    const session = sessionManager.getSession(sessionId);
    if (!session)
        return null;
    ensureExportDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `session-${sessionId.slice(0, 8)}-${timestamp}.${format === "json" ? "json" : "md"}`;
    const filepath = join(EXPORT_DIR, filename);
    let content;
    if (format === "json") {
        content = JSON.stringify(session, null, 2);
    }
    else {
        content = generateMarkdownExport(session);
    }
    writeFileSync(filepath, content);
    return filepath;
}
function generateMarkdownExport(session) {
    let md = `# Session Export\n\n`;
    md += `**Session ID:** ${session.metadata.id}\n`;
    md += `**Name:** ${session.metadata.name || "Unnamed"}\n`;
    md += `**Created:** ${session.metadata.createdAt.toISOString()}\n`;
    md += `**Updated:** ${session.metadata.updatedAt.toISOString()}\n`;
    md += `**Messages:** ${session.metadata.messageCount}\n`;
    md += `**Tokens:** ${session.metadata.tokenUsage.input} in / ${session.metadata.tokenUsage.output} out\n`;
    if (session.metadata.tags.length > 0) {
        md += `**Tags:** ${session.metadata.tags.join(", ")}\n`;
    }
    if (session.metadata.branchName) {
        md += `**Branch:** ${session.metadata.branchName}\n`;
    }
    if (session.metadata.parentSessionId) {
        md += `**Parent:** ${session.metadata.parentSessionId}\n`;
    }
    md += `\n---\n\n`;
    for (const message of session.messages) {
        const roleLabel = message.role === "user" ? "👤 User" : message.role === "assistant" ? "🤖 Assistant" : "⚙️ System";
        md += `## ${roleLabel} (${message.timestamp.toISOString()})\n\n`;
        md += `${message.content}\n\n`;
        if (message.toolCalls && message.toolCalls.length > 0) {
            md += `### Tool Calls\n\n`;
            for (const call of message.toolCalls) {
                md += `- **${call.name}**: ${JSON.stringify(call.input)}\n`;
                if (call.output) {
                    md += `  - Output: ${JSON.stringify(call.output).slice(0, 200)}...\n`;
                }
                if (call.error) {
                    md += `  - Error: ${call.error}\n`;
                }
            }
            md += `\n`;
        }
    }
    if (session.checkpoints.length > 0) {
        md += `---\n\n## Checkpoints\n\n`;
        for (const cp of session.checkpoints) {
            md += `- **${cp.description}** (${cp.timestamp.toISOString()}) - Message #${cp.messageIndex}\n`;
        }
    }
    return md;
}
export function importSession(filepath) {
    if (!existsSync(filepath))
        return null;
    try {
        const content = readFileSync(filepath, "utf-8");
        const session = JSON.parse(content);
        const newId = `imported-${Date.now()}`;
        session.metadata.id = newId;
        session.metadata.name = session.metadata.name ? `${session.metadata.name} (imported)` : "Imported Session";
        session.metadata.createdAt = new Date();
        session.metadata.updatedAt = new Date();
        session.metadata.parentSessionId = undefined;
        session.checkpoints = [];
        const importedSession = sessionManager.createSession(session.metadata.name, undefined);
        importedSession.messages = session.messages;
        importedSession.metadata.messageCount = session.messages.length;
        importedSession.metadata.tokenUsage = session.metadata.tokenUsage;
        importedSession.metadata.tags = session.metadata.tags;
        return importedSession.metadata.id;
    }
    catch (error) {
        console.error(`[Persistence] Failed to import session:`, error);
        return null;
    }
}
export function listExports() {
    ensureExportDir();
    const files = readdirSync(EXPORT_DIR);
    return files.filter((f) => f.endsWith(".json") || f.endsWith(".md"));
}
//# sourceMappingURL=persistence.js.map