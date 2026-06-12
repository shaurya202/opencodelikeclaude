import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";

interface PowerupLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  completed: boolean;
}

const lessons: PowerupLesson[] = [
  {
    id: "agents",
    title: "Agent Delegation",
    description: "Learn how to delegate tasks to specialized agents",
    category: "agents",
    content: "Use /agents to list available agents. Try /agent planner 'plan this feature' or /agent reviewer 'review this code'. Agents can run in background with --bg flag.",
    completed: false,
  },
  {
    id: "goals",
    title: "Goal Tracking",
    description: "Set and track completion goals for your session",
    category: "advanced",
    content: "Use /goal <target> to set a goal. Add --priority high for important goals. Track progress with /goal --list and complete steps with /goal --progress <id> <percent>.",
    completed: false,
  },
  {
    id: "batch",
    title: "Batch Processing",
    description: "Run parallel tasks across worktrees",
    category: "advanced",
    content: "Use /batch <task> --units <count> to create parallel jobs. Start with /batch --start <id>. Each job runs in its own worktree.",
    completed: false,
  },
  {
    id: "worktree",
    title: "Git Worktrees",
    description: "Isolate work per session using git worktrees",
    category: "dev",
    content: "Use /worktree <name> to create a worktree. /worktree --list to see all. Mark complete with --merge and provide a PR URL.",
    completed: false,
  },
  {
    id: "code-review",
    title: "Code Review",
    description: "Automated code review with configurable effort",
    category: "advanced",
    content: "Use /code-review [target] to analyze code. Add --effort <1-10> for depth, --fix for auto-fixes, --security for vulnerability scan.",
    completed: false,
  },
  {
    id: "research",
    title: "Deep Research",
    description: "Multi-query web research with fan-out",
    category: "advanced",
    content: "Use /deep-research <query> to start. Control depth with --depth <n> and sources with --sources <n>. Results are aggregated from multiple sub-queries.",
    completed: false,
  },
  {
    id: "remote",
    title: "Remote Control",
    description: "Control your terminal session remotely",
    category: "remote",
    content: "Use /remote-control --start to start the server. Connect via the configured host:port. Manage sessions with --sessions and --disconnect.",
    completed: false,
  },
  {
    id: "permissions",
    title: "Permission Modes",
    description: "Control what actions are allowed",
    category: "core",
    content: "Use /permissions to manage modes. Cycle with Shift+Tab. Modes: default, acceptEdits (auto-accept file edits), plan (read-only), auto (AI-evaluated), bypassPermissions.",
    completed: false,
  },
];

export const powerupCommand: CommandDefinition = {
  name: "powerup",
  description: "Interactive feature lessons and tutorials",
  usage: "/powerup [list|get <id>|complete <id>|random]",
  aliases: ["tutorial", "learn"],
  category: "dev",
  flags: [
    { name: "list", short: "l", description: "List available lessons", type: "boolean" },
    { name: "get", short: "g", description: "Get lesson by ID", type: "string" },
    { name: "complete", short: "c", description: "Mark lesson as completed", type: "string" },
    { name: "random", short: "r", description: "Show random lesson", type: "boolean" },
    { name: "progress", short: "p", description: "Show learning progress", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags } = context;

    if (flags.list) {
      let output = "Powerup Lessons:\n\n";
      const categories = [...new Set(lessons.map(l => l.category))];
      for (const cat of categories) {
        output += `[${cat.toUpperCase()}]\n`;
        for (const l of lessons.filter(l => l.category === cat)) {
          const status = l.completed ? "✓" : " ";
          output += `  [${status}] ${l.id}: ${l.title} - ${l.description}\n`;
        }
        output += "\n";
      }
      const completed = lessons.filter(l => l.completed).length;
      output += `Progress: ${completed}/${lessons.length} lessons completed`;
      return { output };
    }

    if (flags.get) {
      const lesson = lessons.find(l => l.id === flags.get);
      if (!lesson) return { error: `Lesson "${flags.get}" not found. Use /powerup --list to see available lessons.`, exitCode: 1 };
      return { output: `# ${lesson.title}\n\n${lesson.content}\n\nCategory: ${lesson.category}\nStatus: ${lesson.completed ? "✓ Completed" : "Not completed"}` };
    }

    if (flags.complete) {
      const lesson = lessons.find(l => l.id === flags.complete);
      if (!lesson) return { error: `Lesson "${flags.complete}" not found`, exitCode: 1 };
      lesson.completed = true;
      const completed = lessons.filter(l => l.completed).length;
      return { output: `Lesson "${lesson.title}" marked as completed! (${completed}/${lessons.length})` };
    }

    if (flags.random) {
      const incomplete = lessons.filter(l => !l.completed);
      const pool = incomplete.length > 0 ? incomplete : lessons;
      const lesson = pool[Math.floor(Math.random() * pool.length)];
      return { output: `# ${lesson.title}\n\n${lesson.content}\n\nUse /powerup --complete ${lesson.id} when done.` };
    }

    if (flags.progress) {
      const completed = lessons.filter(l => l.completed).length;
      const pct = Math.round((completed / lessons.length) * 100);
      const bar = "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
      return { output: `Learning Progress: ${completed}/${lessons.length}\n${bar} ${pct}%\n\nUse /powerup --list to see lessons, --random for a random one.` };
    }

    const completed = lessons.filter(l => l.completed).length;
    const pct = Math.round((completed / lessons.length) * 100);
    return { output: `Powerup: Interactive feature tutorials\nProgress: ${completed}/${lessons.length} (${pct}%)\n\nCommands:\n  --list       Show all lessons\n  --get <id>   View a lesson\n  --random     Random lesson\n  --progress   Your progress` };
  },
};

commandRegistry.register({ ...powerupCommand, source: "builtin" });
