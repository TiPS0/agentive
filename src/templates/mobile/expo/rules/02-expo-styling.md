# Rule: Expo Styling

1. **Flexbox Defaults**:
   - Remember that in React Native, `flexDirection` defaults to `"column"`, NOT `"row"`.
   - `display: "flex"` is the default and only display type for Views.

2. **Unitless Values**:
   - NEVER use string values with `px` for dimensions (e.g., `width: "100px"`). ALWAYS use unitless numbers (e.g., `width: 100`).
   - Percentages are allowed as strings (e.g., `width: "100%"`).

3. **StyleSheet Priority**:
   - Unless NativeWind (Tailwind) is explicitly set up in the project, ALWAYS use `StyleSheet.create({ ... })` from `react-native` to define styles.
   - Avoid inline object styles except for dynamic values (e.g., `style={{ width: dynamicWidth }}`).

4. **SafeAreaView**:
   - In Expo Router, do NOT use `react-native`'s `SafeAreaView`. Use `react-native-safe-area-context` and its `useSafeAreaInsets` hook or `<SafeAreaView>` component to handle notches properly across all platforms.
