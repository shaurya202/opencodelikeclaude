import { commandRegistry } from "../commands/registry";
const releaseHistory = [
    { version: "0.1.0", date: "2026-06-11", notes: ["Initial release", "Plugin scaffolding, hooks, commands, config"] },
    { version: "0.2.0", date: "2026-06-11", notes: ["Agent system with 8 built-in agents", "Delegation tools, background agents, team mode"] },
    { version: "0.3.0", date: "2026-06-11", notes: ["Session management: branches, checkpoints, compaction", "Export/import JSON and Markdown"] },
    { version: "0.4.0", date: "2026-06-11", notes: ["Permission modes: default, acceptEdits, plan, auto, bypass", "Permission rules and auto mode"] },
    { version: "0.5.0", date: "2026-06-11", notes: ["MCP integration: websearch, context7, grepApp, lsp, astGrep", "Skill system with 3 built-in skills"] },
    { version: "0.6.0", date: "2026-06-11", notes: ["UI/UX: theme system, keybindings, vim mode, voice mode", "Command palette, attention system, terminal setup"] },
    { version: "0.7.0", date: "2026-06-11", notes: ["Advanced features: goals, loop, schedule, code review", "Batch processing, deep research, security review"] },
    { version: "0.8.0", date: "2026-06-11", notes: ["Remote control server, teleport web sessions", "IDE integration, Chrome browser, web sync"] },
    { version: "0.9.0", date: "2026-06-11", notes: ["Git worktrees, cost tracking, auth system", "Buddy pet, insights, powerup tutorials"] },
];
export const releaseNotesCommand = {
    name: "release-notes",
    description: "Interactive changelog",
    usage: "/release-notes [--version <ver>] [--latest] [--all]",
    aliases: ["changelog", "rn"],
    category: "dev",
    flags: [
        { name: "version", short: "v", description: "Show notes for specific version", type: "string" },
        { name: "latest", short: "l", description: "Show latest release notes", type: "boolean" },
        { name: "all", short: "a", description: "Show all release notes", type: "boolean" },
    ],
    handler: async (context) => {
        const { flags } = context;
        if (flags.version) {
            const release = releaseHistory.find(r => r.version === flags.version);
            if (!release)
                return { error: `Version ${flags.version} not found`, exitCode: 1 };
            return { output: `v${release.version} (${release.date})\n${release.notes.map(n => `  • ${n}`).join("\n")}` };
        }
        if (flags.latest) {
            const latest = releaseHistory[releaseHistory.length - 1];
            return { output: `Latest: v${latest.version} (${latest.date})\n${latest.notes.map(n => `  • ${n}`).join("\n")}` };
        }
        if (flags.all) {
            let output = "Release History:\n\n";
            for (const r of releaseHistory) {
                output += `v${r.version} (${r.date})\n`;
                for (const n of r.notes) {
                    output += `  • ${n}\n`;
                }
                output += "\n";
            }
            return { output };
        }
        let output = "Release History:\n\n";
        for (const r of releaseHistory.slice(-3)) {
            output += `v${r.version} (${r.date})\n`;
            for (const n of r.notes) {
                output += `  • ${n}\n`;
            }
            output += "\n";
        }
        output += `Use --all to see full history, --version <ver> for specific version, --latest for latest.`;
        return { output };
    },
};
commandRegistry.register({ ...releaseNotesCommand, source: "builtin" });
//# sourceMappingURL=release-notes.js.map