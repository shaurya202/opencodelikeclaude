import { sessionManager } from "./manager";
export function createCheckpoint(sessionId, description) {
    const checkpoint = sessionManager.createCheckpoint(sessionId, description);
    if (!checkpoint)
        return null;
    return {
        id: checkpoint.id,
        timestamp: checkpoint.timestamp,
        messageIndex: checkpoint.messageIndex,
        description: checkpoint.description,
    };
}
export function listCheckpoints(sessionId) {
    const checkpoints = sessionManager.getCheckpoints(sessionId);
    return checkpoints.map(c => ({
        id: c.id,
        timestamp: c.timestamp,
        messageIndex: c.messageIndex,
        description: c.description,
    }));
}
export function rewindToCheckpoint(sessionId, checkpointId) {
    return sessionManager.rewindToCheckpoint(sessionId, checkpointId);
}
export function deleteCheckpoint(sessionId, checkpointId) {
    const session = sessionManager.getSession(sessionId);
    if (!session)
        return false;
    const index = session.checkpoints.findIndex(c => c.id === checkpointId);
    if (index === -1)
        return false;
    session.checkpoints.splice(index, 1);
    return true;
}
export function getCheckpointDetails(sessionId, checkpointId) {
    const session = sessionManager.getSession(sessionId);
    if (!session)
        return null;
    const checkpoint = session.checkpoints.find(c => c.id === checkpointId);
    if (!checkpoint)
        return null;
    return {
        ...checkpoint,
        messageCount: checkpoint.snapshot.messages.length,
        tokenUsage: checkpoint.snapshot.metadata.tokenUsage,
    };
}
//# sourceMappingURL=checkpoints.js.map