import { sessionManager } from "./manager";

export interface CheckpointInfo {
  id: string;
  timestamp: Date;
  messageIndex: number;
  description: string;
}

export function createCheckpoint(sessionId: string, description: string): CheckpointInfo | null {
  const checkpoint = sessionManager.createCheckpoint(sessionId, description);
  if (!checkpoint) return null;

  return {
    id: checkpoint.id,
    timestamp: checkpoint.timestamp,
    messageIndex: checkpoint.messageIndex,
    description: checkpoint.description,
  };
}

export function listCheckpoints(sessionId: string): CheckpointInfo[] {
  const checkpoints = sessionManager.getCheckpoints(sessionId);
  return checkpoints.map(c => ({
    id: c.id,
    timestamp: c.timestamp,
    messageIndex: c.messageIndex,
    description: c.description,
  }));
}

export function rewindToCheckpoint(sessionId: string, checkpointId: string): boolean {
  return sessionManager.rewindToCheckpoint(sessionId, checkpointId);
}

export function deleteCheckpoint(sessionId: string, checkpointId: string): boolean {
  const session = sessionManager.getSession(sessionId);
  if (!session) return false;

  const index = session.checkpoints.findIndex(c => c.id === checkpointId);
  if (index === -1) return false;

  session.checkpoints.splice(index, 1);
  return true;
}

export function getCheckpointDetails(sessionId: string, checkpointId: string) {
  const session = sessionManager.getSession(sessionId);
  if (!session) return null;

  const checkpoint = session.checkpoints.find(c => c.id === checkpointId);
  if (!checkpoint) return null;

  return {
    ...checkpoint,
    messageCount: checkpoint.snapshot.messages.length,
    tokenUsage: checkpoint.snapshot.metadata.tokenUsage,
  };
}