---
title: "CLI Design"
status: "active"
date: "2026-07-25"
tags: ["architecture", "core", "cli"]
---

# Architecture: CLI Design

> **AI Agent Instructions:** This is a "living document". Do not create new files using this template for every minor change. Instead, update the existing architecture documents. Read these documents to understand the foundational rules of the system before proposing structural changes.

## 1. Overview

Agentive is a Node.js CLI tool built with `commander` for argument parsing and `prompts` for interactive user input. It scaffolds AI agent environments across different frameworks (General, Next.js, Nuxt, Expo) and allows installing/removing AI rules and library metadata via the NPM registry or local templates.

## 2. Rules & Conventions

- **Rule 1:** Interactive Prompts should always use `chalk` for styling, following the established color scheme (cyan for branding, green for success, yellow for warnings, red for errors).
- **Rule 2:** The `agentDirectoryExists` check must precede commands that expect an existing `.agents/` workspace (like `install` or `remove`) but handle gracefully in `init` by prompting for update.
- **Rule 3:** All file system operations should use `fs/promises` or the custom wrappers in `src/utils/fileSystem.js` to ensure async handling without blocking.

## 3. Diagram / Structure

```text
src/
├── commands/
│   ├── init.js     # Scaffolds .agents workspace
│   ├── install.js  # Fetches and saves library info
│   ├── remove.js   # Deletes library info
│   └── sync.js     # Synchronizes template rules
├── templates/      # Base and framework-specific markdown rules
└── utils/
    ├── compilers.js   # Content merging logic
    └── fileSystem.js  # Helpers for reading/writing agent configs
```
