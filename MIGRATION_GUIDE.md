# Migration Guide

## From Claude Code to opencode-claude-parity

### Settings Migration

The plugin can automatically read and migrate your existing Claude Code configuration.

#### Step 1: Check for existing Claude Code config

```bash
npx opencode-claude-parity migrate
```

This will detect your `~/.claude/settings.json` and produce a migration report.

#### Step 2: Apply migration

```bash
npx opencode-claude-parity migrate --apply
```

This creates `.opencode/opencode-claude-parity.jsonc` with your migrated settings.

#### What gets migrated

| Claude Code Setting | Plugin Config |
|---------------------|---------------|
| `permissions.defaultMode` | `permissions.defaultMode` |
| `permissions.alwaysAllow` | `permissions.allowedTools` |
| `permissions.deny` | `permissions.deniedTools` + rules |
| `hooks.*` | `hooks.claudeSettings` |
| `theme` | `ui.theme` |
| `vimMode` | `ui.vimMode` |
| `mcpServers` | `mcp.servers` |

#### Compatibility

The plugin automatically loads from Claude Code directories:

| Directory | Purpose |
|-----------|---------|
| `~/.claude/commands/` | Custom slash commands |
| `~/.claude/skills/` | Custom skills |
| `~/.claude/agents/` | Custom agents |
| `~/.claude/plugins/` | Marketplace plugins |
| `.mcp.json` | MCP server definitions |
| `~/.claude.json` | Claude app config |

To disable any of these, set the corresponding `compatibility` toggle to `false` in your config.

## From oh-my-opencode to opencode-claude-parity

### Overview

`opencode-claude-parity` is the successor to `oh-my-opencode`. It reproduces all functionality natively using OpenCode's plugin API.

### Config Migration

| oh-my-opencode | opencode-claude-parity |
|----------------|------------------------|
| `oh-my-opencode.json` | `opencode-claude-parity.jsonc` |
| `~/.config/opencode/oh-my-opencode.json` | `~/.config/opencode/opencode-claude-parity.jsonc` |
| `.opencode/oh-my-opencode.json` | `.opencode/opencode-claude-parity.jsonc` |
| Built-in agents | `agents` config section |
| Built-in skills | `skills.builtin` config |
| Built-in MCPs | `mcp.builtin` config |
| Hooks | `hooks.disabled` + `hooks.claudeSettings` |
| Commands | `compatibility.commands: true` |

### Key Differences

1. **ESM Module**: The new plugin uses ES modules (`"type": "module"`) with `NodeNext` module resolution
2. **Zod Validation**: Config is validated with Zod schemas instead of manual validation
3. **Filesystem-First**: Commands, agents, and skills are loaded from standard directories
4. **Runtime Injection**: MCP servers, agents, and skills are injected via `config` hook at runtime
5. **TypeScript**: Full type safety throughout

### Running Side-by-Side

Both plugins can coexist by setting compatibility toggles:

```jsonc
{
  "compatibility": {
    "mcp": false,     // Disable .mcp.json loading (oh-my-opencode handles it)
    "commands": false, // Disable Claude command loading
    "skills": false,   // Disable Claude skill loading
    "agents": false,   // Disable Claude agent loading
    "hooks": false,    // Disable settings.json hooks
    "plugins": false   // Disable plugin loading
  }
}
```

## Uninstallation

```bash
npm uninstall opencode-claude-parity
rm -rf .opencode/opencode-claude-parity.jsonc
```
