---
name: expo-create-app
description: Initialize a new modern Expo project
version: 1.1.2
updated_at: 2026-07-20
---

# Skill: Create Expo App

> **SYSTEM INSTRUCTION FOR AI AGENT:**
> When a user asks to start a new Expo project from scratch, follow these modern initialization standards based on the latest Expo documentation. Your primary goal is to ensure the app is created in the current directory (`./`) and uses the absolute latest Expo SDK.

## 1. Context & Trigger

- **Trigger**: When the user asks to start, create, or initialize a new Expo or React Native project.
- **Context**: Ensure that the project setup targets the current working directory, not an arbitrary subfolder.

## 2. Dependencies & Setup

- Requires Node.js and `npx` available in the environment.
- No global CLI installation is required (always use `npx`).

## 3. Mandatory Agent Workflow

### Step 1: Initialization Readiness

- The user may run this in an empty or non-empty directory. Both cases are supported.
- DO NOT warn the user or ask for permission. Proceed immediately to initializing the Expo app.

### Step 2: Initialize Command

- Propose running the non-interactive setup script provided in the Code Templates section. This ensures seamless initialization without warnings or git repo conflicts.
- This command automatically fetches the latest stable SDK template and sets up modern defaults (like Expo Router).
- If a specific template is requested, insert `--template <template-name>` in the script.

### Step 3: Start the Development Server

- Propose running `npx expo start` to start the Metro bundler.
- Explain to the user that they can press `i` to open the iOS simulator, or `a` to open the Android emulator.

### Step 4: Dependencies and Cache

- If the user reports strange bundling errors or missing modules, propose running `npx expo start --clear` (or `-c`) to clear the Metro cache.
- ALWAYS use `npx expo install <package>` instead of `npm install` or `yarn add` when installing native packages.

## 4. Code Templates

Command to run for default initialization (works in both empty and non-empty directories):

```bash
yes | npx create-expo-app@latest _expo_setup_tmp --yes --no-agents-md && (cp -R -n _expo_setup_tmp/. ./ 2>/dev/null || true) && rm -rf _expo_setup_tmp
```

## 5. Edge Cases (CRITICAL)

- **NEVER** invent a project name (e.g. `my-expo-app`) and pass it to the CLI unless the user explicitly asks to create a subfolder. Always default to `./`.
- **NEVER** use `npm install` or `yarn add` when installing native Expo packages. **ALWAYS** use `npx expo install <package>`. This ensures the installed version perfectly matches the current Expo SDK.
- **NEVER** hardcode a specific SDK version (unless explicitly instructed by the user). Rely on `@latest`.

## 6. Validation Steps

- Verify the `app.json` and `package.json` were created in the current directory.
- Verify dependencies are installed by checking for the `node_modules` directory, or run `npx expo-doctor` to validate the project configuration and dependencies without starting the slow development server.
