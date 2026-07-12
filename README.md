<div align="center">

# Agentive

**A universal, framework-agnostic AI agent workspace CLI.**

<p align="center">
  <a href="https://www.npmjs.com/package/@p_tipso/agentive"><img src="https://img.shields.io/npm/v/@p_tipso/agentive?style=for-the-badge&color=blue" alt="npm version"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=for-the-badge&logo=nodedotjs" alt="Node.js"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@p_tipso/agentive"><img src="https://img.shields.io/npm/dm/@p_tipso/agentive?style=flat-square&label=downloads" alt="npm downloads"></a>
  <a href="https://github.com/TiPS0/agentive/stargazers"><img src="https://img.shields.io/github/stars/TiPS0/agentive?style=flat-square&logo=github" alt="GitHub stars"></a>
  <a href="https://github.com/TiPS0/agentive/issues"><img src="https://img.shields.io/github/issues/TiPS0/agentive?style=flat-square" alt="GitHub issues"></a>
</p>

</div>

---

Stop maintaining separate rule files for every AI tool. **agentive** scaffolds a universal `.agents/` directory, an `AGENTS.md` file, and an `.aiignore` file in your project — providing a **single source of truth** for all your agent commands, skills, and rules, while significantly saving token usage.

## ✨ Why Agentive?

| Feature                       | Description                                                          |
| :---------------------------- | :------------------------------------------------------------------- |
| 🚀 **Interactive Setup**    | Select your environment (General, Expo, React Native) to get tailored rules. |
| 🌍 **Universal**              | Framework-agnostic setup. Works with React, Python, Go, you name it. |
| 🧠 **Single Source of Truth** | Centralize skills and rules for _all_ your AI agents in one place.   |
| ⚡ **Dynamic Layering**     | Scaffolds base rules and safely merges framework-specific guardrails. |

---

## 📦 Installation & Usage

Run one command to get a fully structured AI agent workspace instantly. 
**Note for Users:** Always append `@latest` to ensure `npx` downloads the newest public release from the npm registry, avoiding any locally cached versions:

```bash
npx @p_tipso/agentive@latest
```

> **Note for Contributors:** If you are testing this package locally (e.g., via `npm link`), simply run `npx @p_tipso/agentive` (without `@latest`) to execute your local codebase.


If you prefer to install it globally for frequent usage:

```bash
npm install -g @p_tipso/agentive
agentive
```

### CLI Commands

| Command                           | Description                                                  |
| :-------------------------------- | :----------------------------------------------------------- |
| `npx @p_tipso/agentive init`      | Scaffold `.agents/` workspace instantly in current directory |
| `npx @p_tipso/agentive install <pkg>`| Install an agent skill or rule from the registry (alias: `add`) |
| `npx @p_tipso/agentive remove <pkg>` | Remove an installed skill or rule (alias: `rm`)              |
| `npx @p_tipso/agentive --version` | Print the current CLI version                                |
| `npx @p_tipso/agentive --help`    | Show available commands and options                          |

---

## 🏗 What Happens Under the Hood?

When you run `agentive`, it launches an interactive wizard asking about your project environment (e.g., General, Mobile > Expo, React Native). It then intelligently scaffolds a tailored workspace:

```text
your-project/
├── AGENTS.md                      ← Root agent instructions
├── .aiignore                      ← Hides irrelevant files from AI to save tokens
├── .agents/
│   ├── settings.json              ← Project config
│   ├── settings.local.json        ← Local machine overrides (auto-gitignored)
│   ├── commands/
│   │   ├── README.md              ← Guide: how to add commands
│   │   ├── review.md              ← Example code review command
│   │   └── fix-issue.md           ← Example zero-error fix command
│   ├── skills/
│   │   └── README.md              ← Guide: how to add skills
│   └── rules/
│       └── README.md              ← Guide: how to add rules
```

### 📂 File & Folder Guide

- **`.aiignore`**: Prevents context pollution and saves tokens by hiding files (like `node_modules` or build outputs) from your AI agents.
- **`commands/`**: Reusable prompt instructions that agents can execute on demand (e.g. `review.md`).
- **`skills/`**: Skill definitions that teach agents how to behave in specific roles.
- **`rules/`**: Project-wide rules that all agents must follow strictly.

### 🌟 Framework-Specific Guardrails
By selecting a specific framework (like **Expo** or **React Native**), `agentive` overlays expertly crafted rules into your `.agents/` folder. This ensures your AI understands nuances like *Expo Router*, *Native Modules*, or *Unitless Pixels* right out of the box—preventing common hallucinations.

---

## 🤝 Contributing

We love contributions! Whether it's adding new built-in skills, fixing bugs, or improving documentation, your help is appreciated.

Please read our [Contributing Guide](CONTRIBUTING.md) to get started with setting up your local environment and submitting a Pull Request.


---

## ⭐ Star History

[![Star History Chart](https://raw.githubusercontent.com/TiPS0/agentive/star-tracker/star-tracker.svg)](https://star-history.com/#TiPS0/agentive&Date)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
