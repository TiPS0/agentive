# Rule: React Native Primitives

1. **NO HTML Elements**:
   - NEVER use HTML DOM elements like `<div>`, `<span>`, `<button>`, `<p>`, `<a>`, `<ul>`, `<li>`, or `<input>`.
   - React Native does not use the browser DOM. Using web elements will crash the app instantly.

2. **Core Components**:
   - ALWAYS use React Native core components imported from `react-native`.
   - Use `<View>` instead of `<div>`.
   - Use `<Text>` instead of `<span>` or `<p>`. All strings MUST be wrapped in a `<Text>` component.
   - Use `<Pressable>` or `<TouchableOpacity>` instead of `<button>`.
   - Use `<TextInput>` instead of `<input>`.
   - Use `<Image>` instead of `<img>` (and note that local images require `source={require('./path')}`, while remote require `source={{ uri: '...' }}`).
   - Use `<ScrollView>` or `<FlatList>` for scrollable areas.

3. **Event Handlers**:
   - Do NOT use `onClick`. The correct prop for `<Pressable>` is `onPress`.
   - Do NOT use `onChange` for text inputs. The correct prop for `<TextInput>` is `onChangeText`.
