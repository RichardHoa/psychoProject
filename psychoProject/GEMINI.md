# Project Instructions & Rules

## Mandatory Skills Check & Validation Rule
Whenever performing any task (creating, modifying, refactoring, or reviewing code):
1. **Check Skills**: Always check the `psychoProject/.gemini/skills/` directory to inspect which skills are relevant (`svelte-code-writer`, `svelte-core-bestpractices`, `paraglide-i18n`, `sveltekit-migration`, etc.).
2. **Apply Best Practices**: Strictly apply the guidance, patterns, and runes best practices defined in those skills.
3. **Verify & Validate**: Use the skills' verification mechanisms (e.g., `@sveltejs/mcp svelte-autofixer`, `npm run check`, `npm run build`) to ensure the code is optimized and compiles with 0 errors and warnings.

## Mobile-First Design & Sliding Screen Standard
1. **Screen Sliding Architecture**: Design experiences as discrete 100dvh mobile screen slides with smooth horizontal swipe gestures and active pill indicators.
2. **4 Knowledge Folders Hub**: Organize core topics into 4 tactile expandable folders with deep drill-down navigation (Folders -> Subfolders -> Topic Details).
3. **Sticky Breadcrumb Trails**: Mandatory interactive sticky breadcrumbs with 1-tap back button at depth >= 1.
4. **Ergonomic Touch Targets**: Minimum 48px touch targets tailored for one-thumb mobile reach.


---

## Project Configuration

- **Language**: JavaScript (JSDoc)
- **Package Manager**: npm
- **Framework**: SvelteKit with Svelte 5 runes mode
- **Styling**: Tailwind CSS v4
- **Typography**: `Be Vietnam Pro` single font family standard (`1rem` base)
- **i18n**: Paraglide JS (default `vi`)

---

## Available Svelte MCP Tools & Verification

### 1. list-sections
Use this to discover available documentation sections.

### 2. get-documentation
Retrieves full documentation content for specific sections.

### 3. svelte-autofixer
Analyzes Svelte code and returns issues and suggestions. Run this to validate components.

### 4. Build & Check Commands
- `npm run check` (svelte-check)
- `npm run build` (production build verification)
