# Glossary

Define your project's business logic terms here to ensure AI agents and human developers use consistent naming (e.g. avoiding mixing up "User" vs "Customer").

## Core Entities

- **Workspace (`.agents/`)**: The root directory inside a user's project where agent settings, skills, libraries, and rules are centralized.
- **Skills**: Active capabilities or specialized tasks that an agent can execute manually. Stored in `.agents/skills/`.
- **Library**: Passive documentation, API contracts, and types for installed NPM packages. Stored in `.agents/library/` to provide context to the agent.
- **Rules**: Passive project-wide guidelines (e.g., coding standards, architecture constraints) located in `.agents/rules/`.
- **Template Layering**: The process of combining base agent rules with framework-specific guardrails (e.g., Expo, Next.js) during the `init` process.
