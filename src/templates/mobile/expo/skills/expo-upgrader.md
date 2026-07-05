# Skill: Expo SDK Migration Expert

## Operational Objective
Safely upgrade the local codebase's native wrappers and library versions to the targeted modern Expo SDK layout without generating cascade system failures.

## Step-by-Step Execution Protocol
1. **Context Extraction:** Check `package.json` and `.agents/settings.json` to confirm current project dependencies and target thresholds.
2. **Reference Audit:** Compare existing components against any files found in `.agents/reference/`. Identify breaking changes, deprecated hooks, and required config plugins before making code mutations.
3. **Strict Live Verification:** Do not guess method arguments. If internet permissions are active, query `site:docs.expo.dev/versions/` appending the target SDK code to verify exact API shifts.
4. **Isolated Incremental Assembly:** Modify files sequentially. Complete dependency resolution inside configuration files first, verify type parameters, and fix breaking interface adjustments step-by-step.
