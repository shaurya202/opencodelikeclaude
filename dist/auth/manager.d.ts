import { AuthSession, AuthProvider, AuthConfig, LoginResult } from "./types";
export declare class AuthManager {
    private currentSession;
    private config;
    private loginCallbacks;
    private logoutCallbacks;
    constructor(config?: Partial<AuthConfig>);
    getConfig(): AuthConfig;
    updateConfig(config: Partial<AuthConfig>): void;
    login(provider: AuthProvider, credentials?: {
        token?: string;
        username?: string;
        password?: string;
    }): Promise<LoginResult>;
    logout(): Promise<void>;
    isLoggedIn(): boolean;
    getSession(): AuthSession | null;
    getToken(): string | undefined;
    onLogin(callback: (session: AuthSession) => void): void;
    onLogout(callback: () => void): void;
    private generateId;
    destroy(): void;
}
export declare const authManager: AuthManager;
//# sourceMappingURL=manager.d.ts.map