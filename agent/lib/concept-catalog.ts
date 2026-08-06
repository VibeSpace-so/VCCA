export type ConceptCategory =
  | "security"
  | "scaling"
  | "data"
  | "product"
  | "ops"
  | "reliability"
  | "architecture"
  | "engineering"
  | "business";

export interface Lesson {
  question: string;
  prompts_before_answer?: string[];
  explanation: string;
  why_it_matters?: string;
  common_misconception?: string;
  follow_up_questions?: string[];
  apply: string;
  related_concepts?: string[];
}

export interface CatalogLesson extends Lesson {
  catalog?: string[];
}

interface ConceptSeed {
  category: ConceptCategory;
  question?: string;
  explanation: string;
  apply?: string;
  why?: string;
  misconception?: string;
  related?: string[];
}

const DEFAULT_PROMPTS_BEFORE_ANSWER = [
  "Before reading the answer, try to state the idea in your own words.",
  "What is the failure mode this concept is meant to prevent?",
  "What would you have to believe for this concept not to matter?",
];

const TEMPLATES: Record<
  ConceptCategory,
  (concept: string) => Pick<Lesson, "question" | "why_it_matters" | "apply" | "common_misconception" | "follow_up_questions">
> = {
  security: (concept) => ({
    question: `What is the first thing a determined attacker would try against your ${concept} assumptions?`,
    why_it_matters: "A single security mistake can destroy customer trust faster than any feature can rebuild it.",
    apply: `Audit one surface area where ${concept} applies and fix the weakest link this week.`,
    common_misconception: "That attackers only target big companies.",
    follow_up_questions: [
      `What is the worst that could happen if ${concept} fails?`,
      "Which user role or API is most at risk?",
      "What is one control you can add today without shipping a new feature?",
    ],
  }),
  scaling: (concept) => ({
    question: `What would break first if your traffic grew tenfold and you had not thought about ${concept}?`,
    why_it_matters: "At scale, growth becomes indistinguishable from a denial-of-service attack if your system is not ready.",
    apply: `Identify the one metric that would force you to adopt ${concept}, and set an alert for it.`,
    common_misconception: "That you can just add servers and everything will work without changing your app.",
    follow_up_questions: [
      `Which part of your stack is the bottleneck for ${concept}?`,
      `What is the cheapest way to try ${concept}?`,
      `How would you explain ${concept} to a non-technical co-founder?`,
    ],
  }),
  data: (concept) => ({
    question: `What happens to your data when two users touch the same record at the same time and you ignored ${concept}?`,
    why_it_matters: "Data is the heart of your product; ${concept} keeps it correct under load and over time.",
    apply: `Find one query or write path where ${concept} matters and trace what could go wrong.`,
    common_misconception: "That one database will always stay correct and fast as you grow.",
    follow_up_questions: [
      `What is the simplest failure mode ${concept} prevents?`,
      `When does ${concept} become too expensive?`,
      `What would a naive version of ${concept} look like?`,
    ],
  }),
  ops: (concept) => ({
    question: `At 3am, what page would wake you up if ${concept} was missing or wrong?`,
    why_it_matters: "Production does not sleep; ${concept} is what lets you sleep.",
    apply: `Document the runbook for one failure mode ${concept} should prevent, then test it.`,
    common_misconception: "That you can figure it out when the incident happens.",
    follow_up_questions: [
      "Who is responsible when this fails?",
      `What is your rollback or mitigation path for ${concept}?`,
      `How do you know ${concept} is healthy right now?`,
    ],
  }),
  reliability: (concept) => ({
    question: `If a dependency you rely on goes down, how does ${concept} keep your app useful?`,
    why_it_matters: "Reliable systems fail in predictable ways; ${concept} turns failures into graceful degradation.",
    apply: `Pick the dependency most likely to fail and design a fallback using ${concept}.`,
    common_misconception: "That 99.9% uptime is good enough for every part of your system.",
    follow_up_questions: [
      "What does a partial failure look like?",
      "Where are your single points of failure?",
      `How do you test ${concept} before you need it?`,
    ],
  }),
  architecture: (concept) => ({
    question: `If you had to explain your ${concept} choice to a new hire six months from now, what part could you not justify?`,
    why_it_matters: "Architecture is the set of constraints that become harder to change over time.",
    apply: `Write one paragraph justifying your ${concept} decision and the conditions that would make you revisit it.`,
    common_misconception: "That you should start with the same architecture as a FAANG company.",
    follow_up_questions: [
      `What would force you to change ${concept}?`,
      `What is the cost of ${concept} in complexity?`,
      `What simpler alternative did you reject?`,
    ],
  }),
  product: (concept) => {
    const display = concept.replace(/-/g, " ");
    return {
      question: `How would you know ${display} is right before you spend weeks building around it?`,
      why_it_matters: "Building the wrong thing is the most expensive bug.",
      apply: `Design the smallest test—landing page, interview, or prototype—that validates ${display}.`,
      common_misconception: "That building more features is the same as making progress.",
      follow_up_questions: [
        "What would prove this is wrong?",
        "Who is the customer for this?",
        "What is the riskiest assumption behind this idea?",
      ],
    };
  },
  engineering: (concept) => ({
    question: `What would a confident but wrong engineer say about ${concept}?`,
    why_it_matters: "Good engineering discipline compounds; bad shortcuts compound faster.",
    apply: `Pick one practice from ${concept} and apply it to the part of your code you are most afraid to touch.`,
    common_misconception: "That speed now matters more than discipline later.",
    follow_up_questions: [
      `What does ${concept} cost you in time today?`,
      `When is it okay to skip ${concept}?`,
      `How do you teach ${concept} to the team?`,
    ],
  }),
  business: (concept) => ({
    question: `If your runway got cut in half tomorrow, how would ${concept} change your priorities?`,
    why_it_matters: "A startup dies when it runs out of money and belief; ${concept} keeps both healthy.",
    apply: `Write down the numbers or evidence that prove ${concept} and review them weekly.`,
    common_misconception: "That revenue will solve every other problem.",
    follow_up_questions: [
      `What would make ${concept} no longer true?`,
      "Who else needs to believe this?",
      `What is the first action ${concept} requires?`,
    ],
  }),
};

export const DEFAULT_RELATED: Record<ConceptCategory, string[]> = {
  security: ["authentication-vs-authorization", "secrets-management", "oauth", "input-validation", "tls"],
  scaling: ["horizontal-scaling", "vertical-scaling", "autoscaling", "load-balancing", "caching"],
  data: ["database-migrations", "database-indexing", "connection-pooling", "eventual-consistency", "n-plus-one"],
  product: ["smoke-test", "validation", "north-star-metric", "ab-testing", "activation"],
  ops: ["incident-response", "on-call", "health-checks", "ci-cd", "observability"],
  reliability: ["circuit-breaker", "bulkhead", "back-off-and-retry", "timeouts", "slos"],
  architecture: ["monolith-vs-microservices", "api-design", "state-management", "event-driven-architecture", "serverless"],
  engineering: ["testing-pyramid", "code-review", "documentation", "ci-cd", "contract-testing"],
  business: ["unit-economics", "runway", "gdpr", "cohort-analysis", "retention"],
};

const SEEDS: Record<string, ConceptSeed> = {
  // Product & business
  "north-star-metric": {
    category: "product",
    question: "What is the one number that tells you the product is working?",
    explanation:
      "A north-star metric is the single outcome that captures the core value your product delivers. It aligns the team around what matters most.",
    apply: "Define one north-star metric and a small set of input metrics that drive it.",
  },
  activation: {
    category: "product",
    question: "When does a new user first feel value?",
    explanation:
      "Activation is the moment a user experiences the product's core value. Users who activate are far more likely to retain.",
    apply: "Identify the minimum actions a new user must take to activate and optimize your onboarding for that moment.",
  },
  retention: {
    category: "product",
    question: "Why do users come back?",
    explanation:
      "Retention measures how many users return over time. It is one of the best signals of product-market fit and sustainable growth.",
    apply: "Track cohort retention, find the drop-off point, and improve the experience around the first few uses.",
  },
  "smoke-test": {
    category: "product",
    question: "Can you sell it before you build it?",
    explanation:
      "A smoke test is a lightweight experiment that checks if demand exists before you build. It can be a landing page, waitlist, or pre-order.",
    apply: "Create the smallest artifact that proves demand before writing production code.",
  },
  validation: {
    category: "product",
    question: "How do you know people want this before you build it?",
    explanation:
      "Customer validation means testing demand with smoke tests, waitlists, or paid pre-orders before writing production code. It reduces the risk of building something no one buys.",
    apply: "Create the smallest test—landing page, waitlist, or pre-order—that validates the riskiest assumption.",
  },
  pivot: {
    category: "product",
    question: "What if the idea is not working?",
    explanation:
      "A pivot is a structured change to one part of the business model while keeping the vision. It is not a random restart; it is a hypothesis-driven change.",
    apply: "Pivot when the data shows a better customer, problem, or channel, not because building is hard.",
  },
  "ab-testing": {
    category: "product",
    explanation:
      "Comparing two versions of something to see which performs better. It turns opinions into evidence.",
    apply: "Run a small, controlled test on one variable before rolling out a winner.",
  },
  "cohort-analysis": {
    category: "product",
    explanation:
      "Studying groups of users who started at the same time. It reveals true retention and behavior trends.",
    apply: "Group users by sign-up week and compare how they behave over time.",
  },

  // Business
  "unit-economics": {
    category: "business",
    explanation:
      "The revenue and cost per customer or transaction. It tells you if growth makes you richer or poorer.",
    apply: "Write down your CAC, LTV, gross margin, and payback period for one customer.",
  },
  runway: {
    category: "business",
    explanation:
      "How many months you can operate before running out of cash. It is the hard constraint on how risky you can be.",
    apply: "Calculate runway and decide whether to prioritize revenue, fundraising, or cost cuts.",
  },
  gdpr: {
    category: "business",
    explanation:
      "The EU data protection law that gives users rights over their data. Ignoring it can mean fines and lost trust.",
    apply: "Map what user data you collect, why you collect it, and how a user could delete or export it.",
  },
  "cost-monitoring": {
    category: "business",
    explanation:
      "Tracking what your infrastructure and services cost. Growth that ignores cost can bankrupt you.",
    apply: "Set a monthly cloud budget and alert when any service doubles in cost.",
  },
  "vendor-lock-in": {
    category: "business",
    explanation:
      "Dependence on a single provider that makes switching expensive. It is a risk to price, portability, and continuity.",
    apply: "Identify one service that would be painful to replace and document the migration path.",
  },

  // Security
  idempotency: {
    category: "data",
    question: "What happens if Stripe sends the same webhook twice?",
    explanation:
      "Idempotency means the same operation can run multiple times without changing the result. Use an idempotency key from the provider and record processed keys so the second request is a no-op.",
    apply: "Find every webhook handler and add an idempotency key check before changing state.",
  },
  "rate-limiting": {
    category: "security",
    question: "What happens if a user tries a thousand passwords?",
    explanation:
      "Rate limiting caps how often a caller can use an endpoint. It protects you from brute force, scraping, and accidental abuse. Apply it to logins, public APIs, and expensive endpoints.",
    apply: "Add rate limiting to authentication and any public API that triggers writes.",
  },
  "health-checks": {
    category: "ops",
    question: "How does a load balancer know your app is alive?",
    explanation:
      "A health endpoint tells the load balancer or orchestrator whether the app can serve traffic. It should test the app and its critical dependencies, not just return 200.",
    apply: "Create a /health endpoint that checks the database or cache, and wire it into your deploy target.",
  },
  "feature-flags": {
    category: "engineering",
    question: "What if a new feature breaks in production?",
    explanation:
      "Feature flags let you ship code without exposing it, and turn it off instantly if something breaks. They separate deploy from release.",
    apply: "Wrap the next risky feature in a flag so you can disable it without redeploying.",
  },
  rollback: {
    category: "ops",
    question: "What if the last deploy corrupts data?",
    explanation:
      "A rollback strategy lets you revert to the last known good version quickly. It pairs with backward-compatible migrations and feature flags.",
    apply: "Make the last deploy one command away from a rollback, and test it before you need it.",
  },
  "secrets-management": {
    category: "security",
    question: "What if your API key is in a public GitHub repo?",
    explanation:
      "Secrets management means keeping credentials out of source code and injecting them at runtime from a trusted source. It includes rotation, access control, and audit logs.",
    apply: "Move secrets to environment variables or a secret manager, rotate any exposed keys, and audit who has access.",
  },
  oauth: {
    category: "security",
    question: "Why does 'Sign in with Google' exist?",
    explanation:
      "OAuth is a protocol that lets users authorize your app to access their account on another service without giving you their password. It delegates authentication and lets users revoke access.",
    apply: "Use a managed OAuth provider or library instead of building the flow yourself, and never store the provider's password.",
  },
  "authentication-vs-authorization": {
    category: "security",
    question: "Who are you, and what are you allowed to do?",
    explanation:
      "Authentication is verifying identity. Authorization is deciding what that identity is allowed to do. Mixing them leads to security holes.",
    apply: "Separate login/authentication from permissions/authorization, and check both on every sensitive action.",
  },
  "input-validation": {
    category: "security",
    explanation:
      "Rejecting or sanitizing data before it reaches your logic. It is your first and cheapest defense against many attacks.",
    apply: "Validate every input on the server, not just in the UI, and reject invalid data early.",
  },
  "jwt-security": {
    category: "security",
    explanation:
      "JSON Web Tokens carry claims but are not secrets. Keep them short, sign them, and never trust the client payload blindly.",
    apply: "Verify signatures server-side, keep payloads small, and plan a token revocation path.",
  },
  cors: {
    category: "security",
    explanation:
      "Cross-Origin Resource Sharing controls which websites can call your API from a browser. Misconfigured CORS opens the door to unwanted cross-site requests.",
    apply: "Allow only the origins your frontend uses and never use wildcard with credentials.",
  },
  csp: {
    category: "security",
    explanation:
      "Content Security Policy tells browsers where scripts and resources may load from. It is your main defense against cross-site scripting.",
    apply: "Start with a strict CSP and allow only the domains you need for scripts, styles, and images.",
  },
  "sql-injection": {
    category: "security",
    explanation:
      "An attacker injecting SQL through user input. It is prevented by parameterized queries and input validation.",
    apply: "Replace every string-concatenated query with parameterized queries or an ORM.",
  },
  xss: {
    category: "security",
    explanation:
      "Cross-site scripting lets an attacker run scripts in another user's browser. It is prevented by escaping output and a strict content security policy.",
    apply: "Escape user content in HTML and set a strong Content-Security-Policy header.",
  },
  csrf: {
    category: "security",
    explanation:
      "Cross-site request forgery tricks a logged-in user into performing an unwanted action. It is prevented by tokens and same-site cookies.",
    apply: "Use anti-CSRF tokens for state-changing forms and set SameSite on cookies.",
  },
  "dependency-scanning": {
    category: "security",
    explanation:
      "Checking libraries for known vulnerabilities before shipping. A single dependency can introduce a critical hole.",
    apply: "Add an automated dependency scan to your CI and review high-severity findings before deploying.",
  },
  tls: {
    category: "security",
    explanation:
      "Transport Layer Security encrypts data in transit. Without it, credentials and data can be intercepted.",
    apply: "Require HTTPS for all public traffic and keep certificates on a renewal reminder.",
  },
  ddos: {
    category: "security",
    explanation:
      "Distributed denial of service overwhelms your app with traffic. It needs rate limits, a CDN, and upstream protection.",
    apply: "Set rate limits, use a CDN, and have a plan to absorb or block traffic spikes.",
  },
  waf: {
    category: "security",
    explanation:
      "A Web Application Firewall blocks common attack patterns. It is a safety net, not a replacement for secure code.",
    apply: "Use a WAF in front of your app, but still validate and sanitize every input.",
  },
  "webhook-security": {
    category: "security",
    explanation:
      "Verifying that a webhook came from who it claims and was not replayed. Use signatures, idempotency keys, and HTTPS.",
    apply: "Verify webhook signatures, store processed ids to stop replays, and reject plain HTTP.",
  },

  // Scaling & performance
  caching: {
    category: "scaling",
    question: "What if every request hits the database?",
    explanation:
      "Caching stores frequently used data closer to where it is needed, so you can serve it faster and reduce load on expensive resources. It only helps when the cost of a cache miss is lower than the cost of fetching fresh data.",
    apply: "Cache the most-read, slow-to-fetch data and set an explicit invalidation strategy.",
  },
  "load-balancing": {
    category: "scaling",
    question: "What if one server gets all the traffic?",
    explanation:
      "Load balancing spreads traffic across multiple servers so no single machine becomes a bottleneck. It also gives you a place to check health and remove failing instances.",
    apply: "Put a load balancer in front of your app and add health checks so unhealthy instances stop receiving traffic.",
  },
  "connection-pooling": {
    category: "data",
    question: "Why is your database running out of connections?",
    explanation:
      "Connection pooling reuses database connections instead of opening a new one for every request. It reduces overhead and prevents the database from being overwhelmed.",
    apply: "Use a connection pool in your database driver and size it to your worker count.",
  },
  "database-indexing": {
    category: "data",
    question: "Why is this query getting slower as the table grows?",
    explanation:
      "A database index is a lookup structure that lets the database find rows without scanning the whole table. Indexes speed up reads and specific kinds of filters, but they slow down writes and take up space.",
    apply: "Index the columns you query by most often, especially in WHERE, JOIN, and ORDER BY clauses.",
  },
  "horizontal-scaling": {
    category: "scaling",
    explanation:
      "Adding more machines to handle load instead of making one machine bigger. It works only if your app can run across many instances.",
    apply: "Make your app stateless and put a load balancer in front of multiple instances.",
  },
  "vertical-scaling": {
    category: "scaling",
    explanation:
      "Making the existing server bigger with more CPU, RAM, or faster disks. It is simple but has a ceiling.",
    apply: "Know the biggest machine you can buy and the point where bigger stops being cheaper than more machines.",
  },
  autoscaling: {
    category: "scaling",
    explanation:
      "Automatically adding or removing capacity based on real-time demand. It needs clear metrics and a cooldown to avoid thrashing.",
    apply: "Pick a scaling metric such as request queue depth or CPU and set minimum and maximum limits.",
  },
  "stateless-services": {
    category: "scaling",
    explanation:
      "Each request contains everything the server needs; no session lives in memory. This lets you scale horizontally and replace instances easily.",
    apply: "Move session data to a shared store like Redis and keep application servers stateless.",
  },
  "cache-invalidation": {
    category: "scaling",
    explanation:
      "The rules that tell you when cached data is stale and must be refreshed. The hardest part of caching is not the hit; it is the miss at the wrong time.",
    apply: "For each cached value, document how it is invalidated and who owns the source of truth.",
  },
  cdn: {
    category: "scaling",
    explanation:
      "A network of edge servers that serves static assets close to users. It reduces latency, cost, and origin load.",
    apply: "Serve static assets and cacheable responses from a CDN with a sensible TTL.",
  },
  pagination: {
    category: "data",
    explanation:
      "Returning large result sets in chunks instead of all at once. It protects databases, memory, and user experience.",
    apply: "Add limit and offset or cursor pagination to every list endpoint before it becomes slow.",
  },
  "n-plus-one": {
    category: "data",
    explanation:
      "Fetching a list and then making one extra query per item. It is invisible at low scale and lethal at high scale.",
    apply: "Use eager loading, joins, or data loaders to batch related queries.",
  },
  denormalization: {
    category: "data",
    explanation:
      "Storing redundant data to speed up reads. It trades write complexity and consistency for query performance.",
    apply: "Identify one slow read that joins many tables and consider a denormalized read model.",
  },
  "query-optimization": {
    category: "data",
    explanation:
      "Making database queries fast without throwing hardware at the problem. It starts with measuring, not guessing.",
    apply: "Run EXPLAIN on your slowest query and fix the first thing that surprises you.",
  },

  // Architecture
  queues: {
    category: "architecture",
    question: "What if a user has to wait while you send 10,000 emails?",
    explanation:
      "A queue lets you hand work off to be processed later. It separates the work a user triggers from the time it takes to finish it, and it smooths out traffic spikes.",
    apply: "Move any slow, retryable, or bulk work into a queue and process it in the background.",
  },
  webhooks: {
    category: "architecture",
    question: "How do you react to events that happen in another system?",
    explanation:
      "Webhooks are HTTP callbacks that another service calls when something happens. They push events to you instead of you polling for them. Because the internet is unreliable, you must handle duplicates, delays, and failures.",
    apply: "Verify webhook signatures, make handlers idempotent, and return 2xx quickly.",
  },
  "api-design": {
    category: "architecture",
    question: "How do you design an API that is easy to use and hard to misuse?",
    explanation:
      "Good API design is about clear naming, consistent conventions, predictable errors, and versioning. It reduces integration time and support burden.",
    apply: "Define resource names and error shapes, use plural nouns for collections, and version from day one.",
  },
  "monolith-vs-microservices": {
    category: "architecture",
    question: "Should you start with one big app or many small services?",
    explanation:
      "A monolith is one codebase and one deploy. Microservices split a system into independently deployable services. Microservices add operational overhead that is only worth it when a team is large or modules need different scaling.",
    apply: "Start with a monolith. Split a service out only when one team or module is clearly held back by the shared deploy.",
  },
  "state-management": {
    category: "architecture",
    question: "Where does the truth live?",
    explanation:
      "State management is the discipline of deciding where data is stored, who can change it, and how changes flow through your system. Single sources of truth reduce bugs.",
    apply: "Pick one source of truth for each entity, make state changes explicit, and avoid duplicating state that can get out of sync.",
  },
  "event-driven-architecture": {
    category: "architecture",
    explanation:
      "Services communicate by publishing and consuming events instead of direct calls. It decouples teams but complicates debugging.",
    apply: "Model one business process as events and test the failure path before adding more.",
  },
  "api-gateway": {
    category: "architecture",
    explanation:
      "A single entry point that routes, throttles, authenticates, and transforms API calls. It simplifies clients and centralizes cross-cutting concerns.",
    apply: "Put an API gateway in front of your services when you have more than one backend or client.",
  },
  "reverse-proxy": {
    category: "architecture",
    explanation:
      "A server that sits in front of your app and handles TLS, caching, and routing. It protects and offloads your application.",
    apply: "Use a reverse proxy to terminate TLS and serve static assets before they hit your app.",
  },
  serverless: {
    category: "architecture",
    explanation:
      "Running code without managing servers, billed by usage. It removes ops overhead but has cold starts and limits.",
    apply: "Use serverless for event-driven, spiky workloads and keep the state outside the function.",
  },
  "dead-letter-queues": {
    category: "architecture",
    explanation:
      "A holding area for messages that cannot be processed. It prevents poison pills from blocking the whole queue.",
    apply: "Set up a dead-letter queue and an alert for any message that lands in it.",
  },

  // Engineering practices
  "ci-cd": {
    category: "engineering",
    question: "How do you stop broken code from reaching users?",
    explanation:
      "CI/CD is the practice of automatically building, testing, and deploying code. Continuous Integration catches errors before they merge; Continuous Delivery gets fixes to users quickly.",
    apply: "Set up a pipeline that runs tests on every pull request and deploys automatically from main.",
  },
  "testing-pyramid": {
    category: "engineering",
    question: "How many unit tests versus end-to-end tests should you write?",
    explanation:
      "The testing pyramid says write many fast, isolated unit tests, fewer integration tests, and very few slow end-to-end tests. This gives you confidence without slow, flaky suites.",
    apply: "Write unit tests for business logic, integration tests for database and API boundaries, and end-to-end tests for the critical user path.",
  },
  "cron-jobs": {
    category: "engineering",
    question: "What if you need to do something every night?",
    explanation:
      "A cron job is a scheduled task that runs at fixed times. It is useful for reports, cleanup, and batch work, but it can fail silently and is hard to debug.",
    apply: "Add a heartbeat or log for each run, and make jobs idempotent in case they overlap or rerun.",
  },
  "code-review": {
    category: "engineering",
    explanation:
      "Having another person read your code before it merges. It catches bugs, shares knowledge, and raises the team's standard.",
    apply: "Make every change go through at least one review and keep diffs small enough to actually read.",
  },
  documentation: {
    category: "engineering",
    explanation:
      "Written context that helps the next person understand why the code exists. Code explains how; docs explain why.",
    apply: "Write one README, one architecture note, and one runbook for the piece you are building.",
  },
  "contract-testing": {
    category: "engineering",
    explanation:
      "Verifying that services still speak the same interface. It catches breaking changes before deployment.",
    apply: "Add a contract test for every API or queue interface your service depends on.",
  },
  "load-testing": {
    category: "engineering",
    explanation:
      "Simulating traffic to see how your app behaves under pressure. The goal is to find bottlenecks, not to pass a test.",
    apply: "Run a load test against one critical endpoint and measure latency, errors, and resource use.",
  },
  "technical-debt": {
    category: "engineering",
    explanation:
      "Shortcuts taken now that cost more later. Some debt is deliberate; accidental debt is a tax on every future feature.",
    apply: "List your three most expensive shortcuts and schedule one to fix before adding new features.",
  },

  // Data
  "database-migrations": {
    category: "data",
    question: "How do you change the database without breaking the app?",
    explanation:
      "Database migrations are versioned scripts that apply schema changes. Backward-compatible migrations let old code keep running while new code is deployed.",
    apply: "Add a migration tool, run migrations before code deploys, and avoid destructive changes in the same deploy as code that uses them.",
  },
  "database-replication": {
    category: "data",
    explanation:
      "Copying data from a primary database to one or more replicas. It improves read capacity and failover options.",
    apply: "Set up a read replica and route read-only traffic to it while watching replication lag.",
  },
  "read-replicas": {
    category: "data",
    explanation:
      "Dedicated database copies used only for reads. They offload the primary but introduce replication lag.",
    apply: "Send read-only reports and analytics to a replica and tolerate a few seconds of staleness.",
  },
  "database-sharding": {
    category: "data",
    explanation:
      "Splitting data across multiple databases by a key such as user or tenant. It scales writes but adds routing and rebalancing complexity.",
    apply: "Model your data with a sharding key in mind, even if you only have one database today.",
  },
  "eventual-consistency": {
    category: "data",
    explanation:
      "A promise that all copies of data will match, but not immediately. It is a trade-off that unlocks scale.",
    apply: "Design one read path that can tolerate stale data and communicate the delay to users.",
  },
  "distributed-transactions": {
    category: "data",
    explanation:
      "Operations that must succeed or fail across multiple services or databases. They are hard to get right and often avoided with sagas.",
    apply: "Avoid distributed transactions until you have no other choice; prefer sagas or idempotent retries.",
  },
  "saga-pattern": {
    category: "data",
    explanation:
      "A sequence of local transactions where each step has a compensating rollback. It keeps data consistent across services without locking everything.",
    apply: "Design one cross-service flow as a saga with a compensation step for each action.",
  },
  "race-conditions": {
    category: "data",
    explanation:
      "When the result depends on the timing of two or more operations. They are subtle, common, and dangerous under load.",
    apply: "Look for shared mutable state and add the smallest lock, transaction, or atomic operation that removes the race.",
  },

  // Reliability
  backpressure: {
    category: "reliability",
    explanation:
      "A way for a downstream system to signal upstream to slow down. Without it, queues grow until something crashes.",
    apply: "Add a bounded queue and a mechanism to slow producers when it is full.",
  },
  "back-off-and-retry": {
    category: "reliability",
    explanation:
      "Waiting a little longer between each retry so a struggling service can recover. Random jitter prevents synchronized retries.",
    apply: "Add exponential backoff with jitter to every external API call that can fail.",
  },
  "circuit-breaker": {
    category: "reliability",
    explanation:
      "Stopping calls to a failing service for a short time so it can recover and so your app can fall back. It prevents cascading failures.",
    apply: "Wrap one external dependency in a circuit breaker and define a fallback for when it opens.",
  },
  bulkhead: {
    category: "reliability",
    explanation:
      "Isolating resources so one failure cannot consume all capacity. It limits the blast radius of a problem.",
    apply: "Separate thread pools or connection pools for critical and non-critical workloads.",
  },
  "graceful-degradation": {
    category: "reliability",
    explanation:
      "Keeping the core product useful when non-essential parts fail. A partial experience is better than total failure.",
    apply: "Identify one non-essential feature and design a fallback that keeps the app usable without it.",
  },
  timeouts: {
    category: "reliability",
    explanation:
      "Deciding the maximum time you will wait for a response. Without them, slow dependencies hang your whole request.",
    apply: "Set timeouts on every network call and fail fast when they are hit.",
  },
  "distributed-tracing": {
    category: "reliability",
    explanation:
      "Following a single request as it moves through many services. It turns a maze of logs into a coherent story.",
    apply: "Add a trace ID to every request and propagate it through calls and queues.",
  },
  metrics: {
    category: "reliability",
    explanation:
      "Numbers that describe what your system is doing over time. Good metrics are actionable, not just interesting.",
    apply: "Pick three metrics that measure customer experience, not just server health.",
  },
  alerting: {
    category: "reliability",
    explanation:
      "Notifications when a metric crosses a threshold. Bad alerts wake people up for non-problems; good alerts point to real customer impact.",
    apply: "Write alert descriptions that include what is broken and what to do, not just the metric name.",
  },
  slos: {
    category: "reliability",
    explanation:
      "Service Level Objectives are targets for reliability. They help you decide when to prioritize stability over features.",
    apply: "Define one SLO for your core flow and measure it over a rolling window.",
  },
  "error-budgets": {
    category: "reliability",
    explanation:
      "The amount of unreliability you can tolerate before you must stop launching features. It balances speed and safety.",
    apply: "Calculate your error budget and freeze launches when you spend it too fast.",
  },

  // Ops
  observability: {
    category: "ops",
    question: "How do you debug a problem you cannot see?",
    explanation:
      "Observability is the combination of metrics, logs, and traces that explain what your system is doing. It lets you ask new questions without shipping new code.",
    apply: "Add structured logs, one or two key metrics, and a way to trace a request through your services.",
  },
  "on-call": {
    category: "ops",
    explanation:
      "A defined person responsible for responding to production issues. Without it, nobody fixes problems and everyone burns out.",
    apply: "Create a written on-call rotation with escalation paths and a policy for post-incident follow-up.",
  },
  "incident-response": {
    category: "ops",
    explanation:
      "The process for diagnosing, mitigating, and learning from outages. The goal is to restore service, not to assign blame.",
    apply: "Run a tabletop incident drill and time how long it takes to find the right person and rollback.",
  },
  postmortem: {
    category: "ops",
    explanation:
      "A blameless review of what happened during an incident and how to prevent it. If it is not written, the lesson is lost.",
    apply: "After the next incident, write what happened, what was learned, and one action item.",
  },
  "chaos-engineering": {
    category: "ops",
    explanation:
      "Deliberately introducing failures in a controlled way to find weaknesses. You want to discover fragility before customers do.",
    apply: "Terminate one non-critical instance during business hours and watch what happens.",
  },
  "blue-green-deployment": {
    category: "ops",
    explanation:
      "Running two identical production environments and switching traffic between them. It enables instant rollback with a cutover.",
    apply: "Keep the previous deploy warm for a few minutes after switching traffic.",
  },
  "canary-release": {
    category: "ops",
    explanation:
      "Sending a small percentage of traffic to a new version before rolling it out. It catches problems with limited blast radius.",
    apply: "Route 5% of traffic to the new version and watch error rates for 30 minutes before increasing.",
  },
  "multi-region": {
    category: "ops",
    explanation:
      "Running your app in more than one geographic region. It improves latency and disaster recovery but complicates data.",
    apply: "Document which data belongs in which region and how you fail over if one region fails.",
  },
  "disaster-recovery": {
    category: "ops",
    explanation:
      "A documented plan for restoring service after a major failure. If you have not tested it, you do not have one.",
    apply: "Run a restore from backup at least once a quarter and time how long it takes.",
  },
  backups: {
    category: "ops",
    explanation:
      "Copies of data stored separately so you can recover from loss. A backup you have not restored is a hope, not a plan.",
    apply: "Automate backups and test a restore to a clean environment monthly.",
  },
};

export const ALL_CONCEPTS = Object.keys(SEEDS).sort();

export function normalizeConcept(concept: string): string {
  return concept
    .toLowerCase()
    .replace(/[\s_\/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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
    prompts_before_answer: DEFAULT_PROMPTS_BEFORE_ANSWER,
    explanation: `You asked "${concept}". That's not a concept in the catalog, and it sounds like you're still finding your footing. That's normal. Before you write code, the most important thing is to validate that anyone besides you wants the thing you're thinking about.`,
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

export function getLesson(concept: string): Lesson {
  const normalized = normalizeConcept(concept);
  if (normalized === "" || normalized === "index" || normalized === "list") {
    return catalogIndexLesson();
  }

  if (isLostQuestion(concept)) {
    return lostLesson(concept);
  }

  const seed = SEEDS[normalized];
  if (!seed) {
    return genericLesson(concept);
  }

  const tmpl = TEMPLATES[seed.category](normalized);
  const related = (seed.related ?? DEFAULT_RELATED[seed.category]).filter((r) => r !== normalized);
  return {
    question: seed.question ?? tmpl.question,
    prompts_before_answer: DEFAULT_PROMPTS_BEFORE_ANSWER,
    explanation: seed.explanation,
    why_it_matters: seed.why ?? tmpl.why_it_matters,
    common_misconception: seed.misconception ?? tmpl.common_misconception,
    follow_up_questions: tmpl.follow_up_questions,
    apply: seed.apply ?? tmpl.apply,
    related_concepts: related.length ? related : undefined,
  };
}

export function getConceptCategory(concept: string): ConceptCategory | undefined {
  const normalized = normalizeConcept(concept);
  const seed = SEEDS[normalized];
  if (seed) return seed.category;
  // Heuristic fallback for unknown concepts.
  const lesson = getLesson(concept);
  const text = `${lesson.explanation} ${lesson.apply}`.toLowerCase();
  if (/attacker|hack|password|jwt|oauth|csrf|xss|sql|secret|encrypt|certif|firewall/i.test(text)) return "security";
  if (/server|traffic|load|scale|horizontal|vertical|autoscaling|cdn|cache|thundering herd/i.test(text)) return "scaling";
  if (/database|query|index|shard|replica|migration|consistency|transaction|record|race|deadlock|n-plus-one/i.test(text)) return "data";
  if (/customer|user|retention|activation|market|revenue|business model|pricing|runway|pmf|interview|smoke test/i.test(text)) return "product";
  if (/deploy|rollback|incident|on-call|postmortem|chaos|region|backup|recovery|3am/i.test(text)) return "ops";
  if (/circuit breaker|bulkhead|timeout|retry|backoff|degrade|trace|metrics|alert|slo|error budget|uptime/i.test(text)) return "reliability";
  if (/monolith|microservice|api design|event driven|gateway|queue|webhook|state|serverless|architecture/i.test(text)) return "architecture";
  if (/test|ci\/cd|code review|technical debt|documentation|refactor|lint|contract test/i.test(text)) return "engineering";
  if (/gdpr|privacy|terms|legal|compliance|fundraising|unit economics|ltv|cac|runway|moat/i.test(text)) return "business";
  return undefined;
}

export function catalogIndexLesson(): CatalogLesson {
  return {
    question: "What should a Vibe Coder study before their app scales?",
    prompts_before_answer: DEFAULT_PROMPTS_BEFORE_ANSWER,
    explanation:
      "The catalog below covers the crucial topics. You do not need to master them all today, but you need to know they exist and when they become dangerous to ignore. Pick one that scares you slightly and ask for it by name.",
    why_it_matters:
      "Blind confidence is the biggest risk. Knowing the size of your ignorance is the first defense.",
    common_misconception:
      "That you can defer all of this until you have a lot of users. By then, the fixes are expensive and slow.",
    follow_up_questions: [
      "Which concept do you currently believe is 'not for you'?",
      "Which one would prevent your worst 3am page?",
      "Which one could you explain to a teammate in two minutes?",
    ],
    apply: "Pick one concept from the catalog and ask for a lesson on it.",
    related_concepts: ALL_CONCEPTS.slice(0, 5),
    catalog: ALL_CONCEPTS,
  };
}

export function genericLesson(concept: string): Lesson {
  const normalized = normalizeConcept(concept);
  return {
    question: `What is the most important problem that ${concept} solves for a growing app?`,
    prompts_before_answer: DEFAULT_PROMPTS_BEFORE_ANSWER,
    explanation: `${concept} is a concept every builder should understand before scaling. The core idea is that every technical or product choice has a failure mode it is meant to prevent and a cost it introduces. Learn the failure mode, the cost, and the moment you need it.`,
    why_it_matters:
      "You do not need to master every topic, but you need to know when it becomes dangerous not to know it.",
    common_misconception: `That you can "just Google it later." At scale, later is too late; you need the pattern before the incident.`,
    follow_up_questions: [
      `If ${concept} did not exist, what would break first?`,
      `What is the cheapest way to learn ${concept} hands-on?`,
      `Who on your team would you teach this to first?`,
    ],
    apply: `Find one place in your project where ignoring ${concept} would cause a failure, and fix that first.`,
    related_concepts: ["observability", "testing-pyramid", "rollback", "incident-response"],
  };
}
