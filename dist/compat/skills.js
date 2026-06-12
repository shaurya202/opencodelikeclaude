import { existsSync } from "fs";
import { join } from "path";
import { loadSkillsFromDir } from "../skills/loader";
import { skillRegistry } from "../skills/registry";
import { rootLogger } from "../utils/logger";
import { expandHome } from "../utils/path";
const CLAUDE_SKILL_DIRS = [
    "~/.claude/skills",
    ".claude/skills",
];
export function loadClaudeSkills(cwd = process.cwd()) {
    let count = 0;
    for (const dir of CLAUDE_SKILL_DIRS) {
        const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
        if (existsSync(fullPath)) {
            const skills = loadSkillsFromDir(fullPath, "claude-compat");
            for (const skill of skills) {
                skillRegistry.register(skill);
                count++;
            }
            if (skills.length > 0) {
                rootLogger.info(`Loaded ${skills.length} Claude Code skills from ${fullPath}`);
            }
        }
    }
    return count;
}
//# sourceMappingURL=skills.js.map