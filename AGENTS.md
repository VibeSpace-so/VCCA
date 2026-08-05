# Agent notes for VCCA

This repo is an [EVE](https://eve.dev/) agent.

## Build and verification

```bash
npm install
npx tsc --noEmit   # type-check agent and adapters
npx tsc -p tsconfig.mcp.json --noEmit  # type-check the MCP server
npm run build      # full EVE build
npm run mcp        # compile and start the MCP stdio server
```

## Running

- `npm run dev` — interactive dev server
- `npm run acp` — ACP / stdio mode for coding agent integration
- `npm run mcp` — MCP / stdio mode for any MCP-compatible host

## Project layout

- `agent/instructions.md` — core identity and operating principles
- `agent/agent.ts` — model and runtime config
- `agent/skills/*.md` — playbook skills loaded on demand
- `agent/tools/*.ts` — typed tools for repo analysis, state, risk, etc. (thin EVE wrappers over `agent/lib/tool-definitions.ts`)
- `agent/lib/*.ts` — shared state and repo analysis helpers
- `adapters/mcp/server.ts` — standalone MCP stdio server

## Common notes

- Requires Node.js 24+.
- `zod` is pinned to v4 because EVE 0.30.8 uses the `~standard` / `jsonSchema` interface.
- The agent persists user project state in `.vcca/` inside the target project (not inside this repo).
- When authoring new tools, keep schemas simple (`z.string()`, `z.boolean()`, `z.array(...)`) and use `z.any()` for dynamic object maps instead of `z.record(z.any())`, which has a different v4 signature.
