# Rule: Expo Router

1. **File-Based Routing Architecture**:
   - You MUST use Expo Router (`expo-router`) exclusively. Do NOT install or use `@react-navigation/native` directly.
   - All screens must be placed inside the `app/` directory (or `src/app/` if a `src` folder is used).

2. **Layouts and Navigation**:
   - Use `_layout.tsx` files to define shared UI (like Stack or Tabs) across multiple screens in a directory.
   - NEVER use `<NavigationContainer>`. Expo Router handles this automatically.

3. **Links and Dynamic Routes**:
   - ALWAYS use the `<Link>` component from `expo-router` for navigation between screens, or the `useRouter()` hook for programmatic navigation.
   - Dynamic routes use square brackets (e.g., `app/user/[id].tsx`). Retrieve parameters using the `useLocalSearchParams()` hook from `expo-router`.

4. **Not-Found Screens**:
   - Use `+not-found.tsx` to handle 404 routes.
