# Project Documentation

Welcome to the documentation hub. This directory is structurally designed to support both human developers and AI coding agents.

> **AI Agent Instructions:** Before writing documentation or generating code, check the `_template.md` file inside the relevant folder. These templates contain specific instructions, rules, and standard formats you MUST follow.

## Directory Structure

### Living Documents (Continuously Updated)

These folders and files contain active standards. They are edited in-place as the project evolves.

- **`README.md`**: You are here. The entry point.
- **`manifest.json`**: The metadata index used by the search script.
- **`glossary.md`**: Domain terms to ensure consistent naming.
- **`architecture/`**: System-level rules, tech stack, and hard project conventions.
- **`design/`**: Shared visual tokens, design patterns, and UI rules.
- **`api/`**: API endpoint contracts, request payloads, and response codes.

### Append-Only Archives (Historical Records)

These folders are append-only. We add new files instead of rewriting old ones.

- **`changelog.md`**: Chronological log of shipped features and versions.
- **`features/`**: One document per completed feature (UI flow, state management, components).
- **`decisions/`**: Architecture Decision Records (ADRs) explaining _why_ technical choices were made.
- **`research/`**: Exploratory findings, dead ends, and feasibility notes.

### Code & Execution

- **`scripts/`**: Executable scripts and raw data files. AI agents should create subfolders here (e.g. `mockup-sql/` or `ota-update/`) when storing code snippets, SQL dumps, or build logic referenced in the docs.
