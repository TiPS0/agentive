# Commands

This folder contains **reusable prompt commands** — predefined instructions that AI agents can execute on demand.

## How to use

Each `.md` file in this directory is a command. To use a command, reference it by name when prompting your AI agent.

## Structure

Each command file should include:

- **Goal:** What the command achieves
- **Steps:** The ordered steps the agent should follow
- **Output:** What the agent should produce at the end

## Examples

| File | Purpose |
|------|---------|
| `review.md` | Review code for bugs, performance, and best practices |
| `fix-issue.md` | Diagnose and fix code errors with zero tolerance |

## Adding new commands

Create a new `.md` file in this folder. Name it clearly (e.g., `write-tests.md`, `refactor.md`, `deploy-check.md`).
