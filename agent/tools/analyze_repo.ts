import { defineTool, type ToolContext } from "eve/tools";
import { vccaTools } from "../lib/tool-definitions.js";

const tool = vccaTools.analyze_repo;
const { name: _name, ...definition } = tool;

export default defineTool({
  ...definition,
  execute: (input: any, _ctx: ToolContext) => tool.execute(input),
});
