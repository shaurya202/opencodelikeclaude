# Command Reference

## Core Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/help [command]` | `h`, `?` | Show help for commands |
| `/init` | — | Initialize the plugin in the current directory |
| `/compact [focus]` | — | Compact conversation history |
| `/clear [name]` | — | Start a new conversation, preserve old |
| `/resume [session]` | — | Resume a previous session |
| `/model` | — | View or switch AI model |
| `/config` | — | View or modify configuration |

## Permission Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/permissions` | — | Interactive permission management |
| `/plan` | — | Plan mode — read-only, propose changes |

## Agent Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/agents` | — | List and manage agents |
| `/mcp` | — | List and manage MCP servers |

## Session Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/branch [name]` | — | Fork conversation |
| `/rewind` | — | Rewind to checkpoint (Esc Esc) |
| `/context [all]` | — | Show current context |
| `/rename <name>` | — | Rename current session |
| `/export [file]` | — | Export conversation to markdown |
| `/copy [N]` | — | Copy Nth code block |

## UI Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/theme` | — | Change TUI theme |
| `/keybindings` | — | Customize keybindings |
| `/voice` | — | Toggle voice dictation |
| `/terminal-setup` | — | Configure terminal shortcuts |

## Advanced Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/goal <target>` | — | Set a goal with completion conditions |
| `/loop [interval] [prompt]` | — | Recurring task execution |
| `/schedule` | — | Cron task scheduling |
| `/ralph-loop` | — | Self-referential improvement loop |
| `/code-review [effort]` | — | Code review with auto-fix |
| `/simplify [target]` | — | Code cleanup review |
| `/security-review` | — | Vulnerability scanning |
| `/batch <task>` | — | Parallel worktree execution |
| `/deep-research <query>` | — | Web search fan-out research |
| `/verify` | — | Build, test, lint verification |
| `/run` | — | Launch and drive application |

## Remote Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/remote-control` | — | Start/stop remote control server |
| `/teleport` | — | Pull/push web sessions |
| `/ide` | — | IDE integration |
| `/worktree` | — | Git worktree management |

## Auth & Misc

| Command | Aliases | Description |
|---------|---------|-------------|
| `/login` | — | In-session authentication |
| `/logout` | — | In-session logout |
| `/buddy` | — | Terminal companion pet |
| `/insights` | — | Session analysis report |
| `/release-notes` | — | Interactive changelog |
| `/bug` | — | Submit bug report with logs |
| `/powerup` | — | Interactive feature tutorials |
| `/hash-edit` | — | Hash-verified content editing |

## Dev & Diagnostics

| Command | Aliases | Description |
|---------|---------|-------------|
| `/debug [description]` | `diag` | Session diagnostics |
| `/doctor` | `health` | Installation health check |
| `/status` | — | Current system status |
| `/usage` | — | Token and cost usage |
| `/hooks` | — | List registered hooks |
