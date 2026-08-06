---
description: Use when the user is thinking about running systems in production, on-call, incidents, backups, monitoring, rollback, and operational hygiene.
---

# Operations playbook

## When this becomes relevant

- Preparing to deploy to production.
- Setting up monitoring, alerting, logging, or observability.
- Defining on-call rotation and incident response.
- Planning backups, disaster recovery, or business continuity.
- Scaling from one server to many.
- Handling outages, performance issues, or security incidents.

## Questions to ask

- Who gets woken up when the system breaks at 2am?
- How do you know the system is healthy? What do you alert on?
- How do you back up data, and how do you test restoring it?
- What is the fastest way to revert a bad deploy?
- How do you reproduce the production environment locally?
- What happens when a third-party service you rely on goes down?
- Are runbooks written and accessible to the team?

## Common anti-patterns

- No health checks, so a broken instance keeps receiving traffic.
- Alerting on symptoms only, with no leading indicators.
- Backups that are never tested until a real incident.
- One person holds all the operational knowledge.
- Deploying without a rollback plan.
- Running everything on a single server or account with no redundancy.
- No incident postmortems, so the same outage repeats.

## Decision heuristics

- If it touches users or money, it needs health checks, logs, and alerts.
- Every critical path should be observable without logging into a server.
- Test restores quarterly. A backup you cannot restore is not a backup.
- Make rollback faster than roll-forward for risky deploys.
- Document the first three steps for the top 5 incidents.
- Start with one person on-call; add rotation as the team grows.

## Teaching moments

- "How do I know my app is up?" → Health endpoints, uptime checks, and SLAs.
- "What if the database disappears?" → Backups, point-in-time recovery, and runbooks.
- "What if a deploy breaks something?" → Rollback, feature flags, and canary deploys.
- "Who fixes things at night?" → On-call, escalation, and blameless postmortems.
