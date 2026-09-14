# Workspace Rules & Instructions

## Mandatory Skills Check & Validation Rule
Whenever performing any task in this project:
1. **Check Skills**: Always check the `psychoProject/.gemini/skills/` directory to inspect which skills can be used (`svelte-code-writer`, `svelte-core-bestpractices`, `paraglide-i18n`, `sveltekit-migration`, etc.).
2. **Apply Best Practices**: Strictly apply the guidance, patterns, and runes best practices defined in those skills.
3. **Verify & Validate**: Use the skills' verification mechanisms (e.g., `@sveltejs/mcp svelte-autofixer`, `npm run check`, `npm run build`) to ensure the code is optimized, clean, and compiles with 0 errors.

## Mobile-First Design & Sliding Screen Standard
1. **Screen Sliding Architecture**: Design page experiences as discrete 100dvh mobile slides with smooth horizontal swipe gestures and navigation pills.
2. **4 Knowledge Folders Hub**: Organize content in 4 expandable folders with hierarchical drill-downs (Folders -> Subfolders -> Topic Details).
3. **Sticky Breadcrumb Trails**: Always display sticky breadcrumbs with 1-tap back navigation at depth >= 1.
4. **Touch Targets**: Minimum 48px touch targets for optimal thumb ergonomics.

