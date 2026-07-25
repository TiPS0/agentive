---
title: "Install Command"
status: "completed"
date: "2026-07-25"
tags: ["feature", "cli", "install"]
---

# Feature: Install Command

> **AI Agent Instructions:** This document defines a shipped or in-progress feature. When implementing this feature, strictly follow the "Component Structure" and "State Management" sections.

## 1. User Flow

_Describe the user journey. What does the user see and do step-by-step?_

- Step 1: User runs `npx @p_tipso/agentive install <pkg>`.
- Step 2: Validates the presence of `.agents/`. Fails if missing.
- Step 3: Fetches package data from NPM Registry (`https://registry.npmjs.org/<pkg>`) and optionally unpkg for `README.md` and `index.d.ts`.
- Step 4: Prompts user to select installation targets (`.agents/library`, `.cursor/rules`, `.windsurfrules`, `.claude.md`).
- Step 5: Writes info, types, and rules content to the selected destinations and updates the `library/README.md`.

## 2. Component Structure

- `src/commands/install.js`: Orchestrates the fetch and installation logic.
- `src/utils/fileSystem.js`: Provides helper methods like `addDependency`, `linkAgentFile`, `updateLibraryReadme`.

## 3. State Management & Data Fetching

- Data Fetching: Relies on native `fetch` to retrieve NPM metadata and Unpkg CDN files.
- Formats: Compiles markdown and JSON structures on-the-fly to combine package description, types, and base rules into Editor-friendly AI context.

## 4. Edge Cases & Error Handling

- **Invalid Package / Network Issue:** Displays a red chalk error and skips installation.
- **Missing IDE Configs:** Only prompts for IDEs (Cursor, Windsurf, Claude) if their respective config files/folders exist in the current directory.
