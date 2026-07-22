---
name: agent-rule
description: Generate, update, and manage project-wide AI Rules across multiple IDE frameworks
version: 1.2.0
updated_at: 2026-07-21
---

# /agent-rule: The Rule Architect (v1.2.0)

> **SYSTEM INSTRUCTION FOR AI AGENT:**
> When the user invokes `/agent-rule <context>`, your job is to act as the "Rule Architect". You must parse the user's intent, check for contradictions, detect active AI frameworks (Cursor, Claude, etc.), generate rule files with proper extensions (`.md` or `.mdc`), and smartly manage their injection into the root `AGENTS.md` file.

## 1. Context & Trigger

- **Trigger:** User runs `/agent-rule <context>` or asks you to create/update/delete an AI rule.
- **Purpose:** Used to safely manage always-on project constraints (e.g., coding standards, architectural boundaries) across all of the user's IDEs.
- **Goal:** Prevent context bloat, resolve rule conflicts, sync rules to all active frameworks (`.agents`, `.cursor`, etc.), and activate them in `AGENTS.md`.

## 2. Dependencies & Setup

- You must use `grep_search` to find existing rules and check for conflicts.
- You must use `list_dir` to detect active framework folders.
- You must use `write_to_file` for new rules or `multi_replace_file_content` for updating/deleting rules.

## 3. Mandatory Agent Workflow

When triggered, you MUST execute the following phases in exact order:

### Phase 1: Intent Parsing & "Devil's Advocate"

1. Read the user's `<context>`.
2. Determine the Intent:
   - **CREATE:** User wants a new rule.
   - **UPDATE:** User wants to modify an existing rule.
   - **DELETE:** User wants to remove a rule.
3. **If CREATE/UPDATE:** Determine if the request sounds like a passive rule ("Always do X") or a step-by-step workflow ("How to build Y").
   - If it sounds like a complex workflow (a Skill), you MUST warn the user: _"This sounds like a workflow. Putting this in a Rule will bloat context. You should create a Skill instead."_ Allow them to proceed if they insist.

### Phase 2: Framework Detection & Sync Targeting (Interactive)

1. Use `list_dir` to scan the project root directory.
2. Check for the existence of `.agents`, `.cursor`, `.claude`, etc.
3. **Conditional Targeting**:
   - If ONLY `.agents` is found, **SKIP** the question and proceed directly to Phase 3, targeting `.agents`.
   - If other framework folders (like `.cursor`) are detected, you MUST ask the user: "Which framework folders should I install or update this rule in?"
     - If the `ask_question` tool is available, use it with `is_multi_select: true` and provide the detected folders as options. Otherwise, ask directly in the chat.
4. Wait for the user's decision before proceeding.

### Phase 3: Conflict Resolution & Scanning (CRITICAL)

1. **If CREATE:** Use `grep_search` on the selected framework rule folders (e.g., `.agents/rules/`) and `AGENTS.md` to see if a rule about this topic already exists.
   - If a contradiction is found, WARN the user and ask if they want to UPDATE the existing rule instead of creating a conflict.

### Phase 4: Rule Generation & Modification

1. **If CREATE:**
   - Generate a concise rule using the Markdown Template below.
   - Save the rule in ALL selected framework folders (e.g., `.agents/rules/<rule-name>.md` and `.cursor/rules/<rule-name>.mdc`).
   - **IMPORTANT:** If generating for `.cursor`, you MUST use the `.mdc` file extension. Otherwise use `.md`.
2. **If UPDATE:**
   - Read the existing rule file.
   - Modify the rules based on the user's instructions.
   - **Version Bump:** You MUST increment the semver `version` in the YAML frontmatter and update `updated_at`.
   - Ensure the update is applied across ALL selected framework folders.
3. **If DELETE:**
   - Completely delete the rule file(s) across ALL selected framework folders.

### Phase 5: Dynamic Activation (`AGENTS.md` Injection)

Because `agentive` does not dynamically sync rules yet, you must manually sync the state to the root `AGENTS.md` file:

1. **If CREATE/UPDATE:**
   - Read the root `AGENTS.md`.
   - Determine the most appropriate category heading for the rule. You MUST use one of these standard categories (DO NOT invent new names): `## Architecture Rules`, `## Design Rules`, `## API Rules`, `## Security Rules`, `## Testing Rules`, or `## Workflow Rules`.
   - **If the heading exists:** Append or update the reference to the `.agents/rules/<rule-name>.md` file under that specific heading.
   - **If the heading does NOT exist:** Create the new heading in `AGENTS.md` and add the reference to the `.md` rule under it.
2. **If DELETE:**
   - Use `multi_replace_file_content` to safely remove the rule's reference from `AGENTS.md`.

## 4. Code Templates

**Template for `.agents/rules/<rule-name>.md` (and `.mdc` for Cursor):**

```markdown
---
version: 1.0.0
updated_at: 2026-07-21
---

# [Rule Title]

**Purpose:** [One sentence explaining why this rule exists]

## Strict Anti-Patterns (NEVER DO THIS)

- **NEVER** [Constraint 1]

## Required Patterns (ALWAYS DO THIS)

- **ALWAYS** [Pattern 1]

## Example

**BAD:**
\`\`\`[language]
// Incorrect code
\`\`\`

**GOOD:**
\`\`\`[language]
// Correct code
\`\`\`
```

## 5. Edge Cases & Constraints (CRITICAL)

- **NEVER** create a rule that contradicts an existing one without warning the user.
- **NEVER** dump new rules at the bottom of `AGENTS.md` randomly. Always categorize them logically.
- **NEVER** forget to bump the version number when updating a rule.

## 6. Validation Steps

Future agents executing this skill must confirm:

- [ ] Intent (Create/Update/Delete) was identified correctly.
- [ ] `list_dir` was used to detect frameworks and the user was prompted if multiple were found.
- [ ] `grep_search` was used to prevent rule conflicts.
- [ ] The rule file includes YAML frontmatter (`version`, `updated_at`).
- [ ] Correct extensions were used (`.mdc` for Cursor, `.md` for others).
- [ ] The root `AGENTS.md` was smartly updated in the correct semantic category.
