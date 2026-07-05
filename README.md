<div align="center">

# 🤖 agentive

**A universal, framework-agnostic AI agent workspace CLI.**

[![npm version](https://img.shields.io/npm/v/@p_tipso/agentive.svg?style=flat-square)](https://www.npmjs.com/package/@p_tipso/agentive)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](https://nodejs.org)

</div>

---

Stop maintaining separate rule files for every AI tool. **agentive** scaffolds a universal `.agents/` directory and an `AGENTS.md` file in your project — your single source of truth for agent commands, skills, and rules.

## ✨ What it does

Run one command, get a fully structured AI agent workspace:

```bash
npx @p_tipso/agentive
```

No prompts. No config. Just run it and it scaffolds everything instantly into the folder your terminal is currently in.

### What happens when you run it

1. Detects your current directory and project name
2. Creates an `AGENTS.md` file at your project root (top-level agent instructions)
3. Creates a `.agents/` folder with the full workspace structure:
   - `settings.json` — project config (committed to git)
   - `settings.local.json` — local machine overrides (auto-gitignored)
   - `commands/` — reusable prompt commands (e.g. code review, fix errors)
   - `skills/` — skill definitions for agent roles
   - `rules/` — project-wide rules all agents must follow
4. If `.agents/` already exists, it skips to avoid overwriting your customisations

---

## 📁 Output Structure

```
your-project/
├── AGENTS.md                      ← root agent instructions
├── .agents/
│   ├── settings.json              ← project config
│   ├── settings.local.json        ← local overrides (auto-gitignored)
│   ├── commands/
│   │   ├── README.md              ← guide: how to add commands
│   │   ├── review.md              ← code review command
│   │   └── fix-issue.md           ← zero-error fix command
│   ├── skills/
│   │   └── README.md              ← guide: how to add skills
│   └── rules/
│       └── README.md              ← guide: how to add rules
```

### `settings.json`

```json
{
  "projectName": "my-app",
  "agentiveVersion": "1.1.0",
  "createdAt": "2026-07-05T12:00:00.000Z"
}
```

---

## 🏗 Package Architecture

This is the source code structure of the `agentive` npm package itself:

```
agentive/
├── bin/
│   └── index.js                   ← CLI entry point (shebang + commander)
├── src/
│   ├── commands/
│   │   └── init.js                ← scaffolding logic (no prompts, auto-install)
│   ├── templates/                 ← files copied into the user's project
│   │   ├── AGENTS.md              ← → copied to project root
│   │   ├── commands/
│   │   │   ├── README.md
│   │   │   ├── review.md
│   │   │   └── fix-issue.md
│   │   ├── skills/
│   │   │   └── README.md
│   │   └── rules/
│   │       └── README.md
│   └── utils/
│       ├── fileSystem.js          ← async fs helpers, directory creation, settings
│       └── compilers.js           ← sync to Cursor / Claude / Windsurf formats
├── .github/
│   └── workflows/
│       └── publish.yml            ← auto-publish to npm on git tag push
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

---

## 📂 Folder Guide

### Commands (`commands/`)

Reusable prompt instructions that agents can execute on demand.

| File | Purpose |
|------|---------|
| `review.md` | Structured code review for bugs, performance, and security |
| `fix-issue.md` | Diagnose and fix errors with zero tolerance |

### Skills (`skills/`)

Skill definitions that teach agents how to behave in specific roles. Add `.md` files to define new capabilities.

### Rules (`rules/`)

Project-wide rules that all agents must follow. Add `.md` files for coding standards, architecture rules, etc.

---

## 📦 Commands

| Command | Description |
|---|---|
| `npx @p_tipso/agentive` | Scaffold `.agents/` workspace instantly |
| `npx @p_tipso/agentive --version` | Print the current version |
| `npx @p_tipso/agentive --help` | Show available commands |

---

## 🛠 Install Globally (optional)

```bash
npm install -g @p_tipso/agentive
agentive
```

---

## 🤝 Contributing

1. Fork the repo: [github.com/TiPS0/agentive](https://github.com/TiPS0/agentive)
2. Clone your fork
3. `npm install`
4. `npm link` (to use `agentive` locally while developing)
5. Make your changes and open a pull request!

---

## 📄 License

MIT © [Pakawat Tipso](https://github.com/TiPS0)
