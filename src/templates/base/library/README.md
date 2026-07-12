# Library Directory

This directory contains passive AI agent references for your NPM packages and libraries.

Unlike **skills** (which are active behaviors and workflows), **libraries** are optimized references (`info.md`, `types.d.ts`, `rules.json`) that teach your AI agents how to correctly write code for specific packages without hallucinating or reading outdated syntax.

## How to Install Libraries

Use the `agentive` CLI to automatically fetch documentation and types for a package:

```bash
npx agentive install <pkg>
```

This will automatically create `.agents/library/<pkg>/` and update this file with the new reference.

## Installed Libraries
