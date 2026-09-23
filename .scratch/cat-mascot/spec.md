Status: ready-for-agent

# Cat mascot on the landing page

## Problem Statement

The landing page (Landing page) currently has no character or personality to it — it's just content (ScreenSlider, FolderExplorer, search). The site has a set of Cat mascot illustrations sitting unused in a folder at the repo root, and nothing on the site currently makes MÈO feel warm or welcoming when a visitor first arrives.

## Solution

Introduce the Cat mascot as a small animated presence on the Landing page: it waves hello once when the page loads, then settles into a resting pose, giving the landing experience a friendlier, more personal first impression. This spec also identifies other places the Cat mascot could extend to later — those are out of scope for this build, not decided.

## User Stories

1. As a visitor landing on the site, I want to see a friendly cat character wave hello, so that the site feels warmer and more welcoming than a plain content page.
2. As a visitor, I want the cat's wave animation to happen once and then settle, so that it doesn't distract me while I'm trying to read or navigate the page.
3. As a visitor on a small viewport, I want the cat to sit in a corner that doesn't block content I'm reading, so that it enhances rather than interferes with the page.
4. As a visitor who scrolls the landing page, I want the cat to stay visible (fixed overlay), so that its presence persists throughout my visit to that page rather than disappearing once I scroll past it.
5. As a returning visitor who reloads or revisits the landing page, I want the cat to wave again on that fresh load, so that the greeting feels consistent every time I arrive, not just the first time ever.
6. As a developer, I want the Cat mascot's image assets to live inside the SvelteKit project (not in the permission-restricted root folder) with normalized filenames, so that they can be imported and bundled like any other project asset.
7. As a maintainer, I want the Cat mascot rendered as its own reusable component, so that it can later be reused on other pages (e.g. the future checkin page, once built) without duplicating markup or animation logic.

## Implementation Decisions

- **Asset relocation**: the six PNGs currently in the root-level `Cat/` folder (`happy.png`, `happy with open eyes.png`, `happy (2).png`, `different happy expression.png`, `happy with open eyes and waving.png`, `happy and waving.png`) are copied into `src/lib/assets/cat/` and renamed to kebab-case, URL/import-safe filenames (e.g. `happy.png`, `happy-open-eyes.png`, `happy-alt.png`, `happy-different.png`, `happy-open-eyes-waving.png`, `happy-waving.png` — exact final names are an implementation detail, not a decision to re-litigate).
- **Component**: a new reusable `CatMascot` component in the shared component library (alongside existing shared components like `WiredButton`/`WiredDivider`), parameterizable enough to be reused elsewhere later (e.g. future checkin-page use), even though only the landing-page usage ships now.
- **Placement**: the component renders as a fixed-position overlay in a page corner (e.g. bottom-right), layered above page content, unaffected by the page's internal scroll/slide state (`ScreenSlider`/`FolderExplorer`).
- **Animation**: on mount, the component plays a short wave animation by swapping between the "happy" and "waving" PNG poses (sprite-swap via CSS/Svelte transitions — no new animation library, since assets are static images, not Lottie/video). After the animation completes, it settles on a static happy pose and does not loop or re-trigger without a fresh page load.
- **Trigger scope**: the animation plays on every fresh load of the landing page (not gated to "once ever" via any persisted flag) — each visit/reload replays the greeting.
- **Integration point**: mounted from the Landing page's page component (`trang-chu`), not from the shared root layout, since this build only targets the landing page.

## Testing Decisions

- No automated test for this feature — it is purely presentational (a mount-triggered sprite animation with no business logic to assert on). Verify visually via a Storybook story for the `CatMascot` component and/or manual check of the landing page.
- Good tests here would only be worth adding if/when the component grows real logic (e.g. multiple trigger conditions); until then, testing the visual outcome for a decorative animation isn't worth the coverage cost.

## Out of Scope

- The checkin page and any cat presence on it — that page doesn't exist yet in the codebase and is a separate future effort.
- Any other placement of the Cat mascot beyond the landing page. Candidate future placements noted for later consideration (not decided, not built now): the Safety check-in gate (as a narrator once that ships), a footer/about section, a loading state, and an empty-state illustration (e.g. no search results).
- Any changes to the six source assets' art content — only relocation/renaming is in scope.

## Further Notes

- The `Cat/` source folder at the repo root is permission-restricted (`drwx------`); the implementing agent will need read access to copy the files out, or the user may need to grant/copy access first.
- This is one of two related specs from the same design session; see `.scratch/safety-checkin-gate/spec.md` for the other. They are independent and can be implemented in either order.
