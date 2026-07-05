# Rule: Native iOS & Android Builds

In a bare React Native project, you must manage native dependencies meticulously.

1. **iOS Dependencies (`pod install`)**:
   - ANY time you install a new NPM package that includes native code (e.g., `react-native-device-info`, `react-native-reanimated`), you MUST remind the user to run `cd ios && pod install` (or `npx pod-install`).
   - If an iOS build fails with a "module not found" error for a native module, the most likely solution is to run `pod install`.

2. **Android Gradle Sync**:
   - If a new native module is added, the Android project must be rebuilt.
   - If weird caching issues occur in Android, propose running `cd android && ./gradlew clean`.

3. **Avoid Manual Native Edits Unless Requested**:
   - Do not manually edit `ios/Podfile`, `android/app/build.gradle`, `MainApplication.java`, or `AppDelegate.mm` unless the library's official documentation explicitly requires manual linking (which is rare in modern React Native due to autolinking).
