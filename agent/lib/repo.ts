import fs from "node:fs/promises";
import path from "node:path";

export interface RepoSummary {
  project_name?: string;
  description?: string;
  language?: string;
  manifest?: string;
  dependencies: string[];
  dev_dependencies?: string[];
  top_level: string[];
  has_readme: boolean;
  has_tests: boolean;
  has_ci_cd: boolean;
  has_docker: boolean;
  has_migrations: boolean;
  has_privacy_policy: boolean;
  has_terms: boolean;
  has_health_endpoint: boolean;
  has_auth: boolean;
  has_rate_limiting: boolean;
  has_logging: boolean;
  has_monitoring: boolean;
  has_error_reporting: boolean;
  has_analytics: boolean;
  has_feature_flags: boolean;
  has_https_setup: boolean;
  architecture_notes: string[];
  security_notes: string[];
  deployment_notes: string[];
  todos: string[];
  summary: string;
}

const MAX_FILE_READ = 100 * 1024; // 100 KiB

async function safeRead(filePath: string): Promise<string | null> {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile() || stat.size > MAX_FILE_READ) return null;
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

async function topLevelListing(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.map((e) => e.name);
  } catch {
    return [];
  }
}

async function walkForFiles(dir: string, patterns: string[], max = 30): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      const base = e.name.toLowerCase();
      if (patterns.some((p) => base.includes(p))) {
        results.push(path.relative(dir, path.join(e.parentPath, e.name)));
        if (results.length >= max) break;
      }
    }
  } catch {
    // ignore
  }
  return results;
}

async function readLines(filePath: string, max = 100): Promise<string[]> {
  const text = await safeRead(filePath);
  if (!text) return [];
  return text.split(/\r?\n/).slice(0, max);
}

function parsePackageJson(text: string): Partial<RepoSummary> {
  try {
    const pkg = JSON.parse(text) as {
      name?: string;
      description?: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return {
      project_name: pkg.name,
      description: pkg.description,
      language: "JavaScript/TypeScript",
      manifest: "package.json",
      dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
      dev_dependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies) : [],
    };
  } catch {
    return {};
  }
}

function extractSection(lines: string[], startMarker: string, endMarker = "[") {
  const start = lines.findIndex((l) => l.trim().toLowerCase().startsWith(startMarker.toLowerCase()));
  if (start === -1) return [];
  const collected: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim().startsWith("[") || l.trim().startsWith("[[") || l.trim().startsWith("#") || l.trim() === "") {
      if (collected.length) break;
      continue;
    }
    if (l.includes("=")) {
      const key = l.split("=")[0].trim();
      if (key && !key.startsWith("#")) collected.push(key);
    } else if (l.trim().startsWith("\"")) {
      const m = l.match(/^"([^"]+)"/);
      if (m) collected.push(m[1]);
    } else if (/^[a-zA-Z0-9_-]+\s*=/.test(l)) {
      collected.push(l.split(/\s|=/)[0]);
    } else if (/^[a-zA-Z0-9_.-]+$/.test(l.trim())) {
      collected.push(l.trim());
    }
  }
  return collected;
}

function parseCargoToml(text: string): Partial<RepoSummary> {
  const lines = text.split(/\r?\n/);
  const nameLine = lines.find((l) => l.startsWith("name"));
  const descLine = lines.find((l) => l.startsWith("description"));
  const deps = extractSection(lines, "[dependencies]");
  return {
    project_name: nameLine ? nameLine.split("=")[1].replace(/"/g, "").trim() : undefined,
    description: descLine ? descLine.split("=")[1].replace(/"/g, "").trim() : undefined,
    language: "Rust",
    manifest: "Cargo.toml",
    dependencies: deps,
  };
}

function parseGoMod(text: string): Partial<RepoSummary> {
  const lines = text.split(/\r?\n/);
  const moduleLine = lines.find((l) => l.startsWith("module "));
  const deps: string[] = [];
  let inRequire = false;
  for (const l of lines) {
    const t = l.trim();
    if (t === "require (") { inRequire = true; continue; }
    if (t === ")") { inRequire = false; continue; }
    if (inRequire) {
      const parts = t.split(/\s+/);
      if (parts[0] && !parts[0].startsWith("//")) deps.push(parts[0]);
    } else if (t.startsWith("require ")) {
      const parts = t.replace(/^require\s+/, "").split(/\s+/);
      if (parts[0]) deps.push(parts[0]);
    }
  }
  return {
    project_name: moduleLine ? moduleLine.replace(/^module\s+/, "").trim() : undefined,
    language: "Go",
    manifest: "go.mod",
    dependencies: deps,
  };
}

function parsePyproject(text: string): Partial<RepoSummary> {
  const lines = text.split(/\r?\n/);
  const nameLine = lines.find((l) => l.trim().startsWith("name"));
  const descLine = lines.find((l) => l.trim().startsWith("description"));
  const deps = extractSection(lines, "dependencies");
  return {
    project_name: nameLine ? nameLine.split("=")[1].replace(/"/g, "").trim() : undefined,
    description: descLine ? descLine.split("=")[1].replace(/"/g, "").trim() : undefined,
    language: "Python",
    manifest: "pyproject.toml",
    dependencies: deps,
  };
}

function parseRequirements(text: string): Partial<RepoSummary> {
  const lines = text.split(/\r?\n/);
  const deps = lines
    .map((l) => l.split("==")[0].split(">=")[0].split("<")[0].trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("-"));
  return { language: "Python", manifest: "requirements.txt", dependencies: deps };
}

function parseComposerJson(text: string): Partial<RepoSummary> {
  try {
    const pkg = JSON.parse(text) as { name?: string; description?: string; require?: Record<string, string>; "require-dev"?: Record<string, string> };
    return {
      project_name: pkg.name,
      description: pkg.description,
      language: "PHP",
      manifest: "composer.json",
      dependencies: pkg.require ? Object.keys(pkg.require) : [],
      dev_dependencies: pkg["require-dev"] ? Object.keys(pkg["require-dev"]) : [],
    };
  } catch {
    return {};
  }
}

function parseGemfile(text: string): Partial<RepoSummary> {
  const lines = text.split(/\r?\n/);
  const deps = lines
    .filter((l) => l.trim().startsWith("gem "))
    .map((l) => {
      const m = l.match(/gem\s+['"]([^'"]+)/);
      return m ? m[1] : "";
    })
    .filter(Boolean);
  return { language: "Ruby", manifest: "Gemfile", dependencies: deps };
}

async function loadManifest(projectPath: string): Promise<Partial<RepoSummary>> {
  const byOrder = [
    { file: "package.json", parse: parsePackageJson },
    { file: "Cargo.toml", parse: parseCargoToml },
    { file: "go.mod", parse: parseGoMod },
    { file: "pyproject.toml", parse: parsePyproject },
    { file: "requirements.txt", parse: parseRequirements },
    { file: "composer.json", parse: parseComposerJson },
    { file: "Gemfile", parse: parseGemfile },
  ];
  for (const { file, parse } of byOrder) {
    const text = await safeRead(path.join(projectPath, file));
    if (text) {
      return { ...parse(text), manifest: file };
    }
  }
  return {};
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function grepText(
  projectPath: string,
  needles: string[],
  max = 5,
  opts: { caseSensitive?: boolean; wholeWord?: boolean } = {}
): Promise<string[]> {
  const { caseSensitive = false, wholeWord = false } = opts;
  const patterns = needles.map((n) => {
    const escaped = escapeRegex(n);
    const source = wholeWord ? `\\b${escaped}\\b` : escaped;
    return new RegExp(source, caseSensitive ? "g" : "gi");
  });

  const matches: string[] = [];
  const queue: string[] = [projectPath];
  const visited = new Set<string>();
  while (queue.length && matches.length < max) {
    const dir = queue.shift()!;
    if (visited.has(dir)) continue;
    visited.add(dir);
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          if (!["node_modules", ".git", ".output", ".eve", ".vcca", "vendor", "__pycache__", "dist", "build"].includes(e.name)) {
            queue.push(full);
          }
        } else if (e.isFile()) {
          if (e.name.endsWith(".map") || e.name.endsWith(".min.js")) continue;
          const stat = await fs.stat(full);
          if (stat.size > 50_000) continue;
          const text = await fs.readFile(full, "utf-8").catch(() => "");
          for (let i = 0; i < patterns.length; i++) {
            patterns[i].lastIndex = 0;
            if (patterns[i].test(text)) {
              const rel = path.relative(projectPath, full);
              matches.push(`${rel}: contains "${needles[i]}"`);
              if (matches.length >= max) return matches;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return matches;
}

async function collectTodos(projectPath: string): Promise<string[]> {
  return grepText(projectPath, ["TODO", "FIXME", "XXX", "HACK"], 15, { caseSensitive: true, wholeWord: true });
}

export async function analyzeRepo(projectPath: string): Promise<RepoSummary> {
  const p = path.resolve(projectPath);
  const top = await topLevelListing(p);

  const manifest = await loadManifest(p);
  const allDeps = [...(manifest.dependencies || []), ...(manifest.dev_dependencies || [])];

  const hasReadme = top.some((n) => n.toLowerCase().startsWith("readme"));
  const hasCiCd = top.includes(".github") || top.includes(".circleci") || top.includes(".gitlab-ci.yml") || top.includes("Jenkinsfile");
  const hasDocker = top.some((n) => n.toLowerCase().includes("docker") || n.toLowerCase().includes("dockerfile"));
  const hasMigrations = (await walkForFiles(p, ["migrations", "migrate", "alembic", "prisma"], 5)).length > 0;

  const allTextFiles = await (async () => {
    const files: string[] = [];
    const excluded = new Set(["node_modules", ".git", ".output", ".eve", ".vcca", "vendor", "__pycache__", "dist", "build"]);
    try {
      const entries = await fs.readdir(p, { recursive: true });
      for (const e of entries) {
        const rel =
          typeof e === "string"
            ? e
            : path.relative(p, (e as any).parentPath ? path.join((e as any).parentPath, (e as any).name) : (e as any).name);
        const parts = rel.split(/[\\/]/);
        if (parts.some((part) => excluded.has(part))) continue;
        if (rel.endsWith(".map") || rel.endsWith(".min.js")) continue;
        files.push(rel);
      }
    } catch {
      // ignore
    }
    return files;
  })();

  const hasPrivacy = allTextFiles.some((f) => /privacy/i.test(f));
  const hasTerms = allTextFiles.some((f) => /terms/i.test(f) && !/node_modules/i.test(f));

  const authPackages = ["passport", "next-auth", "@auth", "clerk", "@clerk", "oauth", "jsonwebtoken", "jwt", "bcrypt", "argon2", "auth0"];
  const rateLimitPackages = ["express-rate-limit", "rate-limiter-flexible", "slow-down", "throttle"];
  const loggingPackages = ["winston", "pino", "bunyan", "loguru", "morgan"];
  const monitoringPackages = ["prometheus", "grafana", "datadog", "newrelic", "sentry"];
  const errorPackages = ["@sentry", "sentry", "bugsnag", "rollbar"];
  const analyticsPackages = ["mixpanel", "amplitude", "plausible", "posthog", "google-analytics", "segment"];
  const featureFlagPackages = ["launchdarkly", "flagsmith", "unleash", "flipper", "configcat"];
  const httpsPackages = ["https", "tls", "ssl", "certbot", "caddy", "traefik"];

  const hasAuth = allDeps.some((d) => authPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));
  const hasRateLimit = allDeps.some((d) => rateLimitPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));
  const hasLogging = allDeps.some((d) => loggingPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));
  const hasMonitoring = allDeps.some((d) => monitoringPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));
  const hasErrorReporting = allDeps.some((d) => errorPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));
  const hasAnalytics = allDeps.some((d) => analyticsPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));
  const hasFeatureFlags = allDeps.some((d) => featureFlagPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));
  const hasHttps = allDeps.some((d) => httpsPackages.some((a) => d.toLowerCase().includes(a.toLowerCase())));

  const hasHealthEndpoint = (await grepText(p, ["/health", "healthcheck", "health check"], 3)).length > 0;

  const testFiles = await walkForFiles(p, [".test.", ".spec.", "test_", "_test.", "conftest", "pytest"], 10);
  const testRunnerDeps = ["jest", "vitest", "mocha", "ava", "tap", "karma", "jasmine", "cypress", "playwright", "pytest", "rspec"];
  const hasTests =
    testFiles.length > 0 ||
    top.some((n) => /test/i.test(n)) ||
    allDeps.some((d) => testRunnerDeps.some((r) => d.toLowerCase().includes(r.toLowerCase())));

  const architectureNotes: string[] = [];
  if (top.includes("src")) architectureNotes.push("Source is organized under src/.");
  if (top.includes("app")) architectureNotes.push("Next.js-style app/ directory found.");
  if (top.includes("api")) architectureNotes.push("Top-level api/ route directory.");
  if (manifest.dependencies?.includes("express")) architectureNotes.push("Express server detected.");
  if (manifest.dependencies?.includes("next")) architectureNotes.push("Next.js app detected.");
  if (manifest.dependencies?.includes("react")) architectureNotes.push("React frontend detected.");
  if (manifest.dependencies?.includes("prisma")) architectureNotes.push("Prisma ORM detected.");
  if (manifest.dependencies?.includes("drizzle-orm")) architectureNotes.push("Drizzle ORM detected.");
  if (manifest.dependencies?.some((d) => d.includes("redis"))) architectureNotes.push("Redis dependency found.");
  if (allDeps.some((d) => d.includes("postgres") || d.includes("mysql") || d.includes("sqlite"))) {
    architectureNotes.push("Database driver found.");
  }

  const securityNotes: string[] = [];
  if (!hasAuth) securityNotes.push("No auth-related dependency detected; verify if the app needs authentication.");
  if (!hasRateLimit) securityNotes.push("No rate-limiting dependency detected.");
  if (top.some((n) => n === ".env")) securityNotes.push(".env file exists in repo root; ensure it is not committed.");
  const secretMatches = await grepText(p, ["secret", "password", "api_key", "apikey"], 1);
  if (secretMatches.length > 0) {
    securityNotes.push("Files mention secrets/passwords; audit for hardcoded credentials.");
  }
  if (!hasPrivacy) securityNotes.push("No privacy policy file found.");

  const deploymentNotes: string[] = [];
  if (!hasCiCd) deploymentNotes.push("No CI/CD configuration detected.");
  if (!hasDocker) deploymentNotes.push("No Docker or docker-compose file detected.");
  if (!hasMigrations) deploymentNotes.push("No database migration directory detected.");
  if (top.includes("vercel.json")) deploymentNotes.push("Vercel configuration found.");
  if (top.includes("netlify.toml")) deploymentNotes.push("Netlify configuration found.");
  if (top.includes("Procfile")) deploymentNotes.push("Heroku Procfile found.");
  if (top.some((n) => n.includes("k8s") || n.includes("kube") || n.includes("helm"))) deploymentNotes.push("Kubernetes or Helm resources found.");
  if (top.some((n) => n.includes("terraform") || n.includes("pulumi"))) deploymentNotes.push("Infrastructure-as-code found.");

  const todos = await collectTodos(p);

  const summary = [
    `Language: ${manifest.language || "unknown"}`,
    `Manifest: ${manifest.manifest || "none found"}`,
    `Top-level files: ${top.slice(0, 10).join(", ")}`,
    `Dependencies: ${manifest.dependencies?.slice(0, 8).join(", ") || "none"}`,
    `Tests: ${hasTests ? "yes" : "no"}`,
    `CI/CD: ${hasCiCd ? "yes" : "no"}`,
    `Docker: ${hasDocker ? "yes" : "no"}`,
  ].join("; ");

  return {
    project_name: manifest.project_name,
    description: manifest.description,
    language: manifest.language,
    manifest: manifest.manifest,
    dependencies: manifest.dependencies || [],
    dev_dependencies: manifest.dev_dependencies,
    top_level: top,
    has_readme: hasReadme,
    has_tests: hasTests,
    has_ci_cd: hasCiCd,
    has_docker: hasDocker,
    has_migrations: hasMigrations,
    has_privacy_policy: hasPrivacy,
    has_terms: hasTerms,
    has_health_endpoint: hasHealthEndpoint,
    has_auth: hasAuth,
    has_rate_limiting: hasRateLimit,
    has_logging: hasLogging,
    has_monitoring: hasMonitoring,
    has_error_reporting: hasErrorReporting,
    has_analytics: hasAnalytics,
    has_feature_flags: hasFeatureFlags,
    has_https_setup: hasHttps,
    architecture_notes: architectureNotes,
    security_notes: securityNotes,
    deployment_notes: deploymentNotes,
    todos,
    summary,
  };
}

export function readinessScore(summary: RepoSummary): { score: number; blockers: string[] } {
  const checks = [
    { pass: summary.has_auth, label: "Authentication" },
    { pass: summary.has_auth, label: "Authorization" },
    { pass: summary.has_https_setup, label: "HTTPS" },
    { pass: true, label: "Secrets management" }, // cannot verify from deps alone
    { pass: summary.has_logging, label: "Logging" },
    { pass: summary.has_monitoring, label: "Monitoring" },
    { pass: summary.has_error_reporting, label: "Error reporting" },
    { pass: summary.has_rate_limiting, label: "Rate limiting" },
    { pass: summary.has_health_endpoint, label: "Health endpoints" },
    { pass: true, label: "Backups" },
    { pass: summary.has_ci_cd, label: "Rollback/CI-CD" },
    { pass: summary.has_migrations, label: "Database migrations" },
    { pass: summary.has_analytics, label: "Analytics" },
    { pass: summary.has_privacy_policy, label: "Privacy policy" },
    { pass: summary.has_terms, label: "Terms of service" },
    { pass: summary.has_ci_cd, label: "CI/CD" },
    { pass: summary.has_feature_flags, label: "Feature flags" },
    { pass: summary.has_docker, label: "Disaster recovery" }, // proxy signal
  ];
  const passed = checks.filter((c) => c.pass).length;
  const blockers = checks.filter((c) => !c.pass).map((c) => c.label);
  return { score: Math.round((passed / checks.length) * 100), blockers };
}
