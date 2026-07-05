# Skills

This folder contains **skill definitions** — instructions that teach AI agents how to behave in specific roles or capabilities.

## How to use

Each `.md` file in this directory defines a skill. The agent will adopt the role described in the skill file when activated.

## Structure

Each skill file should include:

- **Role description:** What the agent does in this role
- **Responsibilities:** Specific tasks the agent handles
- **Inputs / Outputs:** What the agent expects and what it produces
- **Constraints:** Boundaries the agent must respect

## Examples of skills you could add

| File | Purpose |
|------|---------|
| `web-browser.md` | How agents should browse the web and retrieve data |
| `data-extractor.md` | How agents should extract structured data from raw content |
| `code-writer.md` | How agents should write new code following project conventions |
| `tester.md` | How agents should write and run tests |

## Adding new skills

Create a new `.md` file in this folder. Name it after the role (e.g., `api-designer.md`, `database-manager.md`).
