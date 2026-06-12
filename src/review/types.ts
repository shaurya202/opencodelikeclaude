export type ReviewType = "code" | "security" | "simplify" | "style";

export type ReviewSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface ReviewConfig {
  defaultEffort: number;
  autoFix: boolean;
  comment: boolean;
  securityScan: boolean;
}

export interface ReviewFinding {
  id: string;
  type: ReviewType;
  severity: ReviewSeverity;
  file: string;
  line?: number;
  column?: number;
  message: string;
  description: string;
  suggestion?: string;
  code?: string;
  fix?: string;
}

export interface ReviewResult {
  id: string;
  type: ReviewType;
  target: string;
  effort: number;
  findings: ReviewFinding[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  passed: boolean;
  score: number;
  duration: number;
  timestamp: number;
}

export interface SimplifyResult {
  original: string;
  simplified: string;
  changes: string[];
  linesRemoved: number;
  complexityReduction: number;
}
