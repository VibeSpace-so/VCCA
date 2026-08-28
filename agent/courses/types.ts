// Shared types for course pillar files.
// Course authors: import everything you need from here, never from
// ../lib/concept-catalog.js directly, so the merge stays conflict-free.
export type {
  ConceptCategory,
  ConceptSeed,
  Lesson,
  CatalogLesson,
} from "../lib/concept-catalog.js";
export { normalizeConcept } from "../lib/concept-catalog.js";
