import { Config } from "./schema";

export const defaultConfig: Config = {
  compatibility: {
    mcp: true,
    commands: true,
    skills: true,
    agents: true,
    hooks: true,
    plugins: true,
  },
  agents: {
    orchestrator: { model: "anthropic/claude-opus-4-5", variant: "max" },
    planner: { model: "anthropic/claude-sonnet-4-5" },
    reviewer: { model: "openai/gpt-5.2" },
    researcher: { model: "anthropic/claude-sonnet-4-5" },
    explorer: { model: "opencode/gpt-5-nano" },
    frontend: { model: "google/gemini-3-pro" },
    gitMaster: { model: "anthropic/claude-sonnet-4-5" },
    multimodal: { model: "google/gemini-3-flash" },
  },
  categories: {
    quick: { model: "opencode/gpt-5-nano" },
    visual: { model: "google/gemini-3-pro" },
    businessLogic: { model: "anthropic/claude-sonnet-4-5" },
    deep: { model: "anthropic/claude-opus-4-5", variant: "max" },
    writing: { model: "anthropic/claude-sonnet-4-5" },
  },
  permissions: {
    defaultMode: "default",
    allowedTools: [],
    deniedTools: [],
    rules: [],
  },
  mcp: {
    builtin: {
      websearch: true,
      context7: true,
      grepApp: true,
      lsp: true,
      astGrep: true,
    },
    servers: {},
  },
  skills: {
    builtin: {
      playwright: true,
      gitMaster: true,
      frontendUiUx: true,
    },
    paths: [],
  },
  hooks: {
    disabled: [],
    claudeSettings: true,
  },
  ui: {
    theme: "default",
    color: "default",
    vimMode: false,
    voiceEnabled: false,
    pushToTalkKey: "Space",
    leaderKey: "ctrl+x",
    keybindings: {},
    diffStyle: "auto",
    mouseCapture: false,
    scrollSpeed: 3,
    scrollAcceleration: true,
    terminal: "",
    notificationSounds: true,
    commandPaletteEnabled: true,
  },
  background: {
    maxConcurrent: 5,
    concurrencyByProvider: {},
  },
  experimental: {
    aggressiveTruncation: false,
    autoResume: false,
    teamMode: false,
    hashEditing: true,
    useRealImplementations: true,
    goal: {
      maxActive: 5,
      autoTrack: true,
      notifyOnComplete: true,
    },
    loop: {
      maxLoops: 100,
      defaultInterval: 60000,
      persistent: false,
    },
    review: {
      defaultEffort: 5,
      autoFix: false,
      comment: true,
      securityScan: true,
    },
    thinkMode: {
      enabled: true,
      autoDetect: true,
      keywords: ["think deeply", "ultrathink", "deep analysis", "carefully"],
    },
    keywordDetector: {
      enabled: true,
      modes: ["ultrawork", "search", "analyze", "review"],
    },
  },
  cost: {
    trackUsage: true,
    breakdown: true,
    alerts: {},
  },
  remote: {
    control: {
      enabled: false,
      port: 9447,
      host: "localhost",
      authToken: undefined,
    },
    teleport: {
      enabled: true,
      defaultClient: "claude.ai",
    },
    ide: {
      enabled: false,
      extension: "opencode",
      autoConnect: true,
    },
    chrome: {
      enabled: false,
      headless: false,
      remoteDebugPort: 9222,
    },
    sync: {
      enabled: false,
      autoSync: true,
      endpoint: undefined,
    },
  },
};