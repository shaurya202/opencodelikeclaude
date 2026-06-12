import { AuthSession, AuthProvider, AuthConfig, LoginResult } from "./types";

export class AuthManager {
  private currentSession: AuthSession | null = null;
  private config: AuthConfig = {
    provider: "openCode",
  };
  private loginCallbacks: Array<(session: AuthSession) => void> = [];
  private logoutCallbacks: Array<() => void> = [];

  constructor(config?: Partial<AuthConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): AuthConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<AuthConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async login(provider: AuthProvider, credentials?: { token?: string; username?: string; password?: string }): Promise<LoginResult> {
    const session: AuthSession = {
      id: this.generateId(),
      provider,
      username: credentials?.username || `user-${provider}`,
      displayName: credentials?.username || `${provider} User`,
      loggedInAt: Date.now(),
    };

    this.currentSession = session;
    this.config.provider = provider;
    if (credentials?.token) this.config.token = credentials.token;

    for (const cb of this.loginCallbacks) {
      cb(session);
    }

    return { success: true, session };
  }

  async logout(): Promise<void> {
    this.currentSession = null;
    for (const cb of this.logoutCallbacks) {
      cb();
    }
  }

  isLoggedIn(): boolean {
    return this.currentSession !== null;
  }

  getSession(): AuthSession | null {
    return this.currentSession;
  }

  getToken(): string | undefined {
    return this.config.token;
  }

  onLogin(callback: (session: AuthSession) => void): void {
    this.loginCallbacks.push(callback);
  }

  onLogout(callback: () => void): void {
    this.logoutCallbacks.push(callback);
  }

  private generateId(): string {
    return `auth-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.currentSession = null;
    this.loginCallbacks = [];
    this.logoutCallbacks = [];
  }
}

export const authManager = new AuthManager();
