import type { RepoSummary } from "./repo.js";
import {
  type Background,
  type ExperienceLevel,
  type KnowledgeEntry,
  type KnowledgeMap,
  type KnowledgeStatus,
  type Milestone,
  type Profile,
  type ReviewIntervals,
  loadKnowledge,
  loadMilestones,
  loadProfile,
  loadProject,
  writeKnowledge,
  writeProfile,
} from "./state.js";
import {
  ALL_CONCEPTS,
  catalogIndexLesson,
  DEFAULT_RELATED,
  getConceptCategory,
  getLesson,
  normalizeConcept,
  type CatalogLesson,
  type ConceptCategory,
  type Lesson,
} from "./concept-catalog.js";

export type { ExperienceLevel };

export type TeachMode = "wide" | "deep" | "balanced";
export type DepthLevel = "shallow" | "normal" | "deep";

export interface DeepDive {
  expert_question: string;
  trade_off_prompt: string;
  common_misconception_2: string;
  subtopics: string[];
  example?: string;
  case_study?: string;
  resources?: string[];
}

export interface TeachOutput extends Lesson {
  concept: string;
  level: ExperienceLevel;
  self_check_question: string;
  rubric: string[];
  knowledge_status?: KnowledgeStatus;
  confidence_gap?: string;
  concept_importance?: "critical" | "important" | "nice_to_have" | "not_yet";
  mode?: TeachMode;
  depth?: DepthLevel;
  prerequisites?: string[];
  subtopics?: string[];
  wider_concepts?: string[];
  study_path?: string[];
  quick_summary?: string;
  deep_dive?: DeepDive;
}

export interface RoadmapStage {
  name: string;
  concepts: { concept: string; importance: number; status?: KnowledgeStatus; why: string }[];
}

export interface RoadmapOutput {
  mode: TeachMode;
  milestone: Milestone;
  experience_level: ExperienceLevel;
  focus_area?: ConceptCategory;
  stages: RoadmapStage[];
  summary: string;
}

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be", "been", "being", "to", "of", "in", "for", "on", "with", "as", "by", "it", "its", "this", "that", "you", "your", "i", "we", "they", "them", "their", "from", "at", "if", "then", "than", "so", "do", "does", "did", "has", "have", "had", "can", "could", "will", "would", "should", "may", "might", "must", "about", "into", "through", "during", "before", "after", "above", "below", "up", "down", "out", "off", "over", "under", "again", "further", "once", "here", "there", "when", "where", "why", "how", "all", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "now",
]);

const CATEGORY_MILESTONE_IMPORTANCE: Partial<
  Record<ConceptCategory, Partial<Record<Milestone, number>>>
> = {
  product: {
    Idea: 1,
    "Customer Interviews": 2,
    "Landing Page": 2,
    "First Email List": 2,
    MVP: 1,
    "First Users": 1,
    "First Paying User": 1,
    Retention: 2,
    "PMF Signals": 2,
    Growth: 2,
  },
  business: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 1,
    "First Users": 1,
    "First Paying User": 2,
    Retention: 2,
    "PMF Signals": 3,
    Growth: 3,
  },
  security: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 3,
    "First Users": 3,
    "First Paying User": 3,
    Retention: 3,
    "PMF Signals": 3,
    Growth: 3,
  },
  architecture: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 3,
    "First Users": 2,
    "First Paying User": 2,
    Retention: 2,
    "PMF Signals": 2,
    Growth: 2,
  },
  engineering: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 3,
    "First Users": 2,
    "First Paying User": 2,
    Retention: 2,
    "PMF Signals": 2,
    Growth: 2,
  },
  data: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 2,
    "First Users": 2,
    "First Paying User": 2,
    Retention: 3,
    "PMF Signals": 2,
    Growth: 3,
  },
  scaling: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 1,
    "First Users": 1,
    "First Paying User": 2,
    Retention: 2,
    "PMF Signals": 2,
    Growth: 3,
  },
  reliability: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 1,
    "First Users": 2,
    "First Paying User": 3,
    Retention: 3,
    "PMF Signals": 3,
    Growth: 3,
  },
  ops: {
    Idea: 1,
    "Customer Interviews": 1,
    "Landing Page": 1,
    "First Email List": 1,
    MVP: 1,
    "First Users": 2,
    "First Paying User": 2,
    Retention: 2,
    "PMF Signals": 2,
    Growth: 3,
  },
};

function depMatch(repo: RepoSummary | undefined, pattern: RegExp): boolean {
  return (repo?.dependencies || []).some((d) => pattern.test(d.toLowerCase())) || (repo?.dev_dependencies || []).some((d) => pattern.test(d.toLowerCase()));
}

function noteMatch(repo: RepoSummary | undefined, ...patterns: RegExp[]): boolean {
  const all = [...(repo?.architecture_notes || []), ...(repo?.security_notes || []), ...(repo?.deployment_notes || [])].join(" ").toLowerCase();
  return patterns.some((p) => p.test(all));
}

const CONCEPT_REPO_SIGNALS: Record<
  string,
  (repo: RepoSummary | undefined) => { match: boolean; strength: number; evidence: string }
> = {
  "rate-limiting": (repo) => ({
    match: Boolean(repo?.has_rate_limiting),
    strength: 4,
    evidence: "repo has rate limiting signal",
  }),
  "authentication-vs-authorization": (repo) => ({
    match: Boolean(repo?.has_auth),
    strength: 4,
    evidence: "repo has auth-related dependency",
  }),
  oauth: (repo) => ({
    match: Boolean(repo?.has_auth) && (repo?.dependencies || []).some((d) => /oauth|next-auth|clerk|auth0|passport/i.test(d)),
    strength: 3,
    evidence: "repo has OAuth-related dependency; verify scopes and token handling are configured",
  }),
  "health-checks": (repo) => ({
    match: Boolean(repo?.has_health_endpoint),
    strength: 4,
    evidence: "repo has health endpoint",
  }),
  "feature-flags": (repo) => ({
    match: Boolean(repo?.has_feature_flags),
    strength: 4,
    evidence: "repo has feature flag dependency",
  }),
  "ci-cd": (repo) => ({
    match: Boolean(repo?.has_ci_cd),
    strength: 4,
    evidence: "repo has CI/CD configuration",
  }),
  observability: (repo) => ({
    match: Boolean(repo?.has_monitoring || repo?.has_logging || repo?.has_error_reporting),
    strength: 4,
    evidence: "repo has monitoring/logging/error reporting",
  }),
  logging: (repo) => ({
    match: Boolean(repo?.has_logging),
    strength: 3,
    evidence: "repo has logging library",
  }),
  monitoring: (repo) => ({
    match: Boolean(repo?.has_monitoring),
    strength: 4,
    evidence: "repo has monitoring tool",
  }),
  "database-migrations": (repo) => ({
    match: Boolean(repo?.has_migrations),
    strength: 4,
    evidence: "repo has migration directory",
  }),
  "testing-pyramid": (repo) => ({
    match: Boolean(repo?.has_tests),
    strength: 4,
    evidence: "repo has tests",
  }),
  gdpr: (repo) => ({
    match: Boolean(repo?.has_privacy_policy || repo?.has_terms),
    strength: 4,
    evidence: "repo has privacy policy or terms",
  }),
  "secrets-management": (repo) => ({
    match: (repo?.top_level || []).some((n) => n.toLowerCase().includes(".env")),
    strength: 2,
    evidence: ".env file found; verify secrets are managed",
  }),
  "input-validation": (repo) => ({
    match: Boolean(repo?.has_auth || depMatch(repo, /(zod|joi|yup|validator|class-validator)/)),
    strength: 3,
    evidence: "auth or validation library present",
  }),
  "sql-injection": (repo) => ({
    match: depMatch(repo, /(prisma|sequelize|typeorm|mongoose|knex|drizzle)/),
    strength: 2,
    evidence: "repo uses an ORM or query builder; verify no raw concatenation remains",
  }),
  caching: (repo) => ({
    match: depMatch(repo, /(redis|ioredis|cache-manager|memcached|node-cache)/),
    strength: 3,
    evidence: "repo has a cache dependency; verify invalidation and hit/miss behavior",
  }),
  "load-balancing": (repo) => ({
    match: noteMatch(repo, /load.?balancer|nginx|haproxy|alb/i),
    strength: 3,
    evidence: "architecture notes mention load balancing",
  }),
  "horizontal-scaling": (repo) => ({
    match: noteMatch(repo, /horizontal|scale.?out|kubernetes|k8s|replica/i),
    strength: 3,
    evidence: "architecture notes mention horizontal scaling",
  }),
  serverless: (repo) => ({
    match: noteMatch(repo, /serverless|lambda|vercel|netlify|cloud.?function/i),
    strength: 3,
    evidence: "architecture notes mention serverless; verify cold start and vendor lock-in trade-offs",
  }),
  "event-driven-architecture": (repo) => ({
    match: depMatch(repo, /(kafka|rabbitmq|sqs|sns|nats|bull|bee.?queue)/),
    strength: 3,
    evidence: "repo uses a message queue or broker; verify idempotency and dead-letter handling",
  }),
  "monolith-vs-microservices": (repo) => ({
    match: noteMatch(repo, /monolith|microservice|service/i),
    strength: 3,
    evidence: "architecture notes mention monolith or microservices",
  }),
  "api-design": (repo) => ({
    match: noteMatch(repo, /api.?design|rest|graphql|openapi|swagger/i),
    strength: 3,
    evidence: "architecture notes mention API design",
  }),
  "state-management": (repo) => ({
    match: depMatch(repo, /(redux|zustand|recoil|mobx|pinia|context)/),
    strength: 3,
    evidence: "repo uses state management library",
  }),
  docker: (repo) => ({
    match: Boolean(repo?.has_docker),
    strength: 4,
    evidence: "repo has Docker configuration",
  }),
  "incident-response": (repo) => ({
    match: Boolean(repo?.has_error_reporting) && (repo?.deployment_notes || []).some((n) => /incident|postmortem|rollback/i.test(n)),
    strength: 2,
    evidence: "repo has error reporting and incident notes; verify runbook and on-call rotation exist",
  }),
  rollback: (repo) => ({
    match: noteMatch(repo, /rollback|revert|blue.?green|canary/i),
    strength: 3,
    evidence: "deployment notes mention rollback strategy",
  }),
  "database-indexing": (repo) => ({
    match: noteMatch(repo, /index|indexed|query.?performance/i),
    strength: 3,
    evidence: "architecture or data notes mention indexing",
  }),
  "connection-pooling": (repo) => ({
    match: depMatch(repo, /(pg.?pool|generic.?pool|tarn|node.?pool)/),
    strength: 3,
    evidence: "repo has connection pooling dependency",
  }),
  "circuit-breaker": (repo) => ({
    match: depMatch(repo, /(opossum|resilience4j|hystrix|breaker)/) || noteMatch(repo, /circuit.?breaker/i),
    strength: 3,
    evidence: "repo has circuit breaker dependency or notes; verify timeout and fallback behavior",
  }),
};

const PROMPTS_BY_LEVEL: Record<ExperienceLevel, string[]> = {
  newbie: [
    "Before reading the answer, try to explain this out loud as if to a friend who does not code.",
    "What is the simplest, most human failure this concept is meant to prevent?",
    "What would you have to believe for this not to matter to you?",
  ],
  some_code: [
    "Before reading the answer, write one sentence in your own words.",
    "What is the failure mode this concept is meant to prevent?",
    "What is the smallest thing you could build to try it?",
  ],
  shipped: [
    "Before reading the answer, name a time you have already touched this idea.",
    "What would break first if you ignored it?",
    "What is the right time to introduce this into an existing system?",
  ],
  senior: [
    "Before reading the answer, identify the strongest opinion you hold about this topic.",
    "What is the most expensive false assumption you have seen people make?",
    "What would you change in your current design if this were mandatory?",
  ],
};

const FOLLOW_UPS_BY_LEVEL: Record<ExperienceLevel, (concept: string) => string[]> = {
  newbie: (concept) => [
    `What is the one sentence a beginner should remember about ${concept}?`,
    "What is the scariest thing that could happen if you skip this?",
    "Who could you ask to check your understanding?",
  ],
  some_code: (concept) => [
    `Which part of your stack would ${concept} show up in first?`,
    `What is the cheapest way to try ${concept}?`,
    "What is one thing you should not do while learning this?",
  ],
  shipped: (concept) => [
    `When in the product lifecycle does ${concept} become non-optional?`,
    `What is the smallest production change that would exercise ${concept}?`,
    "What metric would tell you it is working?",
  ],
  senior: (concept) => [
    `What is the hidden cost of ${concept} that juniors usually miss?`,
    `How would you justify not using ${concept} to a skeptical engineer?`,
    "What is the failure mode that still keeps you up at night?",
  ],
};

const APPLY_SUFFIX_BY_LEVEL: Record<ExperienceLevel, string> = {
  newbie: " If this feels like too much, do only the first sentence and stop.",
  some_code: " Build the smallest proof of concept and observe what happens.",
  shipped: " Add it to your existing project and measure the result before expanding.",
  senior: " Audit your current design, write the decision in one paragraph, and ship the smallest fix.",
};

export function getEffectiveLevel(provided: ExperienceLevel | undefined, profile: Profile | null | undefined): ExperienceLevel {
  if (provided) return provided;
  if (profile?.experience_level) return profile.experience_level;
  return "newbie";
}

export function conceptImportanceForMilestone(
  concept: string,
  milestone: Milestone,
  _lesson: Lesson
): number {
  const category = getConceptCategory(concept);
  const base = category ? CATEGORY_MILESTONE_IMPORTANCE[category]?.[milestone] ?? 1 : 1;
  // Boost foundational product/validation/business concepts at the earliest stages regardless of category heuristic.
  if (["Idea", "Customer Interviews"].includes(milestone)) {
    if (["validation", "smoke-test", "north-star-metric", "pivot", "runway", "unit-economics"].includes(concept)) {
      return Math.max(base, 3);
    }
  }
  if (["MVP", "First Users"].includes(milestone)) {
    if (["authentication-vs-authorization", "rate-limiting", "ci-cd", "testing-pyramid", "database-migrations", "feature-flags"].includes(concept)) {
      return Math.max(base, 3);
    }
  }
  if (["First Paying User", "Retention", "PMF Signals"].includes(milestone)) {
    if (["unit-economics", "runway", "retention", "cohort-analysis"].includes(concept)) {
      return Math.max(base, 3);
    }
  }
  return base;
}

function importanceLabel(score: number): TeachOutput["concept_importance"] {
  if (score >= 3) return "critical";
  if (score === 2) return "important";
  if (score === 1) return "nice_to_have";
  return "not_yet";
}

function tokens(text: string): Set<string> {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/);
  return new Set(cleaned.filter((w) => w.length > 2 && !STOPWORDS.has(w)));
}

function phraseHits(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  return phrases.filter((p) => lower.includes(p.toLowerCase()));
}

export interface AnswerAnalysis {
  score: number;
  confidence: "low" | "medium" | "high";
  matched_terms: string[];
  anti_hits: string[];
  positive_ratio: number;
  negative_ratio: number;
  nuance: string;
}

export function evaluateAnswerDetails(answer: string, lesson: Lesson): AnswerAnalysis {
  if (!answer || answer.trim().length < 10) {
    return { score: 1, confidence: "low", matched_terms: [], anti_hits: [], positive_ratio: 0, negative_ratio: 0, nuance: "Answer too short to evaluate." };
  }
  const answerTokens = tokens(answer);
  if (answerTokens.size === 0) {
    return { score: 1, confidence: "low", matched_terms: [], anti_hits: [], positive_ratio: 0, negative_ratio: 0, nuance: "No evaluable words in answer." };
  }

  // Build a model answer and anti-patterns, falling back to explanation / misconception.
  const example = lesson.example_answer || lesson.explanation || "";
  const exampleText = `${example} ${lesson.why_it_matters || ""}`;
  const exampleTokens = tokens(exampleText);

  const antiPatterns = lesson.anti_patterns?.length
    ? lesson.anti_patterns
    : lesson.common_misconception
      ? [lesson.common_misconception]
      : [];
  const antiText = antiPatterns.join(" ");
  const antiTokens = tokens(antiText);

  const matchedTerms: string[] = [];
  let positive = 0;
  let negative = 0;
  for (const t of answerTokens) {
    if (exampleTokens.has(t)) {
      positive++;
      matchedTerms.push(t);
    }
    if (antiTokens.has(t)) negative++;
  }

  // Whole-phrase anti-pattern hits are a strong negative signal (e.g. "test code before deploying").
  const antiHits = phraseHits(answer, antiPatterns);

  const positiveRatio = positive / answerTokens.size;
  const negativeRatio = negative / answerTokens.size;

  let score: number;
  if (positiveRatio < 0.15) score = 2;
  else if (positiveRatio < 0.3) score = 3;
  else if (positiveRatio < 0.5) score = 4;
  else score = 5;

  // If the user parrots an anti-pattern or the negative signal is strong, cap the score.
  if (antiHits.length > 0 || negativeRatio > 0.3) {
    score = Math.min(score, 2);
  }

  // If they hit a very high positive match with no anti-pattern, promote to verified.
  if (positiveRatio >= 0.6 && !antiHits.length) {
    score = Math.max(score, 5);
  }

  // Confidence is low if score is 3 and ratios are mixed, high if at the extremes, medium otherwise.
  let confidence: AnswerAnalysis["confidence"];
  if (score <= 2 || score >= 5) confidence = "high";
  else if (Math.abs(positiveRatio - negativeRatio) < 0.15) confidence = "low";
  else confidence = "medium";

  const nuance =
    antiHits.length
      ? `Answer repeats an anti-pattern (${antiHits.join(", ")}), so it is capped low. Review the apply step.`
      : score >= 5
        ? "Answer aligns strongly with the model answer."
        : score >= 4
          ? "Answer captures the core idea but may miss edge cases."
          : score >= 3
            ? "Answer touches the topic but has gaps or mixed signals."
            : "Answer is missing the core concept or using it incorrectly.";

  return {
    score,
    confidence,
    matched_terms: matchedTerms.slice(0, 10),
    anti_hits: antiHits,
    positive_ratio: positiveRatio,
    negative_ratio: negativeRatio,
    nuance,
  };
}

export function evaluateAnswer(answer: string, lesson: Lesson): number {
  return evaluateAnswerDetails(answer, lesson).score;
}

function actualRatingFromRepo(concept: string, repo: RepoSummary | undefined): { rating: number; evidence: string } | null {
  if (!repo) return null;
  const signal = CONCEPT_REPO_SIGNALS[concept]?.(repo);
  if (!signal?.match) return null;
  return { rating: signal.strength, evidence: signal.evidence };
}

function actualRatingFromProfile(concept: string, profile: Profile | null | undefined): { rating: number; evidence: string } | null {
  if (profile?.known_concepts?.includes(normalizeConcept(concept))) {
    return { rating: 3, evidence: "user profile lists as known" };
  }
  if (profile?.backgrounds?.some((b) => ["backend", "fullstack", "ops", "security"].includes(b))) {
    if (["rate-limiting", "authentication-vs-authorization", "ci-cd", "observability"].includes(concept)) {
      return { rating: 2, evidence: "background suggests exposure, but no explicit claim" };
    }
  }
  return null;
}

export function classifyStatus(selfRating: number, actualRating: number): KnowledgeStatus {
  if (actualRating >= 4 && selfRating >= 4) return "verified";
  if (actualRating >= 4 && selfRating < 3) return "verified";
  if (actualRating <= 2 && selfRating >= 4) return "overconfident";
  if (actualRating <= 2 && selfRating <= 2) return "shaky";
  if (actualRating <= 2 && selfRating === 3) return "aware";
  if (actualRating === 3 && selfRating <= 2) return "aware";
  if (actualRating === 3 && selfRating >= 4) return "aware";
  if (actualRating >= 4 && selfRating === 3) return "aware";
  return "unknown";
}

export function recommendAction(status: KnowledgeStatus, concept: string, lesson: Lesson): string {
  switch (status) {
    case "overconfident":
      return `Your confidence in ${concept} is ahead of the evidence. Do the action step before claiming this is handled.`;
    case "shaky":
      return `You and the evidence both agree ${concept} is shaky. Start with the smallest step in the action step.`;
    case "aware":
      return `You have some exposure to ${concept}. Solidify it by doing the action step and checking the related concepts.`;
    case "verified":
      return `${concept} looks solid. Move on, but keep an eye on the related concepts.`;
    default:
      return `Read the lesson and try the self-check before deciding how well you know ${concept}.`;
  }
}

export function buildSelfCheck(concept: string, _lesson: Lesson): { question: string; rubric: string[] } {
  const display = concept.replace(/-/g, " ");
  return {
    question: `In your own words, what is ${display}, what failure mode does it prevent, and what would you do with it this week?`,
    rubric: [
      `States the core idea of ${display} in one sentence.`,
      `Names a concrete failure mode it prevents.`,
      `Connects it to a real trade-off or action step.`,
    ],
  };
}

function tailorLesson(lesson: Lesson, level: ExperienceLevel, status?: KnowledgeStatus): Lesson {
  const display = lesson.explanation?.match(/^[A-Z]/) ? "this" : "this concept";
  const newApply = `${lesson.apply || `Apply ${display}.`}${APPLY_SUFFIX_BY_LEVEL[level]}`;
  const followUps = FOLLOW_UPS_BY_LEVEL[level](display);
  const prompts = PROMPTS_BY_LEVEL[level];
  let why = lesson.why_it_matters || "";
  if (status === "overconfident") {
    why = `Careful: your confidence may be ahead of your evidence. ${why}`;
  } else if (level === "senior") {
    why = `${why} At your level, the goal is not to learn the definition but to find the blind spot in your current design.`;
  } else if (level === "newbie") {
    why = `${why} You do not need to master this today; you need to know it exists and when it becomes dangerous to ignore.`;
  }
  return { ...lesson, apply: newApply, follow_up_questions: followUps, prompts_before_answer: prompts, why_it_matters: why };
}

function quickSummary(text: string): string {
  const first = text.split(/[.!?](?:\s|$)/)[0]?.trim() || text;
  return first.length > 120 ? `${first.slice(0, 117)}...` : first;
}

function deepDiveFor(concept: string, category: ConceptCategory | undefined, lesson: Lesson): DeepDive {
  const display = concept.replace(/-/g, " ");
  const subtopics = (category ? DEFAULT_RELATED[category] : []).filter((c) => c !== concept);
  return {
    expert_question: `You are reviewing a production design with a senior engineer. They claim they have handled ${display}. What is the one question you would ask to either expose a hidden flaw or confirm they truly understand the trade-offs?`,
    trade_off_prompt: `When does ${display} become more expensive than the problem it solves? Give a concrete example of a time you would deliberately not use it.`,
    common_misconception_2: `That knowing the definition of ${display} is the same as having made it survive real traffic, real attackers, or real money.`,
    subtopics: subtopics.slice(0, 5),
    example: lesson.example,
    case_study: lesson.case_study,
    resources: lesson.resources,
  };
}

export interface TeachExtrasInput {
  concept: string;
  milestone: Milestone;
  mode: TeachMode;
  depth: DepthLevel;
  level: ExperienceLevel;
  lesson: Lesson;
  knowledge?: KnowledgeMap | null;
}

export function computeTeachExtras(input: TeachExtrasInput): Partial<TeachOutput> {
  const { concept, milestone, mode, depth, level, lesson, knowledge } = input;
  const category = getConceptCategory(concept);
  const importance = conceptImportanceForMilestone(concept, milestone, lesson);
  const extras: Partial<TeachOutput> = {};

  // Prefer an explicit graph from the catalog, then fall back to the category's default related concepts.
  if (lesson.prereqs?.length || lesson.next?.length) {
    extras.prerequisites = (lesson.prereqs || [])
      .filter((c) => c !== concept)
      .slice(0, 4);
    extras.subtopics = (lesson.next || [])
      .filter((c) => c !== concept)
      .slice(0, 5);
  } else {
    const related = category ? DEFAULT_RELATED[category] : [];
    const neighbors = related.filter((c) => c !== concept);
    const conceptIndex = related.indexOf(concept);

    // Sort by importance, then by the catalog's default learning order.
    const withImportance = neighbors
      .map((c) => ({
        concept: c,
        importance: conceptImportanceForMilestone(c, milestone, getLesson(c)),
        order: related.indexOf(c),
      }))
      .sort((a, b) => (a.importance - b.importance) || (a.order - b.order));

    // If the concept is in the canonical list, everything before it is a prerequisite, after is a subtopic.
    // Otherwise use importance to split: lower/equal importance but earlier in list = prereqs, higher = subtopics.
    if (conceptIndex >= 0) {
      extras.prerequisites = withImportance
        .filter((x) => x.order < conceptIndex)
        .slice(0, 4)
        .map((x) => x.concept);
      extras.subtopics = withImportance
        .filter((x) => x.order > conceptIndex)
        .slice(0, 5)
        .map((x) => x.concept);
    } else {
      const prereqThreshold = Math.max(1, importance - 1);
      extras.prerequisites = withImportance
        .filter((x) => x.importance <= prereqThreshold)
        .slice(0, 4)
        .map((x) => x.concept);
      extras.subtopics = withImportance
        .filter((x) => x.importance > importance)
        .slice(0, 5)
        .map((x) => x.concept);
      // If nothing is strictly higher, use the second half of the ordered list as subtopics (e.g. deep mode at an early milestone).
      if (!extras.subtopics?.length) {
        const half = Math.ceil(withImportance.length / 2);
        extras.prerequisites = withImportance.slice(0, half).map((x) => x.concept);
        extras.subtopics = withImportance.slice(half).map((x) => x.concept);
      }
    }
  }

  if (mode === "wide" || mode === "balanced") {
    // Wider concepts are the most important concepts from *other* categories at this milestone.
    const otherCategories: ConceptCategory[] = ["product", "business", "security", "scaling", "data", "reliability", "architecture", "engineering", "ops"].filter(
      (c) => c !== category
    ) as ConceptCategory[];
    const wider: { concept: string; importance: number }[] = [];
    for (const cat of otherCategories) {
      const top = DEFAULT_RELATED[cat]
        .map((c) => ({ concept: c, importance: conceptImportanceForMilestone(c, milestone, getLesson(c)) }))
        .filter((x) => x.importance >= 2)
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 2);
      wider.push(...top);
    }
    extras.wider_concepts = wider
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 8)
      .map((x) => x.concept);
  }

  // Study path = prereqs -> concept -> subtopics (works without a repo).
  extras.study_path = [...(extras.prerequisites || []), concept, ...(extras.subtopics || [])];

  if (depth === "shallow") {
    extras.quick_summary = quickSummary(lesson.explanation);
  }

  if (depth === "deep" || mode === "deep") {
    extras.deep_dive = deepDiveFor(concept, category, lesson);
  }

  // If user already knows the concept, skip some prereqs and point at unknown subtopics.
  const entry = knowledge?.[concept];
  if (entry?.status === "verified" || entry?.status === "aware") {
    extras.prerequisites = undefined;
  }
  // Do not suppress subtopics if the user explicitly asked for deep mode/depth, or if they are senior.
  if ((entry?.status === "shaky" || entry?.status === "unknown" || !entry) && level !== "senior" && mode !== "deep" && depth !== "deep") {
    extras.subtopics = [];
  }

  return extras;
}

export function chooseFocusArea(
  milestone: Milestone,
  knowledge?: KnowledgeMap | null,
  preferred?: ConceptCategory
): ConceptCategory {
  if (preferred) return preferred;
  const categories: ConceptCategory[] = ["product", "business", "security", "scaling", "data", "reliability", "architecture", "engineering", "ops"];
  // Pick the category with the most critical concepts that the user has not verified.
  let best: ConceptCategory = "product";
  let bestScore = -1;
  for (const cat of categories) {
    const concepts = ALL_CONCEPTS.filter((c) => getConceptCategory(c) === cat);
    const criticalUnknown = concepts.filter((c) => {
      const importance = conceptImportanceForMilestone(c, milestone, getLesson(c));
      const status = knowledge?.[c]?.status;
      return importance >= 3 && status !== "verified" && status !== "aware";
    }).length;
    if (criticalUnknown > bestScore) {
      bestScore = criticalUnknown;
      best = cat;
    }
  }
  return best;
}

export function milestoneReadiness(knowledge: KnowledgeMap | null, milestone: Milestone): { concept: string; status: KnowledgeStatus; importance: number; why: string }[] {
  const result: { concept: string; status: KnowledgeStatus; importance: number; why: string }[] = [];
  for (const concept of ALL_CONCEPTS) {
    const lesson = getLesson(concept);
    const importance = conceptImportanceForMilestone(concept, milestone, lesson);
    if (importance < 3) continue;
    const entry = knowledge?.[concept];
    const status = entry?.status || "unknown";
    if (status === "verified" || status === "aware") continue;
    result.push({
      concept,
      status,
      importance,
      why: `${concept} is critical for ${milestone} but is currently ${status}.`,
    });
  }
  return result.sort((a, b) => b.importance - a.importance);
}

export function buildRoadmap(
  milestone: Milestone,
  mode: TeachMode,
  experienceLevel: ExperienceLevel,
  focusArea?: ConceptCategory,
  knowledge?: KnowledgeMap | null,
  maxConcepts?: number,
  hideKnown?: boolean,
  resumeFrom?: string
): RoadmapOutput {
  const categoryOrder: ConceptCategory[] = ["product", "business", "security", "architecture", "data", "reliability", "scaling", "engineering", "ops"];
  const stages: RoadmapStage[] = [];

  if (mode === "deep") {
    const focus = chooseFocusArea(milestone, knowledge, focusArea);
    const focusOrder = DEFAULT_RELATED[focus] || [];
    const concepts = ALL_CONCEPTS
      .filter((c) => getConceptCategory(c) === focus)
      .map((c) => ({
        concept: c,
        importance: conceptImportanceForMilestone(c, milestone, getLesson(c)),
        status: knowledge?.[c]?.status,
        order: focusOrder.indexOf(c),
        why: `Part of the ${focus} track at the ${milestone} stage.`,
      }))
      .filter((x) => x.importance > 0)
      .sort((a, b) => (a.importance - b.importance) || (a.order - b.order));
    const foundation = concepts.filter((x) => x.importance === 1 || (x.importance === 3 && x.order >= 0 && x.order < 2));
    const core = concepts.filter((x) => x.importance === 2 || (x.importance === 3 && x.order >= 2 && x.order < 4));
    const advanced = concepts.filter((x) => x.importance >= 3 && (x.order < 0 || x.order >= 4));
    if (foundation.length) stages.push({ name: `Foundation — ${focus}`, concepts: foundation });
    if (core.length) stages.push({ name: `Core — ${focus}`, concepts: core });
    if (advanced.length) stages.push({ name: `Advanced — ${focus}`, concepts: advanced });
  } else if (mode === "wide") {
    for (const cat of categoryOrder) {
      const concepts = ALL_CONCEPTS
        .filter((c) => getConceptCategory(c) === cat)
        .map((c) => ({
          concept: c,
          importance: conceptImportanceForMilestone(c, milestone, getLesson(c)),
          status: knowledge?.[c]?.status,
          why: `Key ${cat} concept for ${milestone}.`,
        }))
        .filter((x) => x.importance >= 2)
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 3);
      if (concepts.length) {
        stages.push({ name: cat.charAt(0).toUpperCase() + cat.slice(1), concepts });
      }
    }
  } else {
    // balanced: mix importance buckets across all categories.
    const all = ALL_CONCEPTS.map((c) => ({
      concept: c,
      importance: conceptImportanceForMilestone(c, milestone, getLesson(c)),
      status: knowledge?.[c]?.status,
      category: getConceptCategory(c),
      why: `Relevant for ${milestone}.`,
    })).filter((x) => x.importance > 0);
    const critical = all.filter((x) => x.importance >= 3).sort((a, b) => a.concept.localeCompare(b.concept));
    const important = all.filter((x) => x.importance === 2).sort((a, b) => a.concept.localeCompare(b.concept));
    const nice = all.filter((x) => x.importance === 1).sort((a, b) => a.concept.localeCompare(b.concept));
    if (critical.length) stages.push({ name: "Critical now", concepts: critical });
    if (important.length) stages.push({ name: "Important soon", concepts: important });
    if (nice.length) stages.push({ name: "Nice to have", concepts: nice });
  }

  let total = stages.reduce((sum, s) => sum + s.concepts.length, 0);

  // Hide verified/aware concepts if requested.
  if (hideKnown) {
    for (const stage of stages) {
      stage.concepts = stage.concepts.filter((c) => c.status !== "verified" && c.status !== "aware");
    }
  }

  // Pin the resume concept to the top of its stage, or first stage if not found.
  if (resumeFrom) {
    const target = normalizeConcept(resumeFrom);
    let pinned = false;
    for (const stage of stages) {
      const idx = stage.concepts.findIndex((c) => c.concept === target);
      if (idx > 0) {
        const [item] = stage.concepts.splice(idx, 1);
        stage.concepts.unshift(item);
        pinned = true;
        break;
      } else if (idx === 0) {
        pinned = true;
        break;
      }
    }
    if (!pinned && stages.length) {
      const lesson = getLesson(target);
      stages[0].concepts.unshift({
        concept: target,
        importance: conceptImportanceForMilestone(target, milestone, lesson),
        status: knowledge?.[target]?.status,
        why: `Resuming from ${target}.`,
      });
    }
  }

  // Cap total concepts if requested, trimming the least important within each stage.
  if (maxConcepts && maxConcepts > 0 && total > maxConcepts) {
    const perStage = Math.max(1, Math.floor(maxConcepts / stages.length));
    for (const stage of stages) {
      stage.concepts = stage.concepts
        .sort((a, b) => b.importance - a.importance)
        .slice(0, perStage);
    }
    total = stages.reduce((sum, s) => sum + s.concepts.length, 0);
  }
  const summary = `Roadmap for ${milestone} (${mode}, ${experienceLevel}): ${total} concepts across ${stages.length} stages.` +
    (focusArea || mode === "deep" ? ` Focus: ${stages[0]?.name || focusArea || "auto"}.` : "");

  return { mode, milestone, experience_level: experienceLevel, focus_area: focusArea, stages, summary };
}

export async function buildTeachOutput(
  concept: string,
  projectPath?: string,
  applyTo?: string,
  levelOverride?: ExperienceLevel,
  mode: TeachMode = "balanced",
  depth: DepthLevel = "normal"
): Promise<TeachOutput | (CatalogLesson & { concept: string; level: ExperienceLevel })> {
  const normalized = normalizeConcept(concept);
  const isIndex = !concept || normalized === "" || normalized === "index" || normalized === "list" || isLostQuestion(concept);

  let profile: Profile | null = null;
  let knowledge: KnowledgeMap | null = null;
  let project = null;
  let milestones = null;
  if (projectPath) {
    [profile, knowledge, project, milestones] = await Promise.all([
      loadProfile(projectPath).catch(() => null),
      loadKnowledge(projectPath).catch(() => null),
      loadProject(projectPath).catch(() => null),
      loadMilestones(projectPath).catch(() => null),
    ]);
  }

  const level = getEffectiveLevel(levelOverride, profile);

  if (isIndex) {
    const index = catalogIndexLesson();
    return { ...index, concept: "index", level };
  }

  if (isLostQuestion(concept)) {
    const lost = lostLesson(concept);
    const tailored = tailorLesson(lost, level);
    const selfCheck = buildSelfCheck(concept, tailored);
    return {
      ...tailored,
      concept: normalized,
      level,
      ...selfCheck,
      concept_importance: "critical",
    } as TeachOutput;
  }

  const rawLesson = getLesson(concept);
  const tailored = tailorLesson(rawLesson, level);
  const selfCheck = buildSelfCheck(concept, tailored);
  const existing = knowledge?.[normalized];
  const milestone = (milestones?.current || project?.stage || "Idea") as Milestone;
  const importanceScore = conceptImportanceForMilestone(normalized, milestone, rawLesson);
  const conceptImportance = importanceLabel(importanceScore);

  const apply = applyTo && tailored.apply ? `${tailored.apply} In your case: ${applyTo}.` : tailored.apply;

  const extras = computeTeachExtras({
    concept: normalized,
    milestone,
    mode,
    depth,
    level,
    lesson: rawLesson,
    knowledge,
  });

  return {
    ...tailored,
    apply,
    concept: normalized,
    level,
    mode,
    depth,
    ...selfCheck,
    knowledge_status: existing?.status,
    confidence_gap: existing ? buildGapMessage(existing) : undefined,
    concept_importance: conceptImportance,
    ...extras,
  } as TeachOutput;
}

function isLostQuestion(concept: string): boolean {
  const lower = concept.toLowerCase().trim();
  return (
    lower.includes("?") ||
    /^(where|how|what|why|when|who)\b/i.test(lower) ||
    lower.includes("i'm lost") ||
    lower.includes("i am lost") ||
    lower.includes("dont know") ||
    lower.includes("don't know") ||
    lower.includes("confused") ||
    lower === "where do i start" ||
    lower === "where to start"
  );
}

function lostLesson(concept: string): Lesson {
  return {
    question: "Not sure where to start?",
    prompts_before_answer: PROMPTS_BY_LEVEL.newbie,
    explanation: `You asked "${concept}". That is not a concept in the catalog, and it sounds like you are still finding your footing. That is normal. Before you write code, the most important thing is to validate that anyone besides you wants the thing you are thinking about.`,
    why_it_matters: "Most first apps fail because the builder skips the step of proving demand. The earlier you test the idea, the less time you waste.",
    common_misconception: "That you need to know the 'right' stack before you can start.",
    follow_up_questions: [
      "Who is the one person this would help the most?",
      "What is the smallest thing you could do today to test that they want it?",
      "What would make you quit this idea?",
    ],
    apply: "Pick one of the related concepts, ask for a lesson on it, and do the action step before writing any code.",
    related_concepts: ["validation", "smoke-test", "north-star-metric", "activation", "retention"],
  };
}

function buildGapMessage(entry: KnowledgeEntry): string {
  const self = entry.self_rating ?? 0;
  const actual = entry.actual_rating ?? 0;
  if (entry.status === "overconfident") {
    return `You rated this ${self}/5, but the evidence points to ${actual}/5. This is a dangerous gap.`;
  }
  if (entry.status === "shaky") {
    return `You rated this ${self}/5 and the evidence agrees it is still shaky.`;
  }
  if (entry.status === "verified") {
    return `Your rating of ${self}/5 matches the evidence. Well calibrated.`;
  }
  if (entry.status === "aware") {
    return `You are on the path; keep exercising this concept.`;
  }
  return "No prior assessment on record.";
}

export interface AssessmentResult {
  status: KnowledgeStatus;
  self_rating: number;
  actual_rating: number;
  suggested_actual_rating: number;
  needs_review: boolean;
  answer_analysis?: AnswerAnalysis;
  gap: string;
  recommended_action: string;
  evidence: KnowledgeEntry["evidence"];
}

export async function assessConcept(
  projectPath: string,
  concept: string,
  selfRating: number,
  answer?: string,
  repo?: RepoSummary,
  agentActualRating?: number,
  autoGrade = true
): Promise<AssessmentResult> {
  const [profile, knowledgeRaw] = await Promise.all([
    loadProfile(projectPath).catch(() => null),
    loadKnowledge(projectPath).catch(() => ({} as KnowledgeMap)),
  ]);
  const knowledge = knowledgeRaw || {};
  const normalized = normalizeConcept(concept);
  const lesson = getLesson(concept);

  let actual = 1;
  let suggested = 1;
  let answerAnalysis: AnswerAnalysis | undefined;
  const evidence: KnowledgeEntry["evidence"] = ["self_report"];

  // Compute a suggested rating from the answer, but do not commit it unless auto-grading is on.
  if (answer) {
    answerAnalysis = evaluateAnswerDetails(answer, lesson);
    suggested = answerAnalysis.score;
  }

  // If the agent has already evaluated the answer, trust that.
  if (agentActualRating && agentActualRating >= 1 && agentActualRating <= 5) {
    actual = agentActualRating;
    evidence.push("assessment");
  } else if (autoGrade && answer) {
    actual = Math.max(actual, suggested);
    evidence.push("assessment");
  }

  // Repo evidence is the strongest objective signal.
  const repoSignal = actualRatingFromRepo(normalized, repo);
  if (repoSignal && repoSignal.rating > actual) {
    actual = repoSignal.rating;
    evidence.push("repo_signal");
  }

  // Profile exposure (onboarding known_concepts or background) is a weak positive signal.
  const profileSignal = actualRatingFromProfile(normalized, profile);
  if (profileSignal && profileSignal.rating > actual) {
    actual = profileSignal.rating;
    evidence.push("agent");
  }

  const status = classifyStatus(selfRating, actual);
  const gap = buildGapMessage({
    concept: normalized,
    self_rating: selfRating,
    actual_rating: actual,
    status,
    evidence,
    answer,
    notes: repoSignal?.evidence,
  });
  const recommended_action = recommendAction(status, normalized, lesson);
  // Flag for review when an answer was given but not graded by the agent and the heuristic is uncertain.
  const needs_review = Boolean(answer) && !agentActualRating && (Math.abs(selfRating - suggested) > 1 || suggested === 3);

  knowledge[normalized] = {
    concept: normalized,
    self_rating: selfRating,
    actual_rating: actual,
    status,
    evidence,
    answer,
    notes: `${repoSignal?.evidence || ""} ${profileSignal?.evidence || ""}`.trim() || undefined,
    last_interaction: new Date().toISOString(),
  };

  await writeKnowledge(projectPath, knowledge);

  return { status, self_rating: selfRating, actual_rating: actual, suggested_actual_rating: suggested, needs_review, answer_analysis: answerAnalysis, gap, recommended_action, evidence };
}

function daysSince(iso?: string): number {
  if (!iso) return 999;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 999;
  return (Date.now() - then) / (1000 * 60 * 60 * 24);
}

export function isDueForReview(entry: KnowledgeEntry, intervals?: ReviewIntervals): boolean {
  const status = entry.status;
  const d = daysSince(entry.last_interaction);
  const threshold =
    status === "verified" ? (intervals?.verified ?? 14) :
    status === "aware" ? (intervals?.aware ?? 7) :
    status === "shaky" ? (intervals?.shaky ?? 3) :
    status === "overconfident" ? (intervals?.overconfident ?? 3) :
    Infinity;
  return d > threshold;
}

export interface KnowledgeMapView {
  experience_level: ExperienceLevel;
  confidence_tendency: Profile["confidence_tendency"];
  current_milestone?: Milestone;
  next_recommended_concept?: { concept: string; status: KnowledgeStatus; importance: number; why: string };
  concepts: { concept: string; status: KnowledgeStatus; self_rating?: number; actual_rating?: number; importance: number }[];
  unknown_unknowns: string[];
  overconfident: string[];
  shaky: string[];
  verified: string[];
  aware: string[];
  due_for_review: { concept: string; status: KnowledgeStatus; days_since: number }[];
  study_queue: { concept: string; status: KnowledgeStatus; importance: number; why: string }[];
  summary: string;
}

export interface BuildKnowledgeMapOptions {
  category?: ConceptCategory;
  summaryOnly?: boolean;
}

export async function buildKnowledgeMap(
  projectPath: string,
  repo?: RepoSummary,
  options?: BuildKnowledgeMapOptions
): Promise<KnowledgeMapView> {
  const [profile, knowledgeRaw, project, milestones] = await Promise.all([
    loadProfile(projectPath).catch(() => null),
    loadKnowledge(projectPath).catch(() => ({} as KnowledgeMap)),
    loadProject(projectPath).catch(() => null),
    loadMilestones(projectPath).catch(() => null),
  ]);

  const knowledge = knowledgeRaw || {};
  const level = getEffectiveLevel(undefined, profile);
  const milestone = milestones?.current || (project?.stage as Milestone) || "Idea";

  const concepts: KnowledgeMapView["concepts"] = [];
  const byStatus: Record<KnowledgeStatus, string[]> = { unknown: [], aware: [], shaky: [], verified: [], overconfident: [] };
  const studyQueue: KnowledgeMapView["study_queue"] = [];
  const dueForReview: KnowledgeMapView["due_for_review"] = [];

  for (const concept of ALL_CONCEPTS) {
    const conceptCategory = getConceptCategory(concept);
    if (options?.category && conceptCategory !== options.category) continue;

    const lesson = getLesson(concept);
    const entry = knowledge[concept] || { concept };
    // Compute actual from the strongest available evidence.
    // Stored actual (from a previous agent-graded assessment) is preserved unless repo/profile provides higher evidence.
    let actual = entry.actual_rating || 1;
    const evidence: KnowledgeEntry["evidence"] = ["self_report"];
    const repoSignal = actualRatingFromRepo(concept, repo);
    if (repoSignal && repoSignal.rating > actual) {
      actual = repoSignal.rating;
      evidence.push("repo_signal");
    }
    const profileSignal = actualRatingFromProfile(concept, profile);
    if (profileSignal && profileSignal.rating > actual) {
      actual = profileSignal.rating;
      evidence.push("agent");
    }
    if (entry.answer && entry.actual_rating) evidence.push("assessment");
    entry.actual_rating = actual;
    entry.status = classifyStatus(entry.self_rating || 1, actual);
    entry.evidence = evidence;

    const importance = conceptImportanceForMilestone(concept, milestone, lesson);
    if (!options?.summaryOnly) {
      concepts.push({
        concept,
        status: entry.status || "unknown",
        self_rating: entry.self_rating,
        actual_rating: entry.actual_rating,
        importance,
      });
    }
    byStatus[entry.status || "unknown"].push(concept);

    if ((["unknown", "shaky", "overconfident"] as KnowledgeStatus[]).includes(entry.status || "unknown") && importance >= 2) {
      const why =
        entry.status === "overconfident"
          ? "Critical for your stage, but your confidence outpaces the evidence."
          : entry.status === "shaky"
            ? "Critical for your stage, and the evidence agrees this is shaky."
            : "Critical for your stage, but you have not assessed it yet.";
      studyQueue.push({ concept, status: entry.status, importance, why });
    }

    if (isDueForReview(entry, profile?.review_intervals)) {
      dueForReview.push({ concept, status: entry.status || "unknown", days_since: daysSince(entry.last_interaction) });
    }
  }

  studyQueue.sort((a, b) => {
    const statusOrder = { overconfident: 0, unknown: 1, shaky: 2, aware: 3, verified: 4 };
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    return b.importance - a.importance;
  });

  const nextRecommended = studyQueue[0];
  const summary =
    `Knowledge map for ${milestone}: ${byStatus.verified.length} verified, ` +
    `${byStatus.overconfident.length} overconfident, ${byStatus.unknown.length} unknown, ` +
    `${byStatus.shaky.length} shaky. Next recommended: ${nextRecommended?.concept || "none"}.`;

  // Persist any repo/profile signal updates so the map is not just a one-time view.
  await writeKnowledge(projectPath, knowledge).catch(() => null);

  return {
    experience_level: level,
    confidence_tendency: profile?.confidence_tendency || "unknown",
    current_milestone: milestone,
    next_recommended_concept: nextRecommended ? { concept: nextRecommended.concept, status: nextRecommended.status, importance: nextRecommended.importance, why: nextRecommended.why } : undefined,
    concepts,
    unknown_unknowns: byStatus.unknown,
    overconfident: byStatus.overconfident,
    shaky: byStatus.shaky,
    verified: byStatus.verified,
    aware: byStatus.aware,
    due_for_review: dueForReview.sort((a, b) => b.days_since - a.days_since),
    study_queue: studyQueue,
    summary,
  };
}

export async function createProfile(
  projectPath: string,
  profile: Profile
): Promise<{ profile: Profile; knowledge: KnowledgeMap; created: boolean }> {
  const now = new Date().toISOString();
  const [project, milestones] = await Promise.all([
    loadProject(projectPath).catch(() => null),
    loadMilestones(projectPath).catch(() => null),
  ]);
  const milestone = milestones?.current || (project?.stage as Milestone) || "Idea";

  const next: Profile = { ...profile, created_at: profile.created_at || now, updated_at: now };

  const knowledge: KnowledgeMap = {};
  for (const concept of (next.known_concepts || [])) {
    const normalized = normalizeConcept(concept);
    const lesson = getLesson(concept);
    knowledge[normalized] = {
      concept: normalized,
      self_rating: 4,
      actual_rating: 3,
      evidence: ["self_report"],
      status: "aware",
      notes: "Claimed as known during onboarding.",
      last_interaction: now,
    };
  }

  // Pre-seed unknown for a few high-importance concepts based on level so the map is not empty.
  const starterConcepts = ["validation", "smoke-test", "rate-limiting", "authentication-vs-authorization", "ci-cd", "observability"];
  for (const concept of starterConcepts) {
    if (!knowledge[concept]) {
      knowledge[concept] = {
        concept,
        self_rating: 1,
        actual_rating: 1,
        evidence: [],
        status: "unknown",
        notes: "High-leverage concept for a growing app.",
        last_interaction: now,
      };
    }
  }

  // Build a calibration quiz of high-importance concepts the user did not claim to know.
  const quiz = ALL_CONCEPTS
    .filter((c) => !(next.known_concepts || []).map(normalizeConcept).includes(c))
    .map((c) => ({ concept: c, importance: conceptImportanceForMilestone(c, milestone, getLesson(c)) }))
    .filter((x) => x.importance >= 2)
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 5)
    .map((x) => x.concept);
  next.calibration_quiz = quiz;

  await writeProfile(projectPath, next);
  await writeKnowledge(projectPath, knowledge);
  return { profile: next, knowledge, created: true };
}

export function updateConfidenceTendency(knowledge: KnowledgeMap): Profile["confidence_tendency"] {
  const entries = Object.values(knowledge).filter((e) => e.self_rating && e.actual_rating);
  if (entries.length < 3) return "unknown";
  const over = entries.filter((e) => e.status === "overconfident").length;
  const under = entries.filter((e) => e.status === "verified" && (e.self_rating || 0) < (e.actual_rating || 0)).length;
  const ratioOver = over / entries.length;
  const ratioUnder = under / entries.length;
  if (ratioOver > 0.25) return "overconfident";
  if (ratioUnder > 0.25) return "cautious";
  return "calibrated";
}
