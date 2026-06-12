# Real Implementation Guide

## Turning the Plugin Stubs Into a Working System

This plugin runs **inside OpenCode**. Every system should delegate to OpenCode's own LLM,
provider routing, MCP, and tool infrastructure instead of making independent API calls or
returning mock data.

---

## Architecture

```
Plugin Stub (current)                 Plugin Live (target)
┌─────────────────────┐               ┌──────────────────────────┐
│ agents/registry.ts  │──stub──►      │ delegates to OpenCode's  │
│   → mock string     │               │ agent/task dispatch      │
├─────────────────────┤               ├──────────────────────────┤
│ mcp/registry.ts     │──stub──►      │ registers servers with   │
│   → mock tools[]    │               │ OpenCode's MCP subsystem │
├─────────────────────┤               ├──────────────────────────┤
│ skills/executor.ts  │──stub──►      │ sends SKILL.md content   │
│   → template sub    │               │ as system prompt to LLM  │
├─────────────────────┤               ├──────────────────────────┤
│ review/runner.ts    │──stub──►      │ feeds file content to    │
│   → matched lines   │               │ OpenCode LLM for review  │
├─────────────────────┤               ├──────────────────────────┤
│ research/runner.ts  │──stub──►      │ calls OpenCode websearch │
│   → fake URLs       │               │ MCP + LLM for synthesis  │
├─────────────────────┤               ├──────────────────────────┤
│ verify/runner.ts    │──stub──►      │ child_process.execSync   │
│   → "passed"        │               │ (no LLM needed)          │
├─────────────────────┤               ├──────────────────────────┤
│ insights/analyzer   │──stub──►      │ aggregates real data     │
│   → Math.random()   │               │ from session/cost stores │
├─────────────────────┤               ├──────────────────────────┤
│ cost/tracker.ts     │──stub──►      │ fed by post-tool-use     │
│   → records only    │               │ hook with real token use │
├─────────────────────┤               ├──────────────────────────┤
│ commands/loader.ts  │──stub──►      │ child_process.execSync   │
│   → "not impl."     │               │ for .js/.sh command files│
└─────────────────────┘               └──────────────────────────┘
```

---

## Step-by-Step Implementation

### 1. Add a Real/Fallback Config Flag

**File:** `src/config/schema.ts`

Add to `experimentalSchema`:

```ts
useRealImplementations: z.boolean().default(false),
```

Default `false` means stubs stay until explicitly opted in. Each runner checks
this flag before deciding which path to take.

---

### 2. Wire Agent Execution to OpenCode's Task System

**Files:** `src/agents/registry.ts`, `src/tools/delegation/`

OpenCode provides a `task` tool for sub-agents. The plugin already has delegation
tools defined in `src/tools/delegation/` — they just return mock strings.

**Change `agentRegistry.runAgent()`:**

```ts
private async runAgent(agent: LoadedAgent, context: AgentContext): Promise<AgentResult> {
  // When experimental.useRealImplementations is true:
  //   1. Call OpenCode's internal task dispatch with the agent's config as context
  //   2. OpenCode's LLM processes the task using the user's configured provider/model
  //   3. Return the LLM's response as the AgentResult
  //
  // When false: return the current mock string
}
```

OpenCode exposes task dispatch through its plugin API (`context: PluginContext`
in `src/index.ts`). The `PluginAPI` already carries `config`, `agents`, `mcp`,
etc. — wire `agentRegistry.execute()` to call back through `PluginAPI.agents`.

**Key insight:** Don't make HTTP calls to external LLM APIs. Call OpenCode's own
agent dispatch, which uses whatever provider the user configured via `/connect`.

---

### 3. Fix Default Model Names

**File:** `src/config/defaults.ts`

Replace speculative model IDs with real OpenCode model IDs:

| Current | Should Be |
|---------|-----------|
| `anthropic/claude-opus-4-5` | Keep as string — falls through to user config |
| `openai/gpt-5.2` | Use actual provider/model from OpenCode's catalog |
| `google/gemini-3-pro` | Or leave empty and use OpenCode's default model |

OpenCode uses the AI SDK format `provider_id/model_id` (e.g., `opencode/gpt-5.1-codex`
for OpenCode Zen). When no model is specified per-agent, fall back to the user's
globally configured default model from `opencode.json`.

---

### 4. Connect MCP Servers Through OpenCode's MCP Subsystem

**Files:** `src/mcp/registry.ts`, `src/mcp/loader.ts`

OpenCode already has a full MCP implementation. Instead of maintaining a parallel
registry of mock tools:

**Change `MCPRegistry`:**

```ts
// Instead of:
this.servers.set(name, { name, config, status: "disconnected", tools: [], resources: [] });

// Do:
//   Register the server config with OpenCode's MCP system
//   OpenCode handles process spawning (stdio/SSE), JSON-RPC, tool discovery
```

The builtin MCP configs in `getBuiltinMCPConfigs()` (`src/mcp/loader.ts:75-121`)
already define the correct commands (`npx -y @exa-ai/mcp-server`, etc.). These
should be passed to OpenCode's MCP launcher rather than stubbed.

OpenCode's plugin API should expose `registerMCPServer()` or the plugin should
write to OpenCode's MCP config so OpenCode's own MCP manager picks them up.

---

### 5. Run Skills Through OpenCode's LLM

**File:** `src/skills/executor.ts`

**Change `executeSkillContent()`:**

```ts
// Instead of template substitution:
let content = skill.content;
for (const [key, value] of Object.entries(params)) {
  content = content.replace(`{{${key}}}`, String(value));
}
return { output: `Executed skill: ${content}` };

// Do:
//   1. Send skill.content as a system prompt to OpenCode's LLM
//   2. Send params as user message context
//   3. Return the LLM's response
//
// OpenCode's plugin API can provide a `callLlm(systemPrompt, userMessage)` method
// that routes through the user's configured provider.
```

Skills with embedded MCP servers (from SKILL.md frontmatter) should register
those servers with OpenCode's MCP system before execution.

---

### 6. Run Code Review Through OpenCode's LLM

**File:** `src/review/runner.ts`

Security scan already fixed to read file content (previous changes). For the
full code review pipeline:

```ts
// When experimental.useRealImplementations is true:
//   1. Read the target file(s)
//   2. Build a review prompt with the file content + review criteria
//   3. Send to OpenCode's LLM
//   4. Parse structured findings from the LLM response
//   5. Return ReviewResult with real findings, score, etc.
```

The review runner already has the data structures (`ReviewFinding`, `ReviewResult`,
`ReviewSeverity`). Only the content generation needs to change.

---

### 7. Run Verification Commands for Real

**File:** `src/verify/runner.ts`

No LLM needed — just `child_process`:

```ts
// Replace mock-pass with:
const { execSync } = await import("child_process");
try {
  const output = execSync(command, { cwd: target, timeout: config.timeout });
  return { status: "passed", output: output.toString(), duration: ... };
} catch (error) {
  return { status: "failed", output: error.stdout?.toString(), error: error.message, ... };
}
```

Default commands are already in `VerifyConfig`:
- `buildCommand: "npm run build"`
- `testCommand: "npm test"`
- `lintCommand: "npm run lint"`

---

### 8. Wire Deep Research to OpenCode's Web Search MCP

**File:** `src/research/runner.ts`

```ts
// Instead of fake URLs:
sources.push({
  url: `https://example.com/search?q=${query}&page=${i + 1}`,
  title: `Result ${i + 1} for: ${query}`,
  snippet: `Information about ${query}`,
});

// Do:
//   1. Call the websearch MCP server registered with OpenCode
//   2. Parse real search results into ResearchSource objects
//   3. Use OpenCode's LLM to synthesize findings from the results
//   4. Calculate confidence based on source quality and quantity
```

The `websearch` builtin MCP is already defined in `getBuiltinMCPConfigs()`.
When connected through OpenCode's MCP system, its `web_search` tool returns
real results.

---

### 9. Feed Real Data Into Cost Tracker

**File:** `src/cost/tracker.ts`

The tracker itself is correct — it just needs data:

```ts
// In the post-tool-use hook (created in src/index.ts):
//   1. After every LLM call, extract token usage from the response
//   2. Call costTracker.record(model, inputTokens, outputTokens, category)
//   3. Cost alerts and summaries will work automatically
```

OpenCode's hook system already dispatches `post-tool-use` events. The plugin's
hook handler (in `createOpenCodePlugin`) can inspect `toolOutput` for token
counts when the tool was an LLM call.

---

### 10. Aggregate Real Insights

**File:** `src/insights/analyzer.ts`

```ts
// Instead of Math.random():
//   1. Query sessionManager.getAll() for real session counts and durations
//   2. Query costTracker.getSummary() for real token/cost data
//   3. Query commandRegistry.getAll() for real command usage stats
//   4. Build InsightReport from the aggregated data
```

---

### 11. Execute File-Based Command Scripts

**File:** `src/commands/loader.ts`

```ts
// Instead of:
handler: async () => ({
  error: `Command ${commandFile.name} requires script execution (not implemented)`,
  exitCode: 1,
}),

// Do for .js files:
//   const fn = new Function("context", commandFile.script);
//   return await fn(context);
//
// Do for shell scripts (.sh, no extension):
//   const output = execSync(commandFile.script, { cwd, shell: true });
//   return { output: output.toString() };
```

---

## Testing Strategy

Each runner gets two paths gated by `experimental.useRealImplementations`:

```ts
if (config.experimental.useRealImplementations) {
  return this.executeReal(target, options);
}
return this.executeStub(target, options);
```

- **Default (`false`)**: Current mock behavior. Tests pass without external dependencies.
- **`true`**: Real execution. Requires OpenCode to be running with a configured provider.

Tests should cover both paths. The stubs are the source of truth for the return
shape; the real implementations must match the same interfaces.

---

## Files to Modify (Complete List)

| Priority | File | Change |
|----------|------|--------|
| P0 | `src/config/schema.ts` | Add `useRealImplementations` flag |
| P0 | `src/config/defaults.ts` | Update default model IDs |
| P0 | `src/index.ts` | Expose `callLlm()` or task dispatch in PluginAPI |
| P1 | `src/agents/registry.ts` | Wire `runAgent` to OpenCode task dispatch |
| P1 | `src/mcp/registry.ts` | Register servers with OpenCode's MCP system |
| P1 | `src/skills/executor.ts` | Send skill content to OpenCode LLM |
| P1 | `src/review/runner.ts` | Send file contents to OpenCode LLM |
| P2 | `src/verify/runner.ts` | Replace mock with `execSync` |
| P2 | `src/research/runner.ts` | Use websearch MCP + LLM synthesis |
| P2 | `src/insights/analyzer.ts` | Aggregate from real stores |
| P2 | `src/commands/loader.ts` | Execute scripts via `execSync`/`new Function` |
| P3 | `src/cost/tracker.ts` | Add callers in post-tool-use hook |

---

## Files That Don't Need Changes

- `src/config/loader.ts` — Config loading works, deep merge already fixed
- `src/hooks/` — Hook chaining already fixed, types are correct
- `src/session/` — Session CRUD/checkpoint/branch/compact all work
- `src/permissions/` — Permission evaluation logic is correct
- `src/compat/` — Migration tooling works as-is
- `src/utils/` — Logger, errors, memoize, jsonc, path all solid
- `src/builtin/` — Command handlers dispatch correctly, just need backends
- `src/cli.ts` — CLI scaffold works

---

## Quick Reference: OpenCode Integration Points

| Need | How |
|------|-----|
| Run an LLM prompt | Use `PluginAPI` task dispatch or OpenCode's internal SDK |
| Register an MCP server | Add to OpenCode's MCP config or use plugin API |
| Spawn a process | `child_process.execSync` / `spawn` |
| Use web search | Call the registered `websearch` MCP `web_search` tool |
| Get token counts | From `post-tool-use` hook `toolOutput` |
| Get session data | `sessionManager.getCurrentSession()` / `listSessions()` |
| Execute a shell command | `child_process.execSync` with timeout |
