import { execSync } from "child_process";
export class VerifyRunner {
    config = {
        buildCommand: "npm run build",
        testCommand: "npm test",
        lintCommand: "npm run lint",
        timeout: 120000,
        autoFix: false,
    };
    results = new Map();
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
    async verify(target, options) {
        const startTime = Date.now();
        const steps = [];
        if (options?.lint !== false) {
            steps.push(await this.runStep("Lint", options?.lintCommand || this.config.lintCommand, target));
        }
        if (options?.build !== false) {
            steps.push(await this.runStep("Build", options?.buildCommand || this.config.buildCommand, target));
        }
        if (options?.test !== false) {
            steps.push(await this.runStep("Test", options?.testCommand || this.config.testCommand, target));
        }
        const allPassed = steps.every(s => s.status === "passed");
        const result = {
            id: this.generateId(),
            target,
            status: allPassed ? "passed" : "failed",
            steps,
            duration: Date.now() - startTime,
            timestamp: Date.now(),
        };
        this.results.set(result.id, result);
        return result;
    }
    async runStep(name, command, target) {
        const stepStart = Date.now();
        try {
            const output = execSync(command, {
                cwd: target,
                timeout: this.config.timeout,
                stdio: "pipe",
                encoding: "utf-8",
            });
            return {
                name,
                command,
                status: "passed",
                output: output.toString().slice(0, 2000),
                duration: Date.now() - stepStart,
            };
        }
        catch (error) {
            const err = error;
            const output = (err.stdout?.toString() || "") + (err.stderr?.toString() || "");
            return {
                name,
                command,
                status: "failed",
                output: output.slice(0, 2000),
                duration: Date.now() - stepStart,
                error: err.message || String(error),
            };
        }
    }
    getResult(id) {
        return this.results.get(id);
    }
    getAllResults() {
        return Array.from(this.results.values());
    }
    generateId() {
        return `verify-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.results.clear();
    }
}
export const verifyRunner = new VerifyRunner();
//# sourceMappingURL=runner.js.map