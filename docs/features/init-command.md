---
title: "Init Command"
status: "completed"
date: "2026-07-25"
tags: ["feature", "cli", "init"]
---

# Feature: Init Command

> **AI Agent Instructions:** This document defines a shipped or in-progress feature. When implementing this feature, strictly follow the "Component Structure" and "State Management" sections.

## 1. User Flow

_Describe the user journey. What does the user see and do step-by-step?_

- Step 1: User runs `npx @p_tipso/agentive init`.
- Step 2: The CLI checks if `.agents/` exists. If yes, asks to update. If no, proceeds.
- Step 3: Prompt for project type: General, Web Development, Mobile Development.
- Step 4: Prompt for framework (e.g., Next.js or Nuxt for Web; Expo for Mobile).
- Step 5: Scaffolds `.agents/` folder, creates `settings.json`, `AGENTS.md`, and `.aiignore`. Outputs success checkmarks.

## 2. Component Structure

- `src/commands/init.js`: Main CLI command flow using `prompts`.
- `src/utils/fileSystem.js`: Handles `createAgentDirectory`, `copyTemplates`, `writeSettings`.

## 3. State Management & Data Fetching

- Local state managed via standard variables parsing prompt answers.
- File system is the ultimate source of truth (reading/writing to the local workspace).

## 4. Edge Cases & Error Handling

- **Existing `.agents/`:** Prompts the user before proceeding to avoid unwanted overwrites.
- **Missing Templates:** If run in local development without `AGENTIVE_API_URL`, the CLI falls back to local file templates if they exist.
- **User Cancellation:** Gracefully exits if the user aborts a prompt (`process.exit(1)`).
