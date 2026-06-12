import { sessionManager } from "./manager";
export function createBranch(sourceSessionId, options = {}) {
    const sourceSession = sessionManager.getSession(sourceSessionId);
    if (!sourceSession) {
        return { success: false, error: `Source session not found: ${sourceSessionId}` };
    }
    const newSession = sessionManager.branchSession(sourceSessionId, options);
    if (!newSession) {
        return { success: false, error: "Failed to create branch" };
    }
    return { success: true, sessionId: newSession.metadata.id };
}
export function listBranches(sessionId) {
    const session = sessionManager.getSession(sessionId);
    if (!session)
        return [];
    const branches = [];
    for (const s of sessionManager.listSessions()) {
        if (s.parentSessionId === sessionId || s.parentSessionId === session.metadata.parentSessionId) {
            branches.push(s.id);
        }
    }
    return branches;
}
export function mergeBranches(targetSessionId, sourceSessionId, strategy = "append") {
    const targetSession = sessionManager.getSession(targetSessionId);
    const sourceSession = sessionManager.getSession(sourceSessionId);
    if (!targetSession || !sourceSession) {
        return { success: false, error: "One or both sessions not found" };
    }
    if (strategy === "append") {
        for (const message of sourceSession.messages) {
            if (message.timestamp > targetSession.metadata.updatedAt) {
                sessionManager.addMessage(targetSessionId, {
                    role: message.role,
                    content: message.content,
                    toolCalls: message.toolCalls,
                    metadata: { ...message.metadata, mergedFrom: sourceSessionId },
                });
            }
        }
    }
    else {
        targetSession.messages = [...sourceSession.messages];
        targetSession.metadata.messageCount = sourceSession.messages.length;
    }
    targetSession.metadata.updatedAt = new Date();
    return { success: true, sessionId: targetSessionId };
}
//# sourceMappingURL=branching.js.map