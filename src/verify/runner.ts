import { execSync } from "child_process";
import { VerifyResult, VerifyStep, VerifyConfig } from "./types";

export class VerifyRunner {
  private config: VerifyConfig = {
    buildCommand: "npm run build",
    testCommand: "npm test",
    lintCommand: "npm run lint",
    timeout: 120000,
    autoFix: false,
  };
  private results: Map<string, VerifyResult> = new Map();

  constructor(config?: Partial<VerifyConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): VerifyConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<VerifyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async verify(target: string, options?: {
    build?: boolean;
    test?: boolean;
    lint?: boolean;
    buildCommand?: string;
    testCommand?: string;
    lintCommand?: string;
  }): Promise<VerifyResult> {
    const startTime = Date.now();
    const steps: VerifyStep[] = [];

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
    const result: VerifyResult = {
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

  private async runStep(name: string, command: string, target: string): Promise<VerifyStep> {
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
    } catch (error) {
      const err = error as { stdout?: Buffer; stderr?: Buffer; message: string };
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

  getResult(id: string): VerifyResult | undefined {
    return this.results.get(id);
  }

  getAllResults(): VerifyResult[] {
    return Array.from(this.results.values());
  }

  private generateId(): string {
    return `verify-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.results.clear();
  }
}

export const verifyRunner = new VerifyRunner();
