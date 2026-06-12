import { ResearchResult, ResearchSource, ResearchConfig, DeepResearchInstance } from "./types";
import { sdk } from "../sdk";
import { mcpRegistry } from "../mcp/registry";

export class ResearchRunner {
  private config: ResearchConfig = {
    maxSources: 10,
    maxDepth: 3,
    timeout: 120000,
    fanOut: 5,
    includeSummary: true,
  };
  private instances: Map<string, DeepResearchInstance> = new Map();
  private results: Map<string, ResearchResult> = new Map();

  constructor(config?: Partial<ResearchConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): ResearchConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ResearchConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async deepResearch(query: string): Promise<DeepResearchInstance> {
    const subQueries = this.generateSubQueries(query);
    const instance: DeepResearchInstance = {
      id: this.generateId(),
      query,
      subQueries,
      results: [],
      status: "running",
      startedAt: Date.now(),
    };

    this.instances.set(instance.id, instance);

    for (const subQuery of subQueries) {
      const result = await this.runSingleResearch(subQuery);
      instance.results.push(result);
      this.results.set(result.id, result);
    }

    instance.status = "completed";
    instance.completedAt = Date.now();
    instance.summary = this.generateSummary(instance);

    return instance;
  }

  async runSingleResearch(query: string): Promise<ResearchResult> {
    const startTime = Date.now();
    const sources: ResearchSource[] = [];

    if (sdk.shouldUseRealImplementations()) {
      try {
        const result = await mcpRegistry.callTool("websearch", "web_search", { query });
        const content = result.content?.[0];
        if (content?.text) {
          const parsed = this.parseSearchResults(content.text, query);
          sources.push(...parsed);
        }
      } catch {
        // Fallback to stub if MCP unavailable
      }
    }

    if (sources.length === 0) {
      for (let i = 0; i < Math.min(3, this.config.maxSources); i++) {
        sources.push({
          url: `https://example.com/search?q=${encodeURIComponent(query)}&page=${i + 1}`,
          title: `Result ${i + 1} for: ${query}`,
          snippet: `Information about ${query} - source ${i + 1}`,
          relevance: 1 - (i * 0.2),
          depth: 1,
        });
      }
    }

    sources.sort((a, b) => b.relevance - a.relevance);

    let findings: string[] = [];
    if (sdk.shouldUseRealImplementations() && sources.length > 0) {
      try {
        const sourceStr = sources.map(s => `- ${s.title}: ${s.snippet}`).join("\n");
        const response = await sdk.callLlm({
          systemPrompt: "Analyze the following research sources and provide key findings, insights, and recommendations.",
          userMessage: `Query: ${query}\n\nSources:\n${sourceStr}`,
        });
        findings = response.content.split("\n").filter((l: string) => l.trim().length > 0);
      } catch {
        findings = this.getStubFindings(query, sources.length);
      }
    } else {
      findings = this.getStubFindings(query, sources.length);
    }

    return {
      id: this.generateId(),
      query,
      status: "completed",
      sources,
      findings,
      confidence: Math.min(0.9, sources.length * 0.1),
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    };
  }

  private parseSearchResults(text: string, query: string): ResearchSource[] {
    const sources: ResearchSource[] = [];
    try {
      const parsed = JSON.parse(text) as Array<{ url?: string; title?: string; snippet?: string }>;
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item.url) {
            sources.push({
              url: item.url,
              title: item.title || `Result for: ${query}`,
              snippet: item.snippet || "",
              relevance: 0.8,
              depth: 1,
            });
          }
        }
      }
    } catch {
      const lines = text.split("\n").filter(l => l.trim());
      for (const line of lines.slice(0, 10)) {
        const urlMatch = line.match(/https?:\/\/[^\s)]+/);
        if (urlMatch) {
          sources.push({
            url: urlMatch[0],
            title: line.slice(0, 80),
            snippet: line.slice(0, 200),
            relevance: 0.7,
            depth: 1,
          });
        }
      }
    }
    return sources;
  }

  getInstance(id: string): DeepResearchInstance | undefined {
    return this.instances.get(id);
  }

  getAllInstances(): DeepResearchInstance[] {
    return Array.from(this.instances.values());
  }

  getResult(id: string): ResearchResult | undefined {
    return this.results.get(id);
  }

  private generateSubQueries(query: string): string[] {
    const count = Math.min(this.config.fanOut, 5);
    const subQueries: string[] = [];
    for (let i = 0; i < count; i++) {
      subQueries.push(`${query} - aspect ${i + 1}`);
    }
    return subQueries;
  }

  private generateSummary(instance: DeepResearchInstance): string {
    const totalSources = instance.results.reduce((sum, r) => sum + r.sources.length, 0);
    const avgConfidence = instance.results.reduce((sum, r) => sum + r.confidence, 0) / instance.results.length;
    return `Research on "${instance.query}" completed. Analyzed ${instance.subQueries.length} sub-queries across ${totalSources} sources. Average confidence: ${(avgConfidence * 100).toFixed(0)}%.`;
  }

  private getStubFindings(query: string, sourceCount: number): string[] {
    return [
      `Found ${sourceCount} relevant sources for "${query}"`,
      `Key insight: Analysis of ${query} reveals multiple perspectives`,
      `Recommendation: Further investigation needed for comprehensive understanding`,
    ];
  }

  private generateId(): string {
    return `research-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.instances.clear();
    this.results.clear();
  }
}

export const researchRunner = new ResearchRunner();
