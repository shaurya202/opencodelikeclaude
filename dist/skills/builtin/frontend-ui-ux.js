import { skillRegistry } from "../registry";
export const frontendUiUxSkill = {
    name: "frontendUiUx",
    description: "Frontend UI/UX development and design system tools",
    parameters: [
        { name: "action", type: "string", description: "Action: component, theme, accessibility, performance, design-tokens", required: true },
        { name: "framework", type: "string", description: "Framework: react, vue, svelte", required: false },
        { name: "component", type: "string", description: "Component name or path", required: false },
        { name: "props", type: "object", description: "Component props", required: false },
    ],
    handler: async (params) => {
        const action = params.action;
        return {
            output: `Frontend UI/UX ${action} executed (mock)`,
            metadata: { action, params },
        };
    },
};
skillRegistry.registerDefinition(frontendUiUxSkill);
//# sourceMappingURL=frontend-ui-ux.js.map