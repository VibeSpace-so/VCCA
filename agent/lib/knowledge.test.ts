import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildRoadmap,
  classifyStatus,
  conceptImportanceForMilestone,
  evaluateAnswer,
  getEffectiveLevel,
  isDueForReview,
  milestoneReadiness,
} from "./knowledge.js";
import { getLesson } from "./concept-catalog.js";
import type { KnowledgeMap, KnowledgeStatus } from "./state.js";

describe("classifyStatus", () => {
  it("marks verified when self and actual are strong", () => {
    assert.equal(classifyStatus(4, 5), "verified");
  });
  it("marks overconfident when self outpaces actual", () => {
    assert.equal(classifyStatus(5, 2), "overconfident");
  });
  it("marks shaky when both are low", () => {
    assert.equal(classifyStatus(2, 2), "shaky");
  });
});

describe("conceptImportanceForMilestone", () => {
  it("rates rate-limiting critical at MVP", () => {
    const lesson = getLesson("rate-limiting");
    assert.equal(conceptImportanceForMilestone("rate-limiting", "MVP", lesson), 3);
  });
  it("rates smoke-test critical at Idea", () => {
    const lesson = getLesson("smoke-test");
    assert.equal(conceptImportanceForMilestone("smoke-test", "Idea", lesson), 3);
  });
});

describe("evaluateAnswer", () => {
  it("detects anti-patterns and caps the score", () => {
    const lesson = getLesson("smoke-test");
    const score = evaluateAnswer(
      "A smoke test is when you test your code before deploying it.",
      lesson
    );
    assert.ok(score <= 2, `expected low score, got ${score}`);
  });

  it("rewards an answer that matches the example answer", () => {
    const lesson = getLesson("smoke-test");
    const score = evaluateAnswer(
      "A smoke test is a small, cheap experiment to prove demand before building, like a landing page or waitlist.",
      lesson
    );
    assert.ok(score >= 4, `expected high score, got ${score}`);
  });
});

describe("milestoneReadiness", () => {
  it("flags critical unverified concepts", () => {
    const knowledge: KnowledgeMap = {
      "rate-limiting": { concept: "rate-limiting", status: "unknown" },
      "smoke-test": { concept: "smoke-test", status: "verified" },
    };
    const result = milestoneReadiness(knowledge, "MVP");
    assert.ok(result.some((r) => r.concept === "rate-limiting"));
    assert.ok(!result.some((r) => r.concept === "smoke-test"));
  });
});

describe("isDueForReview", () => {
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

  it("flags verified concepts older than 14 days", () => {
    assert.equal(
      isDueForReview({ concept: "x", status: "verified", last_interaction: daysAgo(20) } as any),
      true
    );
  });

  it("does not flag recently verified concepts", () => {
    assert.equal(
      isDueForReview({ concept: "x", status: "verified", last_interaction: daysAgo(2) } as any),
      false
    );
  });
});

describe("buildRoadmap", () => {
  it("caps concepts with maxConcepts", () => {
    const road = buildRoadmap("MVP", "wide", "newbie", undefined, null, 6);
    const total = road.stages.reduce((s, st) => s + st.concepts.length, 0);
    assert.ok(total <= 6, `expected <= 6, got ${total}`);
  });

  it("hides known concepts when requested", () => {
    const knowledge: KnowledgeMap = {
      "validation": { concept: "validation", status: "verified" },
    };
    const road = buildRoadmap("Idea", "balanced", "newbie", undefined, knowledge, undefined, true);
    const all = road.stages.flatMap((s) => s.concepts.map((c) => c.concept));
    assert.ok(!all.includes("validation"));
  });

  it("pins resume concept to the top", () => {
    const road = buildRoadmap("MVP", "balanced", "newbie", undefined, null, undefined, false, "rate-limiting");
    const first = road.stages[0]?.concepts[0]?.concept;
    assert.equal(first, "rate-limiting");
  });
});

describe("getEffectiveLevel", () => {
  it("defaults to newbie", () => {
    assert.equal(getEffectiveLevel(undefined, null), "newbie");
  });
  it("uses provided override", () => {
    assert.equal(getEffectiveLevel("senior", { experience_level: "some_code" } as any), "senior");
  });
});
