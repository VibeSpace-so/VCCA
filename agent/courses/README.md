# VCCA Course Pillars

Four learning pillars for vibe coders, each owned by one author agent.
The coordinator (Devin) merges and reviews.

## Pillar → file → categories

| Pillar                | File                          | Categories you own                              |
|-----------------------|-------------------------------|-------------------------------------------------|
| Startup               | `startup.ts`                  | `business`, `ops`                               |
| Software Development  | `software-development.ts`     | `engineering`, `architecture`, `data`, `scaling`|
| Product               | `product.ts`                  | `product`                                       |
| Security              | `security.ts`                 | `security`, `reliability`                       |

## Hard rules (read first)

1. **Edit only your pillar file.** Do not touch `concept-catalog.ts`,
   `index.ts`, `types.ts`, any other pillar file, or anything outside
   `agent/courses/`. The coordinator owns the merge.
2. **Add only NEW concept keys.** Run `grep` on `agent/lib/concept-catalog.ts`
   first to see what already exists. Duplicates will be rejected at merge.
3. **Import types from `./types.js`**, never from `../lib/concept-catalog.js`.
4. **One rich markdown course file per pillar**: `agent/courses/<pillar>.course.md`.
   This is the human-readable course. The `.ts` seeds are the tutor-integrated
   version of the same content.
5. **Verify before finishing**: `npx tsc --noEmit` must pass with your file.
6. **Do not commit.** Leave changes uncommitted for the coordinator to review
   and merge.

## ConceptSeed shape (from `./types.js`)

```ts
interface ConceptSeed {
  category: ConceptCategory; // one of the categories you own
  question?: string;         // Socratic opener; if omitted, a template fills it
  explanation: string;       // 2-4 sentences, the core idea (REQUIRED)
  apply?: string;            // one concrete action on the user's own project
  why?: string;              // why it matters
  misconception?: string;    // common wrong belief
  related?: string[];        // other concept keys
  example_answer?: string;   // model answer for self-check
  anti_patterns?: string[];  // wrong/shallow answers
  example?: string;          // concrete illustration
  case_study?: string;       // real-world story
  resources?: string[];      // URLs (verify they resolve)
  prereqs?: string[];        // concept keys that should come first
  next?: string[];           // concept keys that follow
}
```

`question`, `why`, `misconception`, `apply`, and `follow_up_questions` are
auto-filled from a per-category template if you omit them. But for a *course*,
prefer writing them yourself so the lesson is specific, not generic.

## Quality bar

- Every concept should answer: what failure mode does this prevent, and when
  does a vibe coder need it?
- `prereqs` and `next` must reference real concept keys (existing catalog keys
  or new ones in your own pillar). Cross-pillar references are fine.
- `resources` URLs must resolve — fetch them with `webfetch` before listing.
- Prefer concrete `case_study` and `example` over generic statements.
- Aim for a coherent learning path: order concepts so `prereqs`/`next` form a
  walkable graph from beginner to advanced.

## Workflow per agent

1. Read `agent/lib/concept-catalog.ts` to see existing concepts in your
   categories (don't duplicate).
2. Browse the web (`web_search` / `webfetch`) to research what vibe coders
   actually need in your pillar and to gather real case studies + resources.
3. Draft the learning path in your markdown course file.
4. Implement the seeds in your `.ts` pillar file.
5. Run `npx tsc --noEmit`; fix until clean.
6. Self-review: does each lesson have a failure mode, an apply step, and a
   real case study? Are `prereqs`/`next` consistent?
7. Leave everything uncommitted. Tell the coordinator you're done.
