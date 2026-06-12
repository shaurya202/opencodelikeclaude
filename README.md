# opencode-claude-parity

OpenCode plugin providing Claude Code parity: hooks, slash commands, agents, MCP servers, skills, sessions, permissions, and more.

## Features

- **43+ Slash Commands** — `/help`, `/init`, `/compact`, `/clear`, `/resume`, `/model`, `/permissions`, `/config`, `/mcp`, `/agents`, `/hooks`, `/debug`, `/doctor`, `/status`, `/usage`, `/export`, `/copy`, `/branch`, `/rewind`, `/context`, `/rename`, `/theme`, `/keybindings`, `/voice`, `/vim`, `/fast`, `/terminal-setup`, `/goal`, `/loop`, `/schedule`, `/ralph-loop`, `/code-review`, `/simplify`, `/security-review`, `/batch`, `/deep-research`, `/verify`, `/run`, `/remote-control`, `/teleport`, `/ide`, `/worktree`, `/login`, `/logout`, `/buddy`, `/insights`, `/release-notes`, `/bug`, `/powerup`, `/hash-edit`
- **8 Built-in Agents** — Orchestrator, Planner, Reviewer, Researcher, Explorer, Frontend, GitMaster, Multimodal
- **5 Built-in MCP Servers** — Web Search (Exa), Context7 (docs), Grep App (GitHub code search), LSP, AST-grep
- **3 Built-in Skills** — Playwright, GitMaster, Frontend UI/UX
- **Session Management** — Branching, checkpoints, compaction, naming, resume
- **Permission Modes** — Default, AcceptEdits, Plan, Auto, BypassPermissions
- **UI/UX** — Themes, keybindings, vim mode, voice, command palette
- **Remote & Cloud** — Remote control server, teleport, IDE integration, Chrome
- **Compatibility** — Loads Claude Code settings.json, commands, agents, skills, MCP servers, plugins

## Installation

```bash
npm install opencode-claude-parity
```

Then register the plugin in your OpenCode configuration.

## Configuration

Create `.opencode/opencode-claude-parity.jsonc` (or `.json`) in your project:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/opencode/opencode-claude-parity/main/schema.json",

  "permissions": {
    "defaultMode": "default"
  },

  "ui": {
    "theme": "default",
    "vimMode": false
  },

  "compatibility": {
    "commands": true,
    "skills": true,
    "agents": true,
    "mcp": true,
    "hooks": true,
    "plugins": true
  }
}
```

See [CONFIG_REFERENCE.md](./CONFIG_REFERENCE.md) for full configuration options.

## Migration from Claude Code

If you have existing Claude Code configuration, run:

```bash
# Generate a migration report (dry run)
npx opencode-claude-parity migrate

# Apply migration
npx opencode-claude-parity migrate --apply
```

This will read your `~/.claude/settings.json` and create `.opencode/opencode-claude-parity.jsonc` with your settings.

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details.

## Migration from oh-my-opencode

The plugin is the successor to `oh-my-opencode`. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for the migration path.

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Test
npm run test
```

## License

MIT
