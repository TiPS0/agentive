---
name: expo-sdk-upgrade
description: Safely upgrade the local codebase's native wrappers and library versions to the targeted modern Expo SDK layout, automatically resolve dependency conflicts, and auto-fix code errors.
version: 1.1.0
updated_at: 2026-07-21
---

# Skill: Expo SDK Migration Expert

> **SYSTEM INSTRUCTION FOR AI AGENT:**
> When the user invokes `/expo-sdk-upgrade`, you must follow this comprehensive protocol to upgrade the Expo SDK to the latest version, update all related dependencies, perform a clean reinstall, and automatically fix any code logic or structural errors resulting from the upgrade. Your ultimate goal is a zero-error project that runs identically to the previous version.

## 1. Context & Trigger

- **Trigger**: When the user types `/expo-sdk-upgrade` or asks to upgrade their Expo SDK version.
- **Context**: The project is an Expo/React Native application. Upgrades can introduce breaking changes across dependencies and code logic. This skill ensures a complete, end-to-end upgrade flow.

## 2. Dependencies & Setup

- Requires Node.js and `npx` available in the environment.
- Requires internet access to search for the latest Expo SDK version and documentation.
- Uses `npm`, `yarn`, or `pnpm` depending on the detected lockfile.

## 3. Mandatory Agent Workflow

### Step 1: Detect Current Version

- Read `package.json` to determine the currently installed `expo` version.
- Note any core dependencies (e.g., `react-native`, `expo-router`, `react`).

### Step 2: Determine Latest SDK Version

- Use the `search_web` tool to search for "latest expo sdk version release".
- Identify the exact major/minor version of the latest stable Expo SDK.

### Step 3: Upgrade Expo SDK

- Run `npx expo install expo@latest` to upgrade the core Expo package.
- This command automatically updates some related dependencies, but we must go further.

### Step 4: Upgrade All Dependencies & Clean Reinstall

- Run `npx expo install --fix` to auto-upgrade all Expo-managed dependencies to their compatible versions for the new SDK.
- Detect the project's package manager based on lockfiles (`package-lock.json` -> npm, `yarn.lock` -> yarn, `pnpm-lock.yaml` -> pnpm). If none found, fallback to npm.
- Delete the `node_modules` folder and the package manager's lockfile to prevent caching issues.
- Run the appropriate install command (e.g., `npm install`, `yarn install`, or `pnpm install`) to perform a completely clean installation of all dependencies.

### Step 5: Deep Error Detection & Auto-Fixing (agent-debug principles)

- Do not assume the upgrade was flawless. You must proactively find errors.
- Run `npx expo-doctor` to identify any structural, configuration, or dependency mismatches. Fix them immediately.
- If the project uses TypeScript (check for `tsconfig.json`), run `npx tsc --noEmit` to catch type errors and API breaking changes introduced by the new SDK.
- If errors are found in the code, apply `/agent-debug` principles: isolate the error, research the breaking change in the Expo documentation for the new SDK version, and modify the code to use the new hooks/functions.
- Repeat the `tsc --noEmit` check until zero errors remain.

### Step 6: Final Verification

- Confirm that the project is completely error-free.
- Summarize all breaking changes that were automatically fixed.

## 4. Code Templates

**Clean Reinstallation Script (NPM Example):**

```bash
rm -rf node_modules package-lock.json && npm install
```

**TypeScript Validation Command:**

```bash
npx tsc --noEmit
```

## 5. Edge Cases (CRITICAL)

- **NEVER** skip the clean reinstallation step (Step 4). Old lockfiles are the #1 cause of post-upgrade crashes.
- **NEVER** leave TypeScript errors unfixed. If an API changed, research the new API and fix the user's code.
- **NEVER** guess breaking changes. If a function signature changed, search the Expo documentation for the exact target SDK version to find the correct implementation.

## 6. Validation Steps

- Verify `package.json` reflects the latest `expo` version.
- Verify `npx expo-doctor` exits with no issues.
- Verify `npx tsc --noEmit` (if applicable) exits with 0 errors.
- The final state must be a functional project with zero code errors.
