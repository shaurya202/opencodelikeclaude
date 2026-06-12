import { PermissionEvaluation, ToolPermissionCheck } from "./types";

interface SafetyCheck {
  check: (toolName: string, toolInput: Record<string, unknown>) => Promise<{ safe: boolean; reason: string }>;
  weight: number;
}

const safetyChecks: SafetyCheck[] = [
  {
    check: async (toolName, toolInput) => {
      if (toolName === "bash") {
        const command = toolInput.command as string;
        if (command) {
          const dangerous = ["rm -rf", "sudo rm", "dd if=", "mkfs", "format", "> /dev/sd", "chmod 777", "chown root"];
          for (const d of dangerous) {
            if (command.includes(d)) {
              return { safe: false, reason: `Dangerous command pattern: ${d}` };
            }
          }
        }
      }
      return { safe: true, reason: "No dangerous patterns detected" };
    },
    weight: 10,
  },
  {
    check: async (toolName, toolInput) => {
      if (toolName === "write" || toolName === "edit") {
        const path = toolInput.path as string;
        if (path) {
          const sensitive = [".env", "secret", "key", "password", "token", "credential", ".pem", ".key", "id_rsa"];
          for (const s of sensitive) {
            if (path.toLowerCase().includes(s)) {
              return { safe: false, reason: `Sensitive file path: ${s}` };
            }
          }
        }
      }
      return { safe: true, reason: "No sensitive files detected" };
    },
    weight: 8,
  },
  {
    check: async (toolName, toolInput) => {
      if (toolName === "bash") {
        const command = toolInput.command as string;
        if (command && (command.includes("curl") || command.includes("wget")) && command.includes("| bash")) {
          return { safe: false, reason: "Piping to bash from network" };
        }
      }
      return { safe: true, reason: "No network pipe to bash" };
    },
    weight: 6,
  },
];

export async function evaluateWithAI(
  check: ToolPermissionCheck
): Promise<PermissionEvaluation> {
  // Run safety checks
  let totalWeight = 0;
  let passedWeight = 0;
  const reasons: string[] = [];

  for (const sc of safetyChecks) {
    totalWeight += sc.weight;
    const result = await sc.check(check.toolName, check.toolInput);
    if (result.safe) {
      passedWeight += sc.weight;
    }
    reasons.push(result.reason);
  }

  const safetyScore = totalWeight > 0 ? passedWeight / totalWeight : 1;
  
  // Auto-allow if safety score is high
  if (safetyScore >= 0.8) {
    return {
      allowed: true,
      reason: `Auto-eval: safety score ${Math.round(safetyScore * 100)}% - ${reasons.join("; ")}`,
      mode: "auto",
    };
  }

  // Require human review for medium risk
  if (safetyScore >= 0.5) {
    return {
      allowed: false,
      reason: `Auto-eval: medium risk (${Math.round(safetyScore * 100)}%) - ${reasons.join("; ")}`,
      mode: "auto",
    };
  }

  // Deny high risk
  return {
    allowed: false,
    reason: `Auto-eval: high risk (${Math.round(safetyScore * 100)}%) - ${reasons.join("; ")}`,
    mode: "auto",
  };
}

export function getSafetyChecks(): SafetyCheck[] {
  return [...safetyChecks];
}