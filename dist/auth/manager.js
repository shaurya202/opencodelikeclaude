export class AuthManager {
    currentSession = null;
    config = {
        provider: "openCode",
    };
    loginCallbacks = [];
    logoutCallbacks = [];
    constructor(config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    async login(provider, credentials) {
        const session = {
            id: this.generateId(),
            provider,
            username: credentials?.username || `user-${provider}`,
            displayName: credentials?.username || `${provider} User`,
            loggedInAt: Date.now(),
        };
        this.currentSession = session;
        this.config.provider = provider;
        if (credentials?.token)
            this.config.token = credentials.token;
        for (const cb of this.loginCallbacks) {
            cb(session);
        }
        return { success: true, session };
    }
    async logout() {
        this.currentSession = null;
        for (const cb of this.logoutCallbacks) {
            cb();
        }
    }
    isLoggedIn() {
        return this.currentSession !== null;
    }
    getSession() {
        return this.currentSession;
    }
    getToken() {
        return this.config.token;
    }
    onLogin(callback) {
        this.loginCallbacks.push(callback);
    }
    onLogout(callback) {
        this.logoutCallbacks.push(callback);
    }
    generateId() {
        return `auth-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.currentSession = null;
        this.loginCallbacks = [];
        this.logoutCallbacks = [];
    }
}
export const authManager = new AuthManager();
//# sourceMappingURL=manager.js.map