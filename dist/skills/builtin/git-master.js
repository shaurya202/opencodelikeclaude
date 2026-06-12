import { skillRegistry } from "../registry";
export const gitMasterSkill = {
    name: "gitMaster",
    description: "Advanced Git operations and workflows",
    parameters: [
        { name: "action", type: "string", description: "Action: rebase, merge, cherry-pick, bisect, worktree, history", required: true },
        { name: "branch", type: "string", description: "Branch name", required: false },
        { name: "commit", type: "string", description: "Commit hash", required: false },
        { name: "args", type: "string", description: "Additional arguments", required: false },
    ],
    handler: async (params) => {
        const action = params.action;
        return {
            output: `Git Master ${action} executed (mock)`,
            metadata: { action, params },
        };
    },
};
skillRegistry.registerDefinition(gitMasterSkill);
//# sourceMappingURL=git-master.js.map