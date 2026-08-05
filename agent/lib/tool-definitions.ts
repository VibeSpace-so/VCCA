import fs from "node:fs/promises";
import { z } from "zod";
import { analyzeRepo } from "./repo.js";
import {
  appendDecision,
  appendJournal,
  defaultMilestones,
  defaultRisks,
  getVccaDir,
  loadMilestones,
  loadProject,
  loadRisks,
  MILESTONES,
  type Milestone,
  type MilestonesState,
  type Project,
  type RiskLevel,
  type Risks,
  RISK_CATEGORIES,
  sanitizeOutput,
  writeMilestones,
  writeProject,
  writeRisks,
} from "./state.js";

export interface VccaTool {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema: any;
  execute: (input: any) => Promise<any> | any;
}

// =============================================================================
// analyze_repo
// =============================================================================

const analyzeRepoTool: VccaTool = {
  name: "analyze_repo",
  description:
    "Analyze the repository at the given project path. Returns a summary of tech stack, architecture, tests, CI/CD, security, deployment readiness, and open TODOs.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Absolute or relative path to the project repository."),
  }),
  outputSchema: z.object({
    project_name: z.string().optional(),
    description: z.string().optional(),
    language: z.string().optional(),
    manifest: z.string().optional(),
    dependencies: z.array(z.string()),
    dev_dependencies: z.array(z.string()).optional(),
    top_level: z.array(z.string()),
    has_readme: z.boolean(),
    has_tests: z.boolean(),
    has_ci_cd: z.boolean(),
    has_docker: z.boolean(),
    has_migrations: z.boolean(),
    has_privacy_policy: z.boolean(),
    has_terms: z.boolean(),
    has_health_endpoint: z.boolean(),
    has_auth: z.boolean(),
    has_rate_limiting: z.boolean(),
    has_logging: z.boolean(),
    has_monitoring: z.boolean(),
    has_error_reporting: z.boolean(),
    has_analytics: z.boolean(),
    has_feature_flags: z.boolean(),
    has_https_setup: z.boolean(),
    architecture_notes: z.array(z.string()),
    security_notes: z.array(z.string()),
    deployment_notes: z.array(z.string()),
    todos: z.array(z.string()),
    summary: z.string(),
  }),
  async execute({ project_path }) {
    return sanitizeOutput(await analyzeRepo(project_path));
  },
};

// =============================================================================
// load_state
// =============================================================================

const loadStateTool: VccaTool = {
  name: "load_state",
  description:
    "Load the persisted VCCA state for a project. Returns project context, current risks, milestones, and recent journal/decision snippets.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project directory."),
  }),
  outputSchema: z.object({
    exists: z.boolean(),
    project: z.any().optional(),
    risks: z.any().optional(),
    milestones: z.any().optional(),
    highest_risk_category: z.string().optional(),
    highest_risk_score: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
    journal_snippet: z.string().optional(),
    decisions_snippet: z.string().optional(),
  }),
  async execute({ project_path }) {
    const [project, risks, milestones] = await Promise.all([
      loadProject(project_path),
      loadRisks(project_path),
      loadMilestones(project_path),
    ]);

    let highest = "" as keyof Risks | "";
    let highestScore = -1;
    const scoreMap = { Low: 1, Medium: 2, High: 3, Critical: 4 };
    if (risks) {
      for (const cat of RISK_CATEGORIES) {
        const s = scoreMap[risks[cat].score];
        if (s > highestScore) {
          highestScore = s;
          highest = cat;
        }
      }
    }

    const journalPath = `${getVccaDir(project_path)}/journal.md`;
    const decisionsPath = `${getVccaDir(project_path)}/decisions.md`;
    const [journal, decisions] = await Promise.all([
      fs.readFile(journalPath, "utf-8").catch(() => ""),
      fs.readFile(decisionsPath, "utf-8").catch(() => ""),
    ]);

    return sanitizeOutput({
      exists: !!(project || risks || milestones),
      project: project || undefined,
      risks: risks || undefined,
      milestones: milestones || undefined,
      highest_risk_category: highest || undefined,
      highest_risk_score: highest
        ? ((["Low", "Medium", "High", "Critical"][highestScore - 1]) as "Low" | "Medium" | "High" | "Critical")
        : undefined,
      journal_snippet: journal ? `...${journal.slice(-1200)}` : undefined,
      decisions_snippet: decisions ? `...${decisions.slice(-1200)}` : undefined,
    });
  },
};

// =============================================================================
// update_state
// =============================================================================

const updateStateTool: VccaTool = {
  name: "update_state",
  description:
    "Create or update the persisted VCCA state for a project. Merge project and risk updates, advance milestones, and append journal or decision entries.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project directory."),
    project: z.any().optional().describe("Partial project fields to merge into .vcca/project.yaml."),
    risks: z.any().optional().describe("Partial risk category updates."),
    milestones: z
      .object({
        current: z.string().optional(),
        completed: z.array(z.string()).optional(),
      })
      .optional(),
    journal_entry: z.string().optional().describe("Markdown text to append to .vcca/journal.md."),
    decision: z
      .object({
        request: z.string(),
        recommendation: z.string(),
        rationale: z.string(),
      })
      .optional(),
  }),
  outputSchema: z.object({
    project: z.any().optional(),
    risks: z.any().optional(),
    milestones: z.any().optional(),
    updated: z.boolean(),
  }),
  async execute({ project_path, project, risks, milestones, journal_entry, decision }) {
    const [existingProject, existingRisks, existingMilestones] = await Promise.all([
      loadProject(project_path),
      loadRisks(project_path),
      loadMilestones(project_path),
    ]);

    const nextProject: Project = { ...(existingProject || {}), ...(project || {}) } as Project;
    const nextRisks: Risks = { ...(existingRisks || defaultRisks()), ...(risks || {}) } as Risks;
    const nextMilestones: MilestonesState = existingMilestones || defaultMilestones();

    if (milestones) {
      if (milestones.current) {
        const target = milestones.current as Milestone;
        if (MILESTONES.includes(target)) {
          const targetIndex = MILESTONES.indexOf(target);
          nextMilestones.current = target;
          for (let i = 0; i < targetIndex; i++) {
            if (!nextMilestones.completed.includes(MILESTONES[i])) {
              nextMilestones.completed.push(MILESTONES[i]);
            }
          }
        }
      }
      if (milestones.completed) {
        for (const m of milestones.completed as Milestone[]) {
          if (MILESTONES.includes(m) && !nextMilestones.completed.includes(m)) {
            nextMilestones.completed.push(m);
          }
        }
      }
    }

    await Promise.all([
      writeProject(project_path, nextProject),
      writeRisks(project_path, nextRisks),
      writeMilestones(project_path, nextMilestones),
    ]);

    if (journal_entry) await appendJournal(project_path, journal_entry);
    if (decision) await appendDecision(project_path, decision.request, decision.recommendation, decision.rationale);

    return sanitizeOutput({
      project: nextProject,
      risks: nextRisks,
      milestones: nextMilestones,
      updated: true,
    });
  },
};

// =============================================================================
// score_risks
// =============================================================================

const SCORE_ORDER: RiskLevel[] = ["Low", "Medium", "High", "Critical"];
const SCORE_MAP = { Low: 1, Medium: 2, High: 3, Critical: 4 };

function scoreToNum(s: RiskLevel) {
  return SCORE_MAP[s];
}

function numToScore(n: number): RiskLevel {
  if (n >= 4) return "Critical";
  if (n >= 3) return "High";
  if (n >= 2) return "Medium";
  return "Low";
}

function monthsFromRunway(runway?: string): number | null {
  if (!runway) return null;
  const m = runway.match(/(\d+(?:\.\d+)?)\s*(?:months?|mo)/i);
  if (m) return Number(m[1]);
  const y = runway.match(/(\d+(?:\.\d+)?)\s*(?:years?|yr)/i);
  if (y) return Number(y[1]) * 12;
  return null;
}

const scoreRisksTool: VccaTool = {
  name: "score_risks",
  description:
    "Recompute the VCCA risk scores for a project and write them to .vcca/risks.yaml. Returns the updated risk matrix and the highest remaining risk.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project directory."),
  }),
  outputSchema: z.object({
    risks: z.any(),
    highest_risk_category: z.string(),
    highest_risk_score: z.enum(["Low", "Medium", "High", "Critical"]),
    recommendation: z.string(),
  }),
  async execute({ project_path }) {
    const [project, existingRisks, repo] = await Promise.all([
      loadProject(project_path),
      loadRisks(project_path),
      analyzeRepo(project_path).catch(() => undefined),
    ]);

    const risks: Risks = { ...(existingRisks || defaultRisks()) };
    const p: Project = project || {};
    const currentUsers = Number(p.current_users) || 0;
    const payingUsers = Number(p.paying_users) || 0;
    const stage = (p.stage || "Idea").toLowerCase();
    const deployment = (p.deployment_status || "").toLowerCase();
    const teamSize = Number(p.team_size) || 0;
    const runway = monthsFromRunway(p.runway);
    const hasStack =
      (p.technical_stack || []).length > 0 ||
      (repo?.dependencies?.length || 0) > 0 ||
      (repo?.architecture_notes?.length || 0) > 0 ||
      Boolean(repo?.language);
    const hasHosting = Boolean(p.hosting);
    const hasBusinessModel = Boolean(p.business_model);
    const hasPricing = Boolean(p.pricing);
    const hasDistribution = Boolean(p.distribution);

    // Business
    risks.Business = {
      score: payingUsers > 0 ? "Low" : hasPricing && hasBusinessModel ? "Medium" : hasBusinessModel ? "High" : "Critical",
      notes: payingUsers > 0 ? "Paying users exist." : hasBusinessModel ? "Need pricing and first paying users." : "No business model defined.",
    };

    // Validation
    if (payingUsers > 0) {
      risks.Validation = { score: "Low", notes: "Paying users validate demand." };
    } else if (currentUsers > 0) {
      risks.Validation = { score: "Medium", notes: "Users exist but no paying customers yet." };
    } else if (["growth", "pmf signals", "retention", "first paying user"].some((s) => stage.includes(s))) {
      risks.Validation = { score: "High", notes: "Late stage but no users; validate demand." };
    } else {
      risks.Validation = { score: "Critical", notes: "No customer validation yet." };
    }

    // Architecture
    if (!hasStack) {
      risks.Architecture = { score: "Critical", notes: "No technical stack chosen." };
    } else if (!hasHosting && !deployment.includes("production")) {
      risks.Architecture = { score: "High", notes: "Stack chosen but hosting/deployment unclear." };
    } else if (deployment.includes("production")) {
      risks.Architecture = { score: repo ? (repo.has_auth ? "Low" : "Medium") : "Low", notes: "Production deployment detected." };
    } else {
      risks.Architecture = { score: "Medium", notes: "Architecture set but not deployed." };
    }

    // Security
    if (repo) {
      if (repo.has_auth && repo.has_rate_limiting && repo.has_error_reporting) {
        risks.Security = { score: "Low", notes: "Auth, rate limiting, and error reporting detected." };
      } else if (repo.has_auth) {
        risks.Security = { score: "Medium", notes: "Auth present; add rate limiting and error reporting." };
      } else if (deployment.includes("production") || currentUsers > 0) {
        risks.Security = { score: "Critical", notes: "Production/users exist without detected auth." };
      } else {
        risks.Security = { score: "High", notes: "No auth mechanism detected." };
      }
    } else {
      risks.Security = { score: "High", notes: "Could not analyze repository for security signals." };
    }

    // Deployment
    if (deployment.includes("production")) {
      risks.Deployment = { score: repo ? (repo.has_ci_cd && repo.has_docker ? "Low" : "Medium") : "Medium", notes: "Production; verify CI/CD and rollback." };
    } else if (deployment.includes("staging")) {
      risks.Deployment = { score: "Medium", notes: "Staging; plan production cutover." };
    } else if (repo?.has_ci_cd) {
      risks.Deployment = { score: "High", notes: "CI/CD exists but not deployed." };
    } else {
      risks.Deployment = { score: "Critical", notes: "No deployment or CI/CD detected." };
    }

    // Legal
    if (repo?.has_privacy_policy && repo.has_terms) {
      risks.Legal = { score: "Low", notes: "Privacy policy and terms present." };
    } else if (payingUsers > 0 || currentUsers > 100) {
      risks.Legal = { score: "High", notes: "Users exist; add privacy policy and terms." };
    } else if (currentUsers > 0) {
      risks.Legal = { score: "Medium", notes: "Small user base; add legal pages before scaling." };
    } else {
      risks.Legal = { score: "High", notes: "No legal pages; add before public launch." };
    }

    // Distribution
    if (payingUsers > 0) {
      risks.Distribution = { score: "Low", notes: "Paying customers prove distribution works." };
    } else if (currentUsers > 0 && hasDistribution) {
      risks.Distribution = { score: "Medium", notes: "Users and channel identified; optimize." };
    } else if (hasDistribution) {
      risks.Distribution = { score: "High", notes: "Channel chosen but no users yet." };
    } else if (stage.includes("growth") || stage.includes("pmf")) {
      risks.Distribution = { score: "Critical", notes: "Late stage with no distribution." };
    } else {
      risks.Distribution = { score: "High", notes: "No distribution plan." };
    }

    // Fundraising
    if (runway !== null) {
      if (runway < 3) {
        risks.Fundraising = { score: "Critical", notes: "Less than 3 months runway." };
      } else if (runway < 6) {
        risks.Fundraising = { score: "High", notes: "Less than 6 months runway." };
      } else if (runway < 12) {
        risks.Fundraising = { score: "Medium", notes: "Runway under 12 months; monitor." };
      } else {
        risks.Fundraising = { score: "Low", notes: "Healthy runway." };
      }
    } else {
      risks.Fundraising = { score: "High", notes: "Runway unknown." };
    }

    // Operations
    if (deployment.includes("production")) {
      risks.Operations = { score: teamSize > 2 ? "Low" : teamSize > 1 ? "Medium" : "Critical", notes: "Production requires on-call coverage." };
    } else {
      risks.Operations = { score: teamSize > 1 ? "Low" : "Medium", notes: "Small team; prepare ops before launch." };
    }

    await writeRisks(project_path, risks);

    let highest = "" as keyof Risks | "";
    let highestScore = -1;
    for (const cat of RISK_CATEGORIES) {
      const s = scoreToNum(risks[cat].score);
      if (s > highestScore) {
        highestScore = s;
        highest = cat;
      }
    }

    const recommendation = `The highest remaining risk is ${highest} at ${SCORE_ORDER[highestScore - 1]}. Focus the next action on reducing it.`;

    return sanitizeOutput({
      risks,
      highest_risk_category: highest,
      highest_risk_score: SCORE_ORDER[highestScore - 1],
      recommendation,
    });
  },
};

// =============================================================================
// track_milestone
// =============================================================================

const VALID_MILESTONES_LIST = MILESTONES.join(", ");

const trackMilestoneTool: VccaTool = {
  name: "track_milestone",
  description:
    "Get or update the current milestone for a project. Setting a later milestone automatically marks all earlier milestones as completed.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project directory."),
    current: z
      .string()
      .optional()
      .describe(`Milestone to set as current. Valid values: ${VALID_MILESTONES_LIST}.`),
    mark_complete: z
      .array(z.string())
      .optional()
      .describe(`Additional milestones to mark complete. Valid values: ${VALID_MILESTONES_LIST}.`),
  }),
  outputSchema: z.object({
    current: z.string(),
    completed: z.array(z.string()),
    previous: z.string().optional(),
    warning: z.string().optional(),
    valid_milestones: z.array(z.string()).optional(),
  }),
  async execute({ project_path, current, mark_complete }) {
    const existing = (await loadMilestones(project_path)) || defaultMilestones();
    const previous = existing.current;
    const warnings: string[] = [];

    if (current) {
      if (MILESTONES.includes(current as Milestone)) {
        const targetIndex = MILESTONES.indexOf(current as Milestone);
        existing.current = current as Milestone;
        for (let i = 0; i < targetIndex; i++) {
          if (!existing.completed.includes(MILESTONES[i])) {
            existing.completed.push(MILESTONES[i]);
          }
        }
      } else {
        warnings.push(`"${current}" is not a recognized milestone.`);
      }
    }

    if (mark_complete) {
      const skipped: string[] = [];
      for (const m of mark_complete as Milestone[]) {
        if (MILESTONES.includes(m) && !existing.completed.includes(m)) {
          existing.completed.push(m);
        } else if (!MILESTONES.includes(m)) {
          skipped.push(m);
        }
      }
      if (skipped.length) warnings.push(`Skipped unrecognized milestone(s): ${skipped.join(", ")}.`);
    }

    await writeMilestones(project_path, existing);

    return sanitizeOutput({
      current: existing.current,
      completed: existing.completed,
      previous: previous !== existing.current ? previous : undefined,
      warning: warnings.length ? warnings.join(" ") : undefined,
      valid_milestones: warnings.length ? [...MILESTONES] : undefined,
    });
  },
};

// =============================================================================
// decision_framework
// =============================================================================

const LEVELS = ["low", "medium", "high", "critical"] as const;
const LEVEL_VALUES = { low: 1, medium: 2, high: 3, critical: 4 };
const TIME_VALUES = { hours: 1, days: 2, weeks: 3, months: 4 };

const decisionFrameworkTool: VccaTool = {
  name: "decision_framework",
  description:
    "Evaluate a major request through the VCCA decision framework. If a project path is provided, the recommendation is logged to .vcca/decisions.md.",
  inputSchema: z.object({
    project_path: z.string().optional().describe("Path to the project directory. Optional; if omitted the recommendation is returned without logging."),
    request: z.string().min(1).describe("The request or proposal being evaluated."),
    business_impact: z.enum(LEVELS).describe("Business impact: low, medium, high, critical."),
    technical_impact: z.enum(LEVELS).describe("Technical impact: low, medium, high, critical."),
    complexity: z.enum(LEVELS).describe("Implementation complexity: low, medium, high, critical."),
    risk: z.enum(LEVELS).describe("Risk if it goes wrong: low, medium, high, critical."),
    time: z.enum(["hours", "days", "weeks", "months"]).describe("Estimated time to deliver."),
    alternatives: z.string().min(1).describe("What else could we do instead?"),
  }),
  outputSchema: z.object({
    recommendation: z.string(),
    rationale: z.string(),
    proceed: z.enum(["yes", "spike", "no"]),
    logged: z.boolean().optional(),
  }),
  async execute(input: any) {
    const {
      project_path,
      request,
      business_impact,
      technical_impact,
      complexity,
      risk,
      time,
      alternatives,
    } = input as {
      project_path?: string;
      request: string;
      business_impact: keyof typeof LEVEL_VALUES;
      technical_impact: keyof typeof LEVEL_VALUES;
      complexity: keyof typeof LEVEL_VALUES;
      risk: keyof typeof LEVEL_VALUES;
      time: keyof typeof TIME_VALUES;
      alternatives: string;
    };
    const impact = LEVEL_VALUES[business_impact] + LEVEL_VALUES[technical_impact];
    const cost = LEVEL_VALUES[complexity] + LEVEL_VALUES[risk] + TIME_VALUES[time];

    let proceed: "yes" | "spike" | "no";
    let recommendation: string;

    if (risk === "critical" && business_impact !== "critical") {
      proceed = "no";
      recommendation = "Do not proceed. De-risk the critical item first, then re-evaluate.";
    } else if (business_impact === "critical" && (complexity === "high" || risk === "high" || time === "months")) {
      proceed = "spike";
      recommendation = "Run a time-boxed spike (hours to days) to reduce complexity and risk before committing.";
    } else if (impact >= 6 && cost <= 7) {
      proceed = "yes";
      recommendation = "Proceed. Impact is high and the cost/risk is acceptable.";
    } else if (impact >= 5 && cost <= 8) {
      proceed = "yes";
      recommendation = "Proceed with the smallest version that validates the assumption.";
    } else if (impact >= 4 && cost <= 9) {
      proceed = "spike";
      recommendation = "Spike first. The idea is worth validating, but the cost or risk is too high to commit yet.";
    } else {
      proceed = "no";
      recommendation = "Defer. The impact does not justify the cost, time, or risk given the current stage.";
    }

    const rationale = [
      `Business impact: ${business_impact}; technical impact: ${technical_impact}.`,
      `Complexity: ${complexity}; risk: ${risk}; time: ${time}.`,
      `Alternatives: ${alternatives}.`,
      `Proceed recommendation: ${proceed}.`,
    ].join(" ");

    const logged = Boolean(project_path);
    if (project_path) {
      await appendDecision(project_path, request, recommendation, rationale);
    }

    return sanitizeOutput({ recommendation, rationale, proceed, logged });
  },
};

// =============================================================================
// production_readiness
// =============================================================================

const CHECKS = [
  "Authentication",
  "Authorization",
  "HTTPS",
  "Secrets management",
  "Logging",
  "Monitoring",
  "Error reporting",
  "Rate limiting",
  "Health endpoints",
  "Backups",
  "Rollback strategy",
  "Database migrations",
  "Analytics",
  "Privacy policy",
  "Terms of service",
  "CI/CD",
  "Feature flags",
  "Disaster recovery",
] as const;

function statusFor(summary: Awaited<ReturnType<typeof analyzeRepo>>, check: string): "pass" | "fail" | "unknown" {
  switch (check) {
    case "Authentication":
      return summary.has_auth ? "pass" : "fail";
    case "Authorization":
      return summary.has_auth ? "pass" : "fail";
    case "HTTPS":
      return summary.has_https_setup ? "pass" : "unknown";
    case "Secrets management":
      return "unknown";
    case "Logging":
      return summary.has_logging ? "pass" : "fail";
    case "Monitoring":
      return summary.has_monitoring ? "pass" : "fail";
    case "Error reporting":
      return summary.has_error_reporting ? "pass" : "fail";
    case "Rate limiting":
      return summary.has_rate_limiting ? "pass" : "fail";
    case "Health endpoints":
      return summary.has_health_endpoint ? "pass" : "fail";
    case "Backups":
      return "unknown";
    case "Rollback strategy":
      return summary.has_ci_cd ? "pass" : "fail";
    case "Database migrations":
      return summary.has_migrations ? "pass" : "fail";
    case "Analytics":
      return summary.has_analytics ? "pass" : "fail";
    case "Privacy policy":
      return summary.has_privacy_policy ? "pass" : "fail";
    case "Terms of service":
      return summary.has_terms ? "pass" : "fail";
    case "CI/CD":
      return summary.has_ci_cd ? "pass" : "fail";
    case "Feature flags":
      return summary.has_feature_flags ? "pass" : "unknown";
    case "Disaster recovery":
      return summary.has_docker && summary.has_ci_cd ? "pass" : "unknown";
    default:
      return "unknown";
  }
}

const productionReadinessTool: VccaTool = {
  name: "production_readiness",
  description:
    "Run a production readiness review on the repository. Returns a per-item checklist, an overall 0-100% score, and the blockers.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project repository."),
  }),
  outputSchema: z.object({
    score: z.number().int().min(0).max(100),
    items: z.array(z.object({ item: z.string(), status: z.enum(["pass", "fail", "unknown"]) })),
    blockers: z.array(z.string()),
    warnings: z.array(z.string()).optional(),
    summary: z.string(),
  }),
  async execute({ project_path }) {
    const summary = await analyzeRepo(project_path);
    const items = CHECKS.map((check) => ({ item: check, status: statusFor(summary, check) }));
    const pass = items.filter((i) => i.status === "pass").length;
    const fail = items.filter((i) => i.status === "fail").length;
    const unknown = items.filter((i) => i.status === "unknown").length;
    const total = items.length;
    const score = Math.round((pass / total) * 100);
    const blockers = items.filter((i) => i.status === "fail").map((i) => i.item);
    const warnings = items.filter((i) => i.status === "unknown").map((i) => i.item);

    return sanitizeOutput({
      score,
      items,
      blockers,
      warnings,
      summary: `Readiness score: ${score}% (${pass} pass, ${fail} fail, ${unknown} unknown out of ${total}). Top blockers: ${blockers.slice(0, 5).join(", ") || "none"}.${warnings.length ? ` Watch: ${warnings.slice(0, 3).join(", ")}.` : ""}`,
    });
  },
};

// =============================================================================
// simulate_incident
// =============================================================================

const SCENARIOS = [
  { area: "database", title: "Database unavailable", question: "What happens to user-facing requests when the database is down? Do you have a graceful failure mode and a retry policy?" },
  { area: "webhooks", title: "Webhook duplicated", question: "A payment provider sends the same webhook twice in quick succession. How does your system keep the charge from being processed twice?" },
  { area: "api", title: "API rate limit exceeded", question: "A third-party API you depend on returns 429 for 10 minutes. How does your app behave?" },
  { area: "cache", title: "Redis offline", question: "Your cache disappears. Do you fall back to the database, and can you handle the load?" },
  { area: "files", title: "User uploads huge file", question: "A user uploads a 2 GB file. Do you have size limits, streaming, and storage quotas?" },
  { area: "auth", title: "Expired JWT", question: "A user's JWT expires mid-session. How do they refresh without losing work?" },
  { area: "infra", title: "Clock drift", question: "Two servers disagree on the current time. How does this affect tokens, caching, or idempotency?" },
  { area: "infra", title: "Disk full", question: "The server disk fills up. What alerts fire, and what fails first?" },
  { area: "network", title: "Third-party API down", question: "A critical API you integrate with is down for an hour. Do you queue work, fail gracefully, or show errors?" },
  { area: "deploy", title: "Bad deployment", question: "A deploy introduces a bug that corrupts new data. How quickly can you roll back and recover?" },
  { area: "queue", title: "Queue backlog", question: "Your job queue grows 100x due to a traffic spike. Do workers autoscale? Do jobs time out?" },
  { area: "security", title: "Secret leak", question: "An API key is accidentally committed. What is your revocation and rotation process?" },
];

const simulateIncidentTool: VccaTool = {
  name: "simulate_incident",
  description:
    "Generate a realistic failure scenario for the user’s project. Use after major features to test resilience and teach incident response.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project."),
    area: z
      .enum(["database", "webhooks", "api", "cache", "files", "auth", "infra", "network", "deploy", "queue", "security", "random"])
      .optional(),
  }),
  outputSchema: z.object({
    title: z.string(),
    question: z.string(),
    area: z.string(),
    mitigation_prompt: z.string(),
  }),
  async execute({ project_path, area }) {
    const pool = area && area !== "random" ? SCENARIOS.filter((s) => s.area === area) : SCENARIOS;
    const scenario = pool[Math.floor(Math.random() * pool.length)];
    const mitigation = `Given the project at ${project_path}, walk me through: 1) how the system would behave, 2) what the user sees, 3) what monitoring would catch it, and 4) the first three steps to recover.`;
    return sanitizeOutput({ ...scenario, mitigation_prompt: mitigation });
  },
};

// =============================================================================
// weekly_review
// =============================================================================

const MILESTONE_ACTION: Record<Milestone, string> = {
  Idea: "Write a one-sentence goal and the riskiest assumption you need to validate.",
  "Customer Interviews": `Run 5 customer interviews with ${"your target customer"} to validate the problem and willingness to use/pay.`,
  "Landing Page": "Create a simple landing page that describes the problem, solution, and how to try it.",
  "First Email List": "Launch the landing page and collect the first 50 signups from your target customer.",
  MVP: "Build the smallest end-to-end version that solves one validated problem.",
  "First Users": "Onboard 5 active users and watch them complete the core flow.",
  "First Paying User": "Ask 3 engaged users to pay and process the first transaction.",
  Retention: "Measure week-over-week retention and identify the biggest drop-off point.",
  "PMF Signals": "Track referrals, organic growth, and retention to confirm product-market fit.",
  Growth: "Double down on the distribution channel that is working and automate operations.",
};

const RISK_ACTION: Record<keyof Risks, string> = {
  Business: "Write down your business model, pricing, and the first 3 ways you'll make money.",
  Validation: "Talk to 5 potential customers this week and confirm they'll use and pay for this.",
  Architecture: "Pick the smallest stack that works and document the key technical choices.",
  Security: "Add auth and rate limiting before collecting sensitive data or going public.",
  Deployment: "Set up CI/CD and one-command deploys before adding more features.",
  Legal: "Add a privacy policy and terms of service before collecting user data.",
  Distribution: "Choose one channel and get the first 100 people to see your product.",
  Fundraising: "Track runway and decide whether you need to raise money or get revenue first.",
  Operations: "Document the on-call rotation and rollback plan before scaling.",
};

const weeklyReviewTool: VccaTool = {
  name: "weekly_review",
  description:
    "Generate a weekly review for the project. Loads state, repository signals, and recent journal/decision logs.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project directory."),
  }),
  outputSchema: z.object({
    completed_work: z.array(z.string()),
    current_milestone: z.string(),
    current_risks: z.array(z.string()),
    suggested_priorities: z.array(z.string()),
    things_not_to_build: z.array(z.string()),
    highest_leverage_next_action: z.string(),
    summary: z.string(),
  }),
  async execute({ project_path }) {
    const [project, risks, milestones, repo] = await Promise.all([
      loadProject(project_path),
      loadRisks(project_path),
      loadMilestones(project_path),
      analyzeRepo(project_path).catch(() => undefined),
    ]);

    const completedWork: string[] = [];
    try {
      const journal = await fs.readFile(`${project_path}/.vcca/journal.md`, "utf-8").catch(() => "");
      const entries = journal.split(/^## /m).filter(Boolean);
      for (const entry of entries.slice(-3)) {
        const firstLine = entry.split("\n")[0]?.trim() || "";
        completedWork.push(firstLine);
      }
    } catch {
      // ignore
    }

    if (!completedWork.length) {
      completedWork.push("No journal entries found this week.");
    }

    const currentRisks = risks
      ? Object.entries(risks)
          .sort((a, b) => {
            const order = { Critical: 4, High: 3, Medium: 2, Low: 1 };
            return (order[b[1].score as keyof typeof order] || 0) - (order[a[1].score as keyof typeof order] || 0);
          })
          .slice(0, 3)
          .map(([cat, item]) => `${cat}: ${item.score} — ${item.notes}`)
      : ["No risk scores found. Run score_risks."];

    const p = project || ({} as Project);
    const r = risks || ({} as Risks);
    const m = milestones || { current: "Idea", completed: [] };
    const milestone = m.current as Milestone;
    const topRisk = (currentRisks[0]?.split(":")[0] as keyof Risks) || "";

    // Personalize the milestone action with the actual target customer if available.
    let milestoneAction = MILESTONE_ACTION[milestone] ?? "Continue validating with customers and move the current milestone forward.";
    if (milestone === "Customer Interviews" && p.target_customer) {
      milestoneAction = `Run 5 customer interviews with ${p.target_customer} to validate the problem and willingness to use/pay.`;
    }

    const suggested: string[] = [];

    // If the top risk is a technical/legal/ops risk, surface the de-risking action first.
    if (topRisk && topRisk !== "Validation" && topRisk !== "Business" && RISK_ACTION[topRisk]) {
      suggested.push(RISK_ACTION[topRisk]);
    }

    suggested.push(milestoneAction);

    // Fill missing core business/validation fields.
    if (!p.current_goal) suggested.push("Set a single current goal in project.yaml.");
    if (!p.target_customer) suggested.push("Define the target customer and run 5 interviews.");
    if (!p.business_model) suggested.push("Choose a business model and pricing hypothesis.");

    // Technical hygiene only matters once the product is being built or used.
    const technicalMilestones: Milestone[] = ["MVP", "First Users", "First Paying User", "Retention", "PMF Signals", "Growth"];
    const technicalRisks: (keyof Risks)[] = ["Architecture", "Security", "Deployment", "Operations"];
    if (technicalMilestones.includes(milestone) || technicalRisks.includes(topRisk)) {
      if (!repo?.has_ci_cd) suggested.push("Set up CI/CD so every merge is deployable.");
      if (!repo?.has_tests) suggested.push("Add one end-to-end or unit test for the core flow.");
      if (!repo?.has_auth && (p.current_users || 0) > 0) suggested.push("Add auth before collecting user data.");
    }

    const notToBuild: string[] = [];
    if (!p.current_users || p.current_users === 0) {
      notToBuild.push("Scaling infrastructure beyond one server/database.");
      notToBuild.push("Advanced admin dashboards.");
      notToBuild.push("Multi-tenant enterprise features.");
    }
    if (!p.paying_users || p.paying_users === 0) {
      notToBuild.push("Complex pricing or billing until first paying user.");
      notToBuild.push("Partnership or reseller features.");
    }
    if (!suggested.length) {
      suggested.push("Continue validating with customers and move the current milestone forward.");
    }

    const highest = suggested[0];

    return sanitizeOutput({
      completed_work: completedWork,
      current_milestone: m.current,
      current_risks: currentRisks,
      suggested_priorities: suggested,
      things_not_to_build: notToBuild,
      highest_leverage_next_action: highest,
      summary: `Current milestone: ${m.current}. Top risk: ${currentRisks[0] || "unknown"}. Highest-leverage next action: ${highest}.`,
    });
  },
};

// =============================================================================
// teach_concept
// =============================================================================

const LESSONS: Record<string, { question: string; explanation: string; apply: string }> = {
  idempotency: {
    question: "What happens if Stripe sends the same webhook twice?",
    explanation:
      "Idempotency means the same operation can run multiple times without changing the result. Use an idempotency key from the provider and record processed keys so the second request is a no-op.",
    apply: "Find every webhook handler and add an idempotency key check before changing state.",
  },
  "rate-limiting": {
    question: "What happens if a user tries a thousand passwords?",
    explanation:
      "Rate limiting caps how often a caller can use an endpoint. It protects you from brute force, scraping, and accidental abuse. Apply it to logins, public APIs, and expensive endpoints.",
    apply: "Add rate limiting to authentication and any public API that triggers writes.",
  },
  "health-checks": {
    question: "How does a load balancer know your app is alive?",
    explanation:
      "A health endpoint tells the load balancer or orchestrator whether the app can serve traffic. It should test the app and its critical dependencies, not just return 200.",
    apply: "Create a /health endpoint that checks the database or cache, and wire it into your deploy target.",
  },
  "feature-flags": {
    question: "What if a new feature breaks in production?",
    explanation:
      "Feature flags let you ship code without exposing it, and turn it off instantly if something breaks. They separate deploy from release.",
    apply: "Wrap the next risky feature in a flag so you can disable it without redeploying.",
  },
  rollback: {
    question: "What if the last deploy corrupts data?",
    explanation:
      "A rollback strategy lets you revert to the last known good version quickly. It pairs with backward-compatible migrations and feature flags.",
    apply: "Make the last deploy one command away from a rollback, and test it before you need it.",
  },
  validation: {
    question: "How do you know people want this before you build it?",
    explanation:
      "Customer validation means testing demand with smoke tests, waitlists, or paid pre-orders before writing production code. It reduces the risk of building something no one buys.",
    apply: "Create the smallest test—landing page, waitlist, or pre-order—that validates the riskiest assumption.",
  },
  caching: {
    question: "What if every request hits the database?",
    explanation:
      "Caching stores frequently used data closer to where it is needed, so you can serve it faster and reduce load on expensive resources. It only helps when the cost of a cache miss is lower than the cost of fetching fresh data.",
    apply: "Cache the most-read, slow-to-fetch data and set an explicit invalidation strategy.",
  },
  queues: {
    question: "What if a user has to wait while you send 10,000 emails?",
    explanation:
      "A queue lets you hand work off to be processed later. It separates the work a user triggers from the time it takes to finish it, and it smooths out traffic spikes.",
    apply: "Move any slow, retryable, or bulk work into a queue and process it in the background.",
  },
  webhooks: {
    question: "How do you react to events that happen in another system?",
    explanation:
      "Webhooks are HTTP callbacks that another service calls when something happens. They push events to you instead of you polling for them. Because the internet is unreliable, you must handle duplicates, delays, and failures.",
    apply: "Verify webhook signatures, make handlers idempotent, and return 2xx quickly.",
  },
  "database-indexing": {
    question: "Why is this query getting slower as the table grows?",
    explanation:
      "A database index is a lookup structure that lets the database find rows without scanning the whole table. Indexes speed up reads and specific kinds of filters, but they slow down writes and take up space.",
    apply: "Index the columns you query by most often, especially in WHERE, JOIN, and ORDER BY clauses.",
  },
  "load-balancing": {
    question: "What if one server gets all the traffic?",
    explanation:
      "Load balancing spreads traffic across multiple servers so no single machine becomes a bottleneck. It also gives you a place to check health and remove failing instances.",
    apply: "Put a load balancer in front of your app and add health checks so unhealthy instances stop receiving traffic.",
  },
  "secrets-management": {
    question: "What if your API key is in a public GitHub repo?",
    explanation:
      "Secrets management means keeping credentials out of source code and injecting them at runtime from a trusted source. It includes rotation, access control, and audit logs.",
    apply: "Move secrets to environment variables or a secret manager, rotate any exposed keys, and audit who has access.",
  },
  oauth: {
    question: "Why does 'Sign in with Google' exist?",
    explanation:
      "OAuth is a protocol that lets users authorize your app to access their account on another service without giving you their password. It delegates authentication and lets users revoke access.",
    apply: "Use a managed OAuth provider or library instead of building the flow yourself, and never store the provider's password.",
  },
  "api-design": {
    question: "How do you design an API that is easy to use and hard to misuse?",
    explanation:
      "Good API design is about clear naming, consistent conventions, predictable errors, and versioning. It reduces integration time and support burden.",
    apply: "Define resource names and error shapes, use plural nouns for collections, and version from day one.",
  },
  "cron-jobs": {
    question: "What if you need to do something every night?",
    explanation:
      "A cron job is a scheduled task that runs at fixed times. It is useful for reports, cleanup, and batch work, but it can fail silently and is hard to debug.",
    apply: "Add a heartbeat or log for each run, and make jobs idempotent in case they overlap or rerun.",
  },
  "ci-cd": {
    question: "How do you stop broken code from reaching users?",
    explanation:
      "CI/CD is the practice of automatically building, testing, and deploying code. Continuous Integration catches errors before they merge; Continuous Delivery gets fixes to users quickly.",
    apply: "Set up a pipeline that runs tests on every pull request and deploys automatically from main.",
  },
  observability: {
    question: "How do you debug a problem you cannot see?",
    explanation:
      "Observability is the combination of metrics, logs, and traces that explain what your system is doing. It lets you ask new questions without shipping new code.",
    apply: "Add structured logs, one or two key metrics, and a way to trace a request through your services.",
  },
  "monolith-vs-microservices": {
    question: "Should you start with one big app or many small services?",
    explanation:
      "A monolith is one codebase and one deploy. Microservices split a system into independently deployable services. Microservices add operational overhead that is only worth it when a team is large or modules need different scaling.",
    apply: "Start with a monolith. Split a service out only when one team or module is clearly held back by the shared deploy.",
  },
  "database-migrations": {
    question: "How do you change the database without breaking the app?",
    explanation:
      "Database migrations are versioned scripts that apply schema changes. Backward-compatible migrations let old code keep running while new code is deployed.",
    apply: "Add a migration tool, run migrations before code deploys, and avoid destructive changes in the same deploy as code that uses them.",
  },
  "connection-pooling": {
    question: "Why is your database running out of connections?",
    explanation:
      "Connection pooling reuses database connections instead of opening a new one for every request. It reduces overhead and prevents the database from being overwhelmed.",
    apply: "Use a connection pool in your database driver and size it to your worker count.",
  },
  "testing-pyramid": {
    question: "How many unit tests versus end-to-end tests should you write?",
    explanation:
      "The testing pyramid says write many fast, isolated unit tests, fewer integration tests, and very few slow end-to-end tests. This gives you confidence without slow, flaky suites.",
    apply: "Write unit tests for business logic, integration tests for database and API boundaries, and end-to-end tests for the critical user path.",
  },
  "state-management": {
    question: "Where does the truth live?",
    explanation:
      "State management is the discipline of deciding where data is stored, who can change it, and how changes flow through your system. Single sources of truth reduce bugs.",
    apply: "Pick one source of truth for each entity, make state changes explicit, and avoid duplicating state that can get out of sync.",
  },
  "authentication-vs-authorization": {
    question: "Who are you, and what are you allowed to do?",
    explanation:
      "Authentication is verifying identity. Authorization is deciding what that identity is allowed to do. Mixing them leads to security holes.",
    apply: "Separate login/authentication from permissions/authorization, and check both on every sensitive action.",
  },
  "north-star-metric": {
    question: "What is the one number that tells you the product is working?",
    explanation:
      "A north-star metric is the single outcome that captures the core value your product delivers. It aligns the team around what matters most.",
    apply: "Define one north-star metric and a small set of input metrics that drive it.",
  },
  "activation": {
    question: "When does a new user first feel value?",
    explanation:
      "Activation is the moment a user experiences the product's core value. Users who activate are far more likely to retain.",
    apply: "Identify the minimum actions a new user must take to activate and optimize your onboarding for that moment.",
  },
  retention: {
    question: "Why do users come back?",
    explanation:
      "Retention measures how many users return over time. It is one of the best signals of product-market fit and sustainable growth.",
    apply: "Track cohort retention, find the drop-off point, and improve the experience around the first few uses.",
  },
  "smoke-test": {
    question: "Can you sell it before you build it?",
    explanation:
      "A smoke test is a lightweight experiment that checks if demand exists before you build. It can be a landing page, waitlist, or pre-order.",
    apply: "Create the smallest artifact that proves demand before writing production code.",
  },
  "pivot": {
    question: "What if the idea is not working?",
    explanation:
      "A pivot is a structured change to one part of the business model while keeping the vision. It is not a random restart; it is a hypothesis-driven change.",
    apply: "Pivot when the data shows a better customer, problem, or channel, not because building is hard.",
  },
};

const teachConceptTool: VccaTool = {
  name: "teach_concept",
  description:
    "Prepare a two-minute lesson for a concept. Returns a question, a short explanation, and an immediate application step.",
  inputSchema: z.object({
    concept: z
      .string()
      .min(1)
      .describe(
        "Concept to teach, e.g. idempotency, rate limiting, health checks, caching, queues, webhooks, database indexing, load balancing, OAuth, API design, CI/CD, observability, feature flags, database migrations, testing pyramid, north star metric, activation, retention, smoke test, pivot."
      ),
    apply_to: z.string().optional().describe("Optional project context to tailor the application step."),
  }),
  outputSchema: z.object({
    question: z.string(),
    explanation: z.string(),
    apply: z.string(),
  }),
  async execute({ concept, apply_to }) {
    const normalized = concept.toLowerCase().replace(/\s+/g, "-").trim();
    const lesson = LESSONS[normalized] || {
      question: `What is the most important thing to understand about ${concept}?`,
      explanation: `${concept} is a tool or principle. The key is to use it only when it reduces a real risk, not because it is interesting.`,
      apply: `Find one place in your project where ignoring ${concept} would cause a failure, and fix that first.`,
    };
    const apply = apply_to ? `${lesson.apply} In your case: ${apply_to}.` : lesson.apply;
    return sanitizeOutput({ question: lesson.question, explanation: lesson.explanation, apply });
  },
};

// =============================================================================
// milestone_checklist
// =============================================================================

const MILESTONE_CHECKLISTS: Record<Milestone, string[]> = {
  Idea: [
    "Write a one-sentence description of the problem you want to solve.",
    "Name the specific person or group who has this problem.",
    "Describe how they solve it today, even badly.",
    "List the riskiest assumptions you are making.",
    "Set a single current goal for the next 2 weeks.",
  ],
  "Customer Interviews": [
    "Find 5 people who match your target customer.",
    "Prepare 5 open-ended questions about their problem and current workaround.",
    "Run the interviews and take notes on jobs, pains, and gains.",
    "Synthesize patterns across interviews, not just one quote.",
    "Validate or invalidate each riskiest assumption.",
    "Decide whether to proceed, pivot, or stop.",
  ],
  "Landing Page": [
    "Write a clear value proposition: problem, solution, and outcome.",
    "Design a single page with a headline, proof, and one call to action.",
    "Add a signup, waitlist, or pre-order form.",
    "Set up basic analytics to track visits and conversions.",
    "Share the page with 50 potential customers.",
  ],
  "First Email List": [
    "Launch the landing page with a channel your target customer uses.",
    "Collect the first 50 emails or signups.",
    "Send a welcome email that reinforces the problem and expected solution.",
    "Segment signups by source or motivation.",
    "Identify 5 people willing to do a deeper interview.",
  ],
  MVP: [
    "Define the smallest end-to-end flow that solves one validated problem.",
    "Choose the simplest stack that supports the core flow.",
    "Build the happy path first; defer edge cases.",
    "Add one path for each: create, read, update, delete if needed.",
    "Run the flow with 3 target users before declaring it done.",
    "Collect and prioritize the top 3 pieces of feedback.",
  ],
  "First Users": [
    "Invite 5 target users to try the MVP.",
    "Watch them complete the core flow without coaching.",
    "Measure activation: did they experience the core value?",
    "Fix the top 3 blockers that stop users from activating.",
    "Set up a feedback loop: email, in-app, or interview.",
  ],
  "First Paying User": [
    "Identify 3 users who get the most value from the product.",
    "Ask them to pay before the feature is fully built.",
    "Set up payment processing and invoicing.",
    "Deliver the promised value and collect a testimonial.",
    "Document why they paid and what almost stopped them.",
  ],
  Retention: [
    "Define a cohort retention chart and pick a time period (e.g., 7-day).",
    "Measure where users drop off in their first week.",
    "Interview 5 users who stuck around and 5 who left.",
    "Fix the biggest drop-off point with the smallest change.",
    "Re-measure retention to confirm the improvement.",
  ],
  "PMF Signals": [
    "Track organic referrals and word-of-mouth growth.",
    "Measure retention, usage frequency, and top user actions.",
    "Identify the segment of users that cannot live without the product.",
    "Calculate unit economics: CAC, LTV, payback period.",
    "Double down on the channel and customer that is working.",
  ],
  Growth: [
    "Find the one distribution channel that is already working.",
    "Build a repeatable process for acquiring users through that channel.",
    "Add growth loops: referrals, virality, content, or integrations.",
    "Hire or automate the operational bottlenecks.",
    "Set a monthly growth target and review it weekly.",
  ],
};

const VALID_MILESTONES_LIST_2 = MILESTONES.join(", ");

const milestoneChecklistTool: VccaTool = {
  name: "milestone_checklist",
  description:
    "Get a concrete checklist for a given milestone. If project_path is provided, uses the current milestone; otherwise uses the milestone argument.",
  inputSchema: z.object({
    milestone: z
      .string()
      .optional()
      .describe(`Milestone to get a checklist for. Valid values: ${VALID_MILESTONES_LIST_2}.`),
    project_path: z
      .string()
      .optional()
      .describe("Path to the project directory. Optional; if provided the current milestone is used."),
  }),
  outputSchema: z.object({
    milestone: z.string(),
    checklist: z.array(z.string()),
    focus: z.array(z.string()),
    summary: z.string(),
  }),
  async execute({ milestone, project_path }) {
    let current: Milestone | undefined = milestone as Milestone | undefined;

    if (project_path) {
      try {
        const ms = await loadMilestones(project_path);
        if (ms?.current) current = ms.current;
      } catch {
        // ignore
      }
    }

    if (!current || !MILESTONES.includes(current as Milestone)) {
      current = "Idea";
    }

    const checklist = MILESTONE_CHECKLISTS[current] || [];
    const focus = checklist.slice(0, 3);

    return sanitizeOutput({
      milestone: current,
      checklist,
      focus,
      summary: `Milestone: ${current}. Top 3 focus: ${focus.join("; ")}.`,
    });
  },
};

// =============================================================================
// repo_review
// =============================================================================

const repoReviewTool: VccaTool = {
  name: "repo_review",
  description:
    "Run a periodic repository review for architecture smells, security, technical debt, missing tests, deployment readiness, and open TODOs.",
  inputSchema: z.object({
    project_path: z.string().min(1).describe("Path to the project repository."),
  }),
  outputSchema: z.object({
    architecture: z.array(z.string()),
    security: z.array(z.string()),
    deployment: z.array(z.string()),
    tests: z.array(z.string()),
    debt: z.array(z.string()),
    docs: z.array(z.string()),
    scaling: z.array(z.string()),
    todos: z.array(z.string()),
    top_recommendations: z.array(z.string()),
  }),
  async execute({ project_path }) {
    const summary = await analyzeRepo(project_path);
    const topLevel = summary.top_level;
    const allDeps = [...summary.dependencies, ...(summary.dev_dependencies || [])];

    const architecture: string[] = [...summary.architecture_notes];
    if (topLevel.length > 15) architecture.push("Many top-level files/directories; consider grouping into src/, packages/, or domains.");
    if (allDeps.length === 0) architecture.push("No manifest dependencies detected; verify project setup.");

    const security: string[] = [...summary.security_notes];
    if (!summary.has_error_reporting) {
      security.push("No error reporting service detected. Use Sentry or similar to catch issues before users do.");
    }

    const deployment: string[] = [...summary.deployment_notes];
    if (!summary.has_health_endpoint && summary.has_ci_cd) {
      deployment.push("CI/CD exists but no health endpoint detected. Add /health before going live.");
    }

    const tests: string[] = [];
    if (!summary.has_tests) tests.push("No tests or test directories found. Add unit or e2e tests for the critical path.");
    if (!allDeps.some((d) => /jest|vitest|mocha|pytest|rspec|cypress|playwright/i.test(d))) {
      tests.push("No test runner dependency detected.");
    }

    const debt: string[] = [];
    if (summary.todos.length > 0) debt.push(`${summary.todos.length} open TODOs/FIXMEs. Review, schedule, or close them.`);

    const docs: string[] = [];
    if (!summary.has_readme) docs.push("Missing README. Add what the project does and how to run it.");
    if (!topLevel.some((n) => /CONTRIBUTING|ARCHITECTURE|DEPLOY/i.test(n))) {
      docs.push("Consider ARCHITECTURE.md or DEPLOYMENT.md for team context.");
    }

    const scaling: string[] = [];
    if (allDeps.some((d) => /redis/i.test(d)) && !summary.has_monitoring) {
      scaling.push("Redis present but no monitoring. Track cache hit rate and memory.");
    }
    if (allDeps.some((d) => /postgres|mysql|mongo/i.test(d))) {
      scaling.push("Database in use. Plan connection pooling, indexes, and read replicas before scaling.");
    }
    if (summary.dependencies.includes("sqlite3") && !summary.has_migrations) {
      scaling.push("SQLite is included but there is no migration strategy. Plan how schema changes will be applied.");
    }

    const top = [
      ...security.slice(0, 2),
      ...deployment.slice(0, 2),
      ...tests.slice(0, 1),
      ...debt.slice(0, 1),
      ...docs.slice(0, 1),
    ];

    return sanitizeOutput({
      architecture,
      security,
      deployment,
      tests,
      debt,
      docs,
      scaling,
      todos: summary.todos,
      top_recommendations: top.length ? top : ["No major blockers detected. Keep shipping."],
    });
  },
};

// =============================================================================
// Export record
// =============================================================================

export const vccaTools = {
  analyze_repo: analyzeRepoTool,
  load_state: loadStateTool,
  update_state: updateStateTool,
  score_risks: scoreRisksTool,
  track_milestone: trackMilestoneTool,
  decision_framework: decisionFrameworkTool,
  production_readiness: productionReadinessTool,
  simulate_incident: simulateIncidentTool,
  weekly_review: weeklyReviewTool,
  teach_concept: teachConceptTool,
  milestone_checklist: milestoneChecklistTool,
  repo_review: repoReviewTool,
} as const;

export type VccaToolName = keyof typeof vccaTools;
