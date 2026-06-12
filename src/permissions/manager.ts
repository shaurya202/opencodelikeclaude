import { PermissionMode, PermissionConfig, PermissionRule, ToolPermissionCheck, PermissionEvaluation } from "./types";
import { loadConfig } from "../config/loader";

const ACCEPT_EDITS_TOOLS = [
  "read", "write", "edit", "glob", "grep", "bash", "task", "websearch",
  "context7", "grepApp", "lsp", "astGrep", "list_sessions", "read_session",
  "search_sessions", "session_info",
];

const PLAN_MODE_DENIED = ["write", "edit", "bash"];

class PermissionManager {
  private config: PermissionConfig;
  private currentMode: PermissionMode;

  constructor(cwd: string = process.cwd()) {
    const fullConfig = loadConfig(cwd);
    this.config = {
      ...fullConfig.permissions,
      rules: fullConfig.permissions.rules.map(r => ({
        ...r,
        scope: r.scope || "project",
      })),
    };
    this.currentMode = this.config.defaultMode;
  }

  getMode(): PermissionMode {
    return this.currentMode;
  }

  setMode(mode: PermissionMode): void {
    this.currentMode = mode;
  }

  getConfig(): PermissionConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<PermissionConfig>): void {
    this.config = { 
      ...this.config, 
      ...config,
      rules: config.rules ? config.rules.map(r => ({ 
        ...r, 
        scope: r.scope || "project" 
      })) : this.config.rules 
    };
    this.currentMode = this.config.defaultMode;
  }

  addRule(rule: PermissionRule): void {
    this.config.rules.push(rule);
  }

  removeRule(pattern: string): boolean {
    const index = this.config.rules.findIndex(r => r.pattern === pattern);
    if (index === -1) return false;
    this.config.rules.splice(index, 1);
    return true;
  }

  evaluateToolPermission(check: ToolPermissionCheck): PermissionEvaluation {
    const { toolName, toolInput, mode, allowedTools, deniedTools, rules } = check;
    const effectiveMode = mode || this.currentMode;

    // Bypass mode - allow everything
    if (effectiveMode === "bypassPermissions") {
      return { allowed: true, reason: "Bypass permissions mode", mode: effectiveMode };
    }

    // Check denied tools first
    if (deniedTools.includes(toolName)) {
      return { allowed: false, reason: `Tool ${toolName} is explicitly denied`, mode: effectiveMode };
    }

    // Check allowed tools
    if (allowedTools.includes(toolName) || allowedTools.includes("*")) {
      return { allowed: true, reason: `Tool ${toolName} is explicitly allowed`, mode: effectiveMode };
    }

    // Check rules
    for (const rule of rules) {
      if (this.matchPattern(toolName, rule.pattern)) {
        return { 
          allowed: rule.action === "allow", 
          reason: `Matched rule: ${rule.pattern}`, 
          matchedRule: rule,
          mode: effectiveMode 
        };
      }
    }

    // Mode-specific logic
    switch (effectiveMode) {
      case "acceptEdits":
        if (ACCEPT_EDITS_TOOLS.includes(toolName)) {
          return { allowed: true, reason: "AcceptEdits mode allows this tool", mode: effectiveMode };
        }
        return { allowed: false, reason: "AcceptEdits mode only allows file operations and safe tools", mode: effectiveMode };

      case "plan":
        if (PLAN_MODE_DENIED.includes(toolName)) {
          return { allowed: false, reason: "Plan mode denies write/edit/bash operations", mode: effectiveMode };
        }
        return { allowed: true, reason: "Plan mode allows read-only operations", mode: effectiveMode };

      case "auto":
        return this.evaluateAutoMode(toolName, toolInput);

      case "default":
      default:
        // Default mode: ask for permission for write/edit/bash
        if (["write", "edit", "bash"].includes(toolName)) {
          return { allowed: false, reason: "Default mode requires permission for this tool", mode: effectiveMode };
        }
        return { allowed: true, reason: "Default mode allows read-only tools", mode: effectiveMode };
    }
  }

  private evaluateAutoMode(toolName: string, toolInput: Record<string, unknown>): PermissionEvaluation {
    // In auto mode, use AI to evaluate (simplified for now)
    const riskyTools = ["bash", "write", "edit"];
    const safeTools = ["read", "glob", "grep", "task", "websearch"];

    if (safeTools.includes(toolName)) {
      return { allowed: true, reason: "Auto mode: safe tool", mode: "auto" };
    }

    if (riskyTools.includes(toolName)) {
      // Check for destructive patterns
      if (toolName === "bash") {
        const command = toolInput.command as string;
        if (command && (command.includes("rm -rf") || command.includes("sudo") || command.includes("> /dev/"))) {
          return { allowed: false, reason: "Auto mode: potentially destructive command", mode: "auto" };
        }
      }
      
      if (toolName === "write" || toolName === "edit") {
        const path = toolInput.path as string;
        if (path && (path.includes(".env") || path.includes("secret") || path.includes("key") || path.includes("password"))) {
          return { allowed: false, reason: "Auto mode: sensitive file", mode: "auto" };
        }
      }

      return { allowed: true, reason: "Auto mode: evaluated as safe", mode: "auto" };
    }

    return { allowed: true, reason: "Auto mode: default allow", mode: "auto" };
  }

  private matchPattern(toolName: string, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern === toolName) return true;
    if (pattern.endsWith("*")) {
      const prefix = pattern.slice(0, -1);
      return toolName.startsWith(prefix);
    }
    if (pattern.startsWith("*")) {
      const suffix = pattern.slice(1);
      return toolName.endsWith(suffix);
    }
    return false;
  }

  getAllowedTools(): string[] {
    return [...this.config.allowedTools];
  }

  getDeniedTools(): string[] {
    return [...this.config.deniedTools];
  }

  getRules(): PermissionRule[] {
    return [...this.config.rules];
  }
}

export const permissionManager = new PermissionManager();