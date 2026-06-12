export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  enabled?: boolean;
}

export interface MCPServer {
  name: string;
  config: MCPServerConfig;
  status: "connected" | "disconnected" | "error";
  tools: MCPTool[];
  resources: MCPResource[];
  lastError?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface MCPToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface MCPClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  listTools(): Promise<MCPTool[]>;
  listResources(): Promise<MCPResource[]>;
  callTool(name: string, args: Record<string, unknown>): Promise<MCPToolResult>;
  readResource(uri: string): Promise<string>;
}

export interface BuiltinMCPConfig {
  websearch: boolean;
  context7: boolean;
  grepApp: boolean;
  lsp: boolean;
  astGrep: boolean;
}