import type { ConceptSeed } from "./types.js";

// Pillar: SECURITY
// Categories you own: "security", "reliability"
// Add ONLY new concept keys here. Do not duplicate keys that already exist
// in agent/lib/concept-catalog.ts. If you want to enrich an existing
// concept, record it in your course markdown under "Suggested enrichments"
// and the coordinator will merge it.

export const SECURITY_SEEDS: Record<string, ConceptSeed> = {
  // --- Phase 1: Identity and access ---
  "password-hashing": {
    category: "security",
    question:
      "Why does the way you store password hashes matter more than the password policy?",
    explanation:
      "Password hashing converts a password into a one-way, salted, slow-to-compute value. If your database is breached, proper hashing makes offline cracking expensive. Fast or unsalted hashes let attackers recover millions of passwords in hours.",
    why:
      "Passwords are reused across sites; a breach at yours can become a breach at banks, email, and corporate VPNs. Slow, salted hashing buys you time and limits the blast radius.",
    apply:
      "Replace any MD5, SHA-1, or unsalted hash with bcrypt, scrypt, or Argon2id. Set a work factor that takes at least 250 ms on your hardware and never roll your own algorithm.",
    misconception: "A strong password policy is enough to protect users.",
    example:
      "bcrypt with a random 16-byte salt and cost factor 12: each password gets a unique hash, and verifying it takes ~300 ms, which is fine for login but painful for an attacker testing millions of guesses.",
    case_study:
      "LinkedIn's 2012 breach exposed 6.5 million unsalted SHA-1 password hashes; attackers cracked most within hours. In 2016 the full set of 117 million was sold, showing how weak storage has a long tail.",
    anti_patterns: [
      "use MD5 or SHA-1",
      "unsalted hashes",
      "store passwords in plain text",
      "roll your own crypto",
      "use a fast hash for passwords",
    ],
    resources: [
      "https://pages.nist.gov/800-63-4/sp800-63b/authenticators/",
      "https://krebsonsecurity.com/2016/05/as-scope-of-2012-breach-expands-linkedin-to-again-reset-passwords-for-some-users/",
      "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
    ],
    prereqs: ["authentication-vs-authorization", "input-validation"],
    next: ["multi-factor-authentication", "session-management"],
  },

  "multi-factor-authentication": {
    category: "security",
    question: "What happens if a user's password is already stolen?",
    explanation:
      "Multi-factor authentication requires proof from something a user has or is, not just something they know. Even if a password or session cookie is stolen, a second factor blocks most remote attackers.",
    why:
      "Stolen passwords are cheap on the dark web. MFA turns a single credential leak into a partial credential, because the attacker usually does not also have the phone or hardware key.",
    apply:
      "Enable TOTP, WebAuthn, or push MFA for all admin and sensitive accounts. Do not make it optional for users with access to customer data or production systems.",
    misconception: "MFA is only for high-security apps; it annoys users too much.",
    example:
      "A login form that accepts a TOTP code from an authenticator app after the password, or a WebAuthn/FIDO2 hardware key for the team with production access.",
    case_study:
      "The July 2020 Twitter attack used phone spear phishing to compromise employees, then pivoted to internal admin tools that lacked strong MFA on privileged actions. 130 high-profile accounts were hijacked and used to tweet a Bitcoin scam.",
    anti_patterns: [
      "SMS as the only factor",
      "MFA only for admins",
      "allow bypass codes in email",
      "skip MFA on internal tools",
    ],
    resources: [
      "https://cyberscoop.com/twitter-hack-social-engineering-new-york-financial-services/",
      "https://www.afslaw.com/perspectives/alerts/nydfs-issues-report-twitter-hack",
      "https://www.cisa.gov/mfa",
    ],
    prereqs: ["authentication-vs-authorization", "password-hashing"],
    next: ["session-management", "secure-cookies"],
  },

  "session-management": {
    category: "security",
    question:
      "How does an attacker use a session after the user logged in safely?",
    explanation:
      "Session management creates, binds, and invalidates the server-side state that represents a logged-in user. If sessions are predictable, long-lived, or not invalidated on logout, an attacker who steals one session token can act as the user.",
    why:
      "A session token is a master key. You can have perfect passwords and still lose accounts because the session itself is weak.",
    apply:
      "Use opaque, random session IDs stored server-side; expire sessions after inactivity; rotate them on privilege change; and invalidate them on logout.",
    misconception: "If I use HTTPS, session tokens are safe.",
    example:
      "A session cookie with HttpOnly and Secure flags, SameSite=Lax, and a 24-hour idle timeout that the server tracks in a Redis store with a corresponding expiry.",
    case_study:
      "The 2022 Uber breach began with stolen contractor credentials and MFA push fatigue, but the attacker also used session cookie theft and network traversal to reach an internal share with hardcoded PAM admin credentials, demonstrating how session compromise enables lateral movement.",
    anti_patterns: [
      "session IDs in URL",
      "no invalidation on logout",
      "one session per user forever",
      "JWTs as sessions with no revocation",
    ],
    resources: [
      "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
      "https://blog.gitguardian.com/uber-breach-2022/",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
    ],
    prereqs: ["multi-factor-authentication"],
    next: ["secure-cookies", "csrf"],
  },

  "secure-cookies": {
    category: "security",
    question: "What stops an attacker from replaying my session cookie?",
    explanation:
      "Secure cookies use the Secure, HttpOnly, and SameSite attributes to limit how browsers send and scripts access cookies. Without these flags, a single sniffed or XSS-stolen cookie can log an attacker in as the user.",
    why:
      "Cookies are the primary session carrier for web apps. Their flags are cheap to set and stop entire classes of attacks.",
    apply:
      "Set Secure, HttpOnly, and SameSite=Lax or Strict on all session cookies; review and migrate legacy SameSite=None cookies.",
    misconception: "HTTPS alone keeps cookies safe.",
    example:
      "Set-Cookie: session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=86400",
    case_study:
      "In 2010 the Firesheep Firefox extension showed that unencrypted session cookies on public Wi-Fi could be captured and replayed. GitHub and many sites responded by forcing SSL and adding Secure flags to protect session cookies.",
    anti_patterns: [
      "missing Secure flag",
      "missing HttpOnly",
      "SameSite=None without Secure",
      "storing session token in localStorage",
    ],
    resources: [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
      "https://github.blog/2010-10-27-sidejack-prevention/",
      "https://www.schneier.com/blog/archives/2010/10/firesheep.html",
    ],
    prereqs: ["session-management", "tls"],
    next: ["csrf", "xss"],
  },

  "role-based-access-control": {
    category: "security",
    question: "Who is allowed to delete this record?",
    explanation:
      "Role-based access control assigns permissions to roles, not individuals. It makes authorization explicit, auditable, and scalable. Without it, any authenticated user can often reach admin or other-user data.",
    why:
      "When your team grows, checking 'is admin' by name becomes a bug farm. RBAC lets you add roles and review access without rewriting every endpoint.",
    apply:
      "Define roles for your app, attach them to users, and enforce role checks in a single authorization layer for every sensitive route.",
    misconception: "If the user is logged in, we can trust them.",
    example:
      "A /projects/:id endpoint that checks whether the user's role or permissions include 'project:delete' before allowing deletion.",
    case_study:
      "Capital One's 2019 breach involved a WAF SSRF and an over-provisioned IAM role that could list and read all S3 buckets. The role had far more permissions than the WAF needed, letting the attacker exfiltrate 106 million records.",
    anti_patterns: [
      "is_admin flag only",
      "per-user permission strings",
      "front-end hides buttons",
      "no role checks on API",
    ],
    resources: [
      "https://csrc.nist.gov/glossary/term/role_based_access_control",
      "https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/",
      "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
    ],
    prereqs: ["authentication-vs-authorization", "input-validation"],
    next: ["least-privilege", "idor"],
  },

  "least-privilege": {
    category: "security",
    question:
      "What is the smallest set of permissions this service actually needs?",
    explanation:
      "Least privilege means every user, service, and role gets only the permissions it needs and no more. It limits how far an attacker can move once they compromise one credential or service.",
    why:
      "Overly broad permissions turn a small breach into a big one. Vibe coders often give every container admin access because it is faster; that becomes the weakest link.",
    apply:
      "Audit the IAM role, API token, or database user for each service. Remove any permission it does not actively use, and re-audit after every feature change.",
    misconception:
      "It's faster to give the service all permissions and lock it down later.",
    example:
      "A payment webhook handler that only has INSERT on the events table, not SELECT on users or DROP on anything.",
    case_study:
      "Capital One's over-provisioned WAF IAM role and Uber's hardcoded Thycotic PAM admin credentials both show that a single over-privileged account can compromise an entire cloud estate.",
    anti_patterns: [
      "admin for all services",
      "broad IAM policies",
      "service account with root",
      "same role for dev and prod",
    ],
    resources: [
      "https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/",
      "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
      "https://blog.gitguardian.com/uber-breach-2022/",
    ],
    prereqs: ["role-based-access-control"],
    next: ["server-side-request-forgery", "api-key-management"],
  },

  // --- Phase 2: Input, injection, and injection-like attacks ---
  "server-side-request-forgery": {
    category: "security",
    question: "What URLs is your server allowed to fetch on behalf of a user?",
    explanation:
      "Server-side request forgery (SSRF) lets an attacker make the server send requests to attacker-chosen destinations, including internal services and cloud metadata endpoints. It is a common path from one exposed endpoint to internal cloud credentials.",
    why:
      "Any feature that fetches a URL from user input, such as a preview, import, image proxy, or webhook validation, can become a proxy into your private network.",
    apply:
      "Use an allowlist of schemes, hosts, and ports; reject private IP ranges and metadata URLs; do not follow redirects; and run fetchers in an isolated network.",
    misconception: "My app is public, so the server has nothing internal to hit.",
    example:
      "An image preview service that only accepts https://public-cdn.example.com/* and returns 400 for any other host or scheme.",
    case_study:
      "Capital One's 2019 breach is the canonical SSRF case: a misconfigured WAF allowed requests to the AWS EC2 metadata service, returning temporary credentials for an over-privileged IAM role. The attacker then listed and read S3 buckets.",
    anti_patterns: [
      "allow any URL",
      "follow redirects blindly",
      "trust DNS resolution",
      "no network segmentation",
    ],
    resources: [
      "https://owasp.org/Top10/2021/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/",
      "https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/",
      "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html",
    ],
    prereqs: ["input-validation", "least-privilege"],
    next: ["path-traversal", "webhook-security"],
  },

  "path-traversal": {
    category: "security",
    question:
      "Can a filename in a request reach files outside the intended directory?",
    explanation:
      "Path traversal lets an attacker use ../ or encoded equivalents to read or write files outside the intended folder. It turns an upload, report, or static-file endpoint into a filesystem exploit.",
    why:
      "Anytime you use user input to build a file path, you are handing the user a key to your server's filesystem.",
    apply:
      "Resolve paths against a base directory, reject or strip .. and null bytes, and use allowlists for extensions. Store uploads outside the web root and never execute them.",
    misconception: "Checking the file extension is enough.",
    example:
      "A request to /files?path=.%2e/.%2e/etc/passwd is rejected because the resolved absolute path is outside /var/app/uploads.",
    case_study:
      "CVE-2021-41773 in Apache HTTP Server 2.4.49 allowed path traversal and source disclosure through URL-encoded .%2e segments. It was quickly exploited in the wild because many deployments did not enforce the usual 'require all denied' defaults.",
    anti_patterns: [
      "concatenate user input into paths",
      "trust the file extension",
      "serve files from user-named directories",
      "allow null bytes",
    ],
    resources: [
      "https://nvd.nist.gov/vuln/detail/CVE-2021-41773",
      "https://www.rapid7.com/blog/post/ra-cve-2021-41773-analysis/",
      "https://owasp.org/www-community/attacks/Path_Traversal",
    ],
    prereqs: ["input-validation"],
    next: ["file-upload-security", "insecure-deserialization"],
  },

  "insecure-deserialization": {
    category: "security",
    question:
      "What happens if an attacker sends a serialized object your app will trust?",
    explanation:
      "Insecure deserialization occurs when an app converts untrusted serialized data back into objects. Attackers can craft payloads that execute code, tamper with object fields, or trigger unintended logic.",
    why:
      "Many frameworks make serialization easy and safe-looking. But native formats like Java ObjectInputStream or Python pickle treat incoming data as code.",
    apply:
      "Never deserialize untrusted data with native serializers. Use JSON, validate with schemas, sign data with HMAC if you must accept blobs, and avoid passing user input into binary deserializers.",
    misconception:
      "JSON parsing cannot execute arbitrary code by default.",
    example:
      "A session cookie that is a JSON Web Token signed with a server-side key, instead of a base64-pickled Python object.",
    case_study:
      "The 2015 Foxglove Security research revealed that Java's native ObjectInputStream, combined with vulnerable versions of the Apache Commons Collections library, gave attackers pre-authentication remote code execution in WebLogic, WebSphere, JBoss, Jenkins, and OpenNMS. Because many apps accept serialized Java objects over the network, the same gadget chains could be reused across products.",
    anti_patterns: [
      "use native pickling for user data",
      "deserialized cookies",
      "ignore framework security patches",
      "trust client object state",
    ],
    resources: [
      "https://owasp.org/www-community/vulnerabilities/Insecure_Deserialization",
      "https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html",
      "https://foxglovesecurity.com/2015/11/06/what-do-weblogic-websphere-jboss-jenkins-opennms-and-your-application-have-in-common-this-vulnerability/",
    ],
    prereqs: ["input-validation", "dependency-scanning"],
    next: ["mass-assignment", "business-logic-security"],
  },

  "credential-stuffing": {
    category: "security",
    question: "What happens when a user reuses a password from a breach?",
    explanation:
      "Credential stuffing uses leaked username-password pairs from one breach to log in elsewhere. It works because people reuse passwords and because many apps do not detect or block automated login attempts.",
    why:
      "Even if your app has never been breached, your users may be using passwords that have. Without detection, those accounts are trivially takeable.",
    apply:
      "Add rate limits and CAPTCHA on login, detect impossible-travel or known breached-password lists, and encourage or enforce MFA.",
    misconception: "My users are smart and use unique passwords.",
    example:
      "A login endpoint that checks passwords against the Have I Been Pwned API and blocks or warns on matches, plus progressive rate limiting.",
    case_study:
      "23andMe's 2023 breach: attackers used credential stuffing to access roughly 0.1% of accounts (~14,000), then used the DNA Relatives feature to reach profile data for about 6.9 million users. The source was reused credentials from other breaches, not a vulnerability in 23andMe's code.",
    anti_patterns: [
      "allow unlimited logins",
      "no breached-password checks",
      "blame users for reuse",
      "store passwords in plain text",
    ],
    resources: [
      "https://www.23andme.org/blog/articles/addressing-data-security-concerns/",
      "https://techcrunch.com/2023/12/04/23andme-confirms-hackers-stole-ancestry-data-on-6-9-million-users/",
      "https://owasp.org/www-community/attacks/Credential_stuffing",
    ],
    prereqs: ["rate-limiting", "password-hashing"],
    next: ["idor", "business-logic-security"],
  },

  "idor": {
    category: "security",
    question:
      "Can an authenticated user access another user's records just by changing an ID?",
    explanation:
      "Insecure direct object reference (IDOR) means the app uses user-supplied IDs to fetch records but fails to check that the user owns them. It leads to horizontal and vertical privilege escalation.",
    why:
      "REST APIs and modern frameworks make it easy to build /resource/:id endpoints. Without per-record authorization, every endpoint is a data leak.",
    apply:
      "On every data access, verify the record belongs to the current tenant or user. Use indirect, unguessable identifiers and never rely on client-side checks.",
    misconception: "Using UUIDs instead of integers prevents IDOR.",
    example:
      "A /orders/:id endpoint that queries where user_id equals the authenticated user's id, returning 403 if the order does not belong to them.",
    case_study:
      "Parler's 2021 data scrape: posts were accessible by sequential IDs with no authorization or rate limiting, allowing activists to download 70+ terabytes of public and deleted posts, including geolocation metadata. This is a textbook IDOR and enumeration failure.",
    anti_patterns: [
      "no object-level auth",
      "rely on obscurity",
      "front-end hides IDs",
      "sequential public IDs",
    ],
    resources: [
      "https://owasp.org/www-community/attacks/insecure_direct_object_reference",
      "https://www.wired.com/story/parler-hack-data-public-posts-images-video/",
      "https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/IDOR",
    ],
    prereqs: ["role-based-access-control", "authentication-vs-authorization"],
    next: ["mass-assignment", "business-logic-security"],
  },

  "mass-assignment": {
    category: "security",
    question: "Can a user set fields they shouldn't by adding parameters?",
    explanation:
      "Mass assignment lets a request set many model attributes at once. If sensitive fields such as admin or owner are not explicitly protected, attackers can overwrite them.",
    why:
      "Frameworks make it convenient to bind request bodies to models. Convenience without an allowlist is a privilege-escalation bug waiting to happen.",
    apply:
      "Use explicit allowlists for fields that can be set from user input, separate domain models from request DTOs, and never expose internal flags directly.",
    misconception: "My framework handles it.",
    example:
      "A user update DTO that only includes name and email, while the User model also has an admin flag that cannot be set by the update endpoint.",
    case_study:
      "In 2012, Egor Homakov exploited a mass assignment vulnerability in GitHub's Rails app to add his own SSH key to the Rails organization, gaining write access. The issue was that user parameters could set internal attributes like public keys or roles.",
    anti_patterns: [
      "bind request body to model",
      "no allowlist",
      "exposed admin flag",
      "trust the front-end form",
    ],
    resources: [
      "https://github.blog/news-insights/public-key-security-vulnerability-and-mitigation/",
      "https://lwn.net/Articles/485675/",
      "https://homakov.blogspot.com/2012/03/how-to.html",
    ],
    prereqs: ["input-validation", "idor"],
    next: ["business-logic-security", "security-logging-audit"],
  },

  "business-logic-security": {
    category: "security",
    question: "What can a legitimate user do that you never intended?",
    explanation:
      "Business logic flaws are vulnerabilities in the design of a workflow, not a bug in code. Attackers abuse intended flows, such as password reset, checkout, or reward systems, to produce unauthorized outcomes.",
    why:
      "Scanners and type systems cannot catch logic errors. You have to think like an attacker who is using your features as designed.",
    apply:
      "Map high-value workflows, set limits per user and per account, enforce state machines for transactions, and do abuse testing on your own APIs.",
    misconception:
      "If it compiles and the tests pass, the logic is secure.",
    example:
      "A password reset flow that limits code attempts per account and per IP, with an expiration window, so it cannot be brute-forced.",
    case_study:
      "In 2018 the USPS Informed Delivery API exposed data on 60 million users because it allowed any authenticated user to view or modify other users' account details by changing a parameter, a business-logic and access-control failure.",
    anti_patterns: [
      "test only happy path",
      "no rate limits on sensitive flows",
      "trust client state",
      "skip API abuse review",
    ],
    resources: [
      "https://krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users/",
      "https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/",
      "https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html",
    ],
    prereqs: ["idor", "rate-limiting"],
    next: ["penetration-testing", "vulnerability-disclosure"],
  },

  // --- Phase 3: Secrets, supply chain, and operational security ---
  "api-key-management": {
    category: "security",
    question: "Where do your API keys sleep at night?",
    explanation:
      "API keys are credentials that services use to talk to each other. If they are committed to git, hardcoded in scripts, or shared across environments, one leak gives an attacker the keys to your kingdom.",
    why:
      "Vibe coders often create one global admin API key and paste it everywhere. That is fine until a developer laptop, CI log, or dependency is compromised.",
    apply:
      "Use environment variables or a secret manager, scope keys by service and environment, rotate them on schedule, and revoke at first sign of exposure.",
    misconception:
      "API keys are just for machines, so they don't need to be secret.",
    example:
      "A Stripe webhook key stored in a secret manager and injected as STRIPE_WEBHOOK_SECRET, not checked into git or printed in logs.",
    case_study:
      "The 2022 Uber breach included hardcoded admin credentials in a PowerShell script on an internal network share. That script gave the attacker admin access to Uber's Thycotic PAM and, from there, AWS, GCP, Slack, and SentinelOne.",
    anti_patterns: [
      "commit keys to git",
      "one global admin key",
      "hardcode in scripts",
      "log keys in plaintext",
    ],
    resources: [
      "https://blog.gitguardian.com/uber-breach-2022/",
      "https://www.infosecurity-magazine.com/opinions/learnings-uber-breach/",
      "https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication.html",
    ],
    prereqs: ["secrets-management", "least-privilege"],
    next: ["secret-rotation", "webhook-security"],
  },

  "secret-rotation": {
    category: "security",
    question: "How long should a leaked secret stay valid?",
    explanation:
      "Secret rotation means replacing credentials and keys on a schedule or after exposure. The longer a secret lives, the more places it can leak and the longer an attacker can use it.",
    why:
      "Even with great secret management, leaks happen via logs, screenshots, old backups, and supply-chain tools. Rotation limits the window of misuse.",
    apply:
      "Set expiry on API keys, automate rotation of TLS certificates, database passwords, and signing keys, and alert on any key older than your policy.",
    misconception:
      "Rotating secrets breaks integrations, so we should do it only after a breach.",
    example:
      "A CI pipeline that re-creates database credentials every 90 days and updates the secret manager, with services picking up the new value on next deploy.",
    case_study:
      "CircleCI's January 2023 incident: an attacker with access to production systems exfiltrated customer environment variables, tokens, and keys. CircleCI advised all customers to rotate any secrets stored in the platform, and worked with AWS and GitHub to revoke and rotate tokens.",
    anti_patterns: [
      "never rotate",
      "manual rotation",
      "one key forever",
      "keep old keys active",
    ],
    resources: [
      "https://circleci.com/blog/jan-4-2023-incident-report/",
      "https://support.circleci.com/hc/en-us/articles/11816211460891-Rotating-Secrets-for-January-4th-Incident",
      "https://www.cisa.gov/resources-tools/resources/product-security-bad-practices",
    ],
    prereqs: ["api-key-management", "secrets-management"],
    next: ["supply-chain-security", "certificate-management"],
  },

  "supply-chain-security": {
    category: "security",
    question: "What if your trusted vendor ships you a backdoor?",
    explanation:
      "Supply-chain security protects against compromised dependencies, build tools, or third-party services that you integrate into your product. An attacker who owns your build or a dependency can own your users.",
    why:
      "Vibe coders pull in hundreds of packages and SaaS tools. You inherit their vulnerabilities, secrets, and sometimes their attackers.",
    apply:
      "Pin dependency versions and hashes, verify checksums and signatures, lock down CI/CD secrets, and monitor for new package maintainers or unexpected code changes.",
    misconception:
      "Open source is safe because many eyes review it.",
    example:
      "A CI job that verifies the SHA-256 of downloaded Node binaries and only installs dependencies from a lock file with audit.",
    case_study:
      "The SolarWinds Orion compromise in 2020: attackers inserted a backdoor into a software update distributed to ~18,000 customers, including U.S. government agencies. The trojanized DLL called out to attacker-controlled infrastructure, allowing access to victim networks.",
    anti_patterns: [
      "install latest without pinning",
      "ignore package signatures",
      "one shared CI secret",
      "no vendor risk review",
    ],
    resources: [
      "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a",
      "https://www.cisa.gov/news-events/alerts/2021/01/07/supply-chain-compromise",
      "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html",
    ],
    prereqs: ["dependency-scanning", "secret-rotation"],
    next: ["subresource-integrity", "penetration-testing"],
  },

  "subresource-integrity": {
    category: "security",
    question:
      "How do you know a third-party script hasn't been tampered with?",
    explanation:
      "Subresource integrity (SRI) lets you pin the cryptographic hash of a script or style loaded from a CDN. The browser refuses to execute the resource if its hash does not match, blocking supply-chain tampering.",
    why:
      "Loading JS from a CDN means you trust the CDN forever. SRI converts that trust into a one-time verification of bytes.",
    apply:
      "Add integrity and crossorigin attributes to every script and link tag that points to an external CDN, and regenerate hashes when you upgrade versions.",
    misconception: "My CDN is big and trustworthy, so this isn't necessary.",
    example:
      "<script src=\"https://cdn.example.com/lib.js\" integrity=\"sha384-...\" crossorigin=\"anonymous\"></script>",
    case_study:
      "In 2024 the polyfill.io domain and GitHub account were sold and the CDN began injecting malicious code into sites that loaded its script. Sites with SRI hashes would have had the tampered script blocked by the browser.",
    anti_patterns: [
      "load third-party JS without integrity",
      "use latest tag",
      "trust every CDN",
      "hardcode hashes that never update",
    ],
    resources: [
      "https://owasp.org/www-community/controls/SubresourceIntegrity",
      "https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity",
      "https://www.srihash.org/",
    ],
    prereqs: ["supply-chain-security", "tls"],
    next: ["security-headers", "dependency-scanning"],
  },

  "file-upload-security": {
    category: "security",
    question: "What happens if an uploaded file is a shell in disguise?",
    explanation:
      "File upload endpoints accept user-controlled data and write it to disk. If the upload directory is web accessible, if MIME types are trusted, or if extensions are loosely checked, an attacker can execute code.",
    why:
      "An upload feature is a direct path from the internet to your filesystem. It requires validation at the content, extension, and filesystem layers.",
    apply:
      "Store uploads outside the web root, use magic bytes and extension allowlists, rename with random names, disable execution in the upload directory, and re-encode images.",
    misconception: "Checking the file extension on the server is enough.",
    example:
      "A profile picture endpoint that re-encodes the image with ImageMagick, saves it to an object store not served by the app server, and rejects anything that does not decode as an image.",
    case_study:
      "Real-world bug bounty reports repeatedly show file uploads leading to remote code execution. A typical chain: the app trusts Content-Type: image/jpeg, writes a file named avatar.php.jpg to a public directory, and the server executes it because PHP matches the final extension or the .php inside the double extension.",
    anti_patterns: [
      "trust Content-Type",
      "store uploads in web root",
      "allow double extensions",
      "execute user files",
    ],
    resources: [
      "https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload",
      "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html",
      "https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files",
    ],
    prereqs: ["input-validation", "path-traversal"],
    next: ["pii-data-minimization", "security-logging-audit"],
  },

  "security-headers": {
    category: "security",
    question: "What if the browser is the last line of defense?",
    explanation:
      "Security headers are HTTP response headers that tell browsers to enforce security policies, such as HTTPS-only, framing restrictions, content-type sniffing, and referrer handling. They are cheap defense-in-depth controls.",
    why:
      "Many attacks, including XSS, clickjacking, and session downgrade, can be mitigated by a few response headers that take minutes to set.",
    apply:
      "Set X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, and Permissions-Policy on every response. Use a scanner to verify.",
    misconception: "CSP is enough; I don't need the other headers.",
    example:
      "A response that includes Strict-Transport-Security: max-age=31536000; includeSubDomains; X-Frame-Options: DENY; X-Content-Type-Options: nosniff.",
    case_study:
      "For years, sites without X-Frame-Options were vulnerable to clickjacking. The 2009–2010 Twitter clickjacking worms used iframes to trick users into tweeting. HSTS and X-Frame-Options are now baseline requirements for most security checklists.",
    anti_patterns: [
      "allow framing from any site",
      "no HSTS",
      "no MIME sniffing protection",
      "referrer policy that leaks origin to untrusted third parties",
    ],
    resources: [
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html",
      "https://web.dev/articles/security-headers",
      "https://owasp.org/www-project-secure-headers/",
    ],
    prereqs: ["tls", "csp"],
    next: ["pii-data-minimization", "security-logging-audit"],
  },

  // --- Phase 4: Data, privacy, and cryptography ---
  "pii-data-minimization": {
    category: "security",
    question: "What data would hurt your users if it leaked?",
    explanation:
      "Data minimization means collecting and retaining only the personal data you need. Less PII means less exposure, smaller compliance scope, and a smaller blast radius.",
    why:
      "The 2018 British Airways breach exposed 380,000+ payment cards partly because the payment page loaded too many third-party scripts. Keeping sensitive fields minimal and isolated limits what attackers can steal.",
    apply:
      "Review every PII field you collect, delete what you don't use, tokenize payment data, and isolate sensitive forms on a separate, locked-down origin.",
    misconception:
      "Collecting more data now is fine because we might need it later.",
    example:
      "A checkout form that collects only the last four digits of a card for support while passing the full PAN directly through a tokenization provider that your server never sees.",
    case_study:
      "British Airways' 2018 Magecart breach captured payment details from 380,000 transactions after attackers injected 22 lines of JavaScript into a third-party script loaded on the payment page. The ICO initially proposed a £183.4m fine and ultimately fined British Airways £20m.",
    anti_patterns: [
      "collect everything",
      "log PII",
      "store CVV",
      "share PII with all services",
    ],
    resources: [
      "https://www.bbc.co.uk/news/technology-45481976",
      "https://ico.org.uk/for-organisations/guide-to-data-protection/",
      "https://techcrunch.com/2018/09/11/british-airways-breach-caused-by-credit-card-skimming-malware-researchers-say/",
    ],
    prereqs: ["input-validation", "tls"],
    next: ["encryption-at-rest", "security-logging-audit"],
  },

  "encryption-at-rest": {
    category: "security",
    question: "What happens if someone steals your database disk?",
    explanation:
      "Encryption at rest protects stored data by encrypting the underlying files, volumes, or backups. It prevents attackers from reading data if they gain physical or snapshot access to storage.",
    why:
      "Cloud snapshots, lost laptops, backup theft, and compromised storage accounts can expose raw database files. Encryption turns those files into ciphertext without the key.",
    apply:
      "Enable database encryption, encrypt backups, manage keys in a KMS, and rotate encryption keys. Do not store keys next to the data they protect.",
    misconception: "Encryption at rest protects data while it is being queried.",
    example:
      "A Postgres cluster using AWS KMS-backed storage encryption and encrypted snapshots, with keys stored in a separate KMS account from the database.",
    case_study:
      "Many breach reports note that encryption of sensitive fields can limit what attackers can read. Equifax's breach also raised questions about why more data at rest was not encrypted and segmented.",
    anti_patterns: [
      "store keys with data",
      "use default passwords",
      "no backup encryption",
      "assume TLS is enough",
    ],
    resources: [
      "https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-111.pdf",
      "https://csrc.nist.gov/pubs/sp/800/111/final",
      "https://docs.aws.amazon.com/efs/latest/ug/encryption-at-rest.html",
    ],
    prereqs: ["pii-data-minimization", "secrets-management"],
    next: ["certificate-management", "security-logging-audit"],
  },

  "certificate-management": {
    category: "security",
    question: "What happens when your TLS certificate expires?",
    explanation:
      "Certificate management is the process of provisioning, deploying, monitoring, and renewing TLS certificates. An expired or misconfigured certificate breaks HTTPS and can block users, CI, or APIs.",
    why:
      "A single expired cert can make an entire service unreachable, tank conversions, and break automated clients that refuse invalid certificates.",
    apply:
      "Use short-lived certificates with automated renewal, set alerts at 30/7/1 days before expiry, and test certificate rotation in staging.",
    misconception: "Certificates are a one-time setup task.",
    example:
      "A service using Let's Encrypt with cert-manager in Kubernetes that auto-renews 30 days before expiry and posts a Slack alert if renewal fails.",
    case_study:
      "In 2013 an expired SSL certificate caused a worldwide outage for Windows Azure Storage and dependent Team Foundation Service for about nine hours. In 2023, packages.microsoft.com also had an expired certificate, breaking apt and Azure CLI installs.",
    anti_patterns: [
      "manual cert renewal",
      "one email alias owns certs",
      "no expiry alerts",
      "self-signed certs in prod",
    ],
    resources: [
      "https://www.pcworld.com/article/456965/microsofts-azure-service-falls-to-expired-ssl-certificate.html",
      "https://www.infoq.com/news/2013/03/feb22_azure_outage/",
      "https://scotthelme.co.uk/hsts-cheat-sheet/",
    ],
    prereqs: ["tls", "secret-rotation"],
    next: ["security-logging-audit", "zero-trust"],
  },

  "zero-trust": {
    category: "security",
    question: "Should we trust anything inside the network?",
    explanation:
      "Zero trust assumes no user, device, or service is trusted by default, regardless of network location. It requires continuous verification, least privilege, and strong segmentation.",
    why:
      "Once an attacker is inside, a flat network lets them move laterally. Zero trust makes every access decision explicit and logged.",
    apply:
      "Replace one internal API's `isLocalhost` or `isVpn` bypass with a signed JWT or mTLS check this sprint, then require identity for one more service-to-service call.",
    misconception:
      "Zero trust is only for large enterprises; my startup is too small.",
    example:
      "A backend service that verifies mTLS and a signed JWT for every request, instead of allowing any container in the same VPC to call it.",
    case_study:
      "The 2020 Twitter attack and 2022 Uber breach both succeeded partly because internal tools had broad, implicit trust. Zero-trust principles such as just-in-time admin and per-service identity would have made lateral movement far harder.",
    anti_patterns: [
      "trust the VPN",
      "flat network",
      "shared admin accounts",
      "no device identity",
    ],
    resources: [
      "https://csrc.nist.gov/pubs/sp/800/207/final",
      "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf",
      "https://www.cisa.gov/zero-trust-maturity-model",
    ],
    prereqs: ["least-privilege", "authentication-vs-authorization"],
    next: ["security-logging-audit", "penetration-testing"],
  },

  "security-logging-audit": {
    category: "security",
    question: "If an attacker is in your system, would you see them?",
    explanation:
      "Security logging and audit capture who did what, when, and from where. Without it, breaches can remain undetected for months, and incident response becomes guesswork.",
    why:
      "Most attackers are not detected at the point of entry; they are detected by anomalous logs. If you are not logging authentication, authorization, and data access, you are flying blind.",
    apply:
      "Add a single centralized log sink for admin `POST`/`DELETE` events and write one anomaly alert, such as a service account accessing PII it has never touched.",
    misconception: "Logs are only for debugging.",
    example:
      "A SIEM rule that alerts when the same admin account logs in from two countries within five minutes or when a service account accesses PII it has never touched.",
    case_study:
      "Target's 2013 breach triggered alerts from its FireEye malware detection system, but the security team in Minneapolis did not act on the warnings from the Bangalore SOC in time. The breach exposed 40 million payment cards and 70 million customer records.",
    anti_patterns: [
      "log only errors",
      "no centralized logs",
      "logs editable by app users",
      "ignore alerts",
    ],
    resources: [
      "https://www.theregister.com/security/2014/03/14/target-ignored-hacker-alarms-as-crooks-took-40m-credit-cards-claim/554381",
      "https://techcrunch.com/2014/03/13/target-knew-about-credit-card-hack-for-12-days-before-reacting/",
      "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html",
    ],
    prereqs: ["security-headers", "pii-data-minimization"],
    next: ["penetration-testing", "incident-response"],
  },

  // --- Phase 5: Validation, testing, and disclosure ---
  "penetration-testing": {
    category: "security",
    question: "What would a determined attacker find before your users do?",
    explanation:
      "Penetration testing simulates real attacks against your app to find vulnerabilities that scanners miss. It is a structured way to discover and fix security holes before exploitation.",
    why:
      "Automated tools find known patterns; humans find logic and chain bugs. A pentest is especially valuable before a big launch, a security incident, or entering a regulated market.",
    apply:
      "Scope a test for your critical flows, hire a reputable firm or run a bug bounty, and fix high-severity findings before the next deploy.",
    misconception: "A clean pentest report means we are secure.",
    example:
      "An annual pentest that covers authentication, authorization, input validation, and file upload, with a retest of any critical or high findings.",
    case_study:
      "The U.S. Department of Defense's Hack the Pentagon bug bounty in 2016 found 138 valid vulnerabilities in public-facing DoD websites in 23 days for $150,000, far faster and cheaper than a traditional audit.",
    anti_patterns: [
      "test only what passes",
      "ignore findings",
      "one pentest at launch",
      "hide scope from testers",
    ],
    resources: [
      "https://apnews.com/united-states-government-de34fa9e05f24fc6a655a8f0b9548bcb",
      "https://www.hackerone.com/events/hack-the-pentagon",
      "https://owasp.org/www-project-web-security-testing-guide/latest/",
    ],
    prereqs: ["business-logic-security", "security-logging-audit"],
    next: ["vulnerability-disclosure", "dependency-scanning"],
  },

  "vulnerability-disclosure": {
    category: "security",
    question: "What happens when someone finds a bug in your app?",
    explanation:
      "Vulnerability disclosure is the process for receiving, triaging, and fixing security reports from external researchers. Without a safe channel, researchers either stay silent or go public, and attackers quietly exploit.",
    why:
      "Bugs will be found. A disclosure policy turns a potential PR crisis into a fast fix and builds trust with the security community.",
    apply:
      "Publish a security@ email or HackerOne policy, define response SLAs, and fix or disclose within a reasonable timeline. Thank reporters and do not threaten them.",
    misconception:
      "Reporting a bug is hacking and we should ignore or sue.",
    example:
      "A /security page with a clear disclosure policy, a PGP key, and a 90-day coordinated disclosure commitment.",
    case_study:
      "The MOVEit Transfer CVE-2023-34362 zero-day was exploited by the Cl0p ransomware group beginning in late May 2023, before a patch was available. A clear disclosure and patching process, plus asset inventory, is the difference between a fast fix and a mass-exploitation event.",
    anti_patterns: [
      "no disclosure policy",
      "threaten researchers",
      "patch silently",
      "no asset inventory",
    ],
    resources: [
      "https://www.ic3.gov/CSA/2023/230607.pdf",
      "https://www.tenable.com/blog/cve-2023-34362-moveit-transfer-critical-zero-day-vulnerability-exploited-in-the-wild",
      "https://disclose.io/",
    ],
    prereqs: ["penetration-testing", "dependency-scanning"],
    next: ["threat-modeling", "incident-response"],
  },

  // --- Reliability: phase 6 ---
  "retry-storms": {
    category: "reliability",
    question: "What happens when every client retries at the same time?",
    explanation:
      "A retry storm occurs when many clients retry failed requests aggressively, multiplying the load on an already struggling service. Without jitter and circuit breakers, retries can turn a small blip into an outage.",
    why:
      "Retries are good until they are not. When a service is down, coordinated retries become a self-inflicted DDoS.",
    apply:
      "Use exponential backoff with full jitter, cap retry counts, and add circuit breakers so clients stop hammering a failing dependency.",
    misconception: "Retrying immediately gives users a faster recovery.",
    example:
      "A client that waits a random time from 0 to 2^attempt ms, with a maximum of 3 attempts, then returns a cached fallback.",
    case_study:
      "The November 2020 AWS Kinesis outage in us-east-1 was triggered by a capacity addition, but recovery was deliberately throttled to avoid thundering-herd and retry effects. AWS noted that restarting the front-end fleet too quickly would have caused further cascading failure.",
    anti_patterns: [
      "immediate retry loops",
      "no jitter",
      "unbounded retries",
      "retry on 5xx without backoff",
    ],
    resources: [
      "https://aws.amazon.com/message/11201/",
      "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/",
      "https://sujeet.pro/articles/aws-kinesis-2020-outage",
    ],
    prereqs: ["back-off-and-retry", "timeouts"],
    next: ["load-shedding", "circuit-breaker"],
  },

  "load-shedding": {
    category: "reliability",
    question: "Which requests should survive when you can't handle them all?",
    explanation:
      "Load shedding means intentionally rejecting low-priority traffic during overload so that critical traffic keeps working. It turns a total collapse into a graceful partial service.",
    why:
      "Autoscaling is not instant. During sudden spikes, you must choose between serving no one and serving the most important requests.",
    apply:
      "Assign priorities to requests, drop non-critical work first, and expose a 503 with a Retry-After header so clients back off.",
    misconception: "Rejecting requests is worse than trying to serve everyone.",
    example:
      "A streaming API that drops prefetch and analytics requests under load but continues to serve playback requests.",
    case_study:
      "Netflix introduced prioritized load shedding to drop non-critical requests during traffic spikes, allowing critical user-initiated playback requests to 'steal' capacity from prefetch and background traffic.",
    anti_patterns: [
      "drop all traffic equally",
      "never reject",
      "queue forever",
      "no priority classification",
    ],
    resources: [
      "https://www.infoq.com/news/2024/11/netflix-load-shedding/",
      "https://www.infoq.com/presentations/service-level-prioritized-load-shedding/",
      "https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/",
    ],
    prereqs: ["retry-storms", "backpressure"],
    next: ["fallback", "graceful-degradation"],
  },

  "fallback": {
    category: "reliability",
    question: "What should your app do when a dependency says no?",
    explanation:
      "A fallback is an alternative response or behavior used when a dependency fails. It keeps the user experience useful even when part of the system is broken.",
    why:
      "Perfect availability is impossible. Fallbacks let you degrade without failing, buying time to fix the root cause.",
    apply:
      "Identify each external call, decide what a safe default is, and return cached, stale, or simplified data when the call fails.",
    misconception: "If a service is down, we should just fail the request.",
    example:
      "A product page that shows cached prices and a 'live inventory unavailable' banner when the inventory service times out.",
    case_study:
      "Netflix uses fallback metadata and cached recommendations to keep the UI populated when personalization or content services are slow. This lets users keep browsing and playing even during partial outages.",
    anti_patterns: [
      "fail every request",
      "return null",
      "cached stale data with no warning",
      "skip fallback tests",
    ],
    resources: [
      "https://www.infoq.com/news/2024/11/netflix-load-shedding/",
      "https://sre.google/sre-book/handling-overload/",
      "https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/",
    ],
    prereqs: ["circuit-breaker", "load-shedding"],
    next: ["graceful-degradation", "slos"],
  },

  "fault-tolerance": {
    category: "reliability",
    question: "How does one broken component bring down the whole app?",
    explanation:
      "Fault tolerance is the ability of a system to continue operating when parts fail. It combines isolation, redundancy, retries, fallbacks, and graceful degradation.",
    why:
      "Vibe coders often build happy-path apps. Real systems have faulty networks, bad deploys, and flaky APIs. Fault tolerance is how you survive them.",
    apply:
      "Add retries, timeouts, circuit breakers, and fallbacks to every dependency. Run chaos tests to prove components fail in isolation.",
    misconception: "Adding try/catch blocks makes a system fault tolerant.",
    example:
      "A payment flow that retries the processor once, then queues the request for reconciliation instead of failing the user's checkout.",
    case_study:
      "Netflix's Chaos Monkey deliberately terminates production instances to validate that the remaining nodes and fallback paths can keep serving customers, making fault tolerance a practiced behavior rather than a hope.",
    anti_patterns: [
      "single point of failure",
      "ignore failures",
      "no retry limits",
      "coupled critical paths",
    ],
    resources: [
      "https://arxiv.org/pdf/1702.05843",
      "https://sre.google/sre-book/handling-overload/",
      "https://aws.amazon.com/builders-library/implementing-health-checks/",
    ],
    prereqs: ["circuit-breaker", "fallback"],
    next: ["redundancy", "service-mesh"],
  },

  "redundancy": {
    category: "reliability",
    question: "What happens when the one thing you rely on disappears?",
    explanation:
      "Redundancy means having independent copies or alternatives for critical components. It is the simplest form of fault tolerance, but only works if the redundant parts do not share the same failure mode.",
    why:
      "A single server, region, database, or data center is a single point of failure. Redundancy lets you fail over without data loss.",
    apply:
      "Run at least two instances of stateless services, replicate databases, store backups in a different region, and test failovers.",
    misconception: "Backups are the same as redundancy; I have a copy.",
    example:
      "A database with a hot standby in a different availability zone and automated promotion on failure detection.",
    case_study:
      "The March 2021 OVHcloud fire in Strasbourg destroyed SBG2 and damaged SBG1. Some customers who paid for backups lost them because backups were stored in the same building as production, showing that redundancy requires physical separation.",
    anti_patterns: [
      "backups in the same building",
      "one AZ",
      "hot standbys not tested",
      "assume single region is enough",
    ],
    resources: [
      "https://journal.uptimeinstitute.com/learning-from-the-ovhcloud-data-center-fire/",
      "https://btw.media/en/the-ovhcloud-fire-showed-that-data-locality-is-not-disaster-separation",
      "https://www.theregister.com/2021/03/10/ovh/",
    ],
    prereqs: ["fault-tolerance", "backups"],
    next: ["multi-region", "disaster-recovery"],
  },

  "service-mesh": {
    category: "reliability",
    question: "Who enforces reliability and security between your services?",
    explanation:
      "A service mesh adds a sidecar proxy to every service to handle mTLS, retries, timeouts, load balancing, and observability without changing application code. It centralizes cross-cutting concerns.",
    why:
      "In microservices, every service pair becomes a potential failure point. A mesh gives you a uniform place to enforce policies and collect telemetry.",
    apply:
      "Deploy a sidecar for one non-critical service in staging, observe mTLS and retry metrics for a week, then add a traffic-splitting policy for one canary release.",
    misconception: "You need a service mesh from day one.",
    example:
      "Istio or Linkerd sidecars between services, providing mTLS, per-route retries, and distributed tracing headers.",
    case_study:
      "Organizations like Airbnb and eBay have used service meshes to secure east-west traffic, manage canary releases, and gain uniform observability across polyglot microservices. The mesh turns 'each team writes its own retry logic' into a platform-level policy.",
    anti_patterns: [
      "mesh for two services",
      "no observability first",
      "ignore control plane failures",
      "hardcoded retries",
    ],
    resources: [
      "https://istio.io/latest/docs/concepts/what-is-istio/",
      "https://linkerd.io/docs/overview/",
      "https://istio.io/latest/about/service-mesh/",
    ],
    prereqs: ["fault-tolerance", "distributed-tracing"],
    next: ["observability", "canary-release"],
  },

  "service-level-indicators": {
    category: "reliability",
    question: "What exactly are you promising to keep reliable?",
    explanation:
      "Service level indicators (SLIs) are the specific, measurable properties of a service, such as latency, error rate, throughput, or availability. SLOs are targets over time; SLIs are the metrics you measure against them.",
    why:
      "You cannot meet a reliability target if you cannot define and measure it. SLIs turn 'keep it fast' into 'p99 latency under 200ms'.",
    apply:
      "Pick one to three SLIs for your critical user journey, instrument them, and use them to set SLOs and alerts.",
    misconception: "Uptime percentage is the only SLI that matters.",
    example:
      "For a checkout API, SLIs are: 99.9% of requests succeed, p99 latency < 300ms, and 100% of payment webhooks are processed within 5 minutes.",
    case_study:
      "Google's SRE book uses 'availability, latency, durability, and freshness' as the key SLIs for systems. Google Search's SLOs are driven by these SLIs and error budgets, making reliability a measurable, negotiable property.",
    anti_patterns: [
      "vanity metrics",
      "too many SLIs",
      "SLI no user cares about",
      "no SLO tie",
    ],
    resources: [
      "https://sre.google/sre-book/service-level-objectives/",
      "https://sre.google/sre-book/monitoring-distributed-systems/",
      "https://learn.microsoft.com/en-us/azure/well-architected/reliability/metrics",
    ],
    prereqs: ["metrics", "slos"],
    next: ["error-budgets", "alerting"],
  },

  "error-budget-policy": {
    category: "reliability",
    question: "How much unreliability can you afford before you stop shipping?",
    explanation:
      "An error budget policy defines the amount of acceptable unreliability and the actions to take when it is consumed. It aligns engineering and product around tradeoffs between features and reliability.",
    why:
      "Without a budget, every launch is a debate. With one, teams agree in advance that a burned budget means launches pause until reliability recovers.",
    apply:
      "Set an SLO, calculate the error budget, and document who decides to pause launches or increase reliability investment when the budget is spent.",
    misconception: "100% uptime is a reasonable SLO.",
    example:
      "A 99.9% monthly availability SLO gives an error budget of ~43 minutes. If two incidents burn that in a week, the team freezes non-essential releases for the rest of the month.",
    case_study:
      "Google's SRE book describes error budgets as the contract between SRE and product: when a service burns its budget, launches stop and the team focuses on reliability work. This balances feature velocity against user trust.",
    anti_patterns: [
      "SLO of 100%",
      "ignore budget",
      "no policy",
      "blame SRE for all incidents",
    ],
    resources: [
      "https://sre.google/workbook/error-budget-policy/",
      "https://sre.google/sre-book/service-level-objectives/",
      "https://sre.google/sre-book/embracing-risk/",
    ],
    prereqs: ["slos", "service-level-indicators"],
    next: ["incident-response", "postmortem"],
  },

  "request-prioritization": {
    category: "reliability",
    question: "Which work should survive when everything cannot run?",
    explanation:
      "Request prioritization ranks traffic by business value so that critical work gets resources first during overload or partial failure. It is the decision side of load shedding.",
    why:
      "Not all requests are equal. Analytics, logs, and previews can wait; login, checkout, and playback cannot.",
    apply:
      "Tag incoming requests by user intent, classify them as critical/degraded/non-critical, and let your gateway or service shed non-critical work first.",
    misconception:
      "First-come, first-served is the fairest way to serve traffic.",
    example:
      "An API gateway that checks a priority header and drops /analytics batch requests when CPU exceeds 80%, preserving /cart and /checkout.",
    case_study:
      "Netflix's prioritized load shedding classifies requests into CRITICAL, DEGRADED_EXPERIENCE, and NON_CRITICAL and drops non-critical traffic during spikes. This keeps members able to play video even when the control plane is under stress.",
    anti_patterns: [
      "no request classification",
      "shed critical first",
      "random dropping",
      "no client backoff",
    ],
    resources: [
      "https://www.infoq.com/news/2024/11/netflix-load-shedding/",
      "https://sre.google/sre-book/handling-overload/",
      "https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/",
    ],
    prereqs: ["load-shedding", "slos"],
    next: ["graceful-degradation", "autoscaling"],
  },

  "synthetic-monitoring": {
    category: "reliability",
    question:
      "How do you know your app works before a real user complains?",
    explanation:
      "Synthetic monitoring runs scripted requests against your app from outside, continuously. It catches failures in critical user journeys before real users notice them.",
    why:
      "Real-user monitoring is too slow for a 3am outage. Synthetic checks give you a heartbeat on the paths that matter most.",
    apply:
      "Write synthetic tests for login, checkout, and a critical API. Run them from multiple regions and alert on failure or latency regressions.",
    misconception:
      "If my service health endpoint returns 200, the app is fine.",
    example:
      "A scheduled test that logs in, adds an item to the cart, and completes a fake checkout every minute from three regions.",
    case_study:
      "Many major outages, including Atlassian's 2022 multi-day site deletion incident, were first noticed by customer reports. Synthetic monitoring of critical flows can shorten detection from hours or days to minutes.",
    anti_patterns: [
      "only ping /health",
      "test from one region",
      "alert on every blip",
      "no critical journey coverage",
    ],
    resources: [
      "https://www.atlassian.com/blog/atlassian-engineering/april-2022-outage-update",
      "https://sre.google/sre-book/monitoring-distributed-systems/",
      "https://aws.amazon.com/builders-library/instrumenting-distributed-systems-for-operational-visibility/",
    ],
    prereqs: ["metrics", "health-checks"],
    next: ["alerting", "observability"],
  },

  "recovery-objectives": {
    category: "reliability",
    question: "How long and how much data can you afford to lose?",
    explanation:
      "RTO (Recovery Time Objective) and RPO (Recovery Point Objective) define the maximum acceptable downtime and data loss for a service. They shape your backup, replication, and runbook strategy.",
    why:
      "Without RTO/RPO, 'disaster recovery' is just a vague hope. They let you choose and cost the right redundancy and test the plan.",
    apply:
      "Set RTO and RPO for each critical service, document the recovery path, and run a drill to see if you can meet them.",
    misconception:
      "Backups mean we can recover instantly with no data loss.",
    example:
      "A service with a 4-hour RTO and 15-minute RPO uses continuous replication and point-in-time restore, tested quarterly.",
    case_study:
      "Atlassian's April 2022 outage took up to 14 days to fully restore 775 customer sites after a deletion script error, far exceeding typical RTOs. The incident drove Atlassian to improve recovery exercises and contact-data resilience.",
    anti_patterns: [
      "no RTO/RPO",
      "untested backups",
      "assume zero RPO",
      "same DR plan for all services",
    ],
    resources: [
      "https://www.atlassian.com/blog/atlassian-engineering/april-2022-outage-update",
      "https://postmortem.io/incidents/atlassian--2022-04-05--post-incident-review-april-2022-outage/",
      "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_planning_for_recovery_disaster_recovery.html",
    ],
    prereqs: ["redundancy", "backups"],
    next: ["disaster-recovery", "incident-response"],
  },

  "chaos-testing": {
    category: "reliability",
    question:
      "How do you know your system handles failure before it matters?",
    explanation:
      "Chaos testing deliberately injects failures into a controlled environment to validate resilience. It proves that fallbacks, redundancy, and incident response actually work under real conditions.",
    why:
      "You cannot test failure by waiting for it. Chaos tests surface hidden dependencies and brittle assumptions.",
    apply:
      "Start small: terminate one non-critical instance or inject latency into one dependency. Observe the impact, then broaden scope.",
    misconception:
      "Chaos testing is just randomly breaking things in production.",
    example:
      "A weekly game-day that kills one pod in staging and verifies that the API returns cached data within the SLO.",
    case_study:
      "Netflix's Chaos Monkey is the canonical chaos testing program. It terminates random production instances, forcing engineers to build services that keep working when any single node disappears.",
    anti_patterns: [
      "break production on Friday",
      "no rollback plan",
      "no observability",
      "skip staging first",
    ],
    resources: [
      "https://arxiv.org/abs/1702.05843",
      "https://sre.google/sre-book/handling-overload/",
      "https://principlesofchaos.org/",
    ],
    prereqs: ["fault-tolerance", "observability"],
    next: ["incident-response", "postmortem"],
  },

  "threat-modeling": {
    category: "security",
    question: "Where will your app break before an attacker finds out?",
    explanation:
      "Threat modeling is the practice of identifying what you are protecting, who might attack it, and how. It turns security from a checklist into a set of structured what-if questions about your actual architecture.",
    why:
      "Vibe coders often ship fast and secure later. Threat modeling lets you spot the cheapest fixes early, before an attacker makes them expensive.",
    apply:
      "Draw one data-flow diagram for your authentication or payment flow, list the trust boundaries, and pick the top three threats to mitigate this month.",
    misconception: "Threat modeling is only for large enterprises with formal teams.",
    example:
      "A simple STRIDE review of a login flow: spoofing (weak passwords), tampering (session tokens), repudiation (missing logs), information disclosure (PII in logs), denial of service (no rate limits), elevation of privilege (IDOR).",
    case_study:
      "The Microsoft Threat Modeling Tool and the OWASP Threat Dragon community both grew from the realization that most vulnerabilities are predictable once you map data flows and trust boundaries. The 2020 Twitter breach, where internal tools had broad access, is a classic example of missing trust-boundary analysis.",
    anti_patterns: [
      "threat model only after a breach",
      "focus only on known vulnerabilities",
      "skip trust boundaries",
      "keep results in a slide deck",
    ],
    resources: [
      "https://owasp.org/www-community/Application_Threat_Modeling",
      "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
      "https://www.microsoft.com/en-us/securityengineering/sdl/threatmodeling",
    ],
    prereqs: ["business-logic-security", "security-logging-audit"],
    next: ["incident-response", "postmortem"],
  },
};
