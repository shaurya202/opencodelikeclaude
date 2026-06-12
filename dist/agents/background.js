import { agentRegistry } from "./registry";
class BackgroundAgentManager {
    agents = new Map();
    maxConcurrent = 5;
    setMaxConcurrent(max) {
        this.maxConcurrent = max;
    }
    getMaxConcurrent() {
        return this.maxConcurrent;
    }
    async spawn(agentName, task, sessionId, cwd) {
        const running = this.getRunningCount();
        if (running >= this.maxConcurrent) {
            throw new Error(`Max concurrent background agents (${this.maxConcurrent}) reached`);
        }
        const agent = agentRegistry.get(agentName);
        if (!agent) {
            throw new Error(`Agent not found: ${agentName}`);
        }
        const id = `bg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const backgroundAgent = {
            id,
            agent: agentName,
            task,
            status: "pending",
            startedAt: new Date(),
        };
        this.agents.set(id, backgroundAgent);
        // Simulate async execution
        this.executeBackgroundTask(id, agentName, task, sessionId, cwd);
        return id;
    }
    async executeBackgroundTask(id, agentName, task, sessionId, cwd) {
        const bgAgent = this.agents.get(id);
        if (!bgAgent)
            return;
        bgAgent.status = "running";
        try {
            const context = { sessionId, cwd, task };
            const result = await agentRegistry.execute(agentName, context);
            bgAgent.status = "completed";
            bgAgent.completedAt = new Date();
            bgAgent.result = result;
        }
        catch (error) {
            bgAgent.status = "failed";
            bgAgent.completedAt = new Date();
            bgAgent.result = {
                output: "",
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
    get(id) {
        return this.agents.get(id);
    }
    getAll() {
        return Array.from(this.agents.values());
    }
    getRunning() {
        return this.getAll().filter(a => a.status === "running" || a.status === "pending");
    }
    getRunningCount() {
        return this.getRunning().length;
    }
    async cancel(id) {
        const agent = this.agents.get(id);
        if (!agent)
            return false;
        if (agent.status === "running" || agent.status === "pending") {
            agent.status = "cancelled";
            agent.completedAt = new Date();
            return true;
        }
        return false;
    }
    attach(id) {
        return this.agents.get(id);
    }
    list(status) {
        const all = this.getAll();
        if (status) {
            return all.filter(a => a.status === status);
        }
        return all;
    }
    clearCompleted() {
        let count = 0;
        for (const [id, agent] of this.agents.entries()) {
            if (agent.status === "completed" || agent.status === "failed" || agent.status === "cancelled") {
                this.agents.delete(id);
                count++;
            }
        }
        return count;
    }
}
export const backgroundAgentManager = new BackgroundAgentManager();
//# sourceMappingURL=background.js.map