# Contributing to agentive

Thank you for taking the time to contribute! 🎉
This guide will help you get started quickly.

---

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Ways to Contribute](#ways-to-contribute)
- [Development Workflow](#development-workflow)
- [Commit Message Format](#commit-message-format)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Git**

### Fork & Clone

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/agentive.git
cd agentive

# 2. Add the upstream remote
git remote add upstream https://github.com/TiPS0/agentive.git

# 3. Install dependencies
npm install
```

---

## Project Structure

```text
agentive/
├── bin/
│   └── index.js                   # CLI entry point
├── src/
│   ├── commands/
│   │   ├── init.js                # CLI interactive wizard & initialization
│   │   ├── install.js             # Package manager (install skills/rules)
│   │   └── remove.js              # Package manager (remove skills/rules)
│   ├── templates/                 # The layered template files
│   │   ├── base/                  # Core templates applied to every project (AGENTS.md, aiignore)
│   │   ├── mobile/                # Framework-specific overrides (expo, react-native)
│   └── utils/
│       ├── fileSystem.js          # File manipulation & dynamic folder merging
│       └── compilers.js           # Exporters for Cursor/Claude/Windsurf
└── package.json                   # Project metadata & scripts
```

> **Important:** When adding new built-in skills for users, make sure you modify the files inside `src/templates/`!

---

## Ways to Contribute

### 🐛 Bug Fixes

Check the [Issues tab](https://github.com/TiPS0/agentive/issues) for any open issues labeled `bug`.

### ✨ New Agent Commands or Skills

If you've found a highly effective agent rule or prompt command, you can add it to our templates:

1. Add generic instructions to `src/templates/base/skills/`.
2. Add framework-specific guardrails (e.g., Next.js, Vue) by creating a new folder like `src/templates/web/nextjs/rules/`.
3. Update the corresponding `init.js` to include the new framework in the interactive prompts.

### 📝 Documentation Improvements

Help us improve `README.md` or this contributing guide by fixing typos, clarifying sections, or adding better examples.

### 🔧 CLI Improvements

Improvements to the core CLI logic (`src/commands/init.js` or `src/utils/`).

---

## Development Workflow

```bash
# 1. Create a feature branch from main
git checkout -b feat/your-feature-name

# 2. Make your changes in the codebase

# 3. Test the CLI locally
npm link
mkdir /tmp/agentive-test && cd /tmp/agentive-test
agentive

# 4. Push your branch
git push -u origin feat/your-feature-name
```

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>: <short description>

Types:
  feat     → New feature or template (new command, skill, etc.)
  fix      → Bug fix
  docs     → Documentation only
  refactor → Code change without new feature or fix
  chore    → Build process, dependency updates
```

**Examples:**

```text
feat: add comprehensive react component skill template
fix: resolve pathing issue on windows environments
docs: improve installation instructions in README
```

---

## Pull Request Guidelines

1. **One PR per change** — keep PRs focused and small.
2. **Fill out the PR description** — describe what you changed and why.
3. **Never push directly to `main`** — always use a feature branch.
4. **Wait for review** — a maintainer will review as soon as possible.

---

## Releasing (For Maintainers)

If you need to manually publish a new update of this package to NPM, run these steps in your terminal:

1. **Bump the version**: Open `package.json` and increase the `"version"` number (e.g., from `1.1.1` to `1.2.0`).
2. **Login to NPM** _(if you aren't already)_:
   ```bash
   npm login
   ```
3. **Publish the package**:
   ```bash
   npm publish --access public
   ```
   _(If your NPM account has 2FA enabled, you will need to add your authenticator code like this: `npm publish --access public`)_

> **Security Note:** You never need to save or commit your NPM passwords or tokens in any files. Running `npm login` securely authenticates your local terminal session.

---

## Reporting Bugs

Please [open an issue](https://github.com/TiPS0/agentive/issues/new) and include:

- Your OS and terminal
- The Node version you are using (`node -v`)
- Expected vs. actual behavior
- Any error messages or screenshots

---

## Code of Conduct

Be kind, constructive, and respectful. We're all here to build something useful together.
Harassment, spam, or low-effort contributions will be closed without review.

Happy contributing! 🚀
