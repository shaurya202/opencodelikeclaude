import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
export class SessionManager {
    config;
    sessions = new Map();
    currentSessionId = null;
    constructor(config) {
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
    loadSessions() {
        if (!existsSync(this.config.storagePath))
            return;
        const files = readdirSync(this.config.storagePath).filter(f => f.endsWith(".json"));
        for (const file of files) {
            try {
                const content = readFileSync(join(this.config.storagePath, file), "utf-8");
                const session = JSON.parse(content);
                this.sessions.set(session.metadata.id, session);
            }
            catch (error) {
                console.warn(`[SessionManager] Failed to load session ${file}:`, error);
            }
        }
    }
    createSession(name, parentSessionId) {
        const id = uuidv4();
        const now = new Date();
        const metadata = {
            id,
            name,
            createdAt: now,
            updatedAt: now,
            parentSessionId,
            messageCount: 0,
            tokenUsage: { input: 0, output: 0 },
            tags: [],
        };
        const session = {
            metadata,
            messages: [],
            checkpoints: [],
        };
        this.sessions.set(id, session);
        this.currentSessionId = id;
        this.persistSession(id);
        return session;
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    getCurrentSession() {
        if (!this.currentSessionId)
            return undefined;
        return this.sessions.get(this.currentSessionId);
    }
    setCurrentSession(id) {
        if (this.sessions.has(id)) {
            this.currentSessionId = id;
            return true;
        }
        return false;
    }
    listSessions() {
        return Array.from(this.sessions.values())
            .map(s => s.metadata)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    deleteSession(id) {
        const session = this.sessions.get(id);
        if (!session)
            return false;
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
    renameSession(id, name) {
        const session = this.sessions.get(id);
        if (!session)
            return false;
        session.metadata.name = name;
        session.metadata.updatedAt = new Date();
        this.persistSession(id);
        return true;
    }
    addMessage(sessionId, message) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const newMessage = {
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
    createCheckpoint(sessionId, description) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const checkpoint = {
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
    getCheckpoints(sessionId) {
        const session = this.sessions.get(sessionId);
        return session?.checkpoints || [];
    }
    rewindToCheckpoint(sessionId, checkpointId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return false;
        const checkpoint = session.checkpoints.find(c => c.id === checkpointId);
        if (!checkpoint)
            return false;
        session.messages = [...checkpoint.snapshot.messages];
        session.metadata = { ...checkpoint.snapshot.metadata };
        session.metadata.updatedAt = new Date();
        this.persistSession(sessionId);
        return true;
    }
    branchSession(sessionId, options = {}) {
        const sourceSession = this.sessions.get(sessionId);
        if (!sourceSession)
            return null;
        let messages = sourceSession.messages;
        if (options.fromCheckpoint) {
            const checkpoint = sourceSession.checkpoints.find(c => c.id === options.fromCheckpoint);
            if (checkpoint) {
                messages = [...checkpoint.snapshot.messages];
            }
        }
        else if (options.fromMessageIndex !== undefined) {
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
    updateTokenUsage(sessionId, inputTokens, outputTokens) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        session.metadata.tokenUsage.input += inputTokens;
        session.metadata.tokenUsage.output += outputTokens;
        this.persistSession(sessionId);
    }
    addTag(sessionId, tag) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        if (!session.metadata.tags.includes(tag)) {
            session.metadata.tags.push(tag);
            this.persistSession(sessionId);
        }
    }
    persistSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        const filePath = join(this.config.storagePath, `${sessionId}.json`);
        writeFileSync(filePath, JSON.stringify(session, null, 2));
    }
    exportSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        return JSON.stringify(session, null, 2);
    }
}
export const sessionManager = new SessionManager();
//# sourceMappingURL=manager.js.map