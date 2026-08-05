# EVE

EVE uses its own ACP (Agent Connect Protocol) over stdio, not the Model Context Protocol.

To run VCCA inside EVE or any ACP-compatible coding agent:

```bash
npm install
npm run acp
```

MCP is only needed if you are wiring VCCA into Claude Code, Codex, Devin, or another MCP host.
