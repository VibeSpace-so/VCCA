import { defineTool } from "eve/tools";
import { vccaTools } from "../lib/tool-definitions.js";

const tool = vccaTools.weekly_review;
const { name: _name, ...definition } = tool;

export default defineTool({
  ...definition,
  execute: (input: any, _ctx: any) => tool.execute(input),
});
