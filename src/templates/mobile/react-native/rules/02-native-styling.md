# Rule: Native Styling

1. **No Web CSS Attributes**:
   - Do NOT use web-specific CSS properties like `grid`, `float`, `display: block`, etc.
   - Do NOT use string styles for dimensions like `width: "100px"`.

2. **Unitless Pixels**:
   - Layout dimensions and font sizes must use unitless values (e.g., `width: 100`, `fontSize: 16`). These represent logical pixels.
   - Percentages are allowed as strings (e.g., `width: "100%"`).

3. **Flexbox Architecture**:
   - In React Native, `flexDirection` defaults to `"column"`. If you want items side-by-side, you MUST explicitly set `flexDirection: "row"`.
   - `display: "flex"` is the default and only display type for Views.
   - Use `justifyContent` and `alignItems` heavily for positioning.

4. **StyleSheet**:
   - ALWAYS use `StyleSheet.create` for defining component styles to ensure performance and avoid inline object recreation on every render.
   - Example:
     ```javascript
     const styles = StyleSheet.create({
       container: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: '#fff',
       }
     });
     ```
   - Only use inline styles for values that change dynamically during render.
