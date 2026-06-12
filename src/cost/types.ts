export interface CostConfig {
  trackUsage: boolean;
  breakdown: boolean;
  alerts: Record<string, { threshold: number; action: "warn" | "block" }>;
}

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface CostEntry {
  id: string;
  timestamp: number;
  model: string;
  tokens: TokenUsage;
  cost: number;
  category: "chat" | "tool" | "mcp" | "agent" | "research";
  label?: string;
}

export interface CostSummary {
  totalTokens: TokenUsage;
  totalCost: number;
  sessionCount: number;
  entries: number;
  byCategory: Record<string, { tokens: TokenUsage; cost: number }>;
  byModel: Record<string, { tokens: TokenUsage; cost: number }>;
}

export type PlanTier = "free" | "pro" | "max" | "team" | "enterprise";

export interface PlanLimits {
  tier: PlanTier;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxCost: number;
  features: string[];
}
