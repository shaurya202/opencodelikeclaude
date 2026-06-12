export class PermissionPrompt {
    static async show(options) {
        const { toolName, toolInput, description, mode, rules } = options;
        console.log("\n" + "=".repeat(60));
        console.log(`🔐 Permission Request (${mode} mode)`);
        console.log("=".repeat(60));
        console.log(`Tool: ${toolName}`);
        console.log(`Description: ${description}`);
        console.log(`Input: ${JSON.stringify(toolInput, null, 2).slice(0, 500)}`);
        if (rules.length > 0) {
            console.log("\nApplicable Rules:");
            for (const rule of rules) {
                console.log(`  ${rule.action === "allow" ? "✅" : "❌"} ${rule.pattern} (${rule.scope})`);
            }
        }
        console.log("\nOptions:");
        console.log("  [a] Allow once");
        console.log("  [A] Allow and remember (always allow)");
        console.log("  [d] Deny once");
        console.log("  [D] Deny and remember (always deny)");
        console.log("  [q] Quit/Abort");
        // In a real implementation, this would be interactive
        // For now, simulate based on mode
        return this.simulateResponse(mode);
    }
    static simulateResponse(mode) {
        switch (mode) {
            case "acceptEdits":
                return { allow: true, remember: true, scope: "project" };
            case "bypassPermissions":
                return { allow: true, remember: true, scope: "project" };
            case "plan":
                return { allow: false, remember: false };
            case "auto":
                return { allow: true, remember: false };
            default:
                return { allow: false, remember: false };
        }
    }
    static formatToolDescription(toolName, toolInput) {
        switch (toolName) {
            case "read":
                return `Read file: ${toolInput.path}`;
            case "write":
                return `Write file: ${toolInput.path}`;
            case "edit":
                return `Edit file: ${toolInput.path}`;
            case "bash":
                return `Run command: ${toolInput.command}`;
            case "glob":
                return `Find files: ${toolInput.pattern}`;
            case "grep":
                return `Search: ${toolInput.pattern}`;
            case "task":
                return `Launch sub-agent: ${toolInput.description}`;
            case "websearch":
                return `Web search: ${toolInput.query}`;
            default:
                return `${toolName}: ${JSON.stringify(toolInput).slice(0, 100)}`;
        }
    }
}
//# sourceMappingURL=prompt.js.map