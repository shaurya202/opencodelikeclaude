import { commandRegistry } from "../commands/registry";
import { worktreeManager } from "../git/worktree";
export const worktreeCommand = {
    name: "worktree",
    description: "Manage isolated git worktrees per session",
    usage: "/worktree <name> [--base <branch>] [list|merge|abandon|remove|switch]",
    aliases: ["wt", "worktrees"],
    category: "dev",
    flags: [
        { name: "list", short: "l", description: "List worktrees", type: "boolean" },
        { name: "get", short: "g", description: "Get worktree details by name", type: "string" },
        { name: "merge", short: "m", description: "Mark worktree as merged", type: "string" },
        { name: "abandon", short: "a", description: "Mark worktree as abandoned", type: "string" },
        { name: "remove", short: "r", description: "Remove worktree by name", type: "string" },
        { name: "base", short: "b", description: "Base branch for new worktree", type: "string" },
        { name: "pr", description: "PR URL for merged worktree", type: "string" },
    ],
    handler: async (context) => {
        const { args, flags } = context;
        if (flags.list) {
            const all = worktreeManager.getAll();
            if (all.length === 0)
                return { output: "No worktrees. Use /worktree <name> to create one." };
            let output = "Worktrees:\n\n";
            for (const w of all) {
                output += `  [${w.status}] ${w.name} → ${w.branch}\n`;
                output += `    Path: ${w.path}  Created: ${new Date(w.createdAt).toLocaleDateString()}\n`;
                if (w.prUrl)
                    output += `    PR: ${w.prUrl}\n`;
            }
            return { output };
        }
        if (flags.get) {
            const wt = worktreeManager.get(flags.get);
            if (!wt)
                return { error: "Worktree not found", exitCode: 1 };
            let output = `Worktree: ${wt.name}\nBranch: ${wt.branch}\nPath: ${wt.path}\nStatus: ${wt.status}`;
            output += `\nCreated: ${new Date(wt.createdAt).toLocaleString()}\nLast active: ${new Date(wt.lastActiveAt).toLocaleString()}`;
            if (wt.prUrl)
                output += `\nPR: ${wt.prUrl}`;
            if (wt.sessionId)
                output += `\nSession: ${wt.sessionId}`;
            return { output };
        }
        if (flags.merge) {
            const wt = worktreeManager.markMerged(flags.merge, flags.pr || undefined);
            return { output: wt ? `Worktree "${wt.name}" marked as merged` : "Worktree not found", ...(wt ? {} : { exitCode: 1, error: "Worktree not found" }) };
        }
        if (flags.abandon) {
            const wt = worktreeManager.markAbandoned(flags.abandon);
            return { output: wt ? `Worktree "${wt.name}" marked as abandoned` : "Worktree not found", ...(wt ? {} : { exitCode: 1, error: "Worktree not found" }) };
        }
        if (flags.remove) {
            const found = worktreeManager.remove(flags.remove);
            return { output: found ? "Worktree removed" : "Worktree not found" };
        }
        const name = args.join(" ");
        if (!name) {
            return { output: "Usage: /worktree <name> [--base <branch>]\nUse /worktree --list to see existing worktrees." };
        }
        const existing = worktreeManager.get(name);
        if (existing)
            return { error: `Worktree "${name}" already exists`, exitCode: 1 };
        const wt = await worktreeManager.create(name, { baseBranch: flags.base });
        return { output: `Worktree created: ${wt.name}\nBranch: ${wt.branch}\nPath: ${wt.path}\n\nUse git worktree add ${wt.path} ${wt.branch} to set up the actual worktree.` };
    },
};
commandRegistry.register({ ...worktreeCommand, source: "builtin" });
//# sourceMappingURL=worktree.js.map