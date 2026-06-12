import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
const SKILL_DIRS = [
    ".opencode/skills",
    "~/.config/opencode/skills",
    "~/.claude/skills",
    ".claude/skills",
];
function expandHome(path) {
    if (path.startsWith("~/")) {
        return join(process.env.HOME || process.env.USERPROFILE || "", path.slice(2));
    }
    return path;
}
function parseSkillFile(filePath) {
    try {
        const content = readFileSync(filePath, "utf-8");
        // Parse frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            return null;
        }
        const frontmatter = frontmatterMatch[1];
        const metadata = {};
        for (const line of frontmatter.split("\n")) {
            const colonIndex = line.indexOf(": ");
            if (colonIndex > 0) {
                const key = line.slice(0, colonIndex).trim();
                const value = line.slice(colonIndex + 2).trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                    metadata[key] = value.slice(1, -1);
                }
                else if (value === "true" || value === "false") {
                    metadata[key] = value === "true";
                }
                else if (!isNaN(Number(value))) {
                    metadata[key] = Number(value);
                }
                else {
                    metadata[key] = value;
                }
            }
        }
        const skillContent = content.slice(frontmatterMatch[0].length).trim();
        return {
            metadata,
            content: skillContent,
            path: filePath,
        };
    }
    catch (error) {
        console.warn(`[SkillLoader] Failed to parse ${filePath}:`, error);
        return null;
    }
}
function loadSkillFromFile(filePath, source) {
    const skillFile = parseSkillFile(filePath);
    if (!skillFile)
        return null;
    // Ensure required metadata fields have defaults
    const metadata = {
        name: skillFile.metadata.name || basename(filePath, ".md"),
        version: skillFile.metadata.version || "1.0.0",
        description: skillFile.metadata.description || "No description",
        author: skillFile.metadata.author,
        license: skillFile.metadata.license,
        homepage: skillFile.metadata.homepage,
        repository: skillFile.metadata.repository,
        keywords: skillFile.metadata.keywords,
        mcp: skillFile.metadata.mcp,
    };
    // Parse MCP config from frontmatter if present
    let mcpServers;
    if (metadata.mcp?.servers) {
        mcpServers = metadata.mcp.servers;
    }
    return {
        metadata,
        content: skillFile.content,
        path: skillFile.path,
        source,
        mcpServers,
    };
}
export function loadSkillsFromDir(dir, source = "filesystem") {
    const expandedDir = expandHome(dir);
    if (!existsSync(expandedDir))
        return [];
    const skills = [];
    const entries = readdirSync(expandedDir);
    for (const entry of entries) {
        const fullPath = join(expandedDir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            // Check for SKILL.md in subdirectory
            const skillMdPath = join(fullPath, "SKILL.md");
            if (existsSync(skillMdPath)) {
                const skill = loadSkillFromFile(skillMdPath, source);
                if (skill)
                    skills.push(skill);
            }
        }
        else if (extname(entry) === ".md" && basename(entry).toUpperCase() === "SKILL.MD") {
            const skill = loadSkillFromFile(fullPath, source);
            if (skill)
                skills.push(skill);
        }
    }
    return skills;
}
export function loadAllSkills(cwd = process.cwd()) {
    const allSkills = [];
    for (const dir of SKILL_DIRS) {
        const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
        const source = dir.includes(".claude") ? "claude-compat" : "filesystem";
        allSkills.push(...loadSkillsFromDir(fullPath, source));
    }
    return allSkills;
}
//# sourceMappingURL=loader.js.map