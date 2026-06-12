export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: (input: Record<string, unknown>) => Promise<{ output: string; metadata?: Record<string, unknown> }> | { output: string; metadata?: Record<string, unknown> };
}