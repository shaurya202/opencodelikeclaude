import { agentRegistry } from "./registry";
import { backgroundAgentManager } from "./background";
class TeamManager {
    teams = new Map();
    createTeam(name, leadAgent, memberAgents) {
        const lead = agentRegistry.get(leadAgent);
        if (!lead) {
            throw new Error(`Lead agent not found: ${leadAgent}`);
        }
        const members = [];
        for (const memberName of memberAgents) {
            const agent = agentRegistry.get(memberName);
            if (!agent) {
                throw new Error(`Member agent not found: ${memberName}`);
            }
            members.push({ agent: memberName, role: "member" });
        }
        const id = `team_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const team = {
            id,
            name,
            lead: leadAgent,
            members,
            status: "forming",
            createdAt: new Date(),
        };
        this.teams.set(id, team);
        return team;
    }
    getTeam(id) {
        return this.teams.get(id);
    }
    getAllTeams() {
        return Array.from(this.teams.values());
    }
    async executeTeamTask(teamId, task, sessionId, cwd) {
        const team = this.teams.get(teamId);
        if (!team) {
            throw new Error(`Team not found: ${teamId}`);
        }
        team.status = "active";
        const taskIds = [];
        // Spawn lead agent
        const leadTaskId = await backgroundAgentManager.spawn(team.lead, `Lead: ${task}`, sessionId, cwd);
        taskIds.push(leadTaskId);
        // Spawn member agents
        for (const member of team.members) {
            const memberTaskId = await backgroundAgentManager.spawn(member.agent, `Member: ${task}`, sessionId, cwd);
            taskIds.push(memberTaskId);
        }
        return taskIds;
    }
    disbandTeam(teamId) {
        const team = this.teams.get(teamId);
        if (!team)
            return false;
        team.status = "disbanded";
        team.completedAt = new Date();
        return true;
    }
}
export const teamManager = new TeamManager();
//# sourceMappingURL=team.js.map