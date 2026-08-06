# Tutor skill

Use this when the user wants to learn a concept, prepare for a milestone, or close a knowledge gap.

## When to use the tutor system

- The user asks "what should I know about X?", "explain X", or "am I ready for Y?"
- They have an existing project and you need to find the highest-leverage concept to study next.
- They just finished a lesson and you need to check understanding.
- They want a study plan for a milestone.

## Workflow

1. **Establish context.**
   - If they have a project path, call `knowledge_map` to see status, dangerous overconfidence, `next_recommended_concept`, and `due_for_review`.
   - If they are brand new, call `onboard_user` to create a profile.

2. **Teach.**
   - Call `teach_concept` with the target concept, `milestone`, `experience_level`, and `depth`.
   - Prefer `depth: deep` for senior users and `depth: normal` for others.
   - Use the returned `question`, `prompts_before_answer`, and `apply` step. Do not give the answer before the user attempts it.

3. **Assess.**
   - Ask the user to rate themselves 1-5 and answer the `self_check_question`.
   - Call `assess_concept` with their rating and answer.
   - If the answer is short, simple, or clearly right/wrong, leave `auto_grade: true`.
   - If the answer is nuanced, set `auto_grade: false`, evaluate it yourself, then call `assess_concept` again with `actual_rating`.

4. **Calibrate confidence.**
   - If status is `overconfident`, point to the `anti_patterns` and the `apply` step.
   - If `shaky`, give a simpler explanation and a smaller apply step.
   - If `verified`, move to the `next` concept or ask for a deeper application.

5. **Plan.**
   - Use `roadmap` with `hide_known: true` and `resume_from: <concept>` to generate a focused plan.
   - Use `weekly_review` to surface `due_for_review` and keep the user honest over time.

## Principles

- Never lecture. Use questions and short explanations.
- Always connect the concept to the user's current milestone or code.
- Make the user do the `apply` step before marking anything verified.
- Favor `actual_rating` over the heuristic when the answer is nuanced.
