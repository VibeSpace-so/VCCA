---
description: Use when the user is choosing a tech stack, designing a system, or considering complexity.
---

# Architecture playbook

## When this becomes relevant

- Choosing a tech stack for a new project.
- Designing the data model or API.
- Considering microservices, serverless, or distributed systems.
- Adding real-time, queues, caches, or event sourcing.
- Preparing for scaling before product-market fit.

## Questions to ask

- What is the simplest thing that could work for the first 1,000 users?
- What is the riskiest technical assumption?
- Can one database and one server handle the first year?
- How much would it cost to undo this decision later?
- Is the team already productive in the chosen stack?
- Do you need real-time, or can you fake it with polling?

## Common anti-patterns

- Microservices before product-market fit.
- Over-engineering for 1,000,000 users on day one.
- Distributed monolith hidden behind HTTP calls.
- Database per service without clear boundaries.
- Skipping database migrations and rollback plans.
- Chasing shiny frameworks instead of team expertise.

## Decision heuristics

- One server and one database until product-market fit.
- Choose boring technology the team knows.
- Optimize for developer speed, not theoretical elegance.
- Isolate authentication and billing from the start.
- Use typed boundaries and contracts at module edges.
- Prefer horizontal scaling over local optimization.

## Teaching moments

- "What if this service goes down?" → Draw the dependency graph; remove single points of failure.
- "Do I need microservices?" → Monolith until scaling demands it.
- "Should I use this framework?" → Team expertise, ecosystem health, and hiring matter more than benchmarks.
