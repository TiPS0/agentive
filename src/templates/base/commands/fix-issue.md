# Command: Fix Issue (Zero Code Error)

> Use this command to diagnose and fix code errors with zero tolerance — no errors should remain after execution.

## Goal

Find and fix **all** code errors in the target file or project. The end result must compile, run, and pass all existing tests with zero errors.

## Steps

1. **Identify the error** — read the error message, stack trace, or failing test output
2. **Locate the root cause** — trace the error to its origin (don't just fix the symptom)
3. **Understand the context** — read surrounding code to understand the intended behaviour
4. **Implement the fix** — make the minimal change that resolves the root cause
5. **Check for side effects** — ensure the fix doesn't break other functionality
6. **Verify** — confirm the error is resolved by running the relevant command or test

## Rules

- **Never** suppress or silence errors without fixing the underlying cause
- **Never** add `// @ts-ignore`, `eslint-disable`, or similar without explicit approval
- **Prefer** targeted fixes over large refactors
- **Always** explain what caused the error and why the fix resolves it

## Output

```
### Error
[Original error message or description]

### Root Cause
[Explanation of why this error occurred]

### Fix Applied
[Description of what was changed and where]

### Verification
[How the fix was verified — command run, test passed, etc.]

### Status: ✅ Resolved
```
