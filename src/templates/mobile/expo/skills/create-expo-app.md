# Skill: Create Expo App

## Context
When a user asks to start a new Expo project from scratch, follow these modern initialization standards based on the latest Expo documentation.

## Execution Steps
1. **Initialize Command**: 
   - Propose running `npx create-expo-app@latest` in the terminal. This uses the default template which includes Expo Router and modern defaults.
   - If a specific template is requested, use `npx create-expo-app@latest --template <template-name>`.

2. **Start the Development Server**:
   - Propose running `npx expo start` to start the Metro bundler.
   - Explain to the user that they can press `i` to open the iOS simulator, or `a` to open the Android emulator.

3. **Resetting Cache**:
   - If the user reports weird bundling errors or missing modules, propose running `npx expo start --clear` (or `-c`) to clear the Metro cache.

4. **Dependencies**:
   - ALWAYS use `npx expo install <package>` instead of `npm install` or `yarn add` when installing native packages. This ensures the version installed is compatible with the current Expo SDK.
