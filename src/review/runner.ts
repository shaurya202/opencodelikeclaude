import { readFileSync, existsSync } from "fs";
import { ReviewResult, ReviewFinding, ReviewConfig, ReviewType, ReviewSeverity, SimplifyResult } from "./types";
import { sdk } from "../sdk";

export class ReviewRunner {
  private config: ReviewConfig = {
    defaultEffort: 5,
    autoFix: false,
    comment: true,
    securityScan: true,
  };
  private results: Map<string, ReviewResult> = new Map();

  constructor(config?: Partial<ReviewConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): ReviewConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ReviewConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async runCodeReview(target: string, options?: {
    effort?: number;
    autoFix?: boolean;
    comment?: boolean;
    type?: ReviewType;
  }): Promise<ReviewResult> {
    const effort = options?.effort ?? this.config.defaultEffort;
    const findings: ReviewFinding[] = [];
    const startTime = Date.now();

    if (this.config.securityScan) {
      findings.push(...await this.runSecurityScan(target));
    }

    if (sdk.shouldUseRealImplementations()) {
      let content = "";
      if (existsSync(target)) {
        try { content = readFileSync(target, "utf-8"); }
        catch { content = target; }
      } else {
        content = target;
      }

      const type = options?.type || "code";
      const response = await sdk.callLlm({
        systemPrompt: `You are a code reviewer. Review the following code and list specific issues.
For each issue, provide:
- severity: critical|high|medium|low|info
- file: the file path
- line: the line number
- message: brief title
- description: detailed explanation
- suggestion: how to fix it

Output as a JSON array of objects with these fields. Only include real issues.`,
        userMessage: `Review target: ${target}\nType: ${type}\nEffort level: ${effort}/10\n\n${content}`,
      });

      try {
        const llmFindings = JSON.parse(response.content) as Array<Partial<ReviewFinding>>;
        for (const f of llmFindings) {
          if (f.message) {
            findings.push({
              id: this.generateId(),
              type: f.type || type as ReviewType,
              severity: (f.severity as ReviewSeverity) || "medium",
              file: f.file || target,
              line: f.line,
              message: f.message || "Issue found",
              description: f.description || f.message || "",
              suggestion: f.suggestion,
            });
          }
        }
      } catch {
        findings.push({
          id: this.generateId(),
          type: "code",
          severity: "info",
          file: target,
          message: "LLM review completed",
          description: response.content.slice(0, 500),
        });
      }
    }

    const result: ReviewResult = {
      id: this.generateId(),
      type: options?.type || "code",
      target,
      effort,
      findings,
      summary: this.summarizeFindings(findings),
      passed: findings.filter(f => f.severity === "critical" || f.severity === "high").length === 0,
      score: this.calculateScore(findings, effort),
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    };

    this.results.set(result.id, result);
    return result;
  }

  async runSecurityScan(target: string): Promise<ReviewFinding[]> {
    const findings: ReviewFinding[] = [];

    let content = "";
    if (existsSync(target)) {
      try {
        content = readFileSync(target, "utf-8");
      } catch {
        content = target;
      }
    } else {
      content = target;
    }

    const patterns: { pattern: RegExp; severity: ReviewSeverity; message: string }[] = [
      { pattern: /(?:api[_-]?key|apikey|secret|password|token|credential)\s*[:=]\s*['"]?[^\s'"]+/i, severity: "critical", message: "Potential credential exposure" },
      { pattern: /eval\s*\(/, severity: "high", message: "Use of eval() - code injection risk" },
      { pattern: /innerHTML\s*=/, severity: "medium", message: "Potential XSS via innerHTML" },
      { pattern: /exec\s*\(/, severity: "high", message: "Command execution risk" },
      { pattern: /child_process/, severity: "medium", message: "Child process execution" },
      { pattern: /\.env/, severity: "low", message: "Environment file reference" },
      { pattern: /TODO|FIXME|HACK|XXX/, severity: "low", message: "Unresolved todo or hack" },
      { pattern: /\.sql\b.*['"]/, severity: "medium", message: "Potential SQL injection" },
      { pattern: /console\.log\s*\(/, severity: "low", message: "Debug logging in production code" },
    ];

    const lines = content.split("\n");
    const matchedLines = new Set<number>();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { pattern, severity, message } of patterns) {
        if (pattern.test(line)) {
          if (!matchedLines.has(i)) {
            matchedLines.add(i);
            findings.push({
              id: this.generateId(),
              type: "security",
              severity,
              file: target,
              line: i + 1,
              message,
              description: `Line ${i + 1}: ${line.trim().slice(0, 120)}`,
              suggestion: `Review and address: ${message}`,
            });
          }
          break;
        }
      }
    }

    return findings;
  }

  async simplify(target: string): Promise<SimplifyResult> {
    if (sdk.shouldUseRealImplementations()) {
      let content = target;
      if (existsSync(target)) {
        try { content = readFileSync(target, "utf-8"); }
        catch { /* use target as-is */ }
      }
      const response = await sdk.callLlm({
        systemPrompt: "Simplify the following code. Remove unnecessary comments, consolidate redundant patterns, and simplify conditional logic. Return the simplified code and a list of changes made.",
        userMessage: content,
      });
      return {
        original: target,
        simplified: response.content,
        changes: ["LLM-suggested simplifications applied"],
        linesRemoved: 0,
        complexityReduction: 0,
      };
    }

    return {
      original: target,
      simplified: target,
      changes: [
        "Remove unnecessary comments",
        "Consolidate redundant code",
        "Simplify conditional logic",
      ],
      linesRemoved: 0,
      complexityReduction: 0,
    };
  }

  getResult(id: string): ReviewResult | undefined {
    return this.results.get(id);
  }

  getAllResults(): ReviewResult[] {
    return Array.from(this.results.values());
  }

  private summarizeFindings(findings: ReviewFinding[]): ReviewResult["summary"] {
    const summary = { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    for (const f of findings) {
      summary.total++;
      summary[f.severity]++;
    }
    return summary;
  }

  private calculateScore(findings: ReviewFinding[], effort: number): number {
    if (findings.length === 0) return 100;
    const severityWeights = { critical: 25, high: 15, medium: 10, low: 5, info: 1 };
    let penalty = 0;
    for (const f of findings) {
      penalty += severityWeights[f.severity] || 1;
    }
    const effortBonus = Math.min(effort * 2, 20);
    return Math.max(0, Math.min(100, 100 - penalty + effortBonus));
  }

  private generateId(): string {
    return `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.results.clear();
  }
}

export const reviewRunner = new ReviewRunner();
