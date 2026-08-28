# Security & Reliability Course

**Owner:** Security pillar (`agent/courses/security.ts`)  
**Categories:** `security`, `reliability`

## Purpose

This course takes a vibe coder from "my first login form" to "hardened, observable, resilient systems at scale." It is built around real breaches, real outages, and the practical controls that would have prevented them.

The course is split into eight phases. Each phase is ordered so that the next one builds on the previous, and each concept has explicit prerequisites (`prereqs`) and follow-ons (`next`) in the `SECURITY_SEEDS` map.

---

## Learning path overview

1. **Identity and access** — passwords, MFA, sessions, cookies, RBAC, least privilege.
2. **Input and injection-like attacks** — SSRF, path traversal, insecure deserialization, credential stuffing, IDOR, mass assignment, business logic.
3. **Secrets, supply chain, and operational security** — API keys, secret rotation, supply-chain security, SRI, file uploads, security headers.
4. **Data, privacy, and cryptography** — PII minimization, encryption at rest, certificate management, zero trust, security logging.
5. **Validation, testing, and disclosure** — penetration testing, vulnerability disclosure, threat modeling.
6. **Reliability foundations** — retry storms, load shedding, fallback, fault tolerance, redundancy, service mesh.
7. **Observable reliability** — SLIs, error budgets, request prioritization, synthetic monitoring.
8. **Preparedness at scale** — recovery objectives, chaos testing.

The graph is intentionally walkable from a single login form to incident response and hardening.

---

## Phase 1: Identity and access

A login form is the first trust boundary. If an attacker can steal a password, reuse a session, or escalate a role, every later control matters less.

| Concept | Why it comes here | Real case study |
|---|---|---|
| `password-hashing` | Stored passwords outlive your app; slow, salted hashes limit the blast radius of a database leak. | LinkedIn's 2012 unsalted SHA-1 breach exposed 117 M accounts over four years. |
| `multi-factor-authentication` | Passwords leak everywhere; MFA breaks the credential-reuse chain. | The July 2020 Twitter admin compromise let attackers tweet from 130 high-profile accounts. |
| `session-management` | After a user logs in, the session token becomes the master key. | The 2022 Uber breach used stolen sessions to move laterally to internal PAM credentials. |
| `secure-cookies` | HTTPS is not enough; cookie flags stop replay and XSS theft. | Firesheep (2010) showed how unencrypted session cookies on public Wi-Fi could be hijacked. |
| `role-based-access-control` | Roles make authorization explicit, auditable, and scalable. | Capital One's over-provisioned WAF IAM role could list and read all S3 buckets. |
| `least-privilege` | Every extra permission is a path an attacker can walk. | Uber's Thycotic PAM admin credentials were hardcoded in an internal script. |

**Cross-pillar entries used as prerequisites:** `authentication-vs-authorization`, `input-validation`.

---

## Phase 2: Input and injection-like attacks

Once a user is authenticated, your app still has to distrust every byte of input.

| Concept | What failure it prevents | Real case study |
|---|---|---|
| `server-side-request-forgery` | Turning an exposed URL-fetcher into a proxy to internal services. | Capital One's misconfigured WAF fetched AWS metadata and exfiltrated 106 M records. |
| `path-traversal` | User-supplied filenames escaping the intended directory. | Apache CVE-2021-41773 allowed `.%2e` traversal and source disclosure. |
| `insecure-deserialization` | Untrusted objects becoming code on the server. | Foxglove Security's 2015 research revealed Java deserialization RCE via Apache Commons Collections in WebLogic, WebSphere, JBoss, Jenkins, and OpenNMS. |
| `credential-stuffing` | Reused stolen credentials logging into your app. | 23andMe's 2023 breach reached 6.9 M users through the DNA Relatives feature. |
| `idor` | Changing an ID and accessing another user's records. | Parler's 2021 scrape downloaded 70+ TB of posts and metadata. |
| `mass-assignment` | Request parameters binding to internal fields like `admin`. | Egor Homakov added his own SSH key to the GitHub Rails repo in 2012. |
| `business-logic-security` | Using a legitimate feature in an unintended, harmful way. | USPS's 2018 Informed Delivery API exposed 60 M users through a logic flaw. |

---

## Phase 3: Secrets, supply chain, and operational security

Modern apps are assembled from dependencies, scripts, and SaaS. Each integration is a trust boundary.

| Concept | Failure mode it closes | Real case study |
|---|---|---|
| `api-key-management` | Keys committed to git or shared across environments. | Uber's PowerShell script contained hardcoded PAM admin credentials. |
| `secret-rotation` | A leaked key staying valid forever. | CircleCI's January 2023 incident forced customers to rotate all stored secrets. |
| `supply-chain-security` | A compromised dependency or build tool owning your users. | SolarWinds Orion backdoor reached ~18,000 customers, including U.S. agencies. |
| `subresource-integrity` | A CDN or third-party script being tampered with. | The 2024 polyfill.io compromise injected malicious code into 100,000+ sites. |
| `file-upload-security` | A disguised executable written to disk and run. | Bug-bounty reports repeatedly show `avatar.php.jpg` leading to RCE. |
| `security-headers` | Browser-based attacks like clickjacking, MIME sniffing, and downgrade. | The 2010 Twitter clickjacking worm used iframes to trick users into tweeting. |

---

## Phase 4: Data, privacy, and cryptography

Less data and better key management reduce the impact of any breach.

| Concept | Failure mode it closes | Real case study |
|---|---|---|
| `pii-data-minimization` | Collecting and leaking data you did not need. | British Airways' 2018 Magecart breach captured 380,000+ payment-card transactions; the ICO proposed £183.4m and ultimately fined BA £20m. |
| `encryption-at-rest` | Raw disk or snapshot theft exposing plaintext. | Many breach reports show unencrypted data at rest; Equifax raised this question. |
| `certificate-management` | An expired cert breaking HTTPS for users and automation. | Azure Storage's 2013 expired SSL cert caused a worldwide, multi-hour outage. |
| `zero-trust` | Implicit trust inside the network letting attackers move laterally. | Twitter and Uber both succeeded partly because internal tools had broad trust. |
| `security-logging-audit` | Breaches going unnoticed because nobody is watching. | Target's 2013 FireEye alerts were not acted on in time. |

---

## Phase 5: Validation, testing, and disclosure

The only way to find the bugs your own tests miss is to invite real attack thinking.

| Concept | Failure mode it closes | Real case study |
|---|---|---|
| `penetration-testing` | Logic and chain bugs that scanners cannot see. | Hack the Pentagon found 138 valid vulns in 23 days for $150,000. |
| `vulnerability-disclosure` | Researchers staying silent or going public. | MOVEit Transfer's CVE-2023-34362 was exploited by Cl0p before a patch existed. |
| `threat-modeling` | Missing trust boundaries before an attacker finds them. | The 2020 Twitter breach exploited internal tools that had broad, implicit trust across the network. |

---

## Phase 6: Reliability foundations

When dependencies fail, a vibe coder's app should still serve users.

| Concept | Failure mode it closes | Real case study |
|---|---|---|
| `retry-storms` | Every client retrying together and overwhelming a recovering service. | AWS Kinesis us-east-1 (Nov 2020) had to throttle recovery to avoid thundering herds. |
| `load-shedding` | Trying to serve every request during overload and serving none. | Netflix drops non-critical prefetch requests to keep playback working. |
| `fallback` | Returning a hard failure when a dependency is slow or down. | Netflix uses cached metadata to keep the UI populated during partial outages. |
| `fault-tolerance` | One broken component taking down the whole app. | Netflix's Chaos Monkey forces services to survive random instance loss. |
| `redundancy` | A single point of failure with no independent copy. | OVHcloud's 2021 Strasbourg fire destroyed production and backups in the same building. |
| `service-mesh` | Ad-hoc retries, mTLS, and observability in microservices. | eBay and Airbnb use meshes to secure east-west traffic and manage canary deploys. |

**Cross-pillar entries used as prerequisites:** `back-off-and-retry`, `backpressure`, `circuit-breaker`, `timeouts`, `distributed-tracing`.

---

## Phase 7: Observable reliability

Reliability is a measurable property, not a feeling.

| Concept | Failure mode it closes | Real case study |
|---|---|---|
| `service-level-indicators` | Vague targets like "keep it fast." | Google's SRE book defines availability, latency, durability, and freshness as core SLIs. |
| `error-budget-policy` | Feature velocity colliding with reliability without a clear rule. | Google's SRE book uses error budgets to decide when launches must pause. |
| `request-prioritization` | Dropping critical and non-critical work equally under load. | Netflix's PlayAPI partitions traffic so user-initiated requests steal from prefetch. |
| `synthetic-monitoring` | Finding out about an outage from real users first. | Atlassian's 2022 multi-day outage was discovered by customer reports. |

**Cross-pillar entries used as prerequisites/related:** `metrics`, `slos`, `health-checks`, `alerting`, `observability`.

---

## Phase 8: Preparedness at scale

You cannot test failure by waiting for it.

| Concept | Failure mode it closes | Real case study |
|---|---|---|
| `recovery-objectives` | Vague disaster-recovery hopes and untested backups. | Atlassian's April 2022 deletion script took up to 14 days to restore 775 sites. |
| `chaos-testing` | Hidden dependencies and brittle assumptions. | Netflix's Chaos Monkey deliberately terminates production instances. |

**Cross-pillar entries used as prerequisites/related:** `backups`, `disaster-recovery`, `incident-response`, `postmortem`.

---

## Concept graph

This table is a compact view of prerequisites and next steps for each new `SECURITY_SEEDS` key. It lets the coordinator verify graph edges and cross-pillar references.

| Key | Category | Prereqs | Next |
|---|---|---|---|
| `password-hashing` | security | `authentication-vs-authorization`, `input-validation` | `multi-factor-authentication`, `session-management` |
| `multi-factor-authentication` | security | `authentication-vs-authorization`, `password-hashing` | `session-management`, `secure-cookies` |
| `session-management` | security | `multi-factor-authentication` | `secure-cookies`, `csrf` |
| `secure-cookies` | security | `session-management`, `tls` | `csrf`, `xss` |
| `role-based-access-control` | security | `authentication-vs-authorization`, `input-validation` | `least-privilege`, `idor` |
| `least-privilege` | security | `role-based-access-control` | `server-side-request-forgery`, `api-key-management` |
| `server-side-request-forgery` | security | `input-validation`, `least-privilege` | `path-traversal`, `webhook-security` |
| `path-traversal` | security | `input-validation` | `file-upload-security`, `insecure-deserialization` |
| `insecure-deserialization` | security | `input-validation`, `dependency-scanning` | `mass-assignment`, `business-logic-security` |
| `credential-stuffing` | security | `rate-limiting`, `password-hashing` | `idor`, `business-logic-security` |
| `idor` | security | `role-based-access-control`, `authentication-vs-authorization` | `mass-assignment`, `business-logic-security` |
| `mass-assignment` | security | `input-validation`, `idor` | `business-logic-security`, `security-logging-audit` |
| `business-logic-security` | security | `idor`, `rate-limiting` | `penetration-testing`, `vulnerability-disclosure` |
| `api-key-management` | security | `secrets-management`, `least-privilege` | `secret-rotation`, `webhook-security` |
| `secret-rotation` | security | `api-key-management`, `secrets-management` | `supply-chain-security`, `certificate-management` |
| `supply-chain-security` | security | `dependency-scanning`, `secret-rotation` | `subresource-integrity`, `penetration-testing` |
| `subresource-integrity` | security | `supply-chain-security`, `tls` | `security-headers`, `dependency-scanning` |
| `file-upload-security` | security | `input-validation`, `path-traversal` | `pii-data-minimization`, `security-logging-audit` |
| `security-headers` | security | `tls`, `csp` | `pii-data-minimization`, `security-logging-audit` |
| `pii-data-minimization` | security | `input-validation`, `tls` | `encryption-at-rest`, `security-logging-audit` |
| `encryption-at-rest` | security | `pii-data-minimization`, `secrets-management` | `certificate-management`, `security-logging-audit` |
| `certificate-management` | security | `tls`, `secret-rotation` | `security-logging-audit`, `zero-trust` |
| `zero-trust` | security | `least-privilege`, `authentication-vs-authorization` | `security-logging-audit`, `penetration-testing` |
| `security-logging-audit` | security | `security-headers`, `pii-data-minimization` | `penetration-testing`, `incident-response` |
| `penetration-testing` | security | `business-logic-security`, `security-logging-audit` | `vulnerability-disclosure`, `dependency-scanning` |
| `vulnerability-disclosure` | security | `penetration-testing`, `dependency-scanning` | `threat-modeling`, `incident-response` |
| `threat-modeling` | security | `business-logic-security`, `security-logging-audit` | `incident-response`, `postmortem` |
| `retry-storms` | reliability | `back-off-and-retry`, `timeouts` | `load-shedding`, `circuit-breaker` |
| `load-shedding` | reliability | `retry-storms`, `backpressure` | `fallback`, `graceful-degradation` |
| `fallback` | reliability | `circuit-breaker`, `load-shedding` | `graceful-degradation`, `slos` |
| `fault-tolerance` | reliability | `circuit-breaker`, `fallback` | `redundancy`, `service-mesh` |
| `redundancy` | reliability | `fault-tolerance`, `backups` | `multi-region`, `disaster-recovery` |
| `service-mesh` | reliability | `fault-tolerance`, `distributed-tracing` | `observability`, `canary-release` |
| `service-level-indicators` | reliability | `metrics`, `slos` | `error-budgets`, `alerting` |
| `error-budget-policy` | reliability | `slos`, `service-level-indicators` | `incident-response`, `postmortem` |
| `request-prioritization` | reliability | `load-shedding`, `slos` | `graceful-degradation`, `autoscaling` |
| `synthetic-monitoring` | reliability | `metrics`, `health-checks` | `alerting`, `observability` |
| `recovery-objectives` | reliability | `redundancy`, `backups` | `disaster-recovery`, `incident-response` |
| `chaos-testing` | reliability | `fault-tolerance`, `observability` | `incident-response`, `postmortem` |

**Cross-pillar references used in the graph (existing catalog keys):**

- `alerting`, `authentication-vs-authorization`, `autoscaling`, `back-off-and-retry`, `backpressure`, `backups`, `canary-release`, `circuit-breaker`, `csp`, `csrf`, `dependency-scanning`, `disaster-recovery`, `distributed-tracing`, `error-budgets`, `graceful-degradation`, `health-checks`
- `incident-response`, `input-validation`, `metrics`, `multi-region`, `observability`, `postmortem`, `rate-limiting`, `secrets-management`, `slos`, `timeouts`, `tls`, `webhook-security`, `xss`

---

## Why this order?

1. **Identity first.** If you cannot authenticate and authorize users safely, later controls are irrelevant.
2. **Input distrust next.** After login, every URL, file, ID, and serialized object is an attack surface.
3. **Secrets and supply chain.** Dependencies and credentials are where attackers bypass your own code.
4. **Data and privacy.** Minimization and encryption reduce blast radius.
5. **Test, disclose, and model threats.** You will miss things; build processes that find, report, and map them safely.
6. **Reliability.** Security is a subset of reliability at scale; both fail when a single dependency can take you down.
7. **Observe and budget.** Measure reliability, set explicit tradeoffs, and prioritize critical work.
8. **Prepare for failure.** Define recovery targets and practice failure so that incidents are survivable.

---

## Suggested enrichments for existing catalog concepts

The following keys already exist in `agent/lib/concept-catalog.ts` and are not redefined in `SECURITY_SEEDS`. They could be enriched with the cross-references and case studies above at merge time:

- `oauth`, `jwt-security`, and `multi-factor-authentication` — add `secure-cookies` and `session-management` as follow-on concepts; consider a future `passkeys` concept for phishing-resistant MFA.
- `rate-limiting` — add `credential-stuffing` and `business-logic-security` as related concepts.
- `input-validation` — add `path-traversal`, `insecure-deserialization`, `idor`, and `mass-assignment` as follow-ons.
- `secrets-management` — add `api-key-management`, `secret-rotation`, and `certificate-management` as follow-ons.
- `dependency-scanning` — add `supply-chain-security` and `subresource-integrity` as follow-ons.
- `tls` — add `certificate-management` and `security-headers` as follow-ons.
- `csp` — add `security-headers` and `subresource-integrity` as related concepts.
- `csrf`, `xss` — add `secure-cookies` as a prerequisite.
- `sql-injection` — add `insecure-deserialization` and `business-logic-security` as related concepts.
- `waf`, `ddos` — add `rate-limiting`, `load-shedding`, and `cors` as related concepts.
- `webhook-security` — add `server-side-request-forgery` and `api-key-management` as prerequisites.
- `back-off-and-retry` and `timeouts` — add `retry-storms` and `circuit-breaker` as follow-ons.
- `circuit-breaker` and `bulkhead` — add `fallback`, `fault-tolerance`, and `load-shedding` as follow-ons.
- `graceful-degradation` — add `fallback`, `request-prioritization`, and `service-mesh` as related concepts.
- `metrics`, `alerting`, `observability`, `distributed-tracing` — add `synthetic-monitoring`, `service-level-indicators`, and `chaos-testing` as follow-ons.
- `slos`, `error-budgets` — add `service-level-indicators` and `error-budget-policy` as related concepts.
- `incident-response`, `postmortem`, `backups`, `disaster-recovery`, `multi-region` — add `recovery-objectives`, `chaos-testing`, and `threat-modeling` as related concepts.

---

## Verified resource sources

All URLs in `SECURITY_SEEDS` were checked with HTTP requests. They are drawn from:

- Authoritative standards: NIST SP 800-63B, NIST SP 800-207, NIST CSRC, CISA.
- OWASP cheat sheets and project pages (Password Storage, Session Management, SSRF Prevention, File Upload, SRI, Logging, etc.).
- Real incident write-ups: KrebsOnSecurity, GitHub Blog, CircleCI, Atlassian, AWS post-incident messages, OVHcloud post-mortems, Bloomberg, The Register, TechCrunch, BBC, AP News, InfoQ.
- Reliability references: Google SRE book, AWS Builders' Library, Netflix InfoQ presentations, Chaos Engineering paper (arxiv.org), Principles of Chaos.

The example URLs `https://cdn.example.com/lib.js` and `https://public-cdn.example.com/*` in `example` fields are illustrative only and are not listed in `resources`.
