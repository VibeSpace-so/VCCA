# VCCA — Vibe Coding Compass Agent

VCCA is an AI execution companion for software founders and vibe coders.

It guides you from idea validation to production deployment by combining the perspectives of a technical cofounder, product manager, security reviewer, DevOps engineer, and startup advisor into a single conversation.

## Run

```bash
npm install
npm run dev
```

## Use as a coding agent (ACP / stdio)

```bash
npm run acp
```

## What VCCA does

- **Greenfield mode**: runs a discovery interview and writes a `.vcca/project.yaml`.
- **Repository mode**: analyzes your existing repo, then does the interview.
- **Continuous risk engine**: keeps scores for Business, Validation, Architecture, Security, Deployment, Legal, Distribution, Fundraising, and Operations.
- **Milestone tracking**: always knows the current milestone from Idea to Growth.
- **Smart interruptions**: stops you before dangerous decisions (deploy, OAuth, scaling) and verifies prerequisites.
- **Teaching in two-minute lessons**: question → short explanation → apply immediately.
- **Decision framework**: evaluates business impact, technical impact, complexity, risk, time, and alternatives before writing code.
- **Playbook skills**: on-demand expertise for validation, architecture, deployment, security, pricing, fundraising, product, and marketing.
- **Repository reviews**: architecture smells, security issues, technical debt, missing tests, deployment readiness, unused dependencies, missing docs, scaling bottlenecks, open TODOs.
- **Production readiness review**: checklist + score.
- **Incident simulator**: failure scenarios after major features.
- **Weekly review**: completed work, current milestone, current risks, priorities, things not to build, highest-leverage next action.

## Project structure

```
agent/
  agent.ts              # runtime config
  instructions.md       # core identity and operating principles
  skills/               # playbook skills
  tools/                # typed actions (repo analysis, memory, risk, etc.)
  lib/                  # shared helpers
```

## Running in other agents

VCCA now ships with an MCP stdio server so you can use it from Claude Code, Codex, Devin, or any other MCP-compatible host.

This repo includes project-scoped auto-discovery configs for those hosts:

- `.mcp.json` for **Claude Code**
- `.codex/config.toml` for **Codex**
- `.devin/mcp_config.json` for **Devin CLI**

When you open this project in one of those agents, the VCCA MCP server should be available after `npm install`.

To run the server manually:

```bash
npm install
npm run mcp
```

See [`adapters/mcp/README.md`](adapters/mcp/README.md) for setup details and host-specific configs.

If you are using EVE or an ACP-compatible coding agent, run:

```bash
npm run acp
```

## Requirements

- Node.js 24+
- A model credential for `eve`'s default model or an AI SDK provider key
