// Central merge point for course pillars.
// The coordinator owns this file. Individual agents must NOT edit it.
import { STARTUP_SEEDS } from "./startup.js";
import { SOFTWARE_DEVELOPMENT_SEEDS } from "./software-development.js";
import { PRODUCT_SEEDS } from "./product.js";
import { SECURITY_SEEDS } from "./security.js";
import type { ConceptSeed } from "./types.js";

export const COURSE_SEEDS: Record<string, ConceptSeed> = {
  ...STARTUP_SEEDS,
  ...SOFTWARE_DEVELOPMENT_SEEDS,
  ...PRODUCT_SEEDS,
  ...SECURITY_SEEDS,
};

export const COURSE_CONCEPTS = Object.keys(COURSE_SEEDS).sort();
