export interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  license?: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  mcp?: SkillMCPConfig;
}

export interface SkillMCPConfig {
  servers: Record<string, {
    command: string;
    args?: string[];
    env?: Record<string, string>;
  }>;
}

export interface SkillFile {
  metadata: Partial<SkillMetadata>;
  content: string;
  path: string;
}

export interface LoadedSkill {
  metadata: SkillMetadata;
  content: string;
  path: string;
  source: "builtin" | "filesystem" | "claude-compat";
  mcpServers?: Record<string, unknown>;
}

export interface SkillParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  required?: boolean;
  default?: unknown;
}

export interface SkillDefinition {
  name: string;
  description: string;
  parameters: SkillParameter[];
  handler: (params: Record<string, unknown>) => Promise<{ output: string; metadata?: Record<string, unknown> }>;
}