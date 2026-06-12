import { MCPServer, MCPServerConfig, MCPTool, MCPToolResult } from "./types";
import { loadMCPConfig, getBuiltinMCPConfigs } from "./loader";
import { MCPClient } from "./client";
import { sdk } from "../sdk";

class MCPRegistry {
  private servers: Map<string, MCPServer> = new Map();
  private clients: Map<string, MCPClient> = new Map();
  private initialized = false;

  async initialize(cwd: string = process.cwd()): Promise<void> {
    if (this.initialized) return;

    const { builtin, servers } = loadMCPConfig(cwd);
    const builtinConfigs = getBuiltinMCPConfigs(builtin);

    for (const [name, config] of Object.entries(builtinConfigs)) {
      this.registerServer(name, config);
    }

    for (const [name, config] of Object.entries(servers)) {
      this.registerServer(name, config);
    }

    this.initialized = true;
  }

  registerServer(name: string, config: MCPServerConfig): void {
    const server: MCPServer = {
      name,
      config,
      status: "disconnected",
      tools: [],
      resources: [],
    };
    this.servers.set(name, server);
  }

  unregisterServer(name: string): boolean {
    const server = this.servers.get(name);
    if (!server) return false;

    if (server.status === "connected") {
      this.disconnectServer(name);
    }

    return this.servers.delete(name);
  }

  getServer(name: string): MCPServer | undefined {
    return this.servers.get(name);
  }

  getAllServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  getConnectedServers(): MCPServer[] {
    return this.getAllServers().filter(s => s.status === "connected");
  }

  async connectServer(name: string): Promise<boolean> {
    const server = this.servers.get(name);
    if (!server) return false;

    try {
      if (sdk.shouldUseRealImplementations()) {
        const client = new MCPClient();
        await client.connect(server.config);
        this.clients.set(name, client);
        server.tools = await client.listTools();
        server.resources = await client.listResources();
      } else {
        server.tools = this.getMockTools(name);
      }
      server.status = "connected";
      return true;
    } catch (error) {
      server.status = "error";
      server.lastError = error instanceof Error ? error.message : String(error);
      return false;
    }
  }

  async disconnectServer(name: string): Promise<void> {
    const server = this.servers.get(name);
    if (!server) return;

    const client = this.clients.get(name);
    if (client) {
      await client.disconnect();
      this.clients.delete(name);
    }

    server.status = "disconnected";
    server.tools = [];
    server.resources = [];
  }

  async connectAll(): Promise<void> {
    for (const server of this.servers.values()) {
      if (server.config.enabled !== false) {
        await this.connectServer(server.name);
      }
    }
  }

  async disconnectAll(): Promise<void> {
    for (const server of this.servers.values()) {
      await this.disconnectServer(server.name);
    }
  }

  async callTool(serverName: string, toolName: string, args: Record<string, unknown>): Promise<MCPToolResult> {
    const server = this.servers.get(serverName);
    if (!server || server.status !== "connected") {
      throw new Error(`Server ${serverName} not connected`);
    }

    if (sdk.shouldUseRealImplementations()) {
      const client = this.clients.get(serverName);
      if (client) {
        return await client.callTool(toolName, args);
      }
    }

    return {
      content: [{ type: "text", text: `Mock result from ${serverName}.${toolName} with args: ${JSON.stringify(args)}` }],
    };
  }

  getAllTools(): { server: string; tool: MCPTool }[] {
    const allTools: { server: string; tool: MCPTool }[] = [];
    for (const server of this.servers.values()) {
      for (const tool of server.tools) {
        allTools.push({ server: server.name, tool });
      }
    }
    return allTools;
  }

  private getMockTools(serverName: string): MCPTool[] {
    const mockTools: Record<string, MCPTool[]> = {
      websearch: [
        { name: "web_search", description: "Search the web", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
        { name: "web_crawl", description: "Crawl a website", inputSchema: { type: "object", properties: { url: { type: "string" } }, required: ["url"] } },
      ],
      context7: [
        { name: "get_docs", description: "Get official documentation", inputSchema: { type: "object", properties: { library: { type: "string" }, topic: { type: "string" } }, required: ["library"] } },
      ],
      grepApp: [
        { name: "search_code", description: "Search GitHub code", inputSchema: { type: "object", properties: { query: { type: "string" }, language: { type: "string" } }, required: ["query"] } },
      ],
      lsp: [
        { name: "diagnostics", description: "Get LSP diagnostics", inputSchema: { type: "object", properties: { uri: { type: "string" } }, required: ["uri"] } },
        { name: "goto_definition", description: "Go to definition", inputSchema: { type: "object", properties: { uri: { type: "string" }, position: { type: "object" } }, required: ["uri", "position"] } },
        { name: "find_references", description: "Find references", inputSchema: { type: "object", properties: { uri: { type: "string" }, position: { type: "object" } }, required: ["uri", "position"] } },
        { name: "symbols", description: "Get document symbols", inputSchema: { type: "object", properties: { uri: { type: "string" } }, required: ["uri"] } },
      ],
      astGrep: [
        { name: "ast_search", description: "Search with AST patterns", inputSchema: { type: "object", properties: { pattern: { type: "string" }, language: { type: "string" } }, required: ["pattern", "language"] } },
        { name: "ast_replace", description: "Replace with AST patterns", inputSchema: { type: "object", properties: { pattern: { type: "string" }, replacement: { type: "string" }, language: { type: "string" } }, required: ["pattern", "replacement", "language"] } },
      ],
    };
    return mockTools[serverName] || [];
  }
}

export const mcpRegistry = new MCPRegistry();