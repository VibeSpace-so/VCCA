import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export const MILESTONES = [
  "Idea",
  "Customer Interviews",
  "Landing Page",
  "First Email List",
  "MVP",
  "First Users",
  "First Paying User",
  "Retention",
  "PMF Signals",
  "Growth",
] as const;

export type Milestone = (typeof MILESTONES)[number];
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface Project {
  project_name?: string;
  description?: string;
  stage?: string;
  industry?: string;
  problem?: string;
  solution?: string;
  target_customer?: string;
  current_users?: number;
  paying_users?: number;
  business_model?: string;
  pricing?: string;
  distribution?: string;
  competitors?: string[];
  current_goal?: string;
  current_biggest_risk?: string;
  technical_stack?: string[];
  hosting?: string;
  repository?: string;
  deployment_status?: string;
  team_size?: number;
  runway?: string;
  fundraising_stage?: string;
}

export interface RiskItem {
  score: RiskLevel;
  notes: string;
}

export interface Risks {
  Business: RiskItem;
  Validation: RiskItem;
  Architecture: RiskItem;
  Security: RiskItem;
  Deployment: RiskItem;
  Legal: RiskItem;
  Distribution: RiskItem;
  Fundraising: RiskItem;
  Operations: RiskItem;
}

export interface MilestonesState {
  current: Milestone;
  completed: Milestone[];
}

export interface State {
  project: Project;
  risks: Risks;
  milestones: MilestonesState;
}

export const RISK_CATEGORIES: (keyof Risks)[] = [
  "Business",
  "Validation",
  "Architecture",
  "Security",
  "Deployment",
  "Legal",
  "Distribution",
  "Fundraising",
  "Operations",
];

export function defaultRisks(): Risks {
  return RISK_CATEGORIES.reduce((acc, category) => {
    acc[category] = { score: "High", notes: "Initial assumption; needs validation." };
    return acc;
  }, {} as Risks);
}

export function defaultMilestones(): MilestonesState {
  return { current: "Idea", completed: [] };
}

export function getVccaDir(projectPath: string): string {
  return path.resolve(projectPath, ".vcca");
}

export function projectFile(projectPath: string): string {
  return path.join(getVccaDir(projectPath), "project.yaml");
}

export function risksFile(projectPath: string): string {
  return path.join(getVccaDir(projectPath), "risks.yaml");
}

export function milestonesFile(projectPath: string): string {
  return path.join(getVccaDir(projectPath), "milestones.md");
}

export function journalFile(projectPath: string): string {
  return path.join(getVccaDir(projectPath), "journal.md");
}

export function decisionsFile(projectPath: string): string {
  return path.join(getVccaDir(projectPath), "decisions.md");
}

export async function ensureVccaDir(projectPath: string): Promise<void> {
  await fs.mkdir(getVccaDir(projectPath), { recursive: true });
}

export async function readYamlFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return YAML.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function writeYamlFile(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, YAML.stringify(data, { indent: 2 }), "utf-8");
}

export async function loadProject(projectPath: string): Promise<Project | null> {
  return readYamlFile<Project>(projectFile(projectPath));
}

export async function loadRisks(projectPath: string): Promise<Risks | null> {
  return readYamlFile<Risks>(risksFile(projectPath));
}

export async function loadMilestones(projectPath: string): Promise<MilestonesState | null> {
  const file = milestonesFile(projectPath);
  try {
    const raw = await fs.readFile(file, "utf-8");
    const frontmatter = parseFrontmatter<MilestonesState>(raw);
    return frontmatter;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function writeProject(projectPath: string, project: Project): Promise<void> {
  await ensureVccaDir(projectPath);
  await writeYamlFile(projectFile(projectPath), project);
}

export async function writeRisks(projectPath: string, risks: Risks): Promise<void> {
  await ensureVccaDir(projectPath);
  await writeYamlFile(risksFile(projectPath), risks);
}

export async function writeMilestones(projectPath: string, state: MilestonesState): Promise<void> {
  await ensureVccaDir(projectPath);
  const body = MILESTONES.map((m) => `- ${state.completed.includes(m) ? "[x]" : "[ ]"} ${m}${state.current === m ? "  ← current" : ""}`).join("\n");
  const content = `---\n${YAML.stringify(state, { indent: 2 })}---\n\n# Milestones\n\n${body}\n`;
  await fs.writeFile(milestonesFile(projectPath), content, "utf-8");
}

export function parseFrontmatter<T>(raw: string): T | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("---")) return null;
  const end = trimmed.indexOf("---", 3);
  if (end === -1) return null;
  const front = trimmed.slice(3, end).trim();
  if (!front) return null;
  return YAML.parse(front) as T;
}

export async function appendJournal(projectPath: string, entry: string): Promise<void> {
  await ensureVccaDir(projectPath);
  const file = journalFile(projectPath);
  const header = `## ${new Date().toISOString()}\n\n`;
  await fs.appendFile(file, `${header}${entry}\n\n`, "utf-8");
}

export async function appendDecision(
  projectPath: string,
  request: string,
  recommendation: string,
  rationale: string
): Promise<void> {
  await ensureVccaDir(projectPath);
  const file = decisionsFile(projectPath);
  const header = `## ${new Date().toISOString()} — ${request}\n\n`;
  const body = `- **Recommendation:** ${recommendation}\n- **Rationale:** ${rationale}\n\n`;
  await fs.appendFile(file, `${header}${body}`, "utf-8");
}

export function sanitizeOutput(obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "undefined") return null;
    return value;
  }));
}
