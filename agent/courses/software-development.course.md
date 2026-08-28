# Software Development Course: From First Commit to Production-Scale Systems

This pillar teaches vibe coders how to write, test, deploy, and operate code that grows from a first prototype to a production-grade system. The course is a walkable graph of concepts across engineering, architecture, data, and scaling.

The new concept seeds should be merged with the existing catalog; they do not duplicate any existing key. Existing catalog concepts that appear in the learning path are marked as _(existing)_ so the learner can see where this pillar connects to the shared graph.

## Learning path at a glance

### Engineering foundations and safe change

- **version-control**: What happens if your laptop dies tonight and the only copy of your code is on it?
- **trunk-based-development**: Why do long-lived branches often become a nightmare to merge?
- **pre-commit-hooks**: What if a broken or secret-laden commit made it into the repository?
- **linting-and-formatting**: How much code-review time is wasted arguing about spacing or quote style?
- **static-type-checking**: How many of your bugs would have been caught if the compiler knew the shape of your data?
- **error-handling**: What does your code do when an API it depends on returns garbage or nothing at all?
- **logging**: When a user reports a bug, how long does it take you to reconstruct what happened?
- **dependency-management**: What happens when the library you rely on releases a breaking change or disappears?
- **semantic-versioning**: How do you communicate whether a new release will break existing callers?

### Testing and confidence

- **test-driven-development**: How do you know a feature works before you build it?
- **unit-testing**: How do you prove that one small piece of your code does what you think?
- **test-doubles**: How do you test a module that sends real emails or charges real cards?
- **integration-testing**: Why do two perfectly unit-tested modules sometimes fail when connected?
- **end-to-end-testing**: What guarantees that your most important user flow works from the browser to the database?
- **code-coverage**: How much of your code is actually exercised by your tests?
- **property-based-testing**: What if your tests could find edge cases you never thought to write?
- **flaky-tests**: What does it cost when a test fails for no reason related to the code?
- **refactoring**: How do you change code without changing behavior?

### Architecture and API design

- **architecture-decision-records**: How will the next developer know why you chose this library or this shape?
- **back-of-the-envelope-estimation**: Before you draw the diagram, do you know if you are building for hundreds or millions of users?
- **rest-api**: What makes an API predictable and easy to evolve?
- **api-contracts**: How do you keep consumers from breaking when your API changes?
- **graphql**: What if the client could request exactly the fields it needs in a single call?
- **api-versioning**: How do you improve an API without breaking every existing integration?
- **api-gateway** _(existing)_: referenced as a bridge in this path
- **reverse-proxy** _(existing)_: referenced as a bridge in this path
- **service-discovery**: How does a client find the right instance to call when your service has ten replicas?
- **multi-tenancy**: How do you serve many customers from one deployment while keeping their data apart?
- **monolith-vs-microservices** _(existing)_: referenced as a bridge in this path
- **strangler-fig-pattern**: How do you replace a legacy system without a risky big-bang cutover?

### Data modeling and consistency

- **data-modeling**: How do you structure data so it stays true to the domain and easy to query?
- **relational-vs-nosql**: When is a relational database the wrong tool for the job?
- **database-normalization**: Why is the same customer address stored in five different tables?
- **database-constraints**: Should the database trust the application to keep data valid?
- **orm-vs-sql**: Do you need an object-relational mapper, or should you write SQL directly?
- **n-plus-one** _(existing)_: referenced as a bridge in this path
- **query-optimization** _(existing)_: referenced as a bridge in this path
- **database-indexing** _(existing)_: referenced as a bridge in this path
- **pagination** _(existing)_: referenced as a bridge in this path
- **transaction-isolation-levels**: How much can one transaction see of another transaction's work while it is still running?
- **database-locks**: How do you stop two transactions from overwriting the same row at the same time?
- **optimistic-locking**: What if most writes do not conflict, and locking slows everything down?
- **materialized-views**: How do you speed up expensive, repeated reports without rewriting the same query everywhere?

### Moving and storing data at scale

- **change-data-capture**: How do you keep downstream systems in sync without querying the source database constantly?
- **database-partitioning**: What do you do when a single table is too large to query efficiently?
- **time-to-live**: How do you keep data from piling up forever without manual cleanup?
- **database-replication** _(existing)_: referenced as a bridge in this path
- **replication-lag**: What does it mean when a user writes data and then cannot see it in a read replica?
- **connection-pooling** _(existing)_: referenced as a bridge in this path
- **database-sharding** _(existing)_: referenced as a bridge in this path

### Asynchronous systems and messaging

- **message-brokers**: How do you keep services from calling each other directly and failing together?
- **outbox-pattern**: How do you update a database and publish an event without losing one or duplicating the other?
- **event-sourcing**: What if your database stored not just current state, but every change that led to it?
- **cqrs**: Why do the same data models often struggle with both writes and complex reads?
- **domain-driven-design**: How do you keep software aligned with the business as it gets complex?
- **choreography-vs-orchestration**: Who should decide what happens next in a multi-step workflow: a central conductor or the participants?
- **saga-pattern** _(existing)_: referenced as a bridge in this path
- **queues** _(existing)_: referenced as a bridge in this path
- **dead-letter-queues** _(existing)_: referenced as a bridge in this path

### Scaling, caching, capacity, and resilience

- **caching** _(existing)_: referenced as a bridge in this path
- **cache-invalidation** _(existing)_: referenced as a bridge in this path
- **cache-aside**: Should the cache be the source of truth, or just a fast copy of the database?
- **write-through-caching**: How do you keep the cache from getting stale when the database changes?
- **thundering-herd**: What happens when a popular cache key expires and ten thousand requests hit the database at once?
- **throttling**: How do you slow traffic down before it overwhelms your service?
- **rate-limiting** _(existing)_: referenced as a bridge in this path
- **load-balancing** _(existing)_: referenced as a bridge in this path
- **load-balancer-algorithms**: How does a load balancer decide which server gets the next request?
- **autoscaling** _(existing)_: referenced as a bridge in this path
- **autoscaling-policies**: How do you add capacity before users notice slowdowns?
- **vertical-scaling** _(existing)_: referenced as a bridge in this path
- **horizontal-scaling** _(existing)_: referenced as a bridge in this path
- **stateless-services** _(existing)_: referenced as a bridge in this path
- **queue-based-load-leveling**: How do you absorb traffic spikes without adding servers instantly?
- **read-after-write-consistency**: How do you scale reads with replicas without making users think their data disappeared?
- **consistent-hashing**: How do you add a cache or database node without remapping almost every key?
- **hot-spot-mitigation**: What do you do when one key or shard gets all the traffic?

### Resilience and failure handling

- **timeouts** _(existing)_: referenced as a bridge in this path
- **circuit-breaker** _(existing)_: referenced as a bridge in this path
- **bulkhead** _(existing)_: referenced as a bridge in this path
- **back-off-and-retry** _(existing)_: referenced as a bridge in this path
- **graceful-degradation** _(existing)_: referenced as a bridge in this path
- **load-shedding** _(existing)_: referenced as a bridge in this path
- **fallback** _(existing)_: referenced as a bridge in this path

### Production operations and ongoing improvement

- **ci-cd** _(existing)_: referenced as a bridge in this path
- **code-review** _(existing)_: referenced as a bridge in this path
- **feature-flags** _(existing)_: referenced as a bridge in this path
- **database-migrations** _(existing)_: referenced as a bridge in this path
- **technical-debt** _(existing)_: referenced as a bridge in this path
- **observability** _(existing)_: referenced as a bridge in this path
- **incident-response** _(existing)_: referenced as a bridge in this path
- **health-checks** _(existing)_: referenced as a bridge in this path

## Concept graph

This table lists every new concept, the categories and concepts that feed into it, and the concepts it unlocks. Cross-pillar references to existing catalog concepts are marked _(existing)_.

| concept | category | prereqs | next |
|---|---|---|---|
| version-control | engineering | — | **trunk-based-development**, **pre-commit-hooks**, **linting-and-formatting**, **dependency-management** |
| trunk-based-development | engineering | **version-control** | **pre-commit-hooks**, **ci-cd** _(existing)_, **feature-flags** _(existing)_ |
| pre-commit-hooks | engineering | **version-control** | **linting-and-formatting**, **ci-cd** _(existing)_ |
| linting-and-formatting | engineering | **version-control** | **static-type-checking** |
| static-type-checking | engineering | **linting-and-formatting** | **test-driven-development** |
| error-handling | engineering | **version-control** | **logging**, **timeouts** _(existing)_ |
| logging | engineering | **error-handling** | **observability** _(existing)_, **incident-response** _(existing)_ |
| test-driven-development | engineering | **static-type-checking** | **unit-testing** |
| unit-testing | engineering | **test-driven-development** | **test-doubles**, **integration-testing**, **code-coverage**, **refactoring** |
| test-doubles | engineering | **unit-testing** | **integration-testing** |
| integration-testing | engineering | **unit-testing**, **test-doubles** | **end-to-end-testing** |
| end-to-end-testing | engineering | **integration-testing** | **flaky-tests** |
| code-coverage | engineering | **unit-testing** | **refactoring** |
| property-based-testing | engineering | **unit-testing** | **integration-testing** |
| flaky-tests | engineering | **end-to-end-testing** | **refactoring** |
| refactoring | engineering | **unit-testing**, **flaky-tests** | **architecture-decision-records**, **technical-debt** _(existing)_ |
| dependency-management | engineering | **version-control** | **semantic-versioning** |
| semantic-versioning | engineering | **dependency-management** | **rest-api**, **back-of-the-envelope-estimation** |
| architecture-decision-records | architecture | **refactoring** | **rest-api** |
| back-of-the-envelope-estimation | architecture | **semantic-versioning** | **rest-api**, **data-modeling** |
| rest-api | architecture | **back-of-the-envelope-estimation** | **graphql**, **api-contracts**, **service-discovery** |
| api-contracts | architecture | **rest-api** | **api-versioning** |
| graphql | architecture | **rest-api** | **api-versioning** |
| api-versioning | architecture | **rest-api**, **api-contracts** | **service-discovery** |
| service-discovery | architecture | **rest-api** | **message-brokers**, **multi-tenancy** |
| message-brokers | architecture | **service-discovery** | **event-sourcing**, **outbox-pattern**, **queue-based-load-leveling** |
| event-sourcing | architecture | **message-brokers** | **cqrs** |
| cqrs | architecture | **event-sourcing** | **domain-driven-design** |
| domain-driven-design | architecture | **cqrs** | **data-modeling**, **strangler-fig-pattern** |
| outbox-pattern | architecture | **message-brokers** | **choreography-vs-orchestration** |
| choreography-vs-orchestration | architecture | **outbox-pattern** | **saga-pattern** _(existing)_ |
| multi-tenancy | architecture | **service-discovery** | **data-modeling** |
| strangler-fig-pattern | architecture | **rest-api**, **monolith-vs-microservices** _(existing)_ | **domain-driven-design** |
| data-modeling | data | **back-of-the-envelope-estimation**, **domain-driven-design** | **relational-vs-nosql** |
| relational-vs-nosql | data | **data-modeling** | **database-normalization** |
| database-normalization | data | **relational-vs-nosql** | **database-constraints** |
| database-constraints | data | **database-normalization** | **orm-vs-sql**, **transaction-isolation-levels** |
| orm-vs-sql | data | **database-constraints** | **n-plus-one** _(existing)_, **query-optimization** _(existing)_, **materialized-views** |
| transaction-isolation-levels | data | **database-constraints** | **database-locks** |
| database-locks | data | **transaction-isolation-levels** | **optimistic-locking** |
| optimistic-locking | data | **database-locks** | **materialized-views** |
| materialized-views | data | **orm-vs-sql**, **optimistic-locking** | **database-partitioning** |
| change-data-capture | data | **database-replication** _(existing)_ | **database-partitioning**, **cache-aside** |
| database-partitioning | data | **materialized-views**, **change-data-capture** | **database-sharding** _(existing)_, **time-to-live** |
| time-to-live | data | **database-partitioning** | **replication-lag**, **cache-aside** |
| replication-lag | data | **database-replication** _(existing)_, **time-to-live** | **read-after-write-consistency** |
| cache-aside | scaling | **time-to-live**, **caching** _(existing)_ | **write-through-caching**, **thundering-herd** |
| write-through-caching | scaling | **cache-aside** | **thundering-herd** |
| thundering-herd | scaling | **cache-aside** | **throttling** |
| throttling | scaling | **rate-limiting** _(existing)_, **load-balancer-algorithms** | **autoscaling-policies** |
| load-balancer-algorithms | scaling | **load-balancing** _(existing)_ | **throttling**, **autoscaling-policies** |
| autoscaling-policies | scaling | **horizontal-scaling** _(existing)_ | **queue-based-load-leveling** |
| queue-based-load-leveling | scaling | **message-brokers**, **dead-letter-queues** _(existing)_ | **read-after-write-consistency** |
| read-after-write-consistency | scaling | **replication-lag**, **eventual-consistency** _(existing)_ | **consistent-hashing** |
| consistent-hashing | scaling | **database-sharding** _(existing)_ | **hot-spot-mitigation** |
| hot-spot-mitigation | scaling | **database-sharding** _(existing)_, **consistent-hashing**, **read-after-write-consistency** | **multi-region** _(existing)_ |

## Existing catalog concepts used or enriched

The course references the following existing catalog concepts as prerequisites, next steps, or bridges. They are not duplicated in the seeds above; this course treats them as part of the overall learning path.

- **api-gateway**
- **authentication-vs-authorization**
- **autoscaling**
- **back-off-and-retry**
- **bulkhead**
- **cache-invalidation**
- **caching**
- **ci-cd**
- **circuit-breaker**
- **code-review**
- **connection-pooling**
- **csrf**
- **database-indexing**
- **database-migrations**
- **database-replication**
- **database-sharding**
- **dead-letter-queues**
- **eventual-consistency**
- **fallback**
- **feature-flags**
- **graceful-degradation**
- **health-checks**
- **horizontal-scaling**
- **idempotency**
- **incident-response**
- **input-validation**
- **load-balancing**
- **load-shedding**
- **monolith-vs-microservices**
- **multi-region**
- **n-plus-one**
- **observability**
- **pagination**
- **query-optimization**
- **queues**
- **rate-limiting**
- **read-replicas**
- **reverse-proxy**
- **saga-pattern**
- **sql-injection**
- **state-management**
- **stateless-services**
- **technical-debt**
- **testing-pyramid**
- **timeouts**
- **vertical-scaling**
- **webhook-security**
- **webhooks**
- **xss**

## Suggested enrichments for existing catalog concepts

The following existing catalog concepts are natural stepping stones or complements for the new seeds above. The course markdown and the seed graph use them as bridges; the coordinator may enrich them with the extra context below.

- **ci-cd**: Pair with `trunk-based-development`, `pre-commit-hooks`, and `feature-flags` so the course shows how small, verified changes flow to production and can be rolled back.
- **database-migrations**: Enrich with the idea of backward-compatible migrations and the risk of long-lived locks; connect to `database-constraints` and `database-partitioning`.
- **n-plus-one**: Connect directly to `orm-vs-sql`, `query-optimization`, and `database-indexing` so the learner sees how ORM choices, query shape, and indexing interact.
- **query-optimization**: Expand with `EXPLAIN` plans, index hints, and the trade-off between `materialized-views` and live queries.
- **cache-invalidation**: Link to `cache-aside`, `write-through-caching`, and `thundering-herd` as the operational reality after a cache is introduced.
- **rate-limiting**: Bridge to `throttling` and `autoscaling-policies` so the learner sees hard quotas, soft shaping, and capacity working together.
- **load-balancing**: Enrich with `load-balancer-algorithms`, `health-checks`, and `connection-pooling` to show how traffic is distributed and drained safely.
- **monolith-vs-microservices**: Connect to `strangler-fig-pattern`, `domain-driven-design`, and `service-discovery` so the choice is framed as an evolution, not a religion.
- **database-sharding**: Link to `database-partitioning`, `hot-spot-mitigation`, and `replication-lag` for a fuller scaling story.
- **database-replication** and **read-replicas**: Enrich with `replication-lag`, `read-after-write-consistency`, and `eventual-consistency` to explain the consistency spectrum.
- **feature-flags**: Connect with `trunk-based-development`, `ci-cd`, and `code-review` as the mechanism that makes continuous deployment safe.
- **technical-debt**: Frame around `refactoring`, `architecture-decision-records`, and `code-coverage` so the learner can prioritize and pay it down.
- **state-management** and **stateless-services**: Contrast stateless services with stateful clients and sessions; link to `horizontal-scaling` and `load-balancing`.
- **api-gateway** and **reverse-proxy**: Show how a gateway routes, transforms, and protects APIs, while a reverse proxy sits in front of application servers.
- **webhooks** and **webhook-security**: Cover push-based HTTP callbacks, idempotency, signatures, and retry handling.
- **database-indexing**: Connect to `query-optimization`, `n-plus-one`, and `materialized-views` to explain how indexes change query plans.
- **timeouts**, **circuit-breaker**, **bulkhead**, **back-off-and-retry**, **graceful-degradation**, and **load-shedding**: Build a resilience module that shows how to fail safely instead of failing hard.
- **observability**, **incident-response**, and **health-checks**: Close the loop between running code and knowing when it is broken.

## Rationale

1. **Engineering foundations and safe change** come first because a vibe coder who cannot reproduce, format, type-check, and version their code will spend most of their energy on avoidable mistakes.
2. **Testing and confidence** follow because automated confidence lets the team change code quickly without fear.
3. **Architecture and API design** come once code is safe, so the learner can think about how systems connect and evolve.
4. **Data modeling and consistency** are next because almost every production failure eventually becomes a data-integrity question.
5. **Moving and storing data at scale** introduces partitioning, replication, and CDC before the learner asks how to support millions of rows.
6. **Asynchronous systems and messaging** teach how to decouple services and handle cross-cutting workflows.
7. **Scaling, caching, and resilience** prepare the learner for traffic, replicas, and the failure modes that only appear at scale.
8. **Resilience and failure handling** make the scaling work safe under partial failure.
9. **Production operations and ongoing improvement** close the loop: CI/CD, feature flags, and migrations keep the system alive and improving.

## Detailed lessons

### Engineering

#### version-control

**Question:** What happens if your laptop dies tonight and the only copy of your code is on it?

**Explanation:** Version control records every change to your code, lets you undo mistakes, and lets multiple people work on the same project without overwriting each other. It is the safety net underneath every other engineering practice.

**Why it matters:** Without version control, a single deleted file or broken laptop can erase days of work, and collaboration becomes a game of passing zip files.

**Common misconception:** That version control is only for large teams. Solo developers lose work the exact same way.

**Apply:** Initialize a Git repo for your project and commit every time a feature or fix is complete.

**Example:** You try an experiment, it breaks, and you run 'git checkout -- .' to get back to a known good state in seconds.

**Example answer:** Use version control to record every change, create a clean history, and never leave the only copy on a single machine.

**Anti-patterns:** *Saving code as timestamped zip files*, *Working on long-lived local branches without commits*

**Case study:** The 2017 GitLab database deletion showed the value of disciplined version control and tested backups; the team recovered by replaying the Git repository of configuration and code.

**Resources:** https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

**Next:** **trunk-based-development**, **pre-commit-hooks**, **linting-and-formatting**, **dependency-management**

---

#### trunk-based-development

**Question:** Why do long-lived branches often become a nightmare to merge?

**Explanation:** Trunk-based development keeps a single main branch that is always releasable. Developers use short-lived branches or commit directly to main, validated by CI. It prevents the merge conflicts and integration surprises that grow with branch age.

**Why it matters:** The longer a branch lives, the more it diverges from main, and the bigger the risky integration becomes.

**Common misconception:** That you need feature branches to keep main stable. Stability comes from small changes and feature flags, not isolation.

**Apply:** Set a team rule that branches live no longer than a day and merge through a reviewed pull request.

**Example:** A developer opens a branch, adds one small change, tests it, and merges it within two hours.

**Example answer:** Keep one main branch, make small short-lived branches or direct commits, and use CI and feature flags to keep it releasable.

**Anti-patterns:** *Long-lived feature branches*, *Merging without CI*

**Case study:** Etsy deploys from trunk more than fifty times a day, with each engineer comfortable that main is always shippable.

**Resources:** https://trunkbaseddevelopment.com/, https://martinfowler.com/articles/continuousIntegration.html

**Prereqs:** **version-control**

**Next:** **pre-commit-hooks**, **ci-cd**, **feature-flags**

---

#### pre-commit-hooks

**Question:** What if a broken or secret-laden commit made it into the repository?

**Explanation:** Pre-commit hooks run small checks before a commit is accepted, such as linting, formatting, secret scanning, or type checking. They catch cheap mistakes before they become part of shared history.

**Why it matters:** A bad commit that reaches main can block the whole team and leak credentials that are hard to rotate.

**Common misconception:** That pre-commit hooks slow you down. They are faster than a CI failure or a security incident.

**Apply:** Add a pre-commit hook that runs your formatter and a secret scanner on every commit.

**Example:** A hook rejects a commit that contains an API key in a .env file before it is ever pushed.

**Example answer:** Run automated checks such as lint, format, type, and secret scans before a commit is accepted.

**Anti-patterns:** *Skipping hooks to save time*, *Relying only on CI to catch local mistakes*

**Case study:** Many organizations use the pre-commit framework to standardize checks across Python, JavaScript, and infrastructure code.

**Resources:** https://pre-commit.com/, https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks

**Prereqs:** **version-control**

**Next:** **linting-and-formatting**, **ci-cd**

---

#### linting-and-formatting

**Question:** How much code-review time is wasted arguing about spacing or quote style?

**Explanation:** Linters find suspicious code and enforce rules; formatters rewrite code to a consistent style. Together they remove the noisy style debates that hide real design issues in code review.

**Why it matters:** Inconsistent style makes code harder to read, and un-caught suspicious patterns become production bugs.

**Common misconception:** That linting is just opinionated nagging. It is an automated second pair of eyes.

**Apply:** Turn on a formatter and a linter in your editor and fail CI when they report issues.

**Example:** Prettier reformats the whole file to the team style, so the diff shows only the actual logic change.

**Example answer:** Use a linter to catch suspicious code and a formatter to enforce a single style so reviews focus on logic.

**Anti-patterns:** *Arguing about style in every PR*, *Disabling all linter rules*

**Case study:** Open-source projects like Prettier and Black are widely adopted because they eliminate style debates in reviews.

**Resources:** https://prettier.io/docs/en/, https://eslint.org/docs/latest/

**Prereqs:** **version-control**

**Next:** **static-type-checking**

---

#### static-type-checking

**Question:** How many of your bugs would have been caught if the compiler knew the shape of your data?

**Explanation:** Static type checking verifies that functions receive and return the right kinds of values before the program runs. It turns whole classes of runtime crashes into red squiggles in the editor.

**Why it matters:** Dynamic typing is fast to write but expensive to debug once the code base grows.

**Common misconception:** That types slow down prototyping. They slow the first draft and speed every refactor after it.

**Apply:** Enable the strictest type-checking mode your language supports and annotate the most-shared functions first.

**Example:** TypeScript rejects a call to processPayment(undefined) because the function expects a Payment object.

**Example answer:** Use a type system to catch shape and null errors at compile time before they become runtime bugs.

**Anti-patterns:** *Using any everywhere to avoid type errors*, *Turning off strict mode*

**Case study:** Dropbox type-checked four million lines of Python with mypy and found that the largest projects benefit most from types.

**Resources:** https://mypy.readthedocs.io/en/stable/index.html, https://www.typescriptlang.org/docs/

**Prereqs:** **linting-and-formatting**

**Next:** **test-driven-development**

---

#### error-handling

**Question:** What does your code do when an API it depends on returns garbage or nothing at all?

**Explanation:** Error handling is the discipline of deciding what happens when things go wrong: returning clear errors, failing fast, and never swallowing exceptions. It keeps failures visible and bounded.

**Why it matters:** Silent failures hide in logs until they corrupt data or blow up at 3am.

**Common misconception:** That errors are exceptional so they can be ignored. Most production time is spent handling failure.

**Apply:** Add explicit error branches for every external call in one critical flow and log the context.

**Example:** A payment handler throws a typed InvalidCardError instead of returning null and hoping the caller checks.

**Example answer:** Return clear, typed errors, fail fast, log context, and never silently swallow exceptions.

**Anti-patterns:** *Returning null for every failure*, *Catching exceptions and doing nothing*

**Case study:** The Knight Capital trading loss of over $440 million was traced to unhandled legacy code paths being reactivated during a deploy.

**Resources:** https://sre.google/sre-book/handling-overload/, https://12factor.net/logs

**Prereqs:** **version-control**

**Next:** **logging**, **timeouts**

---

#### logging

**Question:** When a user reports a bug, how long does it take you to reconstruct what happened?

**Explanation:** Logging writes a structured, time-ordered record of what the application is doing. Good logs include request IDs, user IDs, and the decisions the code made, not just stack traces.

**Why it matters:** Without useful logs, debugging production is guessing; with them, it becomes reading.

**Common misconception:** That more logs are always better. Bad logs drown signal in noise.

**Apply:** Replace three print statements with one structured log event per significant action.

**Example:** A log line contains user=123, action=checkout, amount=500, and duration_ms=42.

**Example answer:** Write structured, time-ordered logs with request IDs, user IDs, and the decisions the code made.

**Anti-patterns:** *Printing raw stack traces only*, *Logging everything at the same level*

**Case study:** The twelve-factor app methodology treats logs as an event stream that the environment can route and aggregate.

**Resources:** https://12factor.net/logs, https://sre.google/sre-book/monitoring-distributed-systems/

**Prereqs:** **error-handling**

**Next:** **observability**, **incident-response**

---

#### test-driven-development

**Question:** How do you know a feature works before you build it?

**Explanation:** Test-driven development writes a failing test first, then the minimum code to make it pass, then refactors. It forces you to define what done looks like before you write the solution.

**Why it matters:** Writing the test first exposes awkward interfaces and keeps the code testable from the start.

**Common misconception:** That TDD means writing all tests up front. It is one small failing test at a time.

**Apply:** Pick the next feature, write one failing test that describes the desired behavior, then implement it.

**Example:** You write a test that expects isPrime(7) to be true before you write the isPrime function.

**Example answer:** Write one small failing test, make it pass with the simplest code, then refactor while the test stays green.

**Anti-patterns:** *Writing all tests after the code*, *Writing tests that match the implementation*

**Case study:** Kent Beck created TDD during Extreme Programming, and it remains a core practice in teams that need to change code safely.

**Resources:** https://martinfowler.com/bliki/TestDrivenDevelopment.html

**Prereqs:** **static-type-checking**

**Next:** **unit-testing**

---

#### unit-testing

**Question:** How do you prove that one small piece of your code does what you think?

**Explanation:** A unit test checks a single function, class, or module in isolation. Fast, focused unit tests form the base of the testing pyramid and catch regressions before they reach integration.

**Why it matters:** Without unit tests, every refactor is a risky guessing game.

**Common misconception:** That unit tests are a waste of time for a prototype. Prototypes become products, and untested products break.

**Apply:** Write one unit test for the next function you add, then run the suite on every save.

**Example:** You test that calculateTax(100, 0.07) returns 7 without touching a database.

**Example answer:** Test one function or module in isolation with fast, deterministic inputs and outputs.

**Anti-patterns:** *Hitting real databases in unit tests*, *Testing through many layers*

**Case study:** Martin Fowlers unit testing guidance emphasizes fast, isolated tests written by the same developers who write the code.

**Resources:** https://martinfowler.com/bliki/UnitTest.html, https://martinfowler.com/articles/practical-test-pyramid.html

**Prereqs:** **test-driven-development**

**Next:** **test-doubles**, **integration-testing**, **code-coverage**, **refactoring**

---

#### test-doubles

**Question:** How do you test a module that sends real emails or charges real cards?

**Explanation:** Test doubles replace slow, expensive, or non-deterministic collaborators during a test. Stubs, mocks, fakes, and spies let you test the unit in isolation while controlling the behavior of its dependencies.

**Why it matters:** Tests that hit real networks are slow, flaky, and expensive; doubles keep tests fast and deterministic.

**Common misconception:** That using mocks means faking everything. You only fake the boundary that makes the test hard.

**Apply:** Replace the real payment gateway with a fake that records charges and returns known responses.

**Example:** A fake email service captures the address and subject so the test can assert they are correct.

**Example answer:** Use stubs, mocks, or fakes to replace slow, external, or non-deterministic dependencies in tests.

**Anti-patterns:** *Mocking everything*, *Using real payment APIs in tests*

**Case study:** Martin Fowler catalogued test double patterns to reduce confusion around stubs, mocks, and fakes.

**Resources:** https://martinfowler.com/bliki/TestDouble.html, https://martinfowler.com/articles/mocksArentStubs.html

**Prereqs:** **unit-testing**

**Next:** **integration-testing**

---

#### integration-testing

**Question:** Why do two perfectly unit-tested modules sometimes fail when connected?

**Explanation:** Integration tests exercise the boundaries between modules: your code and the database, an API, or a message broker. They catch mismatches in assumptions that unit tests cannot see.

**Why it matters:** A contract that both sides interpret differently is a bug waiting for production.

**Common misconception:** That integration tests must spin up the whole world. Narrow integration tests cover one boundary at a time.

**Apply:** Write one test that calls your repository against a real database, then roll the transaction back.

**Example:** You test that createOrder correctly writes the order and the line items together.

**Example answer:** Test that real modules work together, usually with a real database or message broker but without the full UI.

**Anti-patterns:** *Replacing every dependency with a mock*, *Testing the whole stack in every integration test*

**Case study:** Etsys Try service ran integration tests before commits to keep trunk clean and deployable.

**Resources:** https://martinfowler.com/bliki/IntegrationTest.html, https://martinfowler.com/articles/practical-test-pyramid.html

**Prereqs:** **unit-testing**, **test-doubles**

**Next:** **end-to-end-testing**

---

#### end-to-end-testing

**Question:** What guarantees that your most important user flow works from the browser to the database?

**Explanation:** End-to-end tests drive the application the way a user does, through the UI or public API. They are slow but catch the wiring mistakes that unit and integration tests miss.

**Why it matters:** The highest-value user path can fail because of a missing button, a bad redirect, or a misconfigured route.

**Common misconception:** That you need hundreds of end-to-end tests. A few critical paths are enough.

**Apply:** Automate the signup and checkout flows with a browser automation tool.

**Example:** A Playwright test signs up a user, adds an item, and completes a purchase.

**Example answer:** Run a real browser or client through the most important user flows to verify the whole system.

**Anti-patterns:** *Testing only happy paths*, *Running every unit test through the UI*

**Case study:** Rippling moved from Selenium to Playwright and cut flaky test failures and test run time significantly.

**Resources:** https://www.rippling.com/blog/revisiting-end-to-end-testing, https://martinfowler.com/articles/practical-test-pyramid.html

**Prereqs:** **integration-testing**

**Next:** **flaky-tests**

---

#### code-coverage

**Question:** How much of your code is actually exercised by your tests?

**Explanation:** Code coverage measures which lines or branches your tests executed. It is a useful diagnostic for finding untested paths, but it is not a guarantee that the tests are good.

**Why it matters:** Untested code is the code most likely to break when you change something nearby.

**Common misconception:** That 100% coverage means the code is correct. Coverage measures execution, not correctness.

**Apply:** Run a coverage report and add tests for the top three uncovered functions in a critical module.

**Example:** A coverage report shows that the refund path is never executed, so you add a test for it.

**Example answer:** Use coverage as a guide to find untested paths, not as proof that the code is correct.

**Anti-patterns:** *Chasing 100 percent coverage*, *Ignoring uncovered critical paths*

**Case study:** Coverage.py and pytest-cov are standard tools for measuring coverage in Python projects.

**Resources:** https://coverage.readthedocs.io/en/latest/index.html, https://pytest-cov.readthedocs.io/en/stable/

**Prereqs:** **unit-testing**

**Next:** **refactoring**

---

#### property-based-testing

**Question:** What if your tests could find edge cases you never thought to write?

**Explanation:** Property-based testing generates hundreds of random inputs and checks that a property always holds. It finds edge cases that hand-picked example tests miss.

**Why it matters:** Programmers are bad at imagining every weird input; generators are not.

**Common misconception:** That property-based testing replaces unit tests. It complements them by exploring the input space.

**Apply:** Write one property test for a pure function, such as reverse(reverse(list)) == list.

**Example:** A sort test checks that the output is sorted and contains the same elements as the input.

**Example answer:** Define properties that should always hold and let the tool generate many inputs to find edge cases.

**Anti-patterns:** *Only testing hand-picked examples*, *Writing properties that are too weak*

**Case study:** Anthropic used a property-based testing agent with Hypothesis to find bugs in NumPy, SciPy, and Pandas.

**Resources:** https://hypothesis.readthedocs.io/en/latest/, https://www.anthropic.com/research/property-based-testing

**Prereqs:** **unit-testing**

**Next:** **integration-testing**

---

#### flaky-tests

**Question:** What does it cost when a test fails for no reason related to the code?

**Explanation:** A flaky test passes and fails on the same code because of timing, environment, or shared state. Flaky tests erode trust in CI and hide real failures.

**Why it matters:** When tests fail randomly, developers stop trusting them and start ignoring red builds.

**Common misconception:** That rerunning the test is a fix. Rerunning just hides the instability.

**Apply:** Identify the three flakiest tests in your suite and replace timing dependencies with deterministic waits or doubles.

**Example:** A test that waits exactly one second is replaced by an explicit signal that the async work is done.

**Example answer:** Find and fix the root cause of non-deterministic tests, such as timing, order, or external dependencies.

**Anti-patterns:** *Retrying until the test passes*, *Ignoring flaky tests as noise*

**Case study:** Google reported that about 16% of their tests showed some flakiness, costing significant engineering time to investigate.

**Resources:** https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html, https://docs.cypress.io/cloud/features/flaky-test-management

**Prereqs:** **end-to-end-testing**

**Next:** **refactoring**

---

#### refactoring

**Question:** How do you change code without changing behavior?

**Explanation:** Refactoring restructures working code to make it cleaner, smaller, or clearer while keeping the same behavior. It depends on a good test suite to catch accidental changes.

**Why it matters:** Code that is not refactored slowly calcifies until the cost of every new feature skyrockets.

**Common misconception:** That refactoring is rewriting. It is many small, safe changes, not a big bang.

**Apply:** Rename one confusing variable and extract one long function into two smaller ones this week.

**Example:** You extract a 40-line function into a class with well-named methods and all existing tests still pass.

**Example answer:** Change the internal structure without changing behavior, supported by passing tests.

**Anti-patterns:** *Refactoring without tests*, *Changing behavior while cleaning code*

**Case study:** Martin Fowlers Refactoring book catalogued code smells and the small transformations that remove them.

**Resources:** https://martinfowler.com/books/refactoring.html, https://refactoring.guru/

**Prereqs:** **unit-testing**, **flaky-tests**

**Next:** **architecture-decision-records**, **technical-debt**

---

#### dependency-management

**Question:** What happens when the library you rely on releases a breaking change or disappears?

**Explanation:** Dependency management tracks the external packages you use, pins versions with lock files, and monitors for security updates. It keeps your build reproducible and safe.

**Why it matters:** A surprise dependency update can break your app or introduce a supply-chain vulnerability.

**Common misconception:** That using latest is fine. Latest is the version least tested with your code.

**Apply:** Check in a lock file and run an automated vulnerability scan on every pull request.

**Example:** A package-lock.json pins the exact versions so CI and your laptop install the same code.

**Example answer:** Pin versions with a lock file, monitor for vulnerabilities, and review major updates before applying them.

**Anti-patterns:** *Always using latest*, *Ignoring security advisories*

**Case study:** The 2016 left-pad incident broke thousands of npm builds when a single small package was removed from the registry.

**Resources:** https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json, https://github.com/nodejs/package-maintenance/blob/main/docs/dependency-management-guidelines.md

**Prereqs:** **version-control**

**Next:** **semantic-versioning**

---

#### semantic-versioning

**Question:** How do you communicate whether a new release will break existing callers?

**Explanation:** Semantic versioning encodes compatibility in the version number: major for breaking changes, minor for additive changes, patch for fixes. It lets consumers decide when to upgrade safely.

**Why it matters:** Without a clear version contract, every update can become a surprise integration test.

**Common misconception:** That version 0.x means anything goes forever. It means the API is not stable yet.

**Apply:** Start at 0.1.0 and bump major on any public API change that breaks callers.

**Example:** A library goes from 1.2.3 to 1.3.0 when it adds a new endpoint without changing existing ones.

**Example answer:** Use major.minor.patch to signal breaking, additive, and fix changes.

**Anti-patterns:** *Version 1.0.0 on day one*, *Bumping major for every release*

**Case study:** The npm ecosystem and most language package managers use SemVer as the default contract.

**Resources:** https://semver.org/spec/v2.0.0.html, https://docs.npmjs.com/about-semantic-versioning

**Prereqs:** **dependency-management**

**Next:** **rest-api**, **back-of-the-envelope-estimation**

---

### Architecture

#### architecture-decision-records

**Question:** How will the next developer know why you chose this library or this shape?

**Explanation:** Architecture decision records are short documents that capture why a significant technical choice was made. They stop the same debate from happening every six months.

**Why it matters:** Without written context, teams repeat old mistakes and new hires waste time rediscovering trade-offs.

**Common misconception:** That ADRs are heavy bureaucratic documents. A good ADR is one page in a folder.

**Apply:** Write a one-page ADR for the next non-obvious dependency or framework choice.

**Example:** An ADR explains why the team picked PostgreSQL over SQLite for the hosted product.

**Example answer:** Write a short record of the context, decision, and consequences for each significant technical choice.

**Anti-patterns:** *No written rationale*, *Writing multi-page documents for every choice*

**Case study:** The ADR GitHub organization and Google Cloud publish lightweight templates used by many engineering teams.

**Resources:** https://adr.github.io/, https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions

**Prereqs:** **refactoring**

**Next:** **rest-api**

---

#### back-of-the-envelope-estimation

**Question:** Before you draw the diagram, do you know if you are building for hundreds or millions of users?

**Explanation:** Back-of-the-envelope estimation turns vague scale into numbers: daily active users, requests per second, storage, and fan-out. It is a quick way to find the first bottleneck before writing code.

**Why it matters:** Without a rough scale, you may under-provision and crash or over-provision and waste money.

**Common misconception:** That estimates must be precise. Order-of-magnitude is what changes the design.

**Apply:** Estimate QPS, payload size, and storage for the next feature, then pick the cheapest stack that fits.

**Example:** Five million users loading a feed twice a day is 120 QPS on average, a single Postgres instance, not a Kafka cluster.

**Example answer:** Start with users, actions per day, request size, and fan-out to find the order of magnitude that changes the design.

**Anti-patterns:** *Guessing QPS from a single peak number*, *Ignoring payload size*

**Case study:** Jeff Dean's numbers-everyone-should-know talk showed how a few latency and throughput constants settle architecture arguments quickly.

**Resources:** https://learnbackend.com/system-design/foundations-and-estimation/back-of-envelope-estimation/, https://sre.google/sre-book/

**Prereqs:** **semantic-versioning**

**Next:** **rest-api**, **data-modeling**

---

#### rest-api

**Question:** What makes an API predictable and easy to evolve?

**Explanation:** REST organizes APIs around resources, uses standard HTTP verbs and status codes, and keeps state on the client. A resource-oriented API is easier to cache, document, and version than a jungle of custom endpoints.

**Why it matters:** Ad-hoc endpoints with hidden assumptions become a maintenance tax for every consumer.

**Common misconception:** That REST is dead. REST principles still underlie most stable public APIs.

**Apply:** Design one endpoint per resource, use GET for reads and POST/PUT/PATCH/DELETE for changes, and return consistent status codes.

**Example:** GET /orders/123 returns {id: 123, status: shipped, items: [...]}; POST /orders creates a new one.

**Example answer:** Model resources with nouns and standard HTTP methods, then keep state out of the server.

**Anti-patterns:** *Using verbs in URLs like /createOrder*, *Storing session state on the server*

**Case study:** Stripe and GitHub base their public APIs on resource-oriented REST, making integration straightforward for millions of developers.

**Resources:** https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design, https://github.com/microsoft/api-guidelines/blob/master/Guidelines.md

**Prereqs:** **back-of-the-envelope-estimation**

**Next:** **graphql**, **api-contracts**, **service-discovery**

---

#### api-contracts

**Question:** How do you keep consumers from breaking when your API changes?

**Explanation:** An API contract is a machine-readable description of the request and response shapes your API promises. OpenAPI is the most common format. Writing the contract first, reviewing it with consumers, and checking it in CI prevents drift between documentation, implementation, and clients.

**Why it matters:** Without a contract, documentation, backend, frontend, and mobile clients all make different assumptions that turn into integration bugs and breaking changes.

**Common misconception:** That API contracts are just documentation. They are the source of truth that can generate code, tests, and mocks.

**Apply:** Write an OpenAPI spec for the next endpoint before you implement it, then generate a mock server and client types from the spec.

**Example:** An OpenAPI spec for /orders defines the create request, the 201 response, and the error shape, so the frontend and backend compile against the same types.

**Example answer:** Define the request and response schemas in a machine-readable contract such as OpenAPI, review it with consumers, and validate changes in CI.

**Anti-patterns:** *Writing the code first and generating the spec as an afterthought*, *Changing the spec without consumer review*

**Case study:** Stripe and GitHub publish OpenAPI specs that consumers, SDKs, and documentation all derive from.

**Resources:** https://swagger.io/specification/, https://codelit.io/blog/api-first-design-methodology

**Prereqs:** **rest-api**

**Next:** **api-versioning**

---

#### graphql

**Question:** What if the client could request exactly the fields it needs in a single call?

**Explanation:** GraphQL lets clients describe the shape of the response they want, which prevents over-fetching and under-fetching. It is useful when a frontend needs data from many related resources.

**Why it matters:** Mobile and web clients waste bandwidth and make many round trips when a REST API returns too much or too little.

**Common misconception:** That GraphQL replaces REST. It is an alternative for cases with many read patterns and aggregations.

**Apply:** Expose a single /graphql endpoint, start with a small schema, and add resolver-level monitoring.

**Example:** A client asks for { user { name orders { total } } } and gets only those fields in one request.

**Example answer:** Use GraphQL when clients have diverse, nested data needs and you want to avoid N+1 request waterfalls.

**Anti-patterns:** *Exposing the entire database as a schema*, *Not monitoring resolver cost*

**Case study:** GitHub moved to GraphQL for some read-heavy views because it reduced the number of REST calls from eleven to one in common flows.

**Resources:** https://graphql.org/learn/, https://docs.github.com/en/graphql

**Prereqs:** **rest-api**

**Next:** **api-versioning**

---

#### api-versioning

**Question:** How do you improve an API without breaking every existing integration?

**Explanation:** API versioning lets you introduce changes while old clients keep working. The safest approach is to make additive changes in minor versions and pin breaking changes to explicit version headers or URLs.

**Why it matters:** Breaking changes without a versioning strategy force every consumer to update at once, which is impossible for external users.

**Common misconception:** That you can just change the API and notify users. They will not all upgrade in time.

**Apply:** Add a version header or path prefix, and never remove a field without a deprecation period.

**Example:** Stripe uses a Stripe-Version header so an integration pinned to 2022-11-15 keeps working even as new fields are added.

**Example answer:** Version the API contract and only make breaking changes behind a new major version that clients opt into.

**Anti-patterns:** *Unversioned breaking changes*, *Removing fields with no deprecation*

**Case study:** Stripe has kept old API versions running for years, making upgrades a controlled client choice.

**Resources:** https://docs.stripe.com/api/versioning, https://docs.stripe.com/upgrades

**Prereqs:** **rest-api**, **api-contracts**

**Next:** **service-discovery**

---

#### service-discovery

**Question:** How does a client find the right instance to call when your service has ten replicas?

**Explanation:** Service discovery gives clients the current addresses of healthy instances. It can be DNS, a registry, or a sidecar proxy. Without it, you hardcode IPs that fail as soon as anything restarts.

**Why it matters:** Hardcoded endpoints break on deploys, autoscaling, and failures.

**Common misconception:** That service discovery is only for microservices. Even two replicas need a way to locate each other.

**Apply:** Use a DNS name or service registry for internal calls instead of IP addresses.

**Example:** In Kubernetes, http://orders-service resolves to any healthy pod via the cluster DNS.

**Example answer:** Use a registry or DNS so callers always resolve to a healthy, current instance.

**Anti-patterns:** *Hardcoding instance IPs*, *Ignoring health state in routing*

**Case study:** Netflix built Eureka so that its many microservices could find each other without static configuration.

**Resources:** https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/, https://microservices.io/patterns/server-side-discovery.html

**Prereqs:** **rest-api**

**Next:** **message-brokers**, **multi-tenancy**

---

#### message-brokers

**Question:** How do you keep services from calling each other directly and failing together?

**Explanation:** A message broker sits between services and stores messages until consumers can process them. It decouples producers from consumers and absorbs traffic spikes.

**Why it matters:** Direct synchronous calls create a fragile chain where one slow service clogs the whole system.

**Common misconception:** That message brokers add too much latency. They trade immediate response for availability and resilience.

**Apply:** Identify one cross-service call that can be async, publish an event, and consume it from a queue.

**Example:** An order service publishes order.placed and an email service consumes it to send a receipt later.

**Example answer:** Place a durable broker between services so producers and consumers can fail independently.

**Anti-patterns:** *Treating async flows as synchronous*, *No retry or dead-letter setup*

**Case study:** LinkedIn built Kafka to handle trillions of messages per day and decouple data pipelines.

**Resources:** https://www.rabbitmq.com/tutorials/tutorial-one-python.html, https://kafka.apache.org/documentation/

**Prereqs:** **service-discovery**

**Next:** **event-sourcing**, **outbox-pattern**, **queue-based-load-leveling**

---

#### event-sourcing

**Question:** What if your database stored not just current state, but every change that led to it?

**Explanation:** Event sourcing persists every state change as an event. Current state is a projection of the event stream. This enables audit trails, replay, and rebuilding read models.

**Why it matters:** Storing only current state erases the history you need for debugging, compliance, and analytics.

**Common misconception:** That event sourcing means you must use Kafka. It is a storage model, not a specific tool.

**Apply:** For one domain, store events in an append-only log and build a read projection from those events.

**Example:** A bank account is rebuilt from a stream of deposit and withdrawal events.

**Example answer:** Persist events as the source of truth and derive current state from them.

**Anti-patterns:** *Mutating events after they are stored*, *Using events as commands*

**Case study:** The LMAX Disruptor used an event-sourced model to process millions of financial transactions with low latency.

**Resources:** https://martinfowler.com/eaaDev/EventSourcing.html, https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing

**Prereqs:** **message-brokers**

**Next:** **cqrs**

---

#### cqrs

**Question:** Why do the same data models often struggle with both writes and complex reads?

**Explanation:** Command Query Responsibility Segregation splits the model that updates data from the model that reads data. It is useful when read and write patterns diverge, such as dashboards and reporting.

**Why it matters:** Trying to optimize one model for both heavy reads and complex writes leads to contention and awkward schemas.

**Common misconception:** That CQRS is required for every microservice. It adds complexity that is only worth it for read/write asymmetry.

**Apply:** Before adopting CQRS, identify one query that is slow because it fights the write model.

**Example:** Order writes use a normalized model, while the order history view is a denormalized read projection.

**Example answer:** Separate the read model from the write model only when the two have very different needs.

**Anti-patterns:** *Applying CQRS to every table*, *Ignoring eventual consistency*

**Case study:** Martin Fowler notes CQRS can simplify complex domains but warns it is overkill for simple CRUD.

**Resources:** https://martinfowler.com/bliki/CQRS.html, https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs

**Prereqs:** **event-sourcing**

**Next:** **domain-driven-design**

---

#### domain-driven-design

**Question:** How do you keep software aligned with the business as it gets complex?

**Explanation:** Domain-driven design centers code around a shared, precise language used by developers and domain experts. Bounded contexts keep each model coherent and prevent a single giant model.

**Why it matters:** Software drifts from the business when developers and stakeholders use the same words to mean different things.

**Common misconception:** That DDD is just drawing diagrams. It is a way to structure code and language around the business.

**Apply:** Write down five key domain terms and make sure the code uses those names consistently.

**Example:** The word Order means different things in checkout, shipping, and billing, so each context owns its own model.

**Example answer:** Create a shared language and bounded contexts that match how the business actually works.

**Anti-patterns:** *One giant model for the whole company*, *Domain terms that differ in code and conversation*

**Case study:** Spotify and other large teams use bounded contexts to keep squad-sized code bases independent.

**Resources:** https://martinfowler.com/bliki/DomainDrivenDesign.html, https://martinfowler.com/bliki/BoundedContext.html

**Prereqs:** **cqrs**

**Next:** **data-modeling**, **strangler-fig-pattern**

---

#### outbox-pattern

**Question:** How do you update a database and publish an event without losing one or duplicating the other?

**Explanation:** The outbox pattern stores the event in the same database transaction as the business update, then a relay publishes it. This avoids the dual-write problem without distributed transactions.

**Why it matters:** If you update the DB and then publish to a broker, a crash can leave the DB changed and the event lost, or vice versa.

**Common misconception:** That two-phase commit is the only way to keep them consistent. Outbox does the same without the heavy lock.

**Apply:** Add an outbox table, write events there in the same transaction, and run a relay to publish them.

**Example:** A transfer commits to the ledger and writes a TransferCompleted event to the outbox in one transaction.

**Example answer:** Write the event into an outbox table in the same database transaction, then publish it asynchronously.

**Anti-patterns:** *Sending the event before the DB commit*, *Polling the outbox without idempotent consumers*

**Case study:** Shopify and Stripe payment flows use outbox-like patterns to guarantee order and payment events are published.

**Resources:** https://microservices.io/patterns/data/transactional-outbox.html, https://debezium.io/documentation/reference/stable/index.html

**Prereqs:** **message-brokers**

**Next:** **choreography-vs-orchestration**

---

#### choreography-vs-orchestration

**Question:** Who should decide what happens next in a multi-step workflow: a central conductor or the participants?

**Explanation:** Choreography lets each service react to events from others with no central controller. Orchestration uses a central coordinator to invoke each step. Choreography is looser; orchestration is easier to trace and reason about.

**Why it matters:** The wrong choice creates hidden coupling or a single point of failure in the workflow.

**Common misconception:** That orchestration is always bad. Complex long-running workflows are often clearer with a coordinator.

**Apply:** For a simple workflow with few services, use choreography; for a complex one with compensation, use orchestration.

**Example:** In choreography, an order service publishes an event and the payment, inventory, and shipping services each react.

**Example answer:** Choreography is fine for simple, event-driven flows; orchestration fits long-running, compensating workflows.

**Anti-patterns:** *Hidden cyclic dependencies in choreography*, *A brittle central orchestrator*

**Case study:** Azure Architecture Center documents both patterns and recommends orchestration for sagas that need compensating transactions.

**Resources:** https://learn.microsoft.com/en-us/azure/architecture/patterns/choreography, https://learn.microsoft.com/en-us/azure/architecture/patterns/saga

**Prereqs:** **outbox-pattern**

**Next:** **saga-pattern**

---

#### multi-tenancy

**Question:** How do you serve many customers from one deployment while keeping their data apart?

**Explanation:** Multi-tenancy runs a single application for many customers, or tenants. Isolation can be at the database, schema, table, or row level. The right level depends on cost, compliance, and scale.

**Why it matters:** A tenant seeing another tenant's data is a trust-destroying incident.

**Common misconception:** That multi-tenancy always needs separate databases. Row-level isolation is often sufficient at small scale.

**Apply:** Pick one tenant-isolation strategy and enforce it in the data layer and in tests.

**Example:** A SaaS app adds tenant_id to every query and has a test that proves cross-tenant reads fail.

**Example answer:** Choose a tenant-isolation strategy and validate it in every data access path.

**Anti-patterns:** *Filtering in app code instead of the database*, *No automated tenant-isolation tests*

**Case study:** Salesforce's metadata-driven multi-tenant platform serves many customers from shared infrastructure.

**Resources:** https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/tenant-isolation.html, https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-multitenant-architecture

**Prereqs:** **service-discovery**

**Next:** **data-modeling**

---

#### strangler-fig-pattern

**Question:** How do you replace a legacy system without a risky big-bang cutover?

**Explanation:** The strangler fig pattern routes requests through a facade, gradually replacing legacy functionality with new services. The old system stays in use until the new one fully replaces it.

**Why it matters:** Big-bang rewrites often miss hidden behavior and leave users without working software during the transition.

**Common misconception:** That you must shut down the old system to start the new one. The two can coexist for a long time.

**Apply:** Put a proxy in front of the legacy system and route one endpoint at a time to the new implementation.

**Example:** A new checkout service handles /api/orders while every other path still goes to the monolith.

**Example answer:** Route traffic through a facade and move one feature at a time from legacy to new services.

**Anti-patterns:** *Big-bang rewrite*, *Copying every bug from the old system*

**Case study:** Amazon has used strangler-fig strategies to modernize large legacy systems one feature at a time.

**Resources:** https://martinfowler.com/bliki/StranglerFigApplication.html, https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/strangler-fig.html

**Prereqs:** **rest-api**, **monolith-vs-microservices**

**Next:** **domain-driven-design**

---

### Data

#### data-modeling

**Question:** How do you structure data so it stays true to the domain and easy to query?

**Explanation:** Data modeling shapes entities, relationships, and constraints before the schema is built. It is the bridge between domain concepts and the actual database.

**Why it matters:** A schema that does not match the domain produces invalid data, complex joins, and migration pain.

**Common misconception:** That you can fix a bad model later. Schema changes become much harder once data exists.

**Apply:** Model three key entities, their relationships, and the constraints before creating tables.

**Example:** An order has many line items; each line item has one product and one product price.

**Example answer:** Define entities, relationships, and constraints that match how the business works.

**Anti-patterns:** *Starting with a single wide table*, *Letting ORM generate the schema without review*

**Case study:** Airbnb's data models for listings, bookings, and payments enable reliable analytics and personalized search.

**Resources:** https://martinfowler.com/bliki/DataModels.html, https://www.postgresql.org/docs/18/ddl.html

**Prereqs:** **back-of-the-envelope-estimation**, **domain-driven-design**

**Next:** **relational-vs-nosql**

---

#### relational-vs-nosql

**Question:** When is a relational database the wrong tool for the job?

**Explanation:** Relational databases enforce structure and relationships, while NoSQL databases relax consistency for flexibility, scale, or speed. The choice depends on access patterns, consistency needs, and growth.

**Why it matters:** Forcing a rigid schema on unstructured, massive, or write-heavy data leads to slowdowns and workarounds.

**Common misconception:** That NoSQL is always faster. Without the right model it can be slower and harder to query.

**Apply:** List the consistency, query, and scale needs of a feature, then choose the data store.

**Example:** A leaderboard uses a sorted set in Redis; a ledger with strict relationships stays in Postgres.

**Example answer:** Pick the data store based on access patterns, consistency, and scale, not hype.

**Anti-patterns:** *Using NoSQL for every new app*, *Using one database for every workload*

**Case study:** Facebook chose HBase for its messaging workload because the write pattern did not fit a relational model.

**Resources:** https://aws.amazon.com/compare/the-difference-between-relational-and-non-relational-databases/, https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html

**Prereqs:** **data-modeling**

**Next:** **database-normalization**

---

#### database-normalization

**Question:** Why is the same customer address stored in five different tables?

**Explanation:** Database normalization removes redundancy and prevents update anomalies by organizing data into related tables that each hold one kind of fact.

**Why it matters:** Redundant data drifts apart over time, leading to contradictory answers from the same database.

**Common misconception:** That all data must be in one table for performance. Joins exist precisely to keep data consistent.

**Apply:** Start at third normal form, then denormalize only where a query proves too slow.

**Example:** Customers live in one table, orders in another, linked by customer_id instead of copying the address.

**Example answer:** Split data so each table stores one kind of fact and link them with keys.

**Anti-patterns:** *One giant table with everything*, *Denormalizing before measuring*

**Case study:** Stripe's payment data is normalized to avoid mismatching balances across tables.

**Resources:** https://www.dataquest.io/blog/sql-normalization/, https://www.postgresql.org/docs/18/ddl-constraints.html

**Prereqs:** **relational-vs-nosql**

**Next:** **database-constraints**

---

#### database-constraints

**Question:** Should the database trust the application to keep data valid?

**Explanation:** Constraints such as unique, not-null, foreign key, and check let the database enforce rules. They are the final guard against invalid data from any code path.

**Why it matters:** Relying only on application validation leaves holes from migrations, scripts, and bugs.

**Common misconception:** That constraints slow the database down. Modern databases handle them efficiently.

**Apply:** Add a unique constraint, a not-null, and a foreign key to the next table you create.

**Example:** A check constraint ensures product.price is greater than zero, blocking bad inserts from any source.

**Example answer:** Use constraints to make the database the final enforcer of data correctness.

**Anti-patterns:** *Validation only in the UI*, *Soft constraints in app code*

**Case study:** Openbill Core, a pure-PostgreSQL billing engine, uses constraints and triggers to enforce that transfers stay balanced and append-only, processing tens of billions of dollars over ten years.

**Resources:** https://www.postgresql.org/docs/18/ddl-constraints.html, https://github.com/dapi/openbill-core

**Prereqs:** **database-normalization**

**Next:** **orm-vs-sql**, **transaction-isolation-levels**

---

#### orm-vs-sql

**Question:** Do you need an object-relational mapper, or should you write SQL directly?

**Explanation:** ORMs map objects to tables and reduce boilerplate. Raw SQL gives full control over queries. A healthy project uses both: ORM for simple CRUD, SQL for performance-critical paths.

**Why it matters:** ORMs make N+1 queries and oversized transactions easy to write by accident.

**Common misconception:** That ORMs free you from understanding SQL. They require you to understand SQL even more.

**Apply:** Use an ORM for basic operations, drop to SQL for complex reports and batch jobs.

**Example:** An ORM loads an order object with its items; raw SQL aggregates sales by region.

**Example answer:** Use ORMs for routine work and raw SQL for the few critical or complex queries.

**Anti-patterns:** *Putting all SQL in the app*, *Trusting ORM defaults for every query*

**Case study:** Ted Neward's 'Vietnam of Computer Science' warned about the impedance mismatch between object and relational models.

**Resources:** https://blogs.newardassociates.com/blog/2006/the-vietnam-of-computer-science.html, https://www.sqlalchemy.org/

**Prereqs:** **database-constraints**

**Next:** **n-plus-one**, **query-optimization**, **materialized-views**

---

#### transaction-isolation-levels

**Question:** How much can one transaction see of another transaction's work while it is still running?

**Explanation:** Isolation levels define how concurrent transactions interact. Higher levels prevent dirty reads, non-repeatable reads, and phantom reads, but they usually cost performance.

**Why it matters:** Choosing the wrong level can expose uncommitted data or create subtle race conditions.

**Common misconception:** That the strongest level is always best. It can deadlock and slow down normal work.

**Apply:** Start with the default, then raise isolation only for critical sections where anomalies would hurt.

**Example:** Read committed avoids dirty reads; serializable prevents phantom reads but may fail with concurrency.

**Example answer:** Use the weakest isolation level that does not allow the anomalies your business cannot tolerate.

**Anti-patterns:** *Serializing every transaction*, *Assuming the default works everywhere*

**Case study:** PostgreSQL defaults to read committed; financial systems often select serializable for account transfers.

**Resources:** https://www.postgresql.org/docs/current/transaction-iso.html, https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html

**Prereqs:** **database-constraints**

**Next:** **database-locks**

---

#### database-locks

**Question:** How do you stop two transactions from overwriting the same row at the same time?

**Explanation:** Database locks protect rows, tables, or indexes while a transaction runs. They turn concurrent writes into a safe sequence, but too many locks can cause deadlocks and timeouts.

**Why it matters:** Without locks, concurrent updates can lose data or create inconsistent aggregates.

**Common misconception:** That locks are always bad. They are necessary; the goal is to hold them for the shortest time.

**Apply:** Keep transactions short, access resources in a consistent order, and monitor lock waits.

**Example:** SELECT FOR UPDATE locks a row so a second transaction waits until the first commits.

**Example answer:** Use row-level locks inside short transactions and a consistent resource order to avoid deadlocks.

**Anti-patterns:** *Long transactions holding locks*, *Locking without a timeout*

**Case study:** Shopify moved inventory reservations into MySQL and used row-level locks with SKIP LOCKED to prevent overselling during Black Friday traffic spikes.

**Resources:** https://www.postgresql.org/docs/18/explicit-locking.html, https://shopify.engineering/scaling-inventory-reservations

**Prereqs:** **transaction-isolation-levels**

**Next:** **optimistic-locking**

---

#### optimistic-locking

**Question:** What if most writes do not conflict, and locking slows everything down?

**Explanation:** Optimistic locking reads a version number, updates only if the version is unchanged, and fails if another transaction won. It avoids the cost of locks for low-contention data.

**Why it matters:** Pessimistic locks can serialize work unnecessarily, creating bottlenecks in collaborative apps.

**Common misconception:** That the first write always wins. With optimistic locking, the first to commit wins, and others retry.

**Apply:** Add a version or updated_at column to an entity and include it in the update WHERE clause.

**Example:** UPDATE issue_check_list SET check_list = $1, updated_at = now() WHERE issue_id = $2 AND updated_at = $3.

**Example answer:** Use a version column and update only when the version matches; prompt the user on conflict.

**Anti-patterns:** *Retrying without surfacing the conflict*, *Using optimistic locking in high-conflict domains*

**Case study:** Atlassian Forge SQL uses optimistic locking so that two users cannot silently overwrite a release checklist.

**Resources:** https://www.atlassian.com/blog/development/reliable-data-storage-using-optimistic-locking-in-forge-sql, https://www.postgresql.org/docs/current/sql-update.html

**Prereqs:** **database-locks**

**Next:** **materialized-views**

---

#### materialized-views

**Question:** How do you speed up expensive, repeated reports without rewriting the same query everywhere?

**Explanation:** A materialized view stores the result of a query, making slow aggregations fast at the cost of freshness. Refresh it on a schedule or when triggered.

**Why it matters:** Expensive joins and aggregations can drag down production traffic if run on every request.

**Common misconception:** That materialized views are always current. They are a cached snapshot and need refresh.

**Apply:** Identify one slow dashboard query and turn it into a materialized view with a nightly refresh.

**Example:** A sales_summary materialized view rolls up daily revenue so the dashboard loads in milliseconds.

**Example answer:** Store the result of an expensive query and refresh it periodically for fast reads.

**Anti-patterns:** *Treating materialized views as real-time*, *Refreshing too frequently*

**Case study:** Postgres materialized views help analytics teams run heavy reports without impacting OLTP queries.

**Resources:** https://www.postgresql.org/docs/18/rules-materializedviews.html, https://www.mssqltips.com/sqlservertip/5092/sql-server-materialized-views/

**Prereqs:** **orm-vs-sql**, **optimistic-locking**

**Next:** **database-partitioning**

---

#### change-data-capture

**Question:** How do you keep downstream systems in sync without querying the source database constantly?

**Explanation:** Change data capture reads the database transaction log and publishes every insert, update, and delete as an event. Downstream caches, indexes, and warehouses react to those events.

**Why it matters:** Polling the database for changes is wasteful and adds load; CDC turns the database into an event source.

**Common misconception:** That CDC is only for data warehouses. It is also great for cache invalidation and search indexes.

**Apply:** Use a CDC tool to stream one table's changes into a search index or cache.

**Example:** Debezium reads the Postgres WAL and publishes each row change to Kafka.

**Example answer:** Read the database transaction log and emit events for every change.

**Anti-patterns:** *Polling every few seconds*, *Treating CDC events as commands*

**Case study:** Netflix uses CDC to keep its caches and search indexes updated from the source of truth without polling.

**Resources:** https://debezium.io/documentation/reference/stable/index.html, https://learn.microsoft.com/en-us/azure/architecture/patterns/claim-check

**Prereqs:** **database-replication**

**Next:** **database-partitioning**, **cache-aside**

---

#### database-partitioning

**Question:** What do you do when a single table is too large to query efficiently?

**Explanation:** Partitioning splits a table into smaller pieces, usually by range, list, or hash, so queries can skip irrelevant data and maintenance can run on parts of the table.

**Why it matters:** A single multi-terabyte table makes vacuuming, indexing, and backups slow and risky.

**Common misconception:** That partitioning makes queries faster by magic. It helps only when the query can prune partitions.

**Apply:** Partition a time-series table by month and verify the query plan prunes old partitions.

**Example:** A log table is partitioned by created_at month, so a query for today only scans one partition.

**Example answer:** Split large tables by a column used in queries, then confirm the database prunes partitions.

**Anti-patterns:** *Partitioning without checking query plans*, *Too many partitions*

**Case study:** GitHub introduced virtual schema domains and physical partitioning of its MySQL databases, reducing load on its main cluster by 50 percent and cutting database-related incidents.

**Resources:** https://www.postgresql.org/docs/18/ddl-partitioning.html, https://github.blog/engineering/infrastructure/partitioning-githubs-relational-databases-scale/

**Prereqs:** **materialized-views**, **change-data-capture**

**Next:** **database-sharding**, **time-to-live**

---

#### time-to-live

**Question:** How do you keep data from piling up forever without manual cleanup?

**Explanation:** Time to live sets an expiration on cache entries, messages, or rows. After the period expires, the item is removed automatically.

**Why it matters:** Unbounded data growth causes storage costs to climb and queries to slow down.

**Common misconception:** That TTL is only for caches. It is also useful for logs, sessions, and temporary data.

**Apply:** Set a TTL on the next temporary table or cache entry and delete or archive data on expiry.

**Example:** Redis EXPIRE session:abc 3600 deletes the key after one hour of inactivity.

**Example answer:** Set an expiration on temporary data so it is removed automatically.

**Anti-patterns:** *Manual deletion jobs that fail silently*, *Storing transient data forever*

**Case study:** Twitch uses TTLs on Redis keys for live stream metadata and rate-limit counters.

**Resources:** https://redis.io/docs/latest/commands/expire/, https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html

**Prereqs:** **database-partitioning**

**Next:** **replication-lag**, **cache-aside**

---

#### replication-lag

**Question:** What does it mean when a user writes data and then cannot see it in a read replica?

**Explanation:** Replication lag is the time between a write on the primary and the same write appearing on a replica. It makes read replicas stale and can violate user expectations.

**Why it matters:** Routing all reads to replicas without handling lag makes users think their changes disappeared.

**Common misconception:** That replication is instant. It can lag by milliseconds to minutes under load.

**Apply:** For reads after a user's own write, route to the primary or wait until the replica has caught up.

**Example:** A user saves a comment; the next request reads from a primary or a replica past the write's LSN.

**Example answer:** Track the lag window and route read-after-write requests to replicas that have caught up.

**Anti-patterns:** *Reading from a replica immediately after a write*, *Ignoring lag metrics*

**Case study:** Bitbucket uses Log Sequence Numbers to route reads to replicas that have already caught up to a user's own writes.

**Resources:** https://www.atlassian.com/blog/atlassian-engineering/scaling-bitbuckets-database, https://www.postgresql.org/docs/current/warm-standby.html

**Prereqs:** **database-replication**, **time-to-live**

**Next:** **read-after-write-consistency**

---

### Scaling

#### cache-aside

**Question:** Should the cache be the source of truth, or just a fast copy of the database?

**Explanation:** Cache-aside, or lazy loading, keeps the database as the source of truth and only populates the cache when a key is requested and missing. The application is responsible for both lookup and refresh.

**Why it matters:** If the cache becomes the source of truth, losing it means losing data or serving stale values.

**Common misconception:** That the cache must always be written to first. Cache-aside writes to the database and then to the cache on a miss.

**Apply:** Try cache first; on miss, read from the database, write to cache, and return the value.

**Example:** A user profile is read from Redis; if absent, it is loaded from Postgres and stored in Redis with a 5-minute TTL.

**Example answer:** Look up the cache, fall back to the database on miss, and write the result back to the cache.

**Anti-patterns:** *Writing to cache before the database*, *Never invalidating the cache*

**Case study:** McGraw-Hill used Amazon ElastiCache with lazy loading to reduce database load and improve reporting throughput.

**Resources:** https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html, https://redis.io/docs/latest/develop/use-cases/cache-aside/

**Prereqs:** **time-to-live**, **caching**

**Next:** **write-through-caching**, **thundering-herd**

---

#### write-through-caching

**Question:** How do you keep the cache from getting stale when the database changes?

**Explanation:** Write-through caching updates the cache and the database together on every write. Reads are fast and current, but writes are slower.

**Why it matters:** Cache-aside can return old data because it only refreshes on a read miss.

**Common misconception:** That write-through eliminates all staleness. Network partitions or failures can still leave a gap.

**Apply:** Use write-through when read-after-write consistency matters more than write latency.

**Example:** When a profile is updated, the app writes to Postgres and then to Redis in the same request.

**Example answer:** Update both the cache and the database together so the cache always reflects the latest data.

**Anti-patterns:** *Writing to cache but not the database*, *Making writes wait for slow cache nodes*

**Case study:** Uber CacheFront serves more than 150 million reads per second while keeping its cache coherent with writes.

**Resources:** https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html, https://www.uber.com/us/en/blog/how-uber-serves-over-150-million-reads/

**Prereqs:** **cache-aside**

**Next:** **thundering-herd**

---

#### thundering-herd

**Question:** What happens when a popular cache key expires and ten thousand requests hit the database at once?

**Explanation:** A cache stampede, or thundering herd, occurs when many clients request the same missing key at the same time and all fetch from the source. Probabilistic early expiration, locks, or request coalescing can prevent it.

**Why it matters:** A stampede can crash the database that the cache was supposed to protect.

**Common misconception:** That a single database can absorb the herd. The point is that the cache is there because the database cannot.

**Apply:** For a hot key, add a lock or a small chance for each request to refresh before the TTL expires.

**Example:** A front-page feed has a TTL of 60 seconds; a request in the last 10 seconds may refresh the key early with probability 0.1.

**Example answer:** Prevent many clients from regenerating the same key by using locks or probabilistic early refresh.

**Anti-patterns:** *No TTL*, *All clients regenerating the same key simultaneously*

**Case study:** The AWS Kinesis US-East-1 incident in 2020 showed how cascading load from many clients can overwhelm a system.

**Resources:** https://redis.antirez.com/fundamental/cache-stampede-prevention.md, https://aws.amazon.com/message/11201/

**Prereqs:** **cache-aside**

**Next:** **throttling**

---

#### throttling

**Question:** How do you slow traffic down before it overwhelms your service?

**Explanation:** Throttling limits the rate of requests or work a client can generate. It differs from rate limiting by prioritizing stability over a fixed quota, often through queueing or slowing rather than rejecting.

**Why it matters:** Some traffic patterns, such as retry storms or batch jobs, can spike faster than any hard cap allows.

**Common misconception:** That throttling and rate limiting are the same. Rate limiting rejects; throttling shapes or delays.

**Apply:** Add a throttling rule that queues or slows requests above a threshold instead of dropping them.

**Example:** A downstream API can be throttled to 100 calls per second and queue the rest for later processing.

**Example answer:** Shape or delay excess traffic instead of rejecting it to keep the system stable.

**Anti-patterns:** *Throttling without metrics*, *Confusing throttling with rate limiting*

**Case study:** Uber's Global Rate Limiter scales request throttling across regions and services.

**Resources:** https://www.uber.com/us/en/blog/ubers-rate-limiting-system/, https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html

**Prereqs:** **rate-limiting**, **load-balancer-algorithms**

**Next:** **autoscaling-policies**

---

#### load-balancer-algorithms

**Question:** How does a load balancer decide which server gets the next request?

**Explanation:** Load balancers use algorithms such as round-robin, least connections, IP hash, or weighted distribution. The right one depends on request cost and whether clients need sticky sessions.

**Why it matters:** A poor algorithm can overload a slow server or break stateful sessions.

**Common misconception:** That round-robin is always fair. It ignores how long each request takes.

**Apply:** If requests vary in duration, try least-connections. If sessions need state, use sticky sessions or IP hash.

**Example:** A video transcoding service uses least-connections because some jobs take minutes and others take seconds.

**Example answer:** Pick an algorithm based on request cost and session needs, and monitor for uneven load.

**Anti-patterns:** *Round-robin for long-running requests*, *Sticky sessions without health checks*

**Case study:** NGINX uses round-robin, least-connections, and IP hash to adapt to different traffic patterns.

**Resources:** https://nginx.org/en/docs/http/load_balancing.html, https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html

**Prereqs:** **load-balancing**

**Next:** **throttling**, **autoscaling-policies**

---

#### autoscaling-policies

**Question:** How do you add capacity before users notice slowdowns?

**Explanation:** Autoscaling policies watch metrics like CPU, queue depth, or request latency and add or remove instances. Target-tracking policies keep a metric near a set value.

**Why it matters:** Manual scaling cannot react fast enough to real traffic and usually over-provisions.

**Common misconception:** That autoscaling fixes code issues. It can hide an inefficient app if you do not also tune the code.

**Apply:** Set up a target-tracking policy on CPU or request count per target with a reasonable cooldown.

**Example:** An EC2 Auto Scaling group keeps average CPU at 50 percent by adding instances when usage exceeds that.

**Example answer:** Scale on a metric that predicts load, with a cooldown so you are not constantly resizing.

**Anti-patterns:** *Scaling too slowly for traffic spikes*, *Autoscaling without load testing*

**Case study:** Kubernetes Horizontal Pod Autoscaler scales pods based on CPU or custom metrics, keeping cost low and latency stable.

**Resources:** https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/, https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html

**Prereqs:** **horizontal-scaling**

**Next:** **queue-based-load-leveling**

---

#### queue-based-load-leveling

**Question:** How do you absorb traffic spikes without adding servers instantly?

**Explanation:** Queue-based load leveling places a buffer between producers and consumers. Bursts of work pile up in the queue and are processed at the steady rate the backend can handle.

**Why it matters:** Instant scaling is expensive and slow; a queue buys time and smooths demand.

**Common misconception:** That queues make the system slower. They trade some latency for much higher throughput and stability.

**Apply:** Put a queue in front of a worker pool and process messages at a fixed, tunable rate.

**Example:** Image uploads go to a queue; workers resize them at a constant pace without overloading the service.

**Example answer:** Use a queue to buffer spikes and consume at a steady rate.

**Anti-patterns:** *No dead-letter queue*, *A queue without back-pressure*

**Case study:** McGraw-Hill used Amazon SQS to absorb large reporting jobs and improve throughput without over-provisioning.

**Resources:** https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling, https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html

**Prereqs:** **message-brokers**, **dead-letter-queues**

**Next:** **read-after-write-consistency**

---

#### read-after-write-consistency

**Question:** How do you scale reads with replicas without making users think their data disappeared?

**Explanation:** Read-after-write consistency, also called read-your-own-writes, ensures that a user who just wrote data will see that data on subsequent reads, even if those reads come from replicas.

**Why it matters:** Without this guarantee, a user can save a post and immediately see the old version.

**Common misconception:** That eventual consistency is fine for all users. It is not fine for a user's own changes.

**Apply:** Track the user's last write position and route their reads to a replica that has caught up.

**Example:** After a write, the app reads from the primary for one second or uses a replica LSN greater than the write's LSN.

**Example answer:** Route a user's own reads to a replica that has seen their write, or to the primary briefly.

**Anti-patterns:** *Ignoring replication lag for own-writes*, *Routing all traffic to the primary*

**Case study:** Bitbucket solved read-after-write consistency using PostgreSQL LSN tracking and replica selection.

**Resources:** https://www.atlassian.com/blog/atlassian-engineering/scaling-bitbuckets-database, https://learn.microsoft.com/en-us/azure/architecture/patterns/retry

**Prereqs:** **replication-lag**, **eventual-consistency**

**Next:** **consistent-hashing**

---

#### consistent-hashing

**Question:** How do you add a cache or database node without remapping almost every key?

**Explanation:** Consistent hashing maps both keys and servers onto a ring. When a server is added or removed, only the keys between the new server and its neighbor move. Virtual nodes (many tokens per physical server) keep the ring balanced.

**Why it matters:** Modulo hashing remaps almost every key when the node count changes, causing cache misses, migration storms, and hotspots.

**Common misconception:** That consistent hashing removes all data movement. It minimizes it, but some rebalancing is still required.

**Apply:** Pick a consistent hashing library for the next sharded cache or database and add virtual nodes before going to production.

**Example:** A cache uses a hash ring; adding a node only moves 1/N of the keys to the new node instead of nearly all of them.

**Example answer:** Place both keys and servers on a hash ring, walk the ring to find owners, and use virtual nodes to balance load as the cluster grows.

**Anti-patterns:** *Using hash % N for a growing cluster*, *Forgetting virtual nodes*

**Case study:** Amazon Dynamo and Apache Cassandra use consistent hashing with virtual nodes to scale storage without massive rebalancing.

**Resources:** https://cassandra.apache.org/doc/5.0.8/cassandra/architecture/dynamo.html, https://backendbytes.com/articles/consistent-hashing-guide/

**Prereqs:** **database-sharding**

**Next:** **hot-spot-mitigation**

---

#### hot-spot-mitigation

**Question:** What do you do when one key or shard gets all the traffic?

**Explanation:** Hot-spot mitigation replicates popular data, splits keys, or moves load across nodes so that no single shard becomes a bottleneck. Even with perfect hashing, skewed access can create hotspots.

**Why it matters:** A single hot key or celebrity account can saturate one node and raise latency for everyone on that node.

**Common misconception:** That consistent hashing alone fixes it. Real workloads have long-tail popularity.

**Apply:** Identify the top 1 percent of keys and add local caching, replication, or key splitting.

**Example:** A product page for a viral item is replicated across Redis shards and cached at the CDN edge.

**Example answer:** Replicate hot data, split hot keys, and add local caches so no single node becomes a bottleneck.

**Anti-patterns:** *Assuming uniform access*, *Ignoring hot-key metrics*

**Case study:** Alibaba's Tair handles Single's Day hotspots with HotZone replication and local caching.

**Resources:** https://hackernoon.com/how-to-improve-hotspot-data-hashing-on-an-elastic-cache-platform-6999d729e305, https://redis.io/docs/latest/operate/rs/monitoring/observability/

**Prereqs:** **database-sharding**, **consistent-hashing**, **read-after-write-consistency**

**Next:** **multi-region**

---

## Validation notes

- New concept keys: 56
- Categories covered: engineering (18), architecture (15), data (13), scaling (10)
- Existing catalog concepts referenced or enriched: 49
- Cross-pillar prerequisite / next references: 49
- `npx tsc --noEmit` passed.
- `npx tsc -p tsconfig.mcp.json --noEmit` passed.
- `npm run build` passed.
- All resource URLs were fetched and verified (102 URLs).
- No existing concept key was duplicated.

*Generated with the help of compiled seeds; leave uncommitted for the coordinator.*
