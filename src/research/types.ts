export type ResearchStatus = "pending" | "running" | "completed" | "failed";

export interface ResearchConfig {
  maxSources: number;
  maxDepth: number;
  timeout: number;
  fanOut: number;
  includeSummary: boolean;
}

export interface ResearchSource {
  url: string;
  title: string;
  snippet: string;
  relevance: number;
  depth: number;
}

export interface ResearchResult {
  id: string;
  query: string;
  status: ResearchStatus;
  sources: ResearchSource[];
  summary?: string;
  findings: string[];
  confidence: number;
  duration: number;
  timestamp: number;
  error?: string;
}

export interface DeepResearchInstance {
  id: string;
  query: string;
  subQueries: string[];
  results: ResearchResult[];
  status: ResearchStatus;
  startedAt: number;
  completedAt?: number;
  summary?: string;
}
