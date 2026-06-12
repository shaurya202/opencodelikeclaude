# Configuration Reference

The plugin is configured via `.opencode/opencode-claude-parity.jsonc` (or `.json`).

## Schema

### `$schema`
- Type: `string` (optional)
- The JSON schema URL for IDE autocompletion.

### `compatibility`
Controls Claude Code compatibility features.

```jsonc
"compatibility": {
  "mcp": true,       // Load .mcp.json files
  "commands": true,  // Load ~/.claude/commands/
  "skills": true,    // Load ~/.claude/skills/
  "agents": true,    // Load ~/.claude/agents/
  "hooks": true,     // Load settings.json hooks
  "plugins": true    // Load Claude Code plugins
}
```

### `agents`
Configure built-in agents.

```jsonc
"agents": {
  "orchestrator": { "model": "anthropic/claude-opus-4-5", "variant": "max" },
  "planner": { "model": "anthropic/claude-sonnet-4-5" },
  "reviewer": { "model": "openai/gpt-5.2" },
  "researcher": { "model": "anthropic/claude-sonnet-4-5" },
  "explorer": { "model": "opencode/gpt-5-nano" },
  "frontend": { "model": "google/gemini-3-pro" },
  "gitMaster": { "model": "anthropic/claude-sonnet-4-5" },
  "multimodal": { "model": "google/gemini-3-flash" }
}
```

Each agent accepts:
- `model` — Model identifier
- `variant` — Model variant (e.g., "max")
- `fallbackModels` — Array of fallback models
- `temperature` — Temperature (0-2)
- `toolPermissions` — Allowed tool scopes
- `prompt` — Custom system prompt override

### `categories`
Category-based model routing for delegation.

```jsonc
"categories": {
  "quick": { "model": "opencode/gpt-5-nano" },
  "visual": { "model": "google/gemini-3-pro" },
  "businessLogic": { "model": "anthropic/claude-sonnet-4-5" },
  "deep": { "model": "anthropic/claude-opus-4-5", "variant": "max" },
  "writing": { "model": "anthropic/claude-sonnet-4-5" }
}
```

### `permissions`
Permission modes and rules.

```jsonc
"permissions": {
  "defaultMode": "default",
  "allowedTools": [],
  "deniedTools": [],
  "rules": [
    { "pattern": "Read*", "action": "allow", "scope": "user" }
  ]
}
```

Modes: `default`, `acceptEdits`, `plan`, `auto`, `bypassPermissions`

### `mcp`
MCP server configuration.

```jsonc
"mcp": {
  "builtin": {
    "websearch": true,
    "context7": true,
    "grepApp": true,
    "lsp": true,
    "astGrep": true
  },
  "servers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@my/mcp-server"],
      "env": { "API_KEY": "${MY_API_KEY}" }
    }
  }
}
```

### `skills`
Skill configuration.

```jsonc
"skills": {
  "builtin": {
    "playwright": true,
    "gitMaster": true,
    "frontendUiUx": true
  },
  "paths": []
}
```

### `hooks`
Hook settings.

```jsonc
"hooks": {
  "disabled": [],
  "claudeSettings": true
}
```

### `ui`
UI customization.

```jsonc
"ui": {
  "theme": "default",
  "color": "default",
  "vimMode": false,
  "leaderKey": "ctrl+x",
  "diffStyle": "auto",
  "mouseCapture": false,
  "scrollSpeed": 3,
  "scrollAcceleration": true,
  "notificationSounds": true,
  "commandPaletteEnabled": true
}
```

### `background`
Background agent settings.

```jsonc
"background": {
  "maxConcurrent": 5,
  "concurrencyByProvider": {}
}
```

### `experimental`
Experimental features.

```jsonc
"experimental": {
  "aggressiveTruncation": false,
  "autoResume": false,
  "teamMode": false,
  "hashEditing": true
}
```

### `cost`
Cost tracking settings.

```jsonc
"cost": {
  "trackUsage": true,
  "breakdown": true,
  "alerts": {}
}
```

### `remote`
Remote features configuration.

```jsonc
"remote": {
  "control": { "enabled": false, "port": 9447, "host": "localhost" },
  "teleport": { "enabled": true, "defaultClient": "claude.ai" },
  "ide": { "enabled": false, "extension": "opencode", "autoConnect": true },
  "chrome": { "enabled": false, "headless": false, "remoteDebugPort": 9222 },
  "sync": { "enabled": false, "autoSync": true }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENCODE_LOG_LEVEL` | Log level: `debug`, `info`, `warn`, `error`, `silent` (default: `info`) |
| `EXA_API_KEY` | API key for websearch MCP |
| `GITHUB_TOKEN` | Token for grepApp MCP |
