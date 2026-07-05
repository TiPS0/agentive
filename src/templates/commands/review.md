# Command: Review Code

> Use this command to perform a thorough code review on a file, folder, or pull request.

## Goal

Review the target code for correctness, performance, readability, and adherence to project conventions.

## Steps

1. **Read** the target code carefully from start to finish
2. **Check for bugs** — logic errors, off-by-one errors, null/undefined handling, race conditions
3. **Check for performance** — unnecessary re-renders, N+1 queries, missing indexes, memory leaks
4. **Check for security** — injection vulnerabilities, exposed secrets, missing auth checks
5. **Check for readability** — naming, function length, comment quality, dead code
6. **Check for conventions** — does the code follow the rules defined in `.agents/rules/`?

## Output

Provide a structured review with:

```
### Summary
One-sentence verdict (e.g., "Generally solid, 2 bugs found")

### Issues Found
- 🐛 **Bug:** [description] (file:line)
- ⚡ **Performance:** [description] (file:line)
- 🔒 **Security:** [description] (file:line)

### Suggestions
- 💡 [optional improvement]

### Verdict
- [ ] Ready to merge
- [ ] Needs changes (see issues above)
```
