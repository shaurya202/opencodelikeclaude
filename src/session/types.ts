export interface SessionMetadata {
  id: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  parentSessionId?: string;
  branchName?: string;
  messageCount: number;
  tokenUsage: {
    input: number;
    output: number;
  };
  tags: string[];
}

export interface Session {
  metadata: SessionMetadata;
  messages: SessionMessage[];
  checkpoints: Checkpoint[];
}

export interface SessionMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  metadata?: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
}

export interface Checkpoint {
  id: string;
  sessionId: string;
  timestamp: Date;
  messageIndex: number;
  description: string;
  snapshot: SessionSnapshot;
}

export interface SessionSnapshot {
  messages: SessionMessage[];
  metadata: SessionMetadata;
}

export interface BranchOptions {
  name?: string;
  fromCheckpoint?: string;
  fromMessageIndex?: number;
}

export interface SessionManagerConfig {
  storagePath: string;
  maxSessions: number;
  autoCheckpoint: boolean;
  checkpointInterval: number;
}