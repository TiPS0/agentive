---
name: setup-docs-structure
description: Scaffold AI-optimized documentation directory
version: 1.1.0
updated_at: 2026-07-10
---

# AI Documentation Scaffolding Guide

> **SYSTEM INSTRUCTION FOR AI AGENT:**
> Your task is to scaffold a comprehensive, AI-optimized documentation structure in the `docs/` folder of this project. Read this entire document, then use your file creation tools (e.g. `write_to_file` or bash scripts) to generate the exact directory structure and populate the specific files exactly as provided below in a single turn. Do not ask for clarification, simply execute the scaffold.

## 1. Directory Structure to Scaffold

Create the following folders. Create any missing parent directories automatically.

```text
docs/
├── api/
├── architecture/
├── decisions/
├── design/
├── features/
├── research/
└── scripts/
    └── README.md
```

_(Note: Do not create empty subfolders in `/scripts/` right now. When you need to record script-related documents or code later, you can dynamically create files or folders inside `/scripts/` based on the context.)_

## 2. Root Documentation Files

Create these standard files at the root of the `docs/` folder.

### `docs/README.md`

**Instruction:** Write this exact content so human developers and AI agents understand the entire documentation structure.

```markdown
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
```

### `docs/manifest.json`

**Instruction:** Create this file as a blank array. This file acts as the retrieval layer (index) for AI context loaders and search scripts.

```json
{
  "documents": []
}
```

### `docs/glossary.md`

**Instruction:** Provide a template for business wording so agents and humans don't mix up terms.

```markdown
# Glossary

Define your project's business logic terms here to ensure AI agents and human developers use consistent naming (e.g. avoiding mixing up "User" vs "Customer").

## Core Entities

- **[Term 1]**: [Definition]
- **[Term 2]**: [Definition]
```

### `docs/changelog.md`

**Instruction:** Provide the standard Keep a Changelog pattern.

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial AI documentation scaffold.
```

### `docs/scripts/README.md`

**Instruction:** Create this file to teach AI agents how to store executable scripts and code.

```markdown
# Scripts Directory

> **AI Agent Instructions:** This directory is used to store executable scripts, raw mock data, SQL dumps, or complex logic referenced by the documentation.

## Rules for Storing Scripts

When you (the AI agent) need to record a script or code logic, you must decide whether to create a single file or a new folder based on these rules:

1. **Standalone Files:** If the script is a simple, single file (like `search-docs.sh`), create it directly in the root of `/docs/scripts/`.
2. **Subfolders:** If the script logic requires multiple files, complex data, or related `README` notes, you MUST create a dedicated subfolder for it (e.g., `/docs/scripts/mockup-sql/`).
```

## 3. The `_template.md` Standards (CRITICAL)

Create the following `_template.md` files in their respective folders.

**CRITICAL AGENT INSTRUCTION:** You must include the exact YAML frontmatter and the `> **AI Agent Instructions:**` block provided below in every file. This enforces structured outputs and allows the AI context loaders to safely parse the documents.

### `docs/features/_template.md`

```markdown
---
title: "[Feature Name]"
status: "draft" # draft | in-progress | completed
date: "YYYY-MM-DD"
tags: ["feature", "ui"]
---

# Feature: [Feature Name]

> **AI Agent Instructions:** This document defines a shipped or in-progress feature. When implementing this feature, strictly follow the "Component Structure" and "State Management" sections.

## 1. User Flow

_Describe the user journey. What does the user see and do step-by-step?_

- Step 1:
- Step 2:

## 2. Component Structure

_List the React/React Native components involved and their hierarchy/folder paths._

## 3. State Management & Data Fetching

_How is data handled? (e.g., Zustand, Context, local state, React Query)_

## 4. Edge Cases & Error Handling

_What could go wrong and how should the UI respond?_
```

### `docs/decisions/_template.md`

```markdown
---
title: "[Decision Name]"
status: "proposed" # proposed | accepted | rejected | deprecated
date: "YYYY-MM-DD"
tags: ["decision", "architecture"]
---

# Decision: [Decision Name]

> **AI Agent Instructions:** This is an Architecture Decision Record (ADR). Read this to understand _why_ a specific technical choice was made so you do not accidentally reverse it or propose conflicting solutions.

## 1. Context

_What is the exact problem or situation that requires a technical decision to be made?_

## 2. Options Considered

_What were the alternative solutions you evaluated before deciding?_

- **Option A:** [Description] (Pros: X / Cons: Y)
- **Option B:** [Description] (Pros: X / Cons: Y)

## 3. Decision

_Which option did we choose and why? Be explicit about the trade-offs we are accepting._

## 4. Consequences

_What is the impact of this decision? (e.g., larger bundle size, faster development, requires new team skills, affects database migrations)._
```

### `docs/architecture/_template.md`

```markdown
---
title: "[Architecture Domain]"
status: "active"
date: "YYYY-MM-DD"
tags: ["architecture", "core"]
---

# Architecture: [Domain]

> **AI Agent Instructions:** This is a "living document". Do not create new files using this template for every minor change. Instead, update the existing architecture documents. Read these documents to understand the foundational rules of the system before proposing structural changes.

## 1. Overview

_Explain the core architectural concept (e.g., Routing strategy, Database schema, Authentication flow)._

## 2. Rules & Conventions

_List the hard rules that human developers and AI agents MUST follow when working in this domain._

- **Rule 1:**
- **Rule 2:**

## 3. Diagram / Structure

_Provide a high-level folder structure or reference an image link to visualize the architecture._
```

### `docs/design/_template.md`

````markdown
---
title: "[Design Pattern]"
status: "active"
date: "YYYY-MM-DD"
tags: ["design", "ui", "ux"]
---

# Design: [Pattern Name]

> **AI Agent Instructions:** This is a "living document" detailing UI/UX standards. When generating UI code, you MUST use the tokens and patterns defined here instead of hardcoding raw CSS/styles or reinventing components.

## 1. Pattern Description

_What is this design pattern? (e.g., "Standard Form Layout", "Card Styles", "Button Hierarchies")_

## 2. Design Tokens

_Which theme variables, tailwind classes, or stylesheet tokens should be used?_

- **Colors:**
- **Spacing:**

## 3. Code Example

_Provide a minimal code snippet demonstrating the correct usage of this pattern in actual code._

```javascript
// Example component using the correct design tokens
```
````

````

### `docs/api/_template.md`
```markdown
---
title: "[API Endpoint/Domain]"
status: "active"
date: "YYYY-MM-DD"
tags: ["api", "backend"]
---

# API: [Endpoint or Domain Name]

> **AI Agent Instructions:** This document defines external or internal API contracts. Use this when writing data fetching logic to ensure the correct endpoints, HTTP methods, and payload shapes are used.

## 1. Endpoint Details
- **Base URL:** `/api/v1/...`
- **Method:** `GET | POST | PUT | DELETE`
- **Auth Required:** `Yes/No (Token Type)`

## 2. Request Payload
*Describe the expected body or query parameters in JSON format.*
```json
{
  "example": "data"
}
````

## 3. Response Shape

_Describe the expected response format and status codes._

- **200 OK:**

```json
{
  "success": true
}
```

- **400 Bad Request:** (Error handling details)

````

### `docs/research/_template.md`
```markdown
---
title: "[Research Topic Name]"
status: "draft" # draft | completed | rejected
date: "YYYY-MM-DD"
tags: ["research"]
---

# Research: [Topic Name]

> **AI Agent Instructions:** When reading this file, use the "Findings" section to understand the context and limitations of the technology, and strictly follow the "Implementation Pattern" section when generating code.

## 1. Objective
*What is the primary goal of this research? What specific problem are we trying to solve or what library are we evaluating?*

## 2. Findings
*Summarize the data gathered from web research, API documentation, or feasibility studies.*
- **Key Insight 1:** [Description]
- **Key Insight 2:** [Description]
- **Constraints/Limitations:** [What can't be done?]

## 3. Implementation Pattern (For AI to Follow)
*Provide the exact architectural pattern, code structure, or folder location the AI should use when implementing this feature in the codebase.*
```typescript
// Example code pattern that AI should replicate
function examplePattern() {
  // ...
}
````

## 4. Dependencies Needed

_List any NPM packages, external libraries, or environment variables that need to be configured._

## 5. Action Items

_List the next steps required to turn this research into a shipped feature._

- [ ] Step 1
- [ ] Step 2

```

```
