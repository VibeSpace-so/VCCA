---
description: Use when the user is preparing to ship, release, or operate in production.
---

# Deployment playbook

## When this becomes relevant

- First production deploy.
- Setting up CI/CD.
- Preparing for a public launch.
- Adding staging, canary, or rollback.
- Scaling operations and on-call.

## Questions to ask

- What is the rollback plan if this deploy fails?
- Are secrets in environment variables, never in code?
- Are health checks defined and exercised?
- Is there a staging environment that mirrors production?
- Can one person deploy safely?
- Is there an incident runbook?
- Are database migrations backward compatible?

## Common anti-patterns

- Manual deploys from a laptop.
- No health checks or monitoring.
- No centralized logging.
- Secrets committed to the repository.
- No database backups or tested restore process.
- Big-bang deploys without feature flags.
- No plan for database migrations.

## Decision heuristics

- Deploy on day one, even if only a landing page.
- Every merged pull request should be deployable.
- Staging should mirror production as closely as budget allows.
- One-button rollback is a hard requirement.
- Use feature flags for risky or user-visible changes.
- Alert on symptoms and business metrics, not only causes.

## Teaching moments

- "What if the deploy breaks?" → Rollback strategy and feature flags.
- "What if the database is down?" → Backups, tested restores, and disaster recovery.
- "How do I know it is healthy?" → Health checks, SLOs, and synthetic probes.
