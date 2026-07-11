# Skills

This folder contains **skill definitions** — instructions that teach AI agents how to behave in specific roles or capabilities.

## How to use

Each skill lives in its **own subfolder**, named after the skill. The folder must contain a `SKILL.md` file as its entry point.

```
.agents/skills/
├── route-groups-setup/
│   └── SKILL.md
├── create-expo-app/
│   └── SKILL.md
└── my-custom-skill/
    └── SKILL.md
```

IDE and CLI tools that support slash-commands will autocomplete the folder name, then load the `SKILL.md` inside it (e.g., typing `/route-groups-setup` activates that skill).

## SKILL.md Structure

Each `SKILL.md` file must include a YAML frontmatter block at the top:

```markdown
---
name: my-skill-name
description: A short description of what this skill does.
version: 1.0.0
---

# Skill instructions go here...
```

- **`name`** and **`description`** are required — they are used for skill discovery and autocomplete matching.
- The body (below the frontmatter) contains the actual instructions the agent follows when the skill is activated.

## Skill Folder Layout

A skill folder can include optional subdirectories for more complex skills:

| Path | Purpose |
|------|---------|
| `SKILL.md` | *(Required)* Main instructions with YAML frontmatter |
| `scripts/` | Helper scripts the agent can run |
| `examples/` | Reference implementations or usage patterns |
| `resources/` | Templates, assets, or additional files |
| `references/` | Extra documentation the agent can read on demand |

## Adding new skills

1. Create a new folder under `.agents/skills/` named after your skill (e.g., `api-designer/`)
2. Add a `SKILL.md` file inside it with the required frontmatter
3. Describe the agent's role, responsibilities, and constraints in the body
