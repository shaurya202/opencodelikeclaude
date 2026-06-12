import { sessionManager } from "./manager";
export function renameSession(sessionId, name) {
    const success = sessionManager.renameSession(sessionId, name);
    if (!success) {
        return { success: false, error: `Session not found: ${sessionId}` };
    }
    return { success: true, sessionId, name };
}
export function generateSessionName(sessionId) {
    const session = sessionManager.getSession(sessionId);
    if (!session)
        return `session-${sessionId.slice(0, 8)}`;
    if (session.metadata.name) {
        return session.metadata.name;
    }
    const firstUserMessage = session.messages.find(m => m.role === "user");
    if (firstUserMessage) {
        const words = firstUserMessage.content.split(" ").slice(0, 5);
        return words.join(" ") + (words.length >= 5 ? "..." : "");
    }
    return `session-${session.metadata.id.slice(0, 8)}`;
}
export function autoNameSession(sessionId) {
    const name = generateSessionName(sessionId);
    return renameSession(sessionId, name);
}
export function addTag(sessionId, tag) {
    const session = sessionManager.getSession(sessionId);
    if (!session)
        return false;
    sessionManager.addTag(sessionId, tag);
    return true;
}
export function removeTag(sessionId, tag) {
    const session = sessionManager.getSession(sessionId);
    if (!session)
        return false;
    const index = session.metadata.tags.indexOf(tag);
    if (index === -1)
        return false;
    session.metadata.tags.splice(index, 1);
    return true;
}
export function listTags(sessionId) {
    const session = sessionManager.getSession(sessionId);
    return session?.metadata.tags || [];
}
//# sourceMappingURL=naming.js.map