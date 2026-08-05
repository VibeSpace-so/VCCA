# VCCA MCP stdio adapter

This folder contains a Model Context Protocol (MCP) stdio server that exposes the same VCCA tools used by the EVE agent. It lets you plug VCCA into Claude Code, Codex, Devin, and any other MCP-compatible host.

## Run the server

```bash
npm install
npm run mcp
```

The `npm run mcp` script compiles the server with `tsconfig.mcp.json` and starts the stdio server.

You can also compile and run it manually:

```bash
npx tsc -p tsconfig.mcp.json
node .mcp-output/adapters/mcp/server.js
```

## How it works

- `adapters/mcp/server.ts` starts an MCP `Server` over `StdioServerTransport`.
- It imports the shared `vccaTools` record from `agent/lib/tool-definitions.ts`.
- On `tools/list` it converts each tool's Zod `inputSchema` to draft-07 JSON Schema with `z.toJSONSchema`.
- On `tools/call` it looks up the tool by `params.name`, runs `vccaTools[name].execute(params.arguments)`, and returns the result as a JSON text content block.

## Project-scoped auto-discovery

This repo includes project-scoped MCP configs so the VCCA server is automatically picked up by compatible hosts:

- `.mcp.json` for **Claude Code**
- `.codex/config.toml` for **Codex**
- `.devin/mcp_config.json` for **Devin CLI**

Run `npm install` once in this repo, then open it in your agent. The agent should discover the `vcca` MCP server and its 11 tools.

## Host configuration examples

See `config-examples/` for sample configs to add VCCA to *other* projects. Replace `C:\\Users\\mathe\\Projects\\VCCA` with the actual path to this repo.

### Claude Code

Save `config-examples/claude/.mcp.json` as `.mcp.json` in the project where you want to use VCCA, then restart Claude Code.

### Codex

Save `config-examples/codex/config.toml` and add the server with:

```bash
codex mcp add
```

### Devin

Save `config-examples/devin/mcp_config.local.json` and add the server with:

```bash
devin mcp add
```

### EVE

EVE uses ACP (`npm run acp`), not MCP. See `config-examples/eve/README.md`.
