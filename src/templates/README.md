# Agentive Templates (Local Dev Mode)

This directory acts as the **Local Registry** for `agentive` when you are contributing to the CLI or building skills locally.

## How it works
If you fork this repository and run `npm link` to test the CLI locally, the CLI will automatically detect that it is running in local development mode. 
Instead of making an API call to `https://agentive.tipso.dev` to fetch the official production skills, the CLI will read directly from this `src/templates/` folder.

This allows you to safely test new AI rules, skills, and templates on your own machine before proposing them to the community.

## Structure
The structure of this directory mirrors the JSON payload that the official API returns:

```
src/templates/
├── AGENTS.md                  (Base Agent Instruction Template)
├── .aiignore                  (Base Ignore Template)
└── base/
    ├── skills/                (Base Skills)
    │   └── example-skill/
    │       └── SKILL.md
    └── rules/                 (Base Rules)
        └── code-style.md
```

## Publishing to Official Registry
When you are ready to publish your local skill to the official Agentive ecosystem, you can run:
`agentive publish <path-to-skill>` (Coming Soon)

This will send an anonymous API request to the central server for review!
