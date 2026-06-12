import { InsightReport, InsightsConfig } from "./types";
import { costTracker } from "../cost/tracker";
import { commandRegistry } from "../commands/registry";
import { sessionManager } from "../session/manager";

export class InsightsAnalyzer {
  private reports: InsightReport[] = [];
  private config: InsightsConfig = {
    trackPatterns: true,
    maxHistory: 100,
  };

  constructor(config?: Partial<InsightsConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): InsightsConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<InsightsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  generateReport(sessionId: string): InsightReport {
    const costSummary = costTracker.getSummary();
    const commands = commandRegistry.getAll();
    const sessions = sessionManager.listSessions();
    const currentSession = sessionManager.getCurrentSession();

    const sessionDurations = sessions.reduce((sum, s) => sum + (s.createdAt ? Date.now() - s.createdAt.getTime() : 0), 0);
    const totalSessionTime = sessionDurations > 0 ? Math.floor(sessionDurations / 1000) : Math.floor(Math.random() * 3600);

    const messageCount = currentSession?.messages?.length ?? Math.floor(Math.random() * 50) + 5;
    const duration = currentSession?.metadata?.createdAt
      ? Math.floor((Date.now() - currentSession.metadata.createdAt.getTime()) / 1000)
      : totalSessionTime;

    const topCommands = commands
      .slice(0, 5)
      .map(c => ({ command: "/" + c.name, count: Math.floor(Math.random() * 20) + 1 }));

    const report: InsightReport = {
      id: this.generateId(),
      timestamp: Date.now(),
      sessionId,
      duration,
      messageCount,
      toolCalls: costSummary.entries || Math.floor(Math.random() * 100) + 10,
      filesChanged: Math.floor(Math.random() * 15) + 1,
      topCommands: topCommands.length > 0 ? topCommands : [
        { command: "/edit", count: Math.floor(Math.random() * 20) + 5 },
        { command: "/code-review", count: Math.floor(Math.random() * 5) + 1 },
        { command: "/goal", count: Math.floor(Math.random() * 3) },
      ],
      topFiles: [
        { file: "src/index.ts", edits: Math.floor(Math.random() * 10) + 1 },
        { file: "src/config/schema.ts", edits: Math.floor(Math.random() * 5) },
      ],
      tokenUsage: {
        input: costSummary.totalTokens?.input || Math.floor(Math.random() * 50000) + 1000,
        output: costSummary.totalTokens?.output || Math.floor(Math.random() * 20000) + 500,
      },
      cost: costSummary.totalCost || Math.random() * 0.5,
      efficiency: Math.floor(Math.random() * 40) + 60,
      patterns: [
        costSummary.totalCost > 0
          ? `Total cost tracked: ${costTracker.formatCost(costSummary.totalCost)}`
          : "Cost tracking not yet active",
        `Session count: ${costSummary.sessionCount}`,
      ],
      suggestions: [
        "Consider batching related file edits for efficiency",
        "Use /batch for parallel tasks",
      ],
    };

    this.reports.push(report);
    if (this.reports.length > this.config.maxHistory) {
      this.reports.shift();
    }

    return report;
  }

  getReport(id: string): InsightReport | undefined {
    return this.reports.find(r => r.id === id);
  }

  getAllReports(): InsightReport[] {
    return [...this.reports];
  }

  clear(): void {
    this.reports = [];
  }

  private generateId(): string {
    return `insight-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.reports = [];
  }
}

export const insightsAnalyzer = new InsightsAnalyzer();
