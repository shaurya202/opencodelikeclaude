import { sessionManager } from "./manager";

export interface RenameResult {
  success: boolean;
  sessionId?: string;
  name?: string;
  error?: string;
}

export function renameSession(sessionId: string, name: string): RenameResult {
  const success = sessionManager.renameSession(sessionId, name);
  if (!success) {
    return { success: false, error: `Session not found: ${sessionId}` };
  }
  return { success: true, sessionId, name };
}

export function generateSessionName(sessionId: string): string {
  const session = sessionManager.getSession(sessionId);
  if (!session) return `session-${sessionId.slice(0, 8)}`;

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

export function autoNameSession(sessionId: string): RenameResult {
  const name = generateSessionName(sessionId);
  return renameSession(sessionId, name);
}

export function addTag(sessionId: string, tag: string): boolean {
  const session = sessionManager.getSession(sessionId);
  if (!session) return false;
  sessionManager.addTag(sessionId, tag);
  return true;
}

export function removeTag(sessionId: string, tag: string): boolean {
  const session = sessionManager.getSession(sessionId);
  if (!session) return false;
  
  const index = session.metadata.tags.indexOf(tag);
  if (index === -1) return false;
  
  session.metadata.tags.splice(index, 1);
  return true;
}

export function listTags(sessionId: string): string[] {
  const session = sessionManager.getSession(sessionId);
  return session?.metadata.tags || [];
}