---
title: "Template System"
status: "active"
date: "2026-07-25"
tags: ["architecture", "core", "templates"]
---

# Architecture: Template System

> **AI Agent Instructions:** This is a "living document". Do not create new files using this template for every minor change. Instead, update the existing architecture documents. Read these documents to understand the foundational rules of the system before proposing structural changes.

## 1. Overview

The Template System in Agentive is designed to layer rules dynamically based on the project type selected during initialization. It merges a base set of general AI agent rules with framework-specific constraints (e.g., Next.js App Router rules or Expo mobile patterns) to generate a unified `AGENTS.md` and `.aiignore`.

## 2. Rules & Conventions

- **Rule 1:** Templates are grouped into directories (`base`, `web/nextjs`, `mobile/expo`). The `base` templates are always applied.
- **Rule 2:** The compilation process must append framework-specific rules to the base rules rather than overwriting them entirely.
- **Rule 3:** Any skills defined in the templates (`skills/` directory within a template) are copied into the user's `.agents/skills/` directory.

## 3. Diagram / Structure

The template resolution logic typically follows this flow:

```
[User Selection] (e.g., Web -> Next.js)
       |
       v
Read /templates/base/AGENTS.md
       |
       v
Append /templates/web/nextjs/AGENTS.md (if exists)
       |
       v
Write to <cwd>/AGENTS.md
```
