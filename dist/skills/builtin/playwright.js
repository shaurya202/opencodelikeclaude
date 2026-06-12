import { skillRegistry } from "../registry";
export const playwrightSkill = {
    name: "playwright",
    description: "Browser automation with Playwright",
    parameters: [
        { name: "action", type: "string", description: "Action: navigate, click, type, screenshot, evaluate", required: true },
        { name: "url", type: "string", description: "URL to navigate to", required: false },
        { name: "selector", type: "string", description: "CSS selector for element", required: false },
        { name: "text", type: "string", description: "Text to type", required: false },
        { name: "script", type: "string", description: "JavaScript to evaluate", required: false },
        { name: "path", type: "string", description: "Screenshot path", required: false },
    ],
    handler: async (params) => {
        const action = params.action;
        return {
            output: `Playwright ${action} executed (mock)`,
            metadata: { action, params },
        };
    },
};
skillRegistry.registerDefinition(playwrightSkill);
//# sourceMappingURL=playwright.js.map