export type RemoteControlStatus = "stopped" | "running" | "error";

export interface RemoteControlConfig {
  enabled: boolean;
  port: number;
  host: string;
  authToken?: string;
}

export interface RemoteControlSession {
  id: string;
  clientId: string;
  connectedAt: number;
  lastActivity: number;
  ip: string;
  userAgent: string;
}

export interface TeleportConfig {
  enabled: boolean;
  defaultClient: string;
}

export interface TeleportSession {
  id: string;
  url: string;
  title: string;
  content: string;
  source: string;
  importedAt: number;
  messages: number;
}

export interface IDEConfig {
  enabled: boolean;
  extension: string;
  autoConnect: boolean;
}

export interface IDEConnection {
  connected: boolean;
  name: string;
  version: string;
  workspace: string;
  connectedAt?: number;
}

export interface ChromeConfig {
  enabled: boolean;
  headless: boolean;
  remoteDebugPort: number;
}

export interface WebSyncConfig {
  enabled: boolean;
  autoSync: boolean;
  endpoint?: string;
}

export interface RemoteConfig {
  control: RemoteControlConfig;
  teleport: TeleportConfig;
  ide: IDEConfig;
  chrome: ChromeConfig;
  sync: WebSyncConfig;
}
