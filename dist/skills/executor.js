import { skillRegistry } from "./registry";
import { mcpRegistry } from "../mcp/registry";
import { sdk } from "../sdk";
class SkillExecutor {
    runningSkills = new Map();
    async execute(skillName, params) {
        const definition = skillRegistry.getDefinition(skillName);
        if (definition) {
            return await skillRegistry.executeSkill(skillName, params);
        }
        const skill = skillRegistry.get(skillName);
        if (!skill) {
            throw new Error(`Skill not found: ${skillName}`);
        }
        if (skill.mcpServers) {
            for (const [name, raw] of Object.entries(skill.mcpServers)) {
                const cfg = raw;
                if (typeof cfg?.command !== "string")
                    continue;
                const serverConfig = { name, command: cfg.command, args: cfg.args, env: cfg.env };
                mcpRegistry.registerServer(name, serverConfig);
                await mcpRegistry.connectServer(name);
            }
        }
        return this.executeSkillContent(skill, params);
    }
    async executeSkillContent(skill, params) {
        if (sdk.shouldUseRealImplementations()) {
            const paramStr = Object.entries(params)
                .map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n");
            const response = await sdk.callLlm({
                systemPrompt: skill.content,
                userMessage: `Execute this skill with parameters:\n${paramStr}`,
            });
            return {
                output: response.content,
                metadata: { skill: skill.metadata.name, params, model: response.model },
            };
        }
        let content = skill.content;
        for (const [key, value] of Object.entries(params)) {
            const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, "g");
            content = content.replace(placeholder, String(value));
        }
        return {
            output: `Executed skill: ${skill.metadata.name}\n\n${content}`,
            metadata: { skill: skill.metadata.name, params },
        };
    }
    abort(skillName) {
        const controller = this.runningSkills.get(skillName);
        if (controller) {
            controller.abort();
            this.runningSkills.delete(skillName);
            return true;
        }
        return false;
    }
    async executeWithMCP(skillName, mcpServer, toolName, args) {
        return await mcpRegistry.callTool(mcpServer, toolName, args);
    }
}
export const skillExecutor = new SkillExecutor();
//# sourceMappingURL=executor.js.map