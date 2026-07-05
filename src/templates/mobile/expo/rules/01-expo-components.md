# Rule: Expo Components & Libraries

When building UI or accessing device features in an Expo project, you MUST adhere to the following rules:

1. **Strictly Prefer Expo SDK Packages**:
   - For images, ALWAYS use `expo-image` instead of React Native's `<Image>` or `react-native-fast-image`.
   - For icons, prefer `expo-symbols` or `@expo/vector-icons`.
   - For fonts, use `expo-font`.
   - For device features (camera, location, file system), ALWAYS check if an official `expo-*` package exists before reaching for a third-party React Native package.

2. **No Web Primitives**:
   - NEVER use `<div>`, `<span>`, `<button>`, `<p>`, `<a>`, or `<input>`.
   - You MUST use `<View>`, `<Text>`, `<Pressable>`, `<TextInput>`, etc., from `react-native`.

3. **Avoid Bare Native Modules**:
   - Do NOT recommend installing libraries that require manual `pod install` or manual Android Gradle changes unless they are explicitly Expo-compatible (e.g., they provide a Config Plugin).
   - If a library requires native code changes, remind the user that they must use a Custom Development Client (`npx expo run:ios` or `npx expo run:android`) rather than Expo Go.
