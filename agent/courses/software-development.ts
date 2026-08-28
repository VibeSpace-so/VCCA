import type { ConceptSeed } from "./types.js";

// Pillar: SOFTWARE DEVELOPMENT
// Categories you own: "engineering", "architecture", "data", "scaling"
// Add ONLY new concept keys here. Do not duplicate keys that already exist
// in agent/lib/concept-catalog.ts. If you want to enrich an existing
// concept, record it in your course markdown under "Suggested enrichments"
// and the coordinator will merge it.

export const SOFTWARE_DEVELOPMENT_SEEDS: Record<string, ConceptSeed> = {
  // Engineering: from first commit to a team that ships with confidence
  "version-control": {
    category: "engineering",
    question: "What happens if your laptop dies tonight and the only copy of your code is on it?",
    explanation:
      "Version control records every change to your code, lets you undo mistakes, and lets multiple people work on the same project without overwriting each other. It is the safety net underneath every other engineering practice.",
    why: "Without version control, a single deleted file or broken laptop can erase days of work, and collaboration becomes a game of passing zip files.",
    misconception: "That version control is only for large teams. Solo developers lose work the exact same way.",
    apply: "Initialize a Git repo for your project and commit every time a feature or fix is complete.",
    example:
      "You try an experiment, it breaks, and you run 'git checkout -- .' to get back to a known good state in seconds.",
    case_study:
      "The 2017 GitLab database deletion showed the value of disciplined version control and tested backups; the team recovered by replaying the Git repository of configuration and code.",
    example_answer:
      "Use version control to record every change, create a clean history, and never leave the only copy on a single machine.",
    anti_patterns: ["Saving code as timestamped zip files", "Working on long-lived local branches without commits"],
    resources: ["https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control"],
    next: ["trunk-based-development", "pre-commit-hooks", "linting-and-formatting", "dependency-management"],
  },
  "trunk-based-development": {
    category: "engineering",
    question: "Why do long-lived branches often become a nightmare to merge?",
    explanation:
      "Trunk-based development keeps a single main branch that is always releasable. Developers use short-lived branches or commit directly to main, validated by CI. It prevents the merge conflicts and integration surprises that grow with branch age.",
    why: "The longer a branch lives, the more it diverges from main, and the bigger the risky integration becomes.",
    misconception: "That you need feature branches to keep main stable. Stability comes from small changes and feature flags, not isolation.",
    apply: "Set a team rule that branches live no longer than a day and merge through a reviewed pull request.",
    example: "A developer opens a branch, adds one small change, tests it, and merges it within two hours.",
    case_study:
      "Etsy deploys from trunk more than fifty times a day, with each engineer comfortable that main is always shippable.",
    example_answer:
      "Keep one main branch, make small short-lived branches or direct commits, and use CI and feature flags to keep it releasable.",
    anti_patterns: ["Long-lived feature branches", "Merging without CI"],
    resources: ["https://trunkbaseddevelopment.com/", "https://martinfowler.com/articles/continuousIntegration.html"],
    prereqs: ["version-control"],
    next: ["pre-commit-hooks", "ci-cd", "feature-flags"],
  },
  "pre-commit-hooks": {
    category: "engineering",
    question: "What if a broken or secret-laden commit made it into the repository?",
    explanation:
      "Pre-commit hooks run small checks before a commit is accepted, such as linting, formatting, secret scanning, or type checking. They catch cheap mistakes before they become part of shared history.",
    why: "A bad commit that reaches main can block the whole team and leak credentials that are hard to rotate.",
    misconception: "That pre-commit hooks slow you down. They are faster than a CI failure or a security incident.",
    apply: "Add a pre-commit hook that runs your formatter and a secret scanner on every commit.",
    example: "A hook rejects a commit that contains an API key in a .env file before it is ever pushed.",
    case_study:
      "Many organizations use the pre-commit framework to standardize checks across Python, JavaScript, and infrastructure code.",
    example_answer:
      "Run automated checks such as lint, format, type, and secret scans before a commit is accepted.",
    anti_patterns: ["Skipping hooks to save time", "Relying only on CI to catch local mistakes"],
    resources: ["https://pre-commit.com/", "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks"],
    prereqs: ["version-control"],
    next: ["linting-and-formatting", "ci-cd"],
  },
  "linting-and-formatting": {
    category: "engineering",
    question: "How much code-review time is wasted arguing about spacing or quote style?",
    explanation:
      "Linters find suspicious code and enforce rules; formatters rewrite code to a consistent style. Together they remove the noisy style debates that hide real design issues in code review.",
    why: "Inconsistent style makes code harder to read, and un-caught suspicious patterns become production bugs.",
    misconception: "That linting is just opinionated nagging. It is an automated second pair of eyes.",
    apply: "Turn on a formatter and a linter in your editor and fail CI when they report issues.",
    example: "Prettier reformats the whole file to the team style, so the diff shows only the actual logic change.",
    case_study:
      "Open-source projects like Prettier and Black are widely adopted because they eliminate style debates in reviews.",
    example_answer:
      "Use a linter to catch suspicious code and a formatter to enforce a single style so reviews focus on logic.",
    anti_patterns: ["Arguing about style in every PR", "Disabling all linter rules"],
    resources: ["https://prettier.io/docs/en/", "https://eslint.org/docs/latest/"],
    prereqs: ["version-control"],
    next: ["static-type-checking"],
  },
  "static-type-checking": {
    category: "engineering",
    question: "How many of your bugs would have been caught if the compiler knew the shape of your data?",
    explanation:
      "Static type checking verifies that functions receive and return the right kinds of values before the program runs. It turns whole classes of runtime crashes into red squiggles in the editor.",
    why: "Dynamic typing is fast to write but expensive to debug once the code base grows.",
    misconception: "That types slow down prototyping. They slow the first draft and speed every refactor after it.",
    apply: "Enable the strictest type-checking mode your language supports and annotate the most-shared functions first.",
    example: "TypeScript rejects a call to processPayment(undefined) because the function expects a Payment object.",
    case_study:
      "Dropbox type-checked four million lines of Python with mypy and found that the largest projects benefit most from types.",
    example_answer:
      "Use a type system to catch shape and null errors at compile time before they become runtime bugs.",
    anti_patterns: ["Using any everywhere to avoid type errors", "Turning off strict mode"],
    resources: ["https://mypy.readthedocs.io/en/stable/index.html", "https://www.typescriptlang.org/docs/"],
    prereqs: ["linting-and-formatting"],
    next: ["test-driven-development"],
  },
  "error-handling": {
    category: "engineering",
    question: "What does your code do when an API it depends on returns garbage or nothing at all?",
    explanation:
      "Error handling is the discipline of deciding what happens when things go wrong: returning clear errors, failing fast, and never swallowing exceptions. It keeps failures visible and bounded.",
    why: "Silent failures hide in logs until they corrupt data or blow up at 3am.",
    misconception: "That errors are exceptional so they can be ignored. Most production time is spent handling failure.",
    apply: "Add explicit error branches for every external call in one critical flow and log the context.",
    example: "A payment handler throws a typed InvalidCardError instead of returning null and hoping the caller checks.",
    case_study:
      "The Knight Capital trading loss of over $440 million was traced to unhandled legacy code paths being reactivated during a deploy.",
    example_answer:
      "Return clear, typed errors, fail fast, log context, and never silently swallow exceptions.",
    anti_patterns: ["Returning null for every failure", "Catching exceptions and doing nothing"],
    resources: ["https://sre.google/sre-book/handling-overload/", "https://12factor.net/logs"],
    prereqs: ["version-control"],
    next: ["logging", "timeouts"],
  },
  "logging": {
    category: "engineering",
    question: "When a user reports a bug, how long does it take you to reconstruct what happened?",
    explanation:
      "Logging writes a structured, time-ordered record of what the application is doing. Good logs include request IDs, user IDs, and the decisions the code made, not just stack traces.",
    why: "Without useful logs, debugging production is guessing; with them, it becomes reading.",
    misconception: "That more logs are always better. Bad logs drown signal in noise.",
    apply: "Replace three print statements with one structured log event per significant action.",
    example: "A log line contains user=123, action=checkout, amount=500, and duration_ms=42.",
    case_study:
      "The twelve-factor app methodology treats logs as an event stream that the environment can route and aggregate.",
    example_answer:
      "Write structured, time-ordered logs with request IDs, user IDs, and the decisions the code made.",
    anti_patterns: ["Printing raw stack traces only", "Logging everything at the same level"],
    resources: ["https://12factor.net/logs", "https://sre.google/sre-book/monitoring-distributed-systems/"],
    prereqs: ["error-handling"],
    next: ["observability", "incident-response"],
  },
  "test-driven-development": {
    category: "engineering",
    question: "How do you know a feature works before you build it?",
    explanation:
      "Test-driven development writes a failing test first, then the minimum code to make it pass, then refactors. It forces you to define what done looks like before you write the solution.",
    why: "Writing the test first exposes awkward interfaces and keeps the code testable from the start.",
    misconception: "That TDD means writing all tests up front. It is one small failing test at a time.",
    apply: "Pick the next feature, write one failing test that describes the desired behavior, then implement it.",
    example: "You write a test that expects isPrime(7) to be true before you write the isPrime function.",
    case_study:
      "Kent Beck created TDD during Extreme Programming, and it remains a core practice in teams that need to change code safely.",
    example_answer:
      "Write one small failing test, make it pass with the simplest code, then refactor while the test stays green.",
    anti_patterns: ["Writing all tests after the code", "Writing tests that match the implementation"],
    resources: ["https://martinfowler.com/bliki/TestDrivenDevelopment.html"],
    prereqs: ["static-type-checking"],
    next: ["unit-testing"],
  },
  "unit-testing": {
    category: "engineering",
    question: "How do you prove that one small piece of your code does what you think?",
    explanation:
      "A unit test checks a single function, class, or module in isolation. Fast, focused unit tests form the base of the testing pyramid and catch regressions before they reach integration.",
    why: "Without unit tests, every refactor is a risky guessing game.",
    misconception: "That unit tests are a waste of time for a prototype. Prototypes become products, and untested products break.",
    apply: "Write one unit test for the next function you add, then run the suite on every save.",
    example: "You test that calculateTax(100, 0.07) returns 7 without touching a database.",
    case_study:
      "Martin Fowlers unit testing guidance emphasizes fast, isolated tests written by the same developers who write the code.",
    example_answer:
      "Test one function or module in isolation with fast, deterministic inputs and outputs.",
    anti_patterns: ["Hitting real databases in unit tests", "Testing through many layers"],
    resources: ["https://martinfowler.com/bliki/UnitTest.html", "https://martinfowler.com/articles/practical-test-pyramid.html"],
    prereqs: ["test-driven-development"],
    next: ["test-doubles", "integration-testing", "code-coverage", "refactoring"],
  },
  "test-doubles": {
    category: "engineering",
    question: "How do you test a module that sends real emails or charges real cards?",
    explanation:
      "Test doubles replace slow, expensive, or non-deterministic collaborators during a test. Stubs, mocks, fakes, and spies let you test the unit in isolation while controlling the behavior of its dependencies.",
    why: "Tests that hit real networks are slow, flaky, and expensive; doubles keep tests fast and deterministic.",
    misconception: "That using mocks means faking everything. You only fake the boundary that makes the test hard.",
    apply: "Replace the real payment gateway with a fake that records charges and returns known responses.",
    example: "A fake email service captures the address and subject so the test can assert they are correct.",
    case_study:
      "Martin Fowler catalogued test double patterns to reduce confusion around stubs, mocks, and fakes.",
    example_answer:
      "Use stubs, mocks, or fakes to replace slow, external, or non-deterministic dependencies in tests.",
    anti_patterns: ["Mocking everything", "Using real payment APIs in tests"],
    resources: ["https://martinfowler.com/bliki/TestDouble.html", "https://martinfowler.com/articles/mocksArentStubs.html"],
    prereqs: ["unit-testing"],
    next: ["integration-testing"],
  },
  "integration-testing": {
    category: "engineering",
    question: "Why do two perfectly unit-tested modules sometimes fail when connected?",
    explanation:
      "Integration tests exercise the boundaries between modules: your code and the database, an API, or a message broker. They catch mismatches in assumptions that unit tests cannot see.",
    why: "A contract that both sides interpret differently is a bug waiting for production.",
    misconception: "That integration tests must spin up the whole world. Narrow integration tests cover one boundary at a time.",
    apply: "Write one test that calls your repository against a real database, then roll the transaction back.",
    example: "You test that createOrder correctly writes the order and the line items together.",
    case_study:
      "Etsys Try service ran integration tests before commits to keep trunk clean and deployable.",
    example_answer:
      "Test that real modules work together, usually with a real database or message broker but without the full UI.",
    anti_patterns: ["Replacing every dependency with a mock", "Testing the whole stack in every integration test"],
    resources: ["https://martinfowler.com/bliki/IntegrationTest.html", "https://martinfowler.com/articles/practical-test-pyramid.html"],
    prereqs: ["unit-testing", "test-doubles"],
    next: ["end-to-end-testing"],
  },
  "end-to-end-testing": {
    category: "engineering",
    question: "What guarantees that your most important user flow works from the browser to the database?",
    explanation:
      "End-to-end tests drive the application the way a user does, through the UI or public API. They are slow but catch the wiring mistakes that unit and integration tests miss.",
    why: "The highest-value user path can fail because of a missing button, a bad redirect, or a misconfigured route.",
    misconception: "That you need hundreds of end-to-end tests. A few critical paths are enough.",
    apply: "Automate the signup and checkout flows with a browser automation tool.",
    example: "A Playwright test signs up a user, adds an item, and completes a purchase.",
    case_study:
      "Rippling moved from Selenium to Playwright and cut flaky test failures and test run time significantly.",
    example_answer:
      "Run a real browser or client through the most important user flows to verify the whole system.",
    anti_patterns: ["Testing only happy paths", "Running every unit test through the UI"],
    resources: ["https://www.rippling.com/blog/revisiting-end-to-end-testing", "https://martinfowler.com/articles/practical-test-pyramid.html"],
    prereqs: ["integration-testing"],
    next: ["flaky-tests"],
  },
  "code-coverage": {
    category: "engineering",
    question: "How much of your code is actually exercised by your tests?",
    explanation:
      "Code coverage measures which lines or branches your tests executed. It is a useful diagnostic for finding untested paths, but it is not a guarantee that the tests are good.",
    why: "Untested code is the code most likely to break when you change something nearby.",
    misconception: "That 100% coverage means the code is correct. Coverage measures execution, not correctness.",
    apply: "Run a coverage report and add tests for the top three uncovered functions in a critical module.",
    example: "A coverage report shows that the refund path is never executed, so you add a test for it.",
    case_study:
      "Coverage.py and pytest-cov are standard tools for measuring coverage in Python projects.",
    example_answer:
      "Use coverage as a guide to find untested paths, not as proof that the code is correct.",
    anti_patterns: ["Chasing 100 percent coverage", "Ignoring uncovered critical paths"],
    resources: ["https://coverage.readthedocs.io/en/latest/index.html", "https://pytest-cov.readthedocs.io/en/stable/"],
    prereqs: ["unit-testing"],
    next: ["refactoring"],
  },
  "property-based-testing": {
    category: "engineering",
    question: "What if your tests could find edge cases you never thought to write?",
    explanation:
      "Property-based testing generates hundreds of random inputs and checks that a property always holds. It finds edge cases that hand-picked example tests miss.",
    why: "Programmers are bad at imagining every weird input; generators are not.",
    misconception: "That property-based testing replaces unit tests. It complements them by exploring the input space.",
    apply: "Write one property test for a pure function, such as reverse(reverse(list)) == list.",
    example: "A sort test checks that the output is sorted and contains the same elements as the input.",
    case_study:
      "Anthropic used a property-based testing agent with Hypothesis to find bugs in NumPy, SciPy, and Pandas.",
    example_answer:
      "Define properties that should always hold and let the tool generate many inputs to find edge cases.",
    anti_patterns: ["Only testing hand-picked examples", "Writing properties that are too weak"],
    resources: ["https://hypothesis.readthedocs.io/en/latest/", "https://www.anthropic.com/research/property-based-testing"],
    prereqs: ["unit-testing"],
    next: ["integration-testing"],
  },
  "flaky-tests": {
    category: "engineering",
    question: "What does it cost when a test fails for no reason related to the code?",
    explanation:
      "A flaky test passes and fails on the same code because of timing, environment, or shared state. Flaky tests erode trust in CI and hide real failures.",
    why: "When tests fail randomly, developers stop trusting them and start ignoring red builds.",
    misconception: "That rerunning the test is a fix. Rerunning just hides the instability.",
    apply: "Identify the three flakiest tests in your suite and replace timing dependencies with deterministic waits or doubles.",
    example: "A test that waits exactly one second is replaced by an explicit signal that the async work is done.",
    case_study:
      "Google reported that about 16% of their tests showed some flakiness, costing significant engineering time to investigate.",
    example_answer:
      "Find and fix the root cause of non-deterministic tests, such as timing, order, or external dependencies.",
    anti_patterns: ["Retrying until the test passes", "Ignoring flaky tests as noise"],
    resources: ["https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html", "https://docs.cypress.io/cloud/features/flaky-test-management"],
    prereqs: ["end-to-end-testing"],
    next: ["refactoring"],
  },
  "refactoring": {
    category: "engineering",
    question: "How do you change code without changing behavior?",
    explanation:
      "Refactoring restructures working code to make it cleaner, smaller, or clearer while keeping the same behavior. It depends on a good test suite to catch accidental changes.",
    why: "Code that is not refactored slowly calcifies until the cost of every new feature skyrockets.",
    misconception: "That refactoring is rewriting. It is many small, safe changes, not a big bang.",
    apply: "Rename one confusing variable and extract one long function into two smaller ones this week.",
    example: "You extract a 40-line function into a class with well-named methods and all existing tests still pass.",
    case_study:
      "Martin Fowlers Refactoring book catalogued code smells and the small transformations that remove them.",
    example_answer:
      "Change the internal structure without changing behavior, supported by passing tests.",
    anti_patterns: ["Refactoring without tests", "Changing behavior while cleaning code"],
    resources: ["https://martinfowler.com/books/refactoring.html", "https://refactoring.guru/"],
    prereqs: ["unit-testing", "flaky-tests"],
    next: ["architecture-decision-records", "technical-debt"],
  },
  "architecture-decision-records": {
    category: "architecture",
    question: "How will the next developer know why you chose this library or this shape?",
    explanation:
      "Architecture decision records are short documents that capture why a significant technical choice was made. They stop the same debate from happening every six months.",
    why: "Without written context, teams repeat old mistakes and new hires waste time rediscovering trade-offs.",
    misconception: "That ADRs are heavy bureaucratic documents. A good ADR is one page in a folder.",
    apply: "Write a one-page ADR for the next non-obvious dependency or framework choice.",
    example: "An ADR explains why the team picked PostgreSQL over SQLite for the hosted product.",
    case_study:
      "The ADR GitHub organization and Google Cloud publish lightweight templates used by many engineering teams.",
    example_answer:
      "Write a short record of the context, decision, and consequences for each significant technical choice.",
    anti_patterns: ["No written rationale", "Writing multi-page documents for every choice"],
    resources: ["https://adr.github.io/", "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"],
    prereqs: ["refactoring"],
    next: ["rest-api"],
  },
  "dependency-management": {
    category: "engineering",
    question: "What happens when the library you rely on releases a breaking change or disappears?",
    explanation:
      "Dependency management tracks the external packages you use, pins versions with lock files, and monitors for security updates. It keeps your build reproducible and safe.",
    why: "A surprise dependency update can break your app or introduce a supply-chain vulnerability.",
    misconception: "That using latest is fine. Latest is the version least tested with your code.",
    apply: "Check in a lock file and run an automated vulnerability scan on every pull request.",
    example: "A package-lock.json pins the exact versions so CI and your laptop install the same code.",
    case_study:
      "The 2016 left-pad incident broke thousands of npm builds when a single small package was removed from the registry.",
    example_answer:
      "Pin versions with a lock file, monitor for vulnerabilities, and review major updates before applying them.",
    anti_patterns: ["Always using latest", "Ignoring security advisories"],
    resources: ["https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json", "https://github.com/nodejs/package-maintenance/blob/main/docs/dependency-management-guidelines.md"],
    prereqs: ["version-control"],
    next: ["semantic-versioning"],
  },
  "semantic-versioning": {
    category: "engineering",
    question: "How do you communicate whether a new release will break existing callers?",
    explanation:
      "Semantic versioning encodes compatibility in the version number: major for breaking changes, minor for additive changes, patch for fixes. It lets consumers decide when to upgrade safely.",
    why: "Without a clear version contract, every update can become a surprise integration test.",
    misconception: "That version 0.x means anything goes forever. It means the API is not stable yet.",
    apply: "Start at 0.1.0 and bump major on any public API change that breaks callers.",
    example: "A library goes from 1.2.3 to 1.3.0 when it adds a new endpoint without changing existing ones.",
    case_study:
      "The npm ecosystem and most language package managers use SemVer as the default contract.",
    example_answer:
      "Use major.minor.patch to signal breaking, additive, and fix changes.",
    anti_patterns: ["Version 1.0.0 on day one", "Bumping major for every release"],
    resources: ["https://semver.org/spec/v2.0.0.html", "https://docs.npmjs.com/about-semantic-versioning"],
    prereqs: ["dependency-management"],
    next: ["rest-api", "back-of-the-envelope-estimation"],
  },

  // Architecture: designing systems that can change and grow
  "back-of-the-envelope-estimation": {
    category: "architecture",
    question: "Before you draw the diagram, do you know if you are building for hundreds or millions of users?",
    explanation:
      "Back-of-the-envelope estimation turns vague scale into numbers: daily active users, requests per second, storage, and fan-out. It is a quick way to find the first bottleneck before writing code.",
    why: "Without a rough scale, you may under-provision and crash or over-provision and waste money.",
    misconception: "That estimates must be precise. Order-of-magnitude is what changes the design.",
    apply: "Estimate QPS, payload size, and storage for the next feature, then pick the cheapest stack that fits.",
    example: "Five million users loading a feed twice a day is 120 QPS on average, a single Postgres instance, not a Kafka cluster.",
    case_study:
      "Jeff Dean's numbers-everyone-should-know talk showed how a few latency and throughput constants settle architecture arguments quickly.",
    resources: ["https://learnbackend.com/system-design/foundations-and-estimation/back-of-envelope-estimation/", "https://sre.google/sre-book/"],
    prereqs: ["semantic-versioning"],
    next: ["rest-api", "data-modeling"],
    example_answer: "Start with users, actions per day, request size, and fan-out to find the order of magnitude that changes the design.",
    anti_patterns: ["Guessing QPS from a single peak number", "Ignoring payload size"],
  },
  "rest-api": {
    category: "architecture",
    question: "What makes an API predictable and easy to evolve?",
    explanation:
      "REST organizes APIs around resources, uses standard HTTP verbs and status codes, and keeps state on the client. A resource-oriented API is easier to cache, document, and version than a jungle of custom endpoints.",
    why: "Ad-hoc endpoints with hidden assumptions become a maintenance tax for every consumer.",
    misconception: "That REST is dead. REST principles still underlie most stable public APIs.",
    apply: "Design one endpoint per resource, use GET for reads and POST/PUT/PATCH/DELETE for changes, and return consistent status codes.",
    example: "GET /orders/123 returns {id: 123, status: shipped, items: [...]}; POST /orders creates a new one.",
    case_study:
      "Stripe and GitHub base their public APIs on resource-oriented REST, making integration straightforward for millions of developers.",
    resources: ["https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design", "https://github.com/microsoft/api-guidelines/blob/master/Guidelines.md"],
    prereqs: ["back-of-the-envelope-estimation"],
    next: ["graphql", "api-contracts", "service-discovery"],
    example_answer: "Model resources with nouns and standard HTTP methods, then keep state out of the server.",
    anti_patterns: ["Using verbs in URLs like /createOrder", "Storing session state on the server"],
  },
  "api-contracts": {
    category: "architecture",
    question: "How do you keep consumers from breaking when your API changes?",
    explanation:
      "An API contract is a machine-readable description of the request and response shapes your API promises. OpenAPI is the most common format. Writing the contract first, reviewing it with consumers, and checking it in CI prevents drift between documentation, implementation, and clients.",
    why: "Without a contract, documentation, backend, frontend, and mobile clients all make different assumptions that turn into integration bugs and breaking changes.",
    misconception: "That API contracts are just documentation. They are the source of truth that can generate code, tests, and mocks.",
    apply: "Write an OpenAPI spec for the next endpoint before you implement it, then generate a mock server and client types from the spec.",
    example: "An OpenAPI spec for /orders defines the create request, the 201 response, and the error shape, so the frontend and backend compile against the same types.",
    case_study:
      "Stripe and GitHub publish OpenAPI specs that consumers, SDKs, and documentation all derive from.",
    resources: ["https://swagger.io/specification/", "https://codelit.io/blog/api-first-design-methodology"],
    prereqs: ["rest-api"],
    next: ["api-versioning"],
    example_answer: "Define the request and response schemas in a machine-readable contract such as OpenAPI, review it with consumers, and validate changes in CI.",
    anti_patterns: ["Writing the code first and generating the spec as an afterthought", "Changing the spec without consumer review"],
  },
  "graphql": {
    category: "architecture",
    question: "What if the client could request exactly the fields it needs in a single call?",
    explanation:
      "GraphQL lets clients describe the shape of the response they want, which prevents over-fetching and under-fetching. It is useful when a frontend needs data from many related resources.",
    why: "Mobile and web clients waste bandwidth and make many round trips when a REST API returns too much or too little.",
    misconception: "That GraphQL replaces REST. It is an alternative for cases with many read patterns and aggregations.",
    apply: "Expose a single /graphql endpoint, start with a small schema, and add resolver-level monitoring.",
    example: "A client asks for { user { name orders { total } } } and gets only those fields in one request.",
    case_study:
      "GitHub moved to GraphQL for some read-heavy views because it reduced the number of REST calls from eleven to one in common flows.",
    resources: ["https://graphql.org/learn/", "https://docs.github.com/en/graphql"],
    prereqs: ["rest-api"],
    next: ["api-versioning"],
    example_answer: "Use GraphQL when clients have diverse, nested data needs and you want to avoid N+1 request waterfalls.",
    anti_patterns: ["Exposing the entire database as a schema", "Not monitoring resolver cost"],
  },
  "api-versioning": {
    category: "architecture",
    question: "How do you improve an API without breaking every existing integration?",
    explanation:
      "API versioning lets you introduce changes while old clients keep working. The safest approach is to make additive changes in minor versions and pin breaking changes to explicit version headers or URLs.",
    why: "Breaking changes without a versioning strategy force every consumer to update at once, which is impossible for external users.",
    misconception: "That you can just change the API and notify users. They will not all upgrade in time.",
    apply: "Add a version header or path prefix, and never remove a field without a deprecation period.",
    example: "Stripe uses a Stripe-Version header so an integration pinned to 2022-11-15 keeps working even as new fields are added.",
    case_study:
      "Stripe has kept old API versions running for years, making upgrades a controlled client choice.",
    resources: ["https://docs.stripe.com/api/versioning", "https://docs.stripe.com/upgrades"],
    prereqs: ["rest-api", "api-contracts"],
    next: ["service-discovery"],
    example_answer: "Version the API contract and only make breaking changes behind a new major version that clients opt into.",
    anti_patterns: ["Unversioned breaking changes", "Removing fields with no deprecation"],
  },
  "service-discovery": {
    category: "architecture",
    question: "How does a client find the right instance to call when your service has ten replicas?",
    explanation:
      "Service discovery gives clients the current addresses of healthy instances. It can be DNS, a registry, or a sidecar proxy. Without it, you hardcode IPs that fail as soon as anything restarts.",
    why: "Hardcoded endpoints break on deploys, autoscaling, and failures.",
    misconception: "That service discovery is only for microservices. Even two replicas need a way to locate each other.",
    apply: "Use a DNS name or service registry for internal calls instead of IP addresses.",
    example: "In Kubernetes, http://orders-service resolves to any healthy pod via the cluster DNS.",
    case_study:
      "Netflix built Eureka so that its many microservices could find each other without static configuration.",
    resources: ["https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", "https://microservices.io/patterns/server-side-discovery.html"],
    prereqs: ["rest-api"],
    next: ["message-brokers", "multi-tenancy"],
    example_answer: "Use a registry or DNS so callers always resolve to a healthy, current instance.",
    anti_patterns: ["Hardcoding instance IPs", "Ignoring health state in routing"],
  },
  "message-brokers": {
    category: "architecture",
    question: "How do you keep services from calling each other directly and failing together?",
    explanation:
      "A message broker sits between services and stores messages until consumers can process them. It decouples producers from consumers and absorbs traffic spikes.",
    why: "Direct synchronous calls create a fragile chain where one slow service clogs the whole system.",
    misconception: "That message brokers add too much latency. They trade immediate response for availability and resilience.",
    apply: "Identify one cross-service call that can be async, publish an event, and consume it from a queue.",
    example: "An order service publishes order.placed and an email service consumes it to send a receipt later.",
    case_study:
      "LinkedIn built Kafka to handle trillions of messages per day and decouple data pipelines.",
    resources: ["https://www.rabbitmq.com/tutorials/tutorial-one-python.html", "https://kafka.apache.org/documentation/"],
    prereqs: ["service-discovery"],
    next: ["event-sourcing", "outbox-pattern", "queue-based-load-leveling"],
    example_answer: "Place a durable broker between services so producers and consumers can fail independently.",
    anti_patterns: ["Treating async flows as synchronous", "No retry or dead-letter setup"],
  },
  "event-sourcing": {
    category: "architecture",
    question: "What if your database stored not just current state, but every change that led to it?",
    explanation:
      "Event sourcing persists every state change as an event. Current state is a projection of the event stream. This enables audit trails, replay, and rebuilding read models.",
    why: "Storing only current state erases the history you need for debugging, compliance, and analytics.",
    misconception: "That event sourcing means you must use Kafka. It is a storage model, not a specific tool.",
    apply: "For one domain, store events in an append-only log and build a read projection from those events.",
    example: "A bank account is rebuilt from a stream of deposit and withdrawal events.",
    case_study:
      "The LMAX Disruptor used an event-sourced model to process millions of financial transactions with low latency.",
    resources: ["https://martinfowler.com/eaaDev/EventSourcing.html", "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing"],
    prereqs: ["message-brokers"],
    next: ["cqrs"],
    example_answer: "Persist events as the source of truth and derive current state from them.",
    anti_patterns: ["Mutating events after they are stored", "Using events as commands"],
  },
  "cqrs": {
    category: "architecture",
    question: "Why do the same data models often struggle with both writes and complex reads?",
    explanation:
      "Command Query Responsibility Segregation splits the model that updates data from the model that reads data. It is useful when read and write patterns diverge, such as dashboards and reporting.",
    why: "Trying to optimize one model for both heavy reads and complex writes leads to contention and awkward schemas.",
    misconception: "That CQRS is required for every microservice. It adds complexity that is only worth it for read/write asymmetry.",
    apply: "Before adopting CQRS, identify one query that is slow because it fights the write model.",
    example: "Order writes use a normalized model, while the order history view is a denormalized read projection.",
    case_study:
      "Martin Fowler notes CQRS can simplify complex domains but warns it is overkill for simple CRUD.",
    resources: ["https://martinfowler.com/bliki/CQRS.html", "https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs"],
    prereqs: ["event-sourcing"],
    next: ["domain-driven-design"],
    example_answer: "Separate the read model from the write model only when the two have very different needs.",
    anti_patterns: ["Applying CQRS to every table", "Ignoring eventual consistency"],
  },
  "domain-driven-design": {
    category: "architecture",
    question: "How do you keep software aligned with the business as it gets complex?",
    explanation:
      "Domain-driven design centers code around a shared, precise language used by developers and domain experts. Bounded contexts keep each model coherent and prevent a single giant model.",
    why: "Software drifts from the business when developers and stakeholders use the same words to mean different things.",
    misconception: "That DDD is just drawing diagrams. It is a way to structure code and language around the business.",
    apply: "Write down five key domain terms and make sure the code uses those names consistently.",
    example: "The word Order means different things in checkout, shipping, and billing, so each context owns its own model.",
    case_study:
      "Spotify and other large teams use bounded contexts to keep squad-sized code bases independent.",
    resources: ["https://martinfowler.com/bliki/DomainDrivenDesign.html", "https://martinfowler.com/bliki/BoundedContext.html"],
    prereqs: ["cqrs"],
    next: ["data-modeling", "strangler-fig-pattern"],
    example_answer: "Create a shared language and bounded contexts that match how the business actually works.",
    anti_patterns: ["One giant model for the whole company", "Domain terms that differ in code and conversation"],
  },
  "outbox-pattern": {
    category: "architecture",
    question: "How do you update a database and publish an event without losing one or duplicating the other?",
    explanation:
      "The outbox pattern stores the event in the same database transaction as the business update, then a relay publishes it. This avoids the dual-write problem without distributed transactions.",
    why: "If you update the DB and then publish to a broker, a crash can leave the DB changed and the event lost, or vice versa.",
    misconception: "That two-phase commit is the only way to keep them consistent. Outbox does the same without the heavy lock.",
    apply: "Add an outbox table, write events there in the same transaction, and run a relay to publish them.",
    example: "A transfer commits to the ledger and writes a TransferCompleted event to the outbox in one transaction.",
    case_study:
      "Shopify and Stripe payment flows use outbox-like patterns to guarantee order and payment events are published.",
    resources: ["https://microservices.io/patterns/data/transactional-outbox.html", "https://debezium.io/documentation/reference/stable/index.html"],
    prereqs: ["message-brokers"],
    next: ["choreography-vs-orchestration"],
    example_answer: "Write the event into an outbox table in the same database transaction, then publish it asynchronously.",
    anti_patterns: ["Sending the event before the DB commit", "Polling the outbox without idempotent consumers"],
  },
  "choreography-vs-orchestration": {
    category: "architecture",
    question: "Who should decide what happens next in a multi-step workflow: a central conductor or the participants?",
    explanation:
      "Choreography lets each service react to events from others with no central controller. Orchestration uses a central coordinator to invoke each step. Choreography is looser; orchestration is easier to trace and reason about.",
    why: "The wrong choice creates hidden coupling or a single point of failure in the workflow.",
    misconception: "That orchestration is always bad. Complex long-running workflows are often clearer with a coordinator.",
    apply: "For a simple workflow with few services, use choreography; for a complex one with compensation, use orchestration.",
    example: "In choreography, an order service publishes an event and the payment, inventory, and shipping services each react.",
    case_study:
      "Azure Architecture Center documents both patterns and recommends orchestration for sagas that need compensating transactions.",
    resources: ["https://learn.microsoft.com/en-us/azure/architecture/patterns/choreography", "https://learn.microsoft.com/en-us/azure/architecture/patterns/saga"],
    prereqs: ["outbox-pattern"],
    next: ["saga-pattern"],
    example_answer: "Choreography is fine for simple, event-driven flows; orchestration fits long-running, compensating workflows.",
    anti_patterns: ["Hidden cyclic dependencies in choreography", "A brittle central orchestrator"],
  },
  "multi-tenancy": {
    category: "architecture",
    question: "How do you serve many customers from one deployment while keeping their data apart?",
    explanation:
      "Multi-tenancy runs a single application for many customers, or tenants. Isolation can be at the database, schema, table, or row level. The right level depends on cost, compliance, and scale.",
    why: "A tenant seeing another tenant's data is a trust-destroying incident.",
    misconception: "That multi-tenancy always needs separate databases. Row-level isolation is often sufficient at small scale.",
    apply: "Pick one tenant-isolation strategy and enforce it in the data layer and in tests.",
    example: "A SaaS app adds tenant_id to every query and has a test that proves cross-tenant reads fail.",
    case_study:
      "Salesforce's metadata-driven multi-tenant platform serves many customers from shared infrastructure.",
    resources: ["https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/tenant-isolation.html", "https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-multitenant-architecture"],
    prereqs: ["service-discovery"],
    next: ["data-modeling"],
    example_answer: "Choose a tenant-isolation strategy and validate it in every data access path.",
    anti_patterns: ["Filtering in app code instead of the database", "No automated tenant-isolation tests"],
  },
  "strangler-fig-pattern": {
    category: "architecture",
    question: "How do you replace a legacy system without a risky big-bang cutover?",
    explanation:
      "The strangler fig pattern routes requests through a facade, gradually replacing legacy functionality with new services. The old system stays in use until the new one fully replaces it.",
    why: "Big-bang rewrites often miss hidden behavior and leave users without working software during the transition.",
    misconception: "That you must shut down the old system to start the new one. The two can coexist for a long time.",
    apply: "Put a proxy in front of the legacy system and route one endpoint at a time to the new implementation.",
    example: "A new checkout service handles /api/orders while every other path still goes to the monolith.",
    case_study:
      "Amazon has used strangler-fig strategies to modernize large legacy systems one feature at a time.",
    resources: ["https://martinfowler.com/bliki/StranglerFigApplication.html", "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/strangler-fig.html"],
    prereqs: ["rest-api", "monolith-vs-microservices"],
    next: ["domain-driven-design"],
    example_answer: "Route traffic through a facade and move one feature at a time from legacy to new services.",
    anti_patterns: ["Big-bang rewrite", "Copying every bug from the old system"],
  },

  // Data: storing, modeling, and moving data safely
  "data-modeling": {
    category: "data",
    question: "How do you structure data so it stays true to the domain and easy to query?",
    explanation:
      "Data modeling shapes entities, relationships, and constraints before the schema is built. It is the bridge between domain concepts and the actual database.",
    why: "A schema that does not match the domain produces invalid data, complex joins, and migration pain.",
    misconception: "That you can fix a bad model later. Schema changes become much harder once data exists.",
    apply: "Model three key entities, their relationships, and the constraints before creating tables.",
    example: "An order has many line items; each line item has one product and one product price.",
    case_study:
      "Airbnb's data models for listings, bookings, and payments enable reliable analytics and personalized search.",
    resources: ["https://martinfowler.com/bliki/DataModels.html", "https://www.postgresql.org/docs/18/ddl.html"],
    prereqs: ["back-of-the-envelope-estimation", "domain-driven-design"],
    next: ["relational-vs-nosql"],
    example_answer: "Define entities, relationships, and constraints that match how the business works.",
    anti_patterns: ["Starting with a single wide table", "Letting ORM generate the schema without review"],
  },
  "relational-vs-nosql": {
    category: "data",
    question: "When is a relational database the wrong tool for the job?",
    explanation:
      "Relational databases enforce structure and relationships, while NoSQL databases relax consistency for flexibility, scale, or speed. The choice depends on access patterns, consistency needs, and growth.",
    why: "Forcing a rigid schema on unstructured, massive, or write-heavy data leads to slowdowns and workarounds.",
    misconception: "That NoSQL is always faster. Without the right model it can be slower and harder to query.",
    apply: "List the consistency, query, and scale needs of a feature, then choose the data store.",
    example: "A leaderboard uses a sorted set in Redis; a ledger with strict relationships stays in Postgres.",
    case_study:
      "Facebook chose HBase for its messaging workload because the write pattern did not fit a relational model.",
    resources: ["https://aws.amazon.com/compare/the-difference-between-relational-and-non-relational-databases/", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html"],
    prereqs: ["data-modeling"],
    next: ["database-normalization"],
    example_answer: "Pick the data store based on access patterns, consistency, and scale, not hype.",
    anti_patterns: ["Using NoSQL for every new app", "Using one database for every workload"],
  },
  "database-normalization": {
    category: "data",
    question: "Why is the same customer address stored in five different tables?",
    explanation:
      "Database normalization removes redundancy and prevents update anomalies by organizing data into related tables that each hold one kind of fact.",
    why: "Redundant data drifts apart over time, leading to contradictory answers from the same database.",
    misconception: "That all data must be in one table for performance. Joins exist precisely to keep data consistent.",
    apply: "Start at third normal form, then denormalize only where a query proves too slow.",
    example: "Customers live in one table, orders in another, linked by customer_id instead of copying the address.",
    case_study:
      "Stripe's payment data is normalized to avoid mismatching balances across tables.",
    resources: ["https://www.dataquest.io/blog/sql-normalization/", "https://www.postgresql.org/docs/18/ddl-constraints.html"],
    prereqs: ["relational-vs-nosql"],
    next: ["database-constraints"],
    example_answer: "Split data so each table stores one kind of fact and link them with keys.",
    anti_patterns: ["One giant table with everything", "Denormalizing before measuring"],
  },
  "database-constraints": {
    category: "data",
    question: "Should the database trust the application to keep data valid?",
    explanation:
      "Constraints such as unique, not-null, foreign key, and check let the database enforce rules. They are the final guard against invalid data from any code path.",
    why: "Relying only on application validation leaves holes from migrations, scripts, and bugs.",
    misconception: "That constraints slow the database down. Modern databases handle them efficiently.",
    apply: "Add a unique constraint, a not-null, and a foreign key to the next table you create.",
    example: "A check constraint ensures product.price is greater than zero, blocking bad inserts from any source.",
    case_study:
      "Openbill Core, a pure-PostgreSQL billing engine, uses constraints and triggers to enforce that transfers stay balanced and append-only, processing tens of billions of dollars over ten years.",
    resources: ["https://www.postgresql.org/docs/18/ddl-constraints.html", "https://github.com/dapi/openbill-core"],
    prereqs: ["database-normalization"],
    next: ["orm-vs-sql", "transaction-isolation-levels"],
    example_answer: "Use constraints to make the database the final enforcer of data correctness.",
    anti_patterns: ["Validation only in the UI", "Soft constraints in app code"],
  },
  "orm-vs-sql": {
    category: "data",
    question: "Do you need an object-relational mapper, or should you write SQL directly?",
    explanation:
      "ORMs map objects to tables and reduce boilerplate. Raw SQL gives full control over queries. A healthy project uses both: ORM for simple CRUD, SQL for performance-critical paths.",
    why: "ORMs make N+1 queries and oversized transactions easy to write by accident.",
    misconception: "That ORMs free you from understanding SQL. They require you to understand SQL even more.",
    apply: "Use an ORM for basic operations, drop to SQL for complex reports and batch jobs.",
    example: "An ORM loads an order object with its items; raw SQL aggregates sales by region.",
    case_study:
      "Ted Neward's 'Vietnam of Computer Science' warned about the impedance mismatch between object and relational models.",
    resources: ["https://blogs.newardassociates.com/blog/2006/the-vietnam-of-computer-science.html", "https://www.sqlalchemy.org/"],
    prereqs: ["database-constraints"],
    next: ["n-plus-one", "query-optimization", "materialized-views"],
    example_answer: "Use ORMs for routine work and raw SQL for the few critical or complex queries.",
    anti_patterns: ["Putting all SQL in the app", "Trusting ORM defaults for every query"],
  },
  "transaction-isolation-levels": {
    category: "data",
    question: "How much can one transaction see of another transaction's work while it is still running?",
    explanation:
      "Isolation levels define how concurrent transactions interact. Higher levels prevent dirty reads, non-repeatable reads, and phantom reads, but they usually cost performance.",
    why: "Choosing the wrong level can expose uncommitted data or create subtle race conditions.",
    misconception: "That the strongest level is always best. It can deadlock and slow down normal work.",
    apply: "Start with the default, then raise isolation only for critical sections where anomalies would hurt.",
    example: "Read committed avoids dirty reads; serializable prevents phantom reads but may fail with concurrency.",
    case_study:
      "PostgreSQL defaults to read committed; financial systems often select serializable for account transfers.",
    resources: ["https://www.postgresql.org/docs/current/transaction-iso.html", "https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html"],
    prereqs: ["database-constraints"],
    next: ["database-locks"],
    example_answer: "Use the weakest isolation level that does not allow the anomalies your business cannot tolerate.",
    anti_patterns: ["Serializing every transaction", "Assuming the default works everywhere"],
  },
  "database-locks": {
    category: "data",
    question: "How do you stop two transactions from overwriting the same row at the same time?",
    explanation:
      "Database locks protect rows, tables, or indexes while a transaction runs. They turn concurrent writes into a safe sequence, but too many locks can cause deadlocks and timeouts.",
    why: "Without locks, concurrent updates can lose data or create inconsistent aggregates.",
    misconception: "That locks are always bad. They are necessary; the goal is to hold them for the shortest time.",
    apply: "Keep transactions short, access resources in a consistent order, and monitor lock waits.",
    example: "SELECT FOR UPDATE locks a row so a second transaction waits until the first commits.",
    case_study:
      "Shopify moved inventory reservations into MySQL and used row-level locks with SKIP LOCKED to prevent overselling during Black Friday traffic spikes.",
    resources: ["https://www.postgresql.org/docs/18/explicit-locking.html", "https://shopify.engineering/scaling-inventory-reservations"],
    prereqs: ["transaction-isolation-levels"],
    next: ["optimistic-locking"],
    example_answer: "Use row-level locks inside short transactions and a consistent resource order to avoid deadlocks.",
    anti_patterns: ["Long transactions holding locks", "Locking without a timeout"],
  },
  "optimistic-locking": {
    category: "data",
    question: "What if most writes do not conflict, and locking slows everything down?",
    explanation:
      "Optimistic locking reads a version number, updates only if the version is unchanged, and fails if another transaction won. It avoids the cost of locks for low-contention data.",
    why: "Pessimistic locks can serialize work unnecessarily, creating bottlenecks in collaborative apps.",
    misconception: "That the first write always wins. With optimistic locking, the first to commit wins, and others retry.",
    apply: "Add a version or updated_at column to an entity and include it in the update WHERE clause.",
    example: "UPDATE issue_check_list SET check_list = $1, updated_at = now() WHERE issue_id = $2 AND updated_at = $3.",
    case_study:
      "Atlassian Forge SQL uses optimistic locking so that two users cannot silently overwrite a release checklist.",
    resources: ["https://www.atlassian.com/blog/development/reliable-data-storage-using-optimistic-locking-in-forge-sql", "https://www.postgresql.org/docs/current/sql-update.html"],
    prereqs: ["database-locks"],
    next: ["materialized-views"],
    example_answer: "Use a version column and update only when the version matches; prompt the user on conflict.",
    anti_patterns: ["Retrying without surfacing the conflict", "Using optimistic locking in high-conflict domains"],
  },
  "materialized-views": {
    category: "data",
    question: "How do you speed up expensive, repeated reports without rewriting the same query everywhere?",
    explanation:
      "A materialized view stores the result of a query, making slow aggregations fast at the cost of freshness. Refresh it on a schedule or when triggered.",
    why: "Expensive joins and aggregations can drag down production traffic if run on every request.",
    misconception: "That materialized views are always current. They are a cached snapshot and need refresh.",
    apply: "Identify one slow dashboard query and turn it into a materialized view with a nightly refresh.",
    example: "A sales_summary materialized view rolls up daily revenue so the dashboard loads in milliseconds.",
    case_study:
      "Postgres materialized views help analytics teams run heavy reports without impacting OLTP queries.",
    resources: ["https://www.postgresql.org/docs/18/rules-materializedviews.html", "https://www.mssqltips.com/sqlservertip/5092/sql-server-materialized-views/"],
    prereqs: ["orm-vs-sql", "optimistic-locking"],
    next: ["database-partitioning"],
    example_answer: "Store the result of an expensive query and refresh it periodically for fast reads.",
    anti_patterns: ["Treating materialized views as real-time", "Refreshing too frequently"],
  },
  "change-data-capture": {
    category: "data",
    question: "How do you keep downstream systems in sync without querying the source database constantly?",
    explanation:
      "Change data capture reads the database transaction log and publishes every insert, update, and delete as an event. Downstream caches, indexes, and warehouses react to those events.",
    why: "Polling the database for changes is wasteful and adds load; CDC turns the database into an event source.",
    misconception: "That CDC is only for data warehouses. It is also great for cache invalidation and search indexes.",
    apply: "Use a CDC tool to stream one table's changes into a search index or cache.",
    example: "Debezium reads the Postgres WAL and publishes each row change to Kafka.",
    case_study:
      "Netflix uses CDC to keep its caches and search indexes updated from the source of truth without polling.",
    resources: ["https://debezium.io/documentation/reference/stable/index.html", "https://learn.microsoft.com/en-us/azure/architecture/patterns/claim-check"],
    prereqs: ["database-replication"],
    next: ["database-partitioning", "cache-aside"],
    example_answer: "Read the database transaction log and emit events for every change.",
    anti_patterns: ["Polling every few seconds", "Treating CDC events as commands"],
  },
  "database-partitioning": {
    category: "data",
    question: "What do you do when a single table is too large to query efficiently?",
    explanation:
      "Partitioning splits a table into smaller pieces, usually by range, list, or hash, so queries can skip irrelevant data and maintenance can run on parts of the table.",
    why: "A single multi-terabyte table makes vacuuming, indexing, and backups slow and risky.",
    misconception: "That partitioning makes queries faster by magic. It helps only when the query can prune partitions.",
    apply: "Partition a time-series table by month and verify the query plan prunes old partitions.",
    example: "A log table is partitioned by created_at month, so a query for today only scans one partition.",
    case_study:
      "GitHub introduced virtual schema domains and physical partitioning of its MySQL databases, reducing load on its main cluster by 50 percent and cutting database-related incidents.",
    resources: ["https://www.postgresql.org/docs/18/ddl-partitioning.html", "https://github.blog/engineering/infrastructure/partitioning-githubs-relational-databases-scale/"],
    prereqs: ["materialized-views", "change-data-capture"],
    next: ["database-sharding", "time-to-live"],
    example_answer: "Split large tables by a column used in queries, then confirm the database prunes partitions.",
    anti_patterns: ["Partitioning without checking query plans", "Too many partitions"],
  },
  "time-to-live": {
    category: "data",
    question: "How do you keep data from piling up forever without manual cleanup?",
    explanation:
      "Time to live sets an expiration on cache entries, messages, or rows. After the period expires, the item is removed automatically.",
    why: "Unbounded data growth causes storage costs to climb and queries to slow down.",
    misconception: "That TTL is only for caches. It is also useful for logs, sessions, and temporary data.",
    apply: "Set a TTL on the next temporary table or cache entry and delete or archive data on expiry.",
    example: "Redis EXPIRE session:abc 3600 deletes the key after one hour of inactivity.",
    case_study:
      "Twitch uses TTLs on Redis keys for live stream metadata and rate-limit counters.",
    resources: ["https://redis.io/docs/latest/commands/expire/", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"],
    prereqs: ["database-partitioning"],
    next: ["replication-lag", "cache-aside"],
    example_answer: "Set an expiration on temporary data so it is removed automatically.",
    anti_patterns: ["Manual deletion jobs that fail silently", "Storing transient data forever"],
  },
  "replication-lag": {
    category: "data",
    question: "What does it mean when a user writes data and then cannot see it in a read replica?",
    explanation:
      "Replication lag is the time between a write on the primary and the same write appearing on a replica. It makes read replicas stale and can violate user expectations.",
    why: "Routing all reads to replicas without handling lag makes users think their changes disappeared.",
    misconception: "That replication is instant. It can lag by milliseconds to minutes under load.",
    apply: "For reads after a user's own write, route to the primary or wait until the replica has caught up.",
    example: "A user saves a comment; the next request reads from a primary or a replica past the write's LSN.",
    case_study:
      "Bitbucket uses Log Sequence Numbers to route reads to replicas that have already caught up to a user's own writes.",
    resources: ["https://www.atlassian.com/blog/atlassian-engineering/scaling-bitbuckets-database", "https://www.postgresql.org/docs/current/warm-standby.html"],
    prereqs: ["database-replication", "time-to-live"],
    next: ["read-after-write-consistency"],
    example_answer: "Track the lag window and route read-after-write requests to replicas that have caught up.",
    anti_patterns: ["Reading from a replica immediately after a write", "Ignoring lag metrics"],
  },

  // Scaling: caching, capacity, and resilience
  "cache-aside": {
    category: "scaling",
    question: "Should the cache be the source of truth, or just a fast copy of the database?",
    explanation:
      "Cache-aside, or lazy loading, keeps the database as the source of truth and only populates the cache when a key is requested and missing. The application is responsible for both lookup and refresh.",
    why: "If the cache becomes the source of truth, losing it means losing data or serving stale values.",
    misconception: "That the cache must always be written to first. Cache-aside writes to the database and then to the cache on a miss.",
    apply: "Try cache first; on miss, read from the database, write to cache, and return the value.",
    example: "A user profile is read from Redis; if absent, it is loaded from Postgres and stored in Redis with a 5-minute TTL.",
    case_study:
      "McGraw-Hill used Amazon ElastiCache with lazy loading to reduce database load and improve reporting throughput.",
    resources: ["https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html", "https://redis.io/docs/latest/develop/use-cases/cache-aside/"],
    prereqs: ["time-to-live", "caching"],
    next: ["write-through-caching", "thundering-herd"],
    example_answer: "Look up the cache, fall back to the database on miss, and write the result back to the cache.",
    anti_patterns: ["Writing to cache before the database", "Never invalidating the cache"],
  },
  "write-through-caching": {
    category: "scaling",
    question: "How do you keep the cache from getting stale when the database changes?",
    explanation:
      "Write-through caching updates the cache and the database together on every write. Reads are fast and current, but writes are slower.",
    why: "Cache-aside can return old data because it only refreshes on a read miss.",
    misconception: "That write-through eliminates all staleness. Network partitions or failures can still leave a gap.",
    apply: "Use write-through when read-after-write consistency matters more than write latency.",
    example: "When a profile is updated, the app writes to Postgres and then to Redis in the same request.",
    case_study:
      "Uber CacheFront serves more than 150 million reads per second while keeping its cache coherent with writes.",
    resources: ["https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html", "https://www.uber.com/us/en/blog/how-uber-serves-over-150-million-reads/"],
    prereqs: ["cache-aside"],
    next: ["thundering-herd"],
    example_answer: "Update both the cache and the database together so the cache always reflects the latest data.",
    anti_patterns: ["Writing to cache but not the database", "Making writes wait for slow cache nodes"],
  },
  "thundering-herd": {
    category: "scaling",
    question: "What happens when a popular cache key expires and ten thousand requests hit the database at once?",
    explanation:
      "A cache stampede, or thundering herd, occurs when many clients request the same missing key at the same time and all fetch from the source. Probabilistic early expiration, locks, or request coalescing can prevent it.",
    why: "A stampede can crash the database that the cache was supposed to protect.",
    misconception: "That a single database can absorb the herd. The point is that the cache is there because the database cannot.",
    apply: "For a hot key, add a lock or a small chance for each request to refresh before the TTL expires.",
    example: "A front-page feed has a TTL of 60 seconds; a request in the last 10 seconds may refresh the key early with probability 0.1.",
    case_study:
      "The AWS Kinesis US-East-1 incident in 2020 showed how cascading load from many clients can overwhelm a system.",
    resources: ["https://redis.antirez.com/fundamental/cache-stampede-prevention.md", "https://aws.amazon.com/message/11201/"],
    prereqs: ["cache-aside"],
    next: ["throttling"],
    example_answer: "Prevent many clients from regenerating the same key by using locks or probabilistic early refresh.",
    anti_patterns: ["No TTL", "All clients regenerating the same key simultaneously"],
  },
  "throttling": {
    category: "scaling",
    question: "How do you slow traffic down before it overwhelms your service?",
    explanation:
      "Throttling limits the rate of requests or work a client can generate. It differs from rate limiting by prioritizing stability over a fixed quota, often through queueing or slowing rather than rejecting.",
    why: "Some traffic patterns, such as retry storms or batch jobs, can spike faster than any hard cap allows.",
    misconception: "That throttling and rate limiting are the same. Rate limiting rejects; throttling shapes or delays.",
    apply: "Add a throttling rule that queues or slows requests above a threshold instead of dropping them.",
    example: "A downstream API can be throttled to 100 calls per second and queue the rest for later processing.",
    case_study:
      "Uber's Global Rate Limiter scales request throttling across regions and services.",
    resources: ["https://www.uber.com/us/en/blog/ubers-rate-limiting-system/", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html"],
    prereqs: ["rate-limiting", "load-balancer-algorithms"],
    next: ["autoscaling-policies"],
    example_answer: "Shape or delay excess traffic instead of rejecting it to keep the system stable.",
    anti_patterns: ["Throttling without metrics", "Confusing throttling with rate limiting"],
  },
  "load-balancer-algorithms": {
    category: "scaling",
    question: "How does a load balancer decide which server gets the next request?",
    explanation:
      "Load balancers use algorithms such as round-robin, least connections, IP hash, or weighted distribution. The right one depends on request cost and whether clients need sticky sessions.",
    why: "A poor algorithm can overload a slow server or break stateful sessions.",
    misconception: "That round-robin is always fair. It ignores how long each request takes.",
    apply: "If requests vary in duration, try least-connections. If sessions need state, use sticky sessions or IP hash.",
    example: "A video transcoding service uses least-connections because some jobs take minutes and others take seconds.",
    case_study:
      "NGINX uses round-robin, least-connections, and IP hash to adapt to different traffic patterns.",
    resources: ["https://nginx.org/en/docs/http/load_balancing.html", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html"],
    prereqs: ["load-balancing"],
    next: ["throttling", "autoscaling-policies"],
    example_answer: "Pick an algorithm based on request cost and session needs, and monitor for uneven load.",
    anti_patterns: ["Round-robin for long-running requests", "Sticky sessions without health checks"],
  },
  "autoscaling-policies": {
    category: "scaling",
    question: "How do you add capacity before users notice slowdowns?",
    explanation:
      "Autoscaling policies watch metrics like CPU, queue depth, or request latency and add or remove instances. Target-tracking policies keep a metric near a set value.",
    why: "Manual scaling cannot react fast enough to real traffic and usually over-provisions.",
    misconception: "That autoscaling fixes code issues. It can hide an inefficient app if you do not also tune the code.",
    apply: "Set up a target-tracking policy on CPU or request count per target with a reasonable cooldown.",
    example: "An EC2 Auto Scaling group keeps average CPU at 50 percent by adding instances when usage exceeds that.",
    case_study:
      "Kubernetes Horizontal Pod Autoscaler scales pods based on CPU or custom metrics, keeping cost low and latency stable.",
    resources: ["https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html"],
    prereqs: ["horizontal-scaling"],
    next: ["queue-based-load-leveling"],
    example_answer: "Scale on a metric that predicts load, with a cooldown so you are not constantly resizing.",
    anti_patterns: ["Scaling too slowly for traffic spikes", "Autoscaling without load testing"],
  },
  "queue-based-load-leveling": {
    category: "scaling",
    question: "How do you absorb traffic spikes without adding servers instantly?",
    explanation:
      "Queue-based load leveling places a buffer between producers and consumers. Bursts of work pile up in the queue and are processed at the steady rate the backend can handle.",
    why: "Instant scaling is expensive and slow; a queue buys time and smooths demand.",
    misconception: "That queues make the system slower. They trade some latency for much higher throughput and stability.",
    apply: "Put a queue in front of a worker pool and process messages at a fixed, tunable rate.",
    example: "Image uploads go to a queue; workers resize them at a constant pace without overloading the service.",
    case_study:
      "McGraw-Hill used Amazon SQS to absorb large reporting jobs and improve throughput without over-provisioning.",
    resources: ["https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"],
    prereqs: ["message-brokers", "dead-letter-queues"],
    next: ["read-after-write-consistency"],
    example_answer: "Use a queue to buffer spikes and consume at a steady rate.",
    anti_patterns: ["No dead-letter queue", "A queue without back-pressure"],
  },
  "read-after-write-consistency": {
    category: "scaling",
    question: "How do you scale reads with replicas without making users think their data disappeared?",
    explanation:
      "Read-after-write consistency, also called read-your-own-writes, ensures that a user who just wrote data will see that data on subsequent reads, even if those reads come from replicas.",
    why: "Without this guarantee, a user can save a post and immediately see the old version.",
    misconception: "That eventual consistency is fine for all users. It is not fine for a user's own changes.",
    apply: "Track the user's last write position and route their reads to a replica that has caught up.",
    example: "After a write, the app reads from the primary for one second or uses a replica LSN greater than the write's LSN.",
    case_study:
      "Bitbucket solved read-after-write consistency using PostgreSQL LSN tracking and replica selection.",
    resources: ["https://www.atlassian.com/blog/atlassian-engineering/scaling-bitbuckets-database", "https://learn.microsoft.com/en-us/azure/architecture/patterns/retry"],
    prereqs: ["replication-lag", "eventual-consistency"],
    next: ["consistent-hashing"],
    example_answer: "Route a user's own reads to a replica that has seen their write, or to the primary briefly.",
    anti_patterns: ["Ignoring replication lag for own-writes", "Routing all traffic to the primary"],
  },
  "consistent-hashing": {
    category: "scaling",
    question: "How do you add a cache or database node without remapping almost every key?",
    explanation:
      "Consistent hashing maps both keys and servers onto a ring. When a server is added or removed, only the keys between the new server and its neighbor move. Virtual nodes (many tokens per physical server) keep the ring balanced.",
    why: "Modulo hashing remaps almost every key when the node count changes, causing cache misses, migration storms, and hotspots.",
    misconception: "That consistent hashing removes all data movement. It minimizes it, but some rebalancing is still required.",
    apply: "Pick a consistent hashing library for the next sharded cache or database and add virtual nodes before going to production.",
    example: "A cache uses a hash ring; adding a node only moves 1/N of the keys to the new node instead of nearly all of them.",
    case_study:
      "Amazon Dynamo and Apache Cassandra use consistent hashing with virtual nodes to scale storage without massive rebalancing.",
    resources: ["https://cassandra.apache.org/doc/5.0.8/cassandra/architecture/dynamo.html", "https://backendbytes.com/articles/consistent-hashing-guide/"],
    prereqs: ["database-sharding"],
    next: ["hot-spot-mitigation"],
    example_answer: "Place both keys and servers on a hash ring, walk the ring to find owners, and use virtual nodes to balance load as the cluster grows.",
    anti_patterns: ["Using hash % N for a growing cluster", "Forgetting virtual nodes"],
  },
  "hot-spot-mitigation": {
    category: "scaling",
    question: "What do you do when one key or shard gets all the traffic?",
    explanation:
      "Hot-spot mitigation replicates popular data, splits keys, or moves load across nodes so that no single shard becomes a bottleneck. Even with perfect hashing, skewed access can create hotspots.",
    why: "A single hot key or celebrity account can saturate one node and raise latency for everyone on that node.",
    misconception: "That consistent hashing alone fixes it. Real workloads have long-tail popularity.",
    apply: "Identify the top 1 percent of keys and add local caching, replication, or key splitting.",
    example: "A product page for a viral item is replicated across Redis shards and cached at the CDN edge.",
    case_study:
      "Alibaba's Tair handles Single's Day hotspots with HotZone replication and local caching.",
    resources: ["https://hackernoon.com/how-to-improve-hotspot-data-hashing-on-an-elastic-cache-platform-6999d729e305", "https://redis.io/docs/latest/operate/rs/monitoring/observability/"],
    prereqs: ["database-sharding", "consistent-hashing", "read-after-write-consistency"],
    next: ["multi-region"],
    example_answer: "Replicate hot data, split hot keys, and add local caches so no single node becomes a bottleneck.",
    anti_patterns: ["Assuming uniform access", "Ignoring hot-key metrics"],
  },
};
