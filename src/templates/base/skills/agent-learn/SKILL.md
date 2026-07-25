---
name: agent-learn
description: Generate robust AI skills via iterative interview
version: 1.4.1
updated_at: 2026-07-21
---

# /agent-learn: The Meta-Skill Generator & Updater

> **SYSTEM INSTRUCTION FOR AI AGENT:**
> When the user invokes `/agent-learn <context>`, you are acting as a "Skill Architect". Your job is NOT to immediately write the skill file. Your job is to interrogate the user iteratively, validate the concept, and ultimately output a massive, comprehensive "Perfect Skill" playbook that leaves zero ambiguity.

## Required Execution Workflow

You MUST execute the following phases in exact order. Do not skip phases.

### Phase 1: Analyze & Interrogate (Interactive)

1. Read the user's `<context>`.
2. **Check for Updates vs. New Skill:** Analyze if the user is asking to create a NEW skill, or UPDATE an existing skill (e.g., `/agent-learn bottom-sheet-pattern <update context>`).
   - **If Updating:** Use `view_file` to read the existing skill. Analyze the requested changes.
   - **If New:** Analyze if it is a valid concept for a skill. If invalid/too simple, tell the user this should be a simple Rule in `AGENTS.md` and exit.
3. **Knowledge Verification (Research):** Before interrogating the user or writing any code, determine if the request involves a specific framework, library, or pattern. If you are not 100% confident in the absolute latest best practices, you MUST use the `search_web` tool or local codebase search tools (`grep_search`) to research current standards and validate your assumptions.
4. **The Interrogation (Iterative Interview):** You MUST interrogate the user to clarify requirements before generating the skill.
   - **Environment Fallback:** If your environment supports an `ask_question` tool (like Antigravity IDE), use it to present multiple-choice interactive questions. Otherwise, simply ask the user iteratively in the standard chat interface.
   - Adopt an iterative interview style. **Do not ask everything at once.** Walk down each branch of the design tree sequentially, resolving dependencies between decisions one-by-one.
   - Analyze the concept/update and generate likely implementation options for the user to choose from. **Ensure all questions and options are written in clear, simple, and easy-to-understand language.**
   - Ask about: specific libraries, strict constraints ("What NOT to do"), edge cases, and step-by-step agent workflow.
5. Wait for the user to submit their answers. If more clarification is needed, repeat step 4 before moving to Phase 2.

### Phase 2: Framework Detection & Sync Targeting (Interactive)

1. Once you have the answers, use `list_dir` to scan the project root.
2. Check for the existence of `.agents`, `.cursor`, `.claude`, etc.
3. **Conditional Targeting**:
   - If ONLY `.agents` is found (and no other framework folders), **SKIP** the question and proceed directly to Phase 3, targeting `.agents`.
   - If other framework folders (like `.cursor`) are detected, ask the user: "Which framework folders should I install or update this skill in?"
     - If the `ask_question` tool is available, use it with multiple-selection enabled and provide the detected folders as options. Otherwise, ask directly in the chat.
4. If a question was asked, wait for the user's decision.

### Phase 3: Generation & Installation (Execution)

1. Construct the skill document. You MUST force a massive, comprehensive template. Even if the user provided short answers, you must expand them into a professional, robust playbook containing all of the following sections:
   - **Strict YAML Frontmatter** (`name`, `description`, `version`, `updated_at`). The `description` MUST be a short, action-oriented sentence (e.g. "Generate robust AI skills" instead of "This skill is triggered when...").
     - _Versioning Rule:_ If updating an existing skill, you MUST bump the semver version in the frontmatter (e.g., `1.0.0` -> `1.1.0` for new features, `1.0.1` for bug fixes, `2.0.0` for major structural changes). If creating a new skill, start at `1.0.0`.
     - _Updated At Rule:_ Always set or update `updated_at: YYYY-MM-DD` to the current date.
   - **System Instruction**: A `> **SYSTEM INSTRUCTION FOR AI AGENT:**` block demanding strict adherence.
   - **1. Context & Trigger**: Explicit rules on when the AI should activate this skill.
   - **2. Dependencies & Setup**: Required `pnpm install` packages or setup.
   - **3. Mandatory Agent Workflow**: A step-by-step checklist future agents are FORCED to execute.
   - **4. Code Templates**: Exact copy-paste boilerplate code.
   - **5. Edge Cases (CRITICAL)**: Things the agent must NEVER do.
   - **6. Validation Steps**: How future agents should verify their work.
2. **ANTI-LAZINESS & NO-LIMIT MANDATE (CRITICAL):** Never truncate templates, summarize code, or use placeholders like _"Apply the same structure to..."_. When updating an existing skill, there is NO LIMIT to the amount of information you should preserve. You MUST retain all existing valid data and carefully merge new instructions to ensure the skill remains 100% up-to-date and comprehensive. You MUST write out the complete, exact boilerplate code for every single file, folder, or variation mentioned in the context. Completeness is mandatory.
3. Use the `write_to_file` tool to save the compiled Markdown to the targeted directories (e.g., `.agents/skills/<skill-name>/SKILL.md` and/or `.cursor/rules/<skill-name>.mdc`).
4. Notify the user of successful installation.
