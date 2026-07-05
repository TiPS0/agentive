# Skill: Native Module Linking & Troubleshooting

## Context
Use this skill when a user encounters build errors, native module crashes, or needs help installing a library with deep native hooks in a bare React Native app.

## Execution Steps

1. **Verify Autolinking**:
   - React Native uses Autolinking by default for iOS and Android. 
   - Check the `package.json` to ensure the library is installed.
   - For iOS: Propose running `cd ios && pod install`. If the user is on an Apple Silicon Mac and encounters FFI errors, propose `arch -x86_64 pod install`.
   - For Android: Propose running `cd android && ./gradlew clean`.

2. **Manual Linking (Only if Autolinking Fails)**:
   - Only propose manual changes to `settings.gradle` and `MainApplication.java` (Android) or `Podfile` (iOS) if the specific library documentation states that it does not support autolinking.

3. **Clearing Caches**:
   - The React Native packager (Metro) often caches aggressively. If JS changes aren't reflecting or weird module resolution errors occur, propose:
     `npx react-native start --reset-cache`
   - For a deeper clean, propose clearing Watchman watches:
     `watchman watch-del-all`
     `rm -rf node_modules && npm install`
     `rm -rf $TMPDIR/metro-*`

4. **Rebuilding**:
   - Remind the user that after installing a native module, they CANNOT simply rely on fast refresh. They MUST recompile the app:
     `npx react-native run-ios` OR `npx react-native run-android`
