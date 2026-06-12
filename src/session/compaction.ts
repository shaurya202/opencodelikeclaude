import { sessionManager } from "./manager";
import { v4 as uuidv4 } from "uuid";

export interface CompactionOptions {
  focus?: string;
  preserveRecent?: number;
  customPrompt?: string;
}

export interface CompactionResult {
  success: boolean;
  originalMessageCount: number;
  compactedMessageCount: number;
  tokensSaved: number;
  error?: string;
}

export function compactSession(
  sessionId: string,
  options: CompactionOptions = {}
): CompactionResult {
  const session = sessionManager.getSession(sessionId);
  if (!session) {
    return {
      success: false,
      originalMessageCount: 0,
      compactedMessageCount: 0,
      tokensSaved: 0,
      error: `Session not found: ${sessionId}`,
    };
  }

  const originalCount = session.messages.length;
  const preserveCount = options.preserveRecent ?? 10;
  
  if (originalCount <= preserveCount) {
    return {
      success: true,
      originalMessageCount: originalCount,
      compactedMessageCount: originalCount,
      tokensSaved: 0,
    };
  }

  const messagesToCompact = session.messages.slice(0, -preserveCount);
  const recentMessages = session.messages.slice(-preserveCount);

  const compactedContent = generateCompactedSummary(messagesToCompact, options.focus, options.customPrompt);

  const summaryMessage = {
    id: uuidv4(),
    role: "system" as const,
    content: `[Compacted Summary${options.focus ? ` (Focus: ${options.focus})` : ""}]\n${compactedContent}`,
    timestamp: new Date(),
    toolCalls: undefined,
    metadata: { compacted: true, originalCount: messagesToCompact.length },
  };

  session.messages = [summaryMessage, ...recentMessages];
  session.metadata.messageCount = session.messages.length;
  session.metadata.updatedAt = new Date();

  const tokensSaved = estimateTokensSaved(messagesToCompact, compactedContent);

  return {
    success: true,
    originalMessageCount: originalCount,
    compactedMessageCount: session.messages.length,
    tokensSaved,
  };
}

function generateCompactedSummary(
  messages: { role: string; content: string }[],
  focus?: string,
  customPrompt?: string
): string {
  if (customPrompt) {
    return customPrompt;
  }

  let summary = `Conversation compacted from ${messages.length} messages.\n\n`;

  if (focus) {
    summary += `Focus area: ${focus}\n\n`;
  }

  const userMessages = messages.filter(m => m.role === "user");
  const assistantMessages = messages.filter(m => m.role === "assistant");

  summary += `User messages: ${userMessages.length}\n`;
  summary += `Assistant messages: ${assistantMessages.length}\n\n`;

  summary += "Key topics discussed:\n";
  const topics = extractTopics(messages);
  for (const topic of topics) {
    summary += `- ${topic}\n`;
  }

  return summary;
}

function extractTopics(messages: { content: string }[]): string[] {
  const topics = new Set<string>();
  const keywords = [
    "bug", "fix", "feature", "refactor", "test", "deploy", "api", "database",
    "auth", "ui", "component", "hook", "state", "performance", "security",
    "migration", "config", "build", "lint", "type", "interface", "class",
  ];

  for (const msg of messages) {
    const lower = msg.content.toLowerCase();
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        topics.add(kw);
      }
    }
  }

  return Array.from(topics).slice(0, 10);
}

function estimateTokensSaved(originalMessages: { content: string }[], compactedContent: string): number {
  const originalChars = originalMessages.reduce((sum, m) => sum + m.content.length, 0);
  const compactedChars = compactedContent.length;
  return Math.max(0, Math.floor((originalChars - compactedChars) / 4));
}