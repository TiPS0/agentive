# Rules

This folder contains **project-wide rules** — constraints and standards that all AI agents must follow when working in this repository.

## How to use

Each `.md` file in this directory defines a set of rules.

> [!WARNING]
> **Important Note for Agentive:**
> Currently, the `agentive` CLI does not automatically merge these files into the root `AGENTS.md` file. Because AI Agents read the root `AGENTS.md` file for their global instructions, **creating a file here is not enough to activate it.**

## How to Add New Rules (The Right Way)

To ensure your rule is instantly active, you should use the custom AI skill we built for this project:

**Run this prompt in the AI chat:**
`/agent-rule <explain the rule you want to enforce>`

The AI will automatically:

1. Format it correctly and save it in this directory.
2. Automatically inject it into the root `AGENTS.md` file so it becomes active immediately.

## Structure

If you write rules manually, they should include:

- **Purpose:** Why this rule exists
- **Rules:** The specific constraints, listed clearly
- **Examples:** Good vs. bad patterns (optional but recommended)

## Examples of rules you could add

| File              | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| `code-style.md`   | Naming conventions, formatting, and patterns   |
| `architecture.md` | How the project is structured, what goes where |
| `testing.md`      | Testing requirements, coverage expectations    |
| `security.md`     | Security practices, data handling rules        |
| `git.md`          | Branch naming, commit messages, PR conventions |
