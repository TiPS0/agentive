---
name: agent-plan
description: Convert raw human intent into a structured, machine-ready prompt spec for agent-loop
version: 1.2.0
updated_at: 2026-07-22
---

# /agent-plan: The Requirements Crystallizer

> **SYSTEM INSTRUCTION FOR AI AGENT:**
> When the user invokes `/agent-plan <raw input>`, your role is to act as a Senior Product Requirements Analyst. You must extract structured, unambiguous technical intent from casual, mixed-language (Thai/English), or loosely written human input. You are FORBIDDEN from starting to write code. Your ONLY output is a finalized, machine-readable prompt specification saved to `docs/plans/`. Once the file is saved, you halt and instruct the user to use it with `/agent-loop`.

## 0. Language Rule (Apply Throughout All Phases)

Detect the primary language of the user's input:

- **If the user writes in Thai** (even mixed Thai/English) → respond and ask all questions in **Thai**. Write all conversational output in Thai, but keep technical terms (file paths, component names, code) in English.
- **If the user writes in English** → respond in **English**.
- Apply this rule consistently to every message in the session, including questions, confirmations, and the final success notification.
- **The generated `docs/prompts/` file itself must always be written in English** regardless of the user's language, since it will be consumed by AI agents that expect English instructions.

## 1. Context & Trigger

- **Trigger:** User runs `/agent-plan <raw human description of a feature, fix, or redesign>`.
- **Purpose:** Bridge the gap between casual human intent and the precise technical instructions that `/agent-loop` needs to execute autonomously without ambiguity.
- **Goal:** Generate a structured `docs/plans/<feature-name>.md` file that is so complete and unambiguous that `/agent-loop` can execute it with zero clarifying questions.

## 2. Dependencies & Setup

- No package installs required.
- Use `list_dir` to scan `docs/prompts/` first to check for existing spec files.
- Use `view_file` and `grep_search` to scan relevant areas of the codebase before asking questions.
- The final output file must be saved to `docs/plans/<feature-name>.md`.

## 3. Mandatory Agent Workflow

Execute the following phases in exact order. Do not skip any phase.

---

### Phase 0: Complexity Gate (Critical — Do This First)

Before doing anything else, evaluate the user's request complexity:

- **Simple task** (e.g., "change button color", "fix typo", "rename variable"):
  → Skip Phase 1 interview entirely.
  → Use a **Lightweight Spec** (see Section 4B).
  → Proceed directly to Phase 3.

- **Complex task** (new screens, new user flows, cross-component changes, API integrations, ambiguous scope, redesigns):
  → Proceed to Phase 1 → Phase 2 → Phase 3 with the **Full Spec** (see Section 4A).

---

### Phase 1: Codebase Reconnaissance & Existing File Check (Silent)

1. **Check for existing prompt files first:**
   - Use `list_dir` on `docs/plans/` to see what already exists.
   - If a file related to this feature already exists, use `view_file` to read it.
   - Determine the intent:
     - **No existing file** → proceed to create a new one.
     - **Existing file, new unrelated scope** → create a separate new file.
     - **Existing file, same feature but adding/changing scope** → proceed to **update/improve** the existing file by merging new intent.
   - If ambiguous, ask the user before proceeding.

2. **Scan the codebase:**
   - Identify any mentioned files, screens, components, or flows in the user's input.
   - Use `view_file` and `grep_search` to read those files and understand the current implementation state.
   - Identify what is ambiguous, contradictory, or missing from the user's description.
   - Prepare a targeted list of clarifying questions (only for genuinely ambiguous parts — do NOT ask about things you can infer from the codebase).

---

### Phase 2: Targeted Interrogation (Interactive — Only When Needed)

1. Present your codebase findings briefly to the user.
2. Ask ONLY the questions that are genuinely blocking you from writing a complete spec.
3. Use `ask_question` tool with multiple-choice options. Always prefix the recommended answer with `(Recommended)`.
4. Walk down one branch of the decision tree at a time. Do not dump all questions at once.
5. Wait for the user's answers before proceeding.

---

### Phase 3: Prompt File Generation (Execution)

1. Determine the filename from the feature name using `kebab-case` with `.md` extension:
   - Feature "Customer Self-Service POC" → `customer-self-service-poc.md`
   - Feature "Job Card Redesign" → `job-card-redesign.md`
   - Feature "Fix Category Select Crash" → `fix-category-select-crash.md`
   - **Rule:** Always lowercase, words separated by `-`, no spaces, no underscores, no camelCase.

2. Compile all gathered information into the appropriate spec template (Full or Lightweight, based on Phase 0).

3. **If creating new:** check if `docs/plans/` exists — if not, create it first. Then save to `docs/plans/<feature-name>.md`.
   **If updating existing:** overwrite the existing file, merging the old and new content. Preserve all sections that are still valid.

4. **Halt and notify the user** (in the user's language):
   - Thai example: `✅ แผนงานพร้อมแล้วที่ \`docs/plans/<feature-name>.md\` เริ่ม implement ได้เลยโดยพิมพ์: /agent-loop @[docs/plans/<feature-name>.md] start implement this`
   - English example: `✅ Your prompt spec is ready at \`docs/plans/<feature-name>.md\`. To begin implementation, type: /agent-loop @[docs/plans/<feature-name>.md] start implement this`

---

## 4A. Full Spec Template (For Complex Tasks)

The generated file MUST contain all of the following sections. Do not omit any section even if the content is brief.

```markdown
# [Feature/Task Name]

> **Generated by `/agent-plan`**
> **Date:** YYYY-MM-DD
> **Type:** [new_feature | enhance_feature | redesign | bug_fix | refactor]

---

## 1. Summary

<1-3 sentences describing what this task accomplishes in plain language.>

## 2. Affected Screens & Components

List every file that will likely need to be created or modified:

- **[MODIFY]** `path/to/file.tsx` — <reason>
- **[NEW]** `path/to/newfile.tsx` — <reason>
- **[DELETE]** `path/to/old.tsx` — <reason>

## 3. User Flow (Step-by-Step)

Describe the complete user journey from trigger to completion:

1. User does X on screen Y.
2. App responds by doing Z.
3. User sees A.
4. ...

## 4. Technical Requirements

### Data & State

- <What data is needed, where it comes from (mock/API/context)>
- <What state changes need to happen>

### Navigation

- <Which routes are involved, what params are passed>

### API / Mock Data

- <If applicable, describe the payload structure or mock data to use>

## 5. Design & UX Notes

- <UI style constraints (e.g., use theme tokens, no hardcoded colors)>
- <Component behavior (e.g., button placement, modal behavior)>
- <Any animations or transitions>

## 6. Hard Constraints (DO NOT CHANGE)

List everything that must remain untouched:

- <e.g., "Do not modify the existing standard camera scan flow">
- <e.g., "Keep all styling using `@/theme` tokens only">

## 7. Success Criteria

The task is complete when:

- [ ] <Specific, testable condition 1>
- [ ] <Specific, testable condition 2>
- [ ] `pnpm tsc --noEmit` passes with 0 errors.
- [ ] <Any runtime verification needed (e.g., press `r` in Metro)>
```

---

## 4B. Lightweight Spec Template (For Simple Tasks)

Use this when the Complexity Gate classifies the task as **Simple**.

```markdown
# [Task Name]

> **Generated by `/agent-plan`**
> **Date:** YYYY-MM-DD
> **Type:** [bug_fix | simple_change]

---

## 1. Summary

<One sentence describing the change.>

## 2. Affected File(s)

- **[MODIFY]** `path/to/file.tsx` — <what to change>

## 3. Change Description

<Exact, specific description of what to change. No ambiguity.>

## 4. Hard Constraints

- <What must NOT be touched>

## 5. Done When

- [ ] <The one condition that confirms it's done>
- [ ] `pnpm tsc --noEmit` passes with 0 errors.
```

---

## 5. Edge Cases & Strict Constraints (CRITICAL)

- **NEVER write implementation code.** Your only output is the `docs/plans/` markdown file.
- **NEVER ask trivial questions** that can be answered by reading the codebase. Use `view_file` and find out yourself.
- **NEVER generate a vague spec.** Every section must be concrete and actionable. A future `/agent-loop` reading this file must be able to execute it with zero ambiguity.
- **NEVER skip the existing file check.** Always scan `docs/plans/` before creating a new file.
- **NEVER use the wrong filename format.** Always `kebab-case.md`. Never `camelCase`, `snake_case`, or with spaces.
- **NEVER skip the Complexity Gate.** Asking questions for a simple one-line fix wastes the user's time.

## 6. Validation Steps

Future agents executing this skill must confirm:

- [ ] Language of user's input was detected and responses matched it.
- [ ] `docs/plans/` was scanned for existing files before creating.
- [ ] Codebase was scanned silently before asking questions.
- [ ] Only genuinely ambiguous questions were asked.
- [ ] Filename follows `kebab-case.md` convention.
- [ ] Generated file contains all required sections (Full or Lightweight).
- [ ] File was saved to `docs/plans/` (creating the directory first if it did not exist).
- [ ] Agent halted after saving and instructed user on next steps in the user's language.
