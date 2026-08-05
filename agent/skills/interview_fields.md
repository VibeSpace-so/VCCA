---
description: Use during greenfield discovery to collect project context one question at a time.
---

# Discovery interview fields

Use this as a reference while running the greenfield discovery interview. Ask one question at a time. Follow up only to clarify. Never present this as a form to the user.

## Fields to collect

- **project_name** — working name for the project or company
- **description** — one or two sentence summary of what it does
- **stage** — Idea / Customer Interviews / Landing Page / First Email List / MVP / First Users / First Paying User / Retention / PMF Signals / Growth
- **industry** — market or vertical
- **problem** — the specific problem you solve
- **solution** — how you solve it
- **target_customer** — who has the problem
- **current_users** — number of active users, if any
- **paying_users** — number of paying users, if any
- **business_model** — SaaS, marketplace, transactional, etc.
- **pricing** — current or planned pricing
- **distribution** — main customer acquisition channel
- **competitors** — direct and indirect alternatives
- **current_goal** — the single most important objective right now
- **current_biggest_risk** — the highest-risk assumption
- **technical_stack** — languages, frameworks, infrastructure
- **hosting** — cloud provider, serverless, PaaS
- **repository** — where the code lives
- **deployment_status** — not deployed / staging / production
- **team_size** — number of people working on it
- **runway** — cash runway or time until funding needed
- **fundraising_stage** — none / bootstrapped / pre-seed / seed / etc.

## Interview flow

1. Start with the problem and the customer, not the solution.
2. Ask for numbers even if they are guesses.
3. If the stage is unclear, default to "Idea".
4. After gathering enough fields, summarize the context and ask the user to confirm or edit.
5. Persist confirmed answers in `.vcca/project.yaml` with `update_state`.
