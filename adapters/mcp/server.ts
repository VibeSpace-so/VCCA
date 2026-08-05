import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { vccaTools } from "../../agent/lib/tool-definitions.js";

const server = new Server(
  { name: "vcca", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = Object.values(vccaTools).map((tool) => {
    const jsonSchema = z.toJSONSchema(tool.inputSchema, { target: "draft-07" });
    // Zod's toJSONSchema may stamp a "~standard" metadata key on the result.
    // Clone the object and drop any non-JSON-Schema / metadata keys so MCP
    // clients receive a plain JSON Schema object.
    const inputSchema =
      jsonSchema && typeof jsonSchema === "object"
        ? Object.fromEntries(Object.entries(jsonSchema).filter(([key]) => !key.startsWith("~")))
        : jsonSchema;
    return {
      name: tool.name,
      description: tool.description,
      inputSchema,
    };
  });
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const tool = vccaTools[name as keyof typeof vccaTools];
  if (!tool) {
    return {
      content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }
  try {
    const result = await tool.execute(args ?? {});
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result, null, 2) },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text" as const, text: message }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
