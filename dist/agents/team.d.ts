export interface TeamMember {
    agent: string;
    role: string;
    task?: string;
}
export interface Team {
    id: string;
    name: string;
    lead: string;
    members: TeamMember[];
    status: "forming" | "active" | "completed" | "disbanded";
    createdAt: Date;
    completedAt?: Date;
}
declare class TeamManager {
    private teams;
    createTeam(name: string, leadAgent: string, memberAgents: string[]): Team;
    getTeam(id: string): Team | undefined;
    getAllTeams(): Team[];
    executeTeamTask(teamId: string, task: string, sessionId: string, cwd: string): Promise<string[]>;
    disbandTeam(teamId: string): boolean;
}
export declare const teamManager: TeamManager;
export {};
//# sourceMappingURL=team.d.ts.map