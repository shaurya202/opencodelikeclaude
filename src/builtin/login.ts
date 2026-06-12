import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { authManager } from "../auth/manager";
import { AuthProvider } from "../auth/types";

export const loginCommand: CommandDefinition = {
  name: "login",
  description: "Authenticate with a provider",
  usage: "/login [provider] [--token <token>]",
  aliases: [],
  category: "dev",
  flags: [
    { name: "token", short: "t", description: "Auth token", type: "string" },
    { name: "provider", short: "p", description: "Auth provider (openCode, claude, github, google)", type: "string" },
    { name: "status", short: "s", description: "Show login status", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { args, flags } = context;

    if (flags.status) {
      if (authManager.isLoggedIn()) {
        const session = authManager.getSession()!;
        return { output: `Logged in to: ${session.provider}\nUser: ${session.displayName} (${session.username})\nSince: ${new Date(session.loggedInAt).toLocaleString()}` };
      }
      return { output: "Not logged in. Use /login <provider> to authenticate." };
    }

    const providerName = (flags.provider as string) || args[0] || "openCode";
    const provider = providerName as AuthProvider;
    const validProviders: AuthProvider[] = ["openCode", "claude", "github", "google", "custom"];
    if (!validProviders.includes(provider)) {
      return { error: `Invalid provider: ${providerName}. Valid: ${validProviders.join(", ")}`, exitCode: 1 };
    }

    const result = await authManager.login(provider, { token: flags.token as string });
    if (result.success && result.session) {
      return { output: `Logged in as ${result.session.displayName} via ${provider}` };
    }
    return { error: result.error || "Login failed", exitCode: 1 };
  },
};

export const logoutCommand: CommandDefinition = {
  name: "logout",
  description: "Log out of the current session",
  usage: "/logout",
  aliases: [],
  category: "dev",
  handler: async (): Promise<CommandResult> => {
    if (!authManager.isLoggedIn()) {
      return { output: "Not logged in." };
    }
    await authManager.logout();
    return { output: "Logged out successfully." };
  },
};

commandRegistry.register({ ...loginCommand, source: "builtin" });
commandRegistry.register({ ...logoutCommand, source: "builtin" });
