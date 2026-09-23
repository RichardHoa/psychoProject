# 01: Cat mascot on the landing page

**What to build:** A reusable `CatMascot` component that waves hello once on mount then settles into a static happy pose, mounted on the landing page (`trang-chu`) as a fixed corner overlay — the full end-to-end feature from the spec.

**Blocked by:** None (can start immediately)

**Status:** implemented

**Implementation notes (scope evolved during review with the user):** after the initial build, the user asked for further changes that superseded a few of the original decisions below: the six source PNGs had a baked-in white background (no alpha) and were far larger than needed, so they were flood-filled to transparency, cropped to a shared tight bounding box (pixel-aligned across poses), and downscaled. The animation now cross-fades through all six pose variations, not just "happy"/"waving". The bottom-right corner overlay was replaced with a click-to-navigate icon in the navbar (sized to fit the row, tight gap to the "MÈO" wordmark) that plays a short wave burst on click before navigating home, then the standalone corner mascot was removed entirely. The checklist below is marked against what was actually shipped.

- [x] The six PNGs currently in the repo-root `Cat/` folder are copied into `src/lib/assets/cat/`, renamed to kebab-case, URL/import-safe filenames (exact names are an implementation detail).
- [x] A `CatMascot` component exists in the shared component library, generic enough to be reused on other pages later (no landing-page-specific assumptions baked in).
- [x] On mount, the component plays a wave animation by sprite-swapping between poses using CSS/Svelte transitions (no new animation library dependency) — extended to cross-fade through all six poses rather than just "happy"/"waving".
- [x] After the animation completes, the component settles on a static happy pose and does not loop or re-trigger on its own.
- [x] A Storybook story renders the component so the animation can be viewed and verified in isolation.
- [x] `CatMascot` is mounted from the landing page (`trang-chu`) component, not the shared root layout.
- [x] `npm run check` passes.
- [x] Verified via screenshots and user review in this session (no dev server run by the agent, per standing instruction).
- [~] Superseded by later user request: no longer a fixed-position corner overlay — now a clickable navbar icon that triggers the wave on click and navigates home, instead of autoplaying on every landing-page load.
- [x] **Remaining:** animation still doesn't read as smooth per the user's last feedback ("the animation is not really that smooth") — needs another pass on `CatMascot.svelte`'s cross-fade timing/easing (currently 240ms per frame, `duration-200 ease-in-out` opacity transition). Fixed: the opacity transition's duration was hardcoded to `duration-200` (200ms) while frames advanced every 240ms, leaving a ~40ms static "hold" each step that read as a stutter. The transition duration is now bound to `frameDurationMs` via an inline style so each cross-fade runs the full length of its frame interval with no dead time, and stays in sync if a caller overrides `frameDurationMs`.
