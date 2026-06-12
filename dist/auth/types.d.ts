export type AuthProvider = "openCode" | "claude" | "github" | "google" | "custom";
export interface AuthConfig {
    provider: AuthProvider;
    token?: string;
    refreshToken?: string;
    expiresAt?: number;
}
export interface AuthSession {
    id: string;
    provider: AuthProvider;
    username: string;
    displayName: string;
    email?: string;
    avatarUrl?: string;
    loggedInAt: number;
    tokenExpiresAt?: number;
}
export interface LoginResult {
    success: boolean;
    session?: AuthSession;
    error?: string;
}
//# sourceMappingURL=types.d.ts.map