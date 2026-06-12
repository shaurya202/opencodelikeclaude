import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
import { LoadedSkill, SkillMetadata } from "./types";

const SKILL_DIRS = [
  ".opencode/skills",
  "~/.config/opencode/skills",
  "~/.claude/skills",
  ".claude/skills",
];

function expandHome(path: string): string {
  if (path.startsWith("~/")) {
    return join(process.env.HOME || process.env.USERPROFILE || "", path.slice(2));
  }
  return path;
}

interface ParsedSkillFile {
  metadata: Partial<SkillMetadata>;
  content: string;
  path: string;
}

function parseSkillFile(filePath: string): ParsedSkillFile | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    
    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = frontmatterMatch[1];
    const metadata: Partial<SkillMetadata> = {};
    
    for (const line of frontmatter.split("\n")) {
      const colonIndex = line.indexOf(": ");
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 2).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          (metadata as Record<string, unknown>)[key] = value.slice(1, -1);
        } else if (value === "true" || value === "false") {
          (metadata as Record<string, unknown>)[key] = value === "true";
        } else if (!isNaN(Number(value))) {
          (metadata as Record<string, unknown>)[key] = Number(value);
        } else {
          (metadata as Record<string, unknown>)[key] = value;
        }
      }
    }

    const skillContent = content.slice(frontmatterMatch[0].length).trim();

    return {
      metadata,
      content: skillContent,
      path: filePath,
    };
  } catch (error) {
    console.warn(`[SkillLoader] Failed to parse ${filePath}:`, error);
    return null;
  }
}

function loadSkillFromFile(filePath: string, source: "filesystem" | "claude-compat"): LoadedSkill | null {
  const skillFile = parseSkillFile(filePath);
  if (!skillFile) return null;

  // Ensure required metadata fields have defaults
  const metadata: SkillMetadata = {
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
  let mcpServers: Record<string, unknown> | undefined;
  if (metadata.mcp?.servers) {
    mcpServers = metadata.mcp.servers as Record<string, unknown>;
  }

  return {
    metadata,
    content: skillFile.content,
    path: skillFile.path,
    source,
    mcpServers,
  };
}

export function loadSkillsFromDir(dir: string, source: "filesystem" | "claude-compat" = "filesystem"): LoadedSkill[] {
  const expandedDir = expandHome(dir);
  if (!existsSync(expandedDir)) return [];

  const skills: LoadedSkill[] = [];
  const entries = readdirSync(expandedDir);

  for (const entry of entries) {
    const fullPath = join(expandedDir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Check for SKILL.md in subdirectory
      const skillMdPath = join(fullPath, "SKILL.md");
      if (existsSync(skillMdPath)) {
        const skill = loadSkillFromFile(skillMdPath, source);
        if (skill) skills.push(skill);
      }
    } else if (extname(entry) === ".md" && basename(entry).toUpperCase() === "SKILL.MD") {
      const skill = loadSkillFromFile(fullPath, source);
      if (skill) skills.push(skill);
    }
  }

  return skills;
}

export function loadAllSkills(cwd: string = process.cwd()): LoadedSkill[] {
  const allSkills: LoadedSkill[] = [];
  
  for (const dir of SKILL_DIRS) {
    const fullPath = dir.startsWith("~/") ? expandHome(dir) : join(cwd, dir);
    const source = dir.includes(".claude") ? "claude-compat" : "filesystem";
    allSkills.push(...loadSkillsFromDir(fullPath, source));
  }
  
  return allSkills;
}