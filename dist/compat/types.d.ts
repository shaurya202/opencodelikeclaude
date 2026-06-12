export interface ClaudeCodeSettings {
    permissions?: {
        defaultMode?: string;
        allowedTools?: string[];
        deniedTools?: string[];
        alwaysAllow?: string[];
        allow?: string[];
        deny?: string[];
    };
    hooks?: {
        "pre-tool-use"?: string;
        "post-tool-use"?: string;
        "user-prompt-submit"?: string;
        "pre-compact"?: string;
        [key: string]: string | undefined;
    };
    theme?: string;
    vimMode?: boolean;
    voiceEnabled?: boolean;
    terminal?: string;
    keys?: Record<string, string>;
    mcpServers?: Record<string, {
        command: string;
        args?: string[];
        env?: Record<string, string>;
    }>;
    disableMcp?: boolean;
}
export interface ClaudePackageJson {
    name?: string;
    description?: string;
    version?: string;
    main?: string;
    scripts?: Record<string, string>;
    displayName?: string;
    publisher?: string;
    repository?: {
        type?: string;
        url?: string;
    };
    categories?: string[];
    keywords?: string[];
    icon?: string;
    activationEvents?: string[];
    contributes?: {
        commands?: Array<{
            command: string;
            title: string;
        }>;
        hooks?: Array<{
            event: string;
            handler: string;
        }>;
        mcpServers?: Array<{
            name: string;
            command: string;
            args?: string[];
        }>;
    };
}
export interface ClaudeMCPServer {
    name: string;
    command: string;
    args?: string[];
    env?: Record<string, string>;
    disabled?: boolean;
    alwaysAllow?: string[];
}
export interface MigrationResult {
    success: boolean;
    migrated: string[];
    skipped: string[];
    errors: string[];
    warnings: string[];
}
export interface CompatibilityOptions {
    commands: boolean;
    skills: boolean;
    agents: boolean;
    mcp: boolean;
    hooks: boolean;
    plugins: boolean;
}
//# sourceMappingURL=types.d.ts.map