---
description: Use when the user is handling auth, secrets, data, compliance, or any security-sensitive feature.
---

# Security playbook

## When this becomes relevant

- Adding authentication or authorization.
- Handling payments or billing.
- Storing user data, PII, or health/financial data.
- Exposing or consuming APIs and webhooks.
- Managing secrets, tokens, or credentials.
- Thinking about compliance (SOC 2, GDPR, etc.).

## Questions to ask

- What data do we hold? Where does it live? Who can access it?
- Is HTTPS enforced everywhere, including APIs and webhooks?
- Are secrets in environment variables or a secret manager, never in code?
- Do we have rate limiting on authentication and public endpoints?
- Are webhooks idempotent and signed?
- Do we validate and sanitize all input at the boundary?
- Are dependencies audited and updated regularly?
- What is the incident response plan for a breach or leak?

## Common anti-patterns

- Rolling your own cryptography or auth protocol.
- Storing plaintext passwords or tokens.
- No rate limiting on login, signup, or public APIs.
- Trusting client-side validation.
- Logging secrets, tokens, or PII.
- Long-lived API tokens without rotation or revocation.
- No dependency scanning or patch process.
- Ignoring CORS, CSP, and security headers.

## Decision heuristics

- Use managed authentication until you have a strong reason not to.
- Default-deny permissions; grant least privilege.
- Validate at the boundary and sanitize before storage.
- Never log secrets or unredacted PII.
- Encrypt in transit and at rest by default.
- Patch critical dependencies within days, not weeks.
- Prepare an incident response plan before you need it.

## Teaching moments

- "What if Stripe sends the same webhook twice?" → Idempotency keys and signature verification.
- "What if a user tries 1,000 passwords?" → Rate limiting and account lockout.
- "What if a JWT is leaked?" → Short expiry, refresh rotation, and revocation.
