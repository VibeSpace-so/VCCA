import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  assessConcept,
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
import { ensureVccaDir } from "./state.js";

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

describe("assessConcept", () => {
  it("returns a grading_prompt and does not commit a grade by default", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "vcca-assess-"));
    await ensureVccaDir(tmp);
    const result = await assessConcept(tmp, "smoke-test", 5, "It is when you test your code before deploying it.");
    assert.equal(result.needs_review, true);
    assert.ok(result.grading_prompt);
    assert.ok(result.grading_prompt?.includes("smoke test"));
    assert.ok(result.answer_analysis);
    // Clean up.
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it("auto-grades when autoGrade is true", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "vcca-assess-"));
    await ensureVccaDir(tmp);
    const result = await assessConcept(
      tmp,
      "smoke-test",
      4,
      "A smoke test is a small, cheap experiment to prove demand before you build, like a landing page or waitlist.",
      undefined,
      undefined,
      true
    );
    assert.equal(result.needs_review, false);
    assert.ok(!result.grading_prompt);
    assert.equal(result.status, "verified");
    await fs.rm(tmp, { recursive: true, force: true });
  });
});
