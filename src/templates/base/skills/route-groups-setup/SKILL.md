---
name: route-groups-setup
description: Guidelines for enforcing the Route Groups pattern across modern file-based routing frameworks (Next.js, Expo Router, Nuxt).
version: 1.1.0
updated_at: 2026-07-10
---

# Modern File-Based Routing Guidelines

**CRITICAL INSTRUCTION FOR AI AGENTS**: When working with modern meta-frameworks (e.g., **Next.js**, **Expo Router**, or **Nuxt**) in this workspace, you must enforce a clean routing structure using **Route Groups**. This applies regardless of the specific framework or version.

## Route Groups Context

Route Groups (directories named with parentheses, like `(tabs)`, `(auth)`, or `(marketing)`) allow you to organize files and share layouts without adding a segment to the URL path.

As projects grow, a flat file-based routing structure can quickly become messy and hard to maintain. To prevent this, the modern standard is to use Route Groups to keep the routing directory organized, modular, and clean.

## The Standard Routing Pattern

You must strictly enforce the following rules for routing:

### 1. Structural Requirements

- **Root Directory**: The routing root is `app/` or `src/app/` (Next.js App Router, Expo Router). _Note: These rules do not apply to the legacy Next.js `pages/` router._
- **Global Layouts**: Base files like `index.tsx`, `page.tsx`, `_layout.tsx`, `layout.tsx`, and `+not-found.tsx` MUST remain at the root of the routing directory.
- **Top-Level Feature Modules**: ALL distinct top-level feature modules or screen sections MUST be wrapped in parentheses `()` to form a Route Group.
  - **DO NOT** create flat static directories at the root level (e.g., `app/profile/index.tsx`).
  - **DO** create Route Group directories for top-level features (e.g., `app/(profile)/index.tsx`).
  - _Note: Normal static folders are completely fine INSIDE a Route Group when you specifically need to add a URL segment._
- **Consistency**: Ensure that layouts and screens for a specific feature are contained entirely within their respective Route Group directory.

#### ⚠️ Critical Rule — Route Groups Are Invisible in the URL

Route Groups `(name)` are **completely ignored** in the final URL path. They exist purely for layout organization. This has a critical implication for dynamic routes:

- **DO NOT** place two dynamic segments at the same URL depth using nested Route Groups.
  - ❌ `app/(shop)/[storeId].tsx` + `app/(shop)/(product)/[productId].tsx` → **Both resolve to `/:id` — URL collision!**
- **DO** chain dynamic segments directly by nesting them, or use static folders to separate them.
  - ✅ `app/(shop)/[storeId]/[productId]/page.tsx` → URLs: `/:storeId` and `/:storeId/:productId`

### 2. Folder Naming Conventions (Quick Matrix)

You must understand the exact differences between folder types to construct valid routes:

| Folder Pattern | URL Impact           | Type              | Best Used For                                                            |
| -------------- | -------------------- | ----------------- | ------------------------------------------------------------------------ |
| `(groupName)/` | **None (Hidden)**    | **Route Group**   | Organizing code by feature or sharing layouts (e.g., `(auth)`)           |
| `folderName/`  | Exact Match          | **Static Route**  | Fixed pages with hardcoded URLs (e.g., `dashboard`, `shop`)              |
| `[paramName]/` | Variable Placeholder | **Dynamic Route** | Dynamic data pages matching IDs or slugs (e.g., `[userId]`, `[storeId]`) |

### 3. The Purpose of Layout Files (`_layout.tsx` / `layout.tsx`)

Layout files are crucial in Route Groups. Even though the Route Group folder `(groupName)` is invisible in the URL, the routing framework relies on the `_layout.tsx` file inside it to know _how_ to render the screens it contains.

**Why it is needed:**
Without a layout file (`_layout.tsx` in Expo returning a `<Stack />`, or `layout.tsx` in Next.js returning `{children}`), the framework won't know how to render the screens or provide navigation between them (e.g., it won't know how to slide screens in or provide a back button).

**Advanced Use Cases:**

1. **Shared Context Providers**: If you build a state manager that only applies to specific screens (e.g., `<ShopStateProvider>`), wrap it inside `(shop)/layout.tsx` so it doesn't degrade performance for the rest of the app.
2. **Auth Guards**: You can enforce security at the folder level. Checking `if (!isAuthenticated)` inside `(dashboard)/layout.tsx` instantly protects every screen inside the dashboard folder (like the profile page).
3. **Shared UI**: Use the layout file to inject a custom header, footer, or navigation bar that applies to every screen in that specific Route Group.

### 4. Example Valid Directory Tree

```text
app/ (or src/app/)
├── _layout.tsx (or layout.tsx)
├── index.tsx (or page.tsx)
│
├── (auth)/                          ← Route Group: shared auth layout
│   ├── _layout.tsx (or layout.tsx)
│   └── login.tsx                    → URL: /login
│
├── (tabs)/                          ← Route Group: tab bar layout
│   ├── _layout.tsx (or layout.tsx)
│   ├── dashboard.tsx                → URL: /dashboard
│   └── shop.tsx                     → URL: /shop  (tab entry point)
│
├── (dashboard)/                     ← Route Group: dashboard layout
│   ├── _layout.tsx (or layout.tsx)
│   └── profile.tsx                  → URL: /profile
│
└── (shop)/                          ← Route Group: shared shop layout (URL-invisible)
    ├── _layout.tsx (or layout.tsx)
    └── [storeId]/                   ← Dynamic folder → URL: /:storeId
        ├── index.tsx (or page.tsx)  → URL: /123
        └── [productId]/             ← Nested dynamic folder → URL: /:storeId/:productId
            └── index.tsx (or page.tsx) → URL: /123/456
```

**How the shop flow works:**

1. `(tabs)/shop.tsx` → the tab that shows the store list (`/shop`)
2. User selects a store → navigates to `(shop)/[storeId]/index.tsx` → URL: `/123`
3. User selects a product → navigates to `(shop)/[storeId]/[productId]/index.tsx` → URL: `/123/456`

The `(shop)` Route Group provides a **shared layout** (e.g., a back-button header) for both the store and product screens, without polluting the URL.

**Important File Naming Note:**
When using dynamic folders like `[storeId]`, always name the main entry file `index.tsx` (Expo Router) or `page.tsx` (Next.js). Do NOT name the file `storeId.tsx` inside the `[storeId]` folder, as that would result in an awkward URL like `/123/storeId`.

## Required Agent Workflow for Routing Tasks

Whenever you are asked to create, modify, or debug routes/screens, you must execute these steps:

1. **Identify the Framework**: Check `package.json` to determine if the project uses Next.js, Expo, Remix, or Nuxt, and note the correct file naming conventions (`page.tsx`, `index.tsx`, `index.vue`).
2. **Verify the Structure**: Check the `app/` or `src/app/` directory to understand the existing root.
3. **Enforce Route Groups**: Ensure that top-level feature modules are created exclusively inside parentheses `(group_name)`. You are FORBIDDEN from creating new standard flat folder routes directly at the root of `app/` (e.g., `app/home/`).
4. **Refactor if Necessary**: If you encounter an existing flat routing structure at the root (e.g., `app/home/`), you MUST transition it to the standard Route Group pattern (e.g., `app/(home)/`) before adding new features.
