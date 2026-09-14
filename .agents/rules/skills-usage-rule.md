---
name: skills-usage-rule
description: Enforces checking psychoProject/.gemini skills before any action and validating code optimization and compilation.
trigger: always_on
---

# Mandatory Skill Usage and Validation Rule

Whenever performing any action (creating, editing, refactoring, or reviewing code):

1. **Check Skills Folder**:
   - Always inspect `psychoProject/.gemini/skills/` to discover all relevant skills available for the current task (`svelte-code-writer`, `svelte-core-bestpractices`, `paraglide-i18n`, `sveltekit-migration`, etc.).

2. **Apply Applicable Skills**:
   - Use the documentation, patterns, and guidelines specified in those skills (e.g. Svelte 5 runes `$state`, `$derived`, `$props`, Paraglide i18n, Tailwind CSS v4 practices).

3. **Verify Optimization & Correct Compilation**:
   - Use the skill validation tools and CLI utilities (such as `@sveltejs/mcp svelte-autofixer`, `npm run check`, and `npm run build`) to confirm that all modified code is optimized, adheres to best practices, and compiles cleanly with zero errors and warnings.
