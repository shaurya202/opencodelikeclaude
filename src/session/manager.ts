import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import {
  Session,
  SessionMetadata,
  SessionMessage,
  Checkpoint,
  BranchOptions,
  SessionManagerConfig,
} from "./types";

export class SessionManager {
  private config: SessionManagerConfig;
  private sessions: Map<string, Session> = new Map();
  private currentSessionId: string | null = null;

  constructor(config?: Partial<SessionManagerConfig>) {
    this.config = {
      storagePath: join(process.cwd(), ".opencode", "sessions"),
      maxSessions: 1000,
      autoCheckpoint: true,
      checkpointInterval: 10,
      ...config,
    };

    if (!existsSync(this.config.storagePath)) {
      mkdirSync(this.config.storagePath, { recursive: true });
    }

    this.loadSessions();
  }

  private loadSessions(): void {
    if (!existsSync(this.config.storagePath)) return;

    const files = readdirSync(this.config.storagePath).filter(f => f.endsWith(".json"));
    for (const file of files) {
      try {
        const content = readFileSync(join(this.config.storagePath, file), "utf-8");
        const session = JSON.parse(content) as Session;
        this.sessions.set(session.metadata.id, session);
      } catch (error) {
        console.warn(`[SessionManager] Failed to load session ${file}:`, error);
      }
    }
  }

  createSession(name?: string, parentSessionId?: string): Session {
    const id = uuidv4();
    const now = new Date();

    const metadata: SessionMetadata = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      parentSessionId,
      messageCount: 0,
      tokenUsage: { input: 0, output: 0 },
      tags: [],
    };

    const session: Session = {
      metadata,
      messages: [],
      checkpoints: [],
    };

    this.sessions.set(id, session);
    this.currentSessionId = id;
    this.persistSession(id);

    return session;
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  getCurrentSession(): Session | undefined {
    if (!this.currentSessionId) return undefined;
    return this.sessions.get(this.currentSessionId);
  }

  setCurrentSession(id: string): boolean {
    if (this.sessions.has(id)) {
      this.currentSessionId = id;
      return true;
    }
    return false;
  }

  listSessions(): SessionMetadata[] {
    return Array.from(this.sessions.values())
      .map(s => s.metadata)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  deleteSession(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;

    const filePath = join(this.config.storagePath, `${id}.json`);
    if (existsSync(filePath)) {
      // In a real implementation, you'd delete the file
    }

    this.sessions.delete(id);
    if (this.currentSessionId === id) {
      this.currentSessionId = null;
    }
    return true;
  }

  renameSession(id: string, name: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;

    session.metadata.name = name;
    session.metadata.updatedAt = new Date();
    this.persistSession(id);
    return true;
  }

  addMessage(sessionId: string, message: Omit<SessionMessage, "id" | "timestamp">): SessionMessage | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const newMessage: SessionMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date(),
    };

    session.messages.push(newMessage);
    session.metadata.messageCount++;
    session.metadata.updatedAt = new Date();

    if (this.config.autoCheckpoint && session.messages.length % this.config.checkpointInterval === 0) {
      this.createCheckpoint(sessionId, `Auto-checkpoint at message ${session.messages.length}`);
    }

    this.persistSession(sessionId);
    return newMessage;
  }

  createCheckpoint(sessionId: string, description: string): Checkpoint | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const checkpoint: Checkpoint = {
      id: uuidv4(),
      sessionId,
      timestamp: new Date(),
      messageIndex: session.messages.length - 1,
      description,
      snapshot: {
        messages: [...session.messages],
        metadata: { ...session.metadata },
      },
    };

    session.checkpoints.push(checkpoint);
    this.persistSession(sessionId);
    return checkpoint;
  }

  getCheckpoints(sessionId: string): Checkpoint[] {
    const session = this.sessions.get(sessionId);
    return session?.checkpoints || [];
  }

  rewindToCheckpoint(sessionId: string, checkpointId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const checkpoint = session.checkpoints.find(c => c.id === checkpointId);
    if (!checkpoint) return false;

    session.messages = [...checkpoint.snapshot.messages];
    session.metadata = { ...checkpoint.snapshot.metadata };
    session.metadata.updatedAt = new Date();
    this.persistSession(sessionId);
    return true;
  }

  branchSession(sessionId: string, options: BranchOptions = {}): Session | null {
    const sourceSession = this.sessions.get(sessionId);
    if (!sourceSession) return null;

    let messages = sourceSession.messages;

    if (options.fromCheckpoint) {
      const checkpoint = sourceSession.checkpoints.find(c => c.id === options.fromCheckpoint);
      if (checkpoint) {
        messages = [...checkpoint.snapshot.messages];
      }
    } else if (options.fromMessageIndex !== undefined) {
      messages = messages.slice(0, options.fromMessageIndex + 1);
    }

    const newSession = this.createSession(options.name, sessionId);
    newSession.messages = messages;
    newSession.metadata.branchName = options.name;
    newSession.metadata.messageCount = messages.length;
    newSession.checkpoints = [];

    this.persistSession(newSession.metadata.id);
    return newSession;
  }

  updateTokenUsage(sessionId: string, inputTokens: number, outputTokens: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.metadata.tokenUsage.input += inputTokens;
    session.metadata.tokenUsage.output += outputTokens;
    this.persistSession(sessionId);
  }

  addTag(sessionId: string, tag: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (!session.metadata.tags.includes(tag)) {
      session.metadata.tags.push(tag);
      this.persistSession(sessionId);
    }
  }

  private persistSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const filePath = join(this.config.storagePath, `${sessionId}.json`);
    writeFileSync(filePath, JSON.stringify(session, null, 2));
  }

  exportSession(sessionId: string): string | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    return JSON.stringify(session, null, 2);
  }
}

export const sessionManager = new SessionManager();