import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-sonnet-5",
  reasoning: "high",
  compaction: {
    thresholdPercent: 0.85,
  },
  limits: {
    maxInputTokensPerSession: 400_000,
    maxOutputTokensPerSession: 40_000,
  },
});
