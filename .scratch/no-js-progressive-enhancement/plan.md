Status: phases 1–3 done, phases 4–6 ready-for-agent

# Make MÈO work without JavaScript (progressive enhancement)

## Goal

Every page and every core action works with JavaScript disabled or failed to load. JavaScript only
adds polish on top (animations, live search, voice input, the cat's wave).

Principles:

1. **The URL is the state.** A screen, topic, search or exercise is a real URL rendered on the server.
2. **Every action is a `<form>` or an `<a href>`.** SvelteKit upgrades both to client-side navigation when JS is available.
3. **CSS/HTML before JS** for animation, auto-hide, swipe (scroll-snap) and modals (`popover`).
4. **JS only enhances**: view transitions, live search, voice input, mascot animation.

## Done

### Phase 1 — Safety gate enforced on the server
- `hooks.server.js` redirects every matched route to `/kiem-tra-an-toan` until the session cookie
  `meo_safety_gate` is set (no Max-Age → cleared when the browser session ends). Client-side
  navigations get the same redirect as JSON.
- The gate answers are form actions (`?/no`, `?/yes`) with `use:enhance`. Bubbles reveal with CSS
  `animation-delay`. Without JS the redirects are `<meta http-equiv="refresh">`; with JS, timers.
- The hotline is a real link / same-tab navigation (no more pop-up-blocked `window.open` from a timer).
- `dest` is sanitised on the server (`sanitizeDestination`, unit-tested).
- **Deploy note:** form POSTs need `ORIGIN` to match the public URL (adapter-node assumes https
  otherwise). `make prod ORIGIN=https://your-domain`.

### Phase 2 — Real routes
- `/trang-chu`: hero + hub as CSS scroll-snap slides (`#gioi-thieu`, `#chu-de`), scroll-driven progress bar.
- `/trang-chu/[folder]`: one topic, with `id`s on sections and items (`:target` highlight).
- Breadcrumbs, back, next topic and hub cards are all links. Swipe-right-to-go-back is an attachment.
- Old `?slide=1&folder=x&sub=y` links redirect to `/trang-chu/x#y`.
- Content data moved to `$lib/server` (never shipped to the browser).
- `onNavigate` view transitions (JS) + `@view-transition { navigation: auto }` (full page loads).

### Phase 3 — Search
- `/tim-kiem?q=` renders results on the server. The index is built from the real folder content,
  diacritic-insensitive ("bao mat" finds "bảo mật"), with each result linking to its exact anchor.
- With JS, the search bar opens the same page as an overlay via shallow routing
  (`preloadData` + `pushState`). Results update as you type; Escape / Đóng go back in history.
- Global `searchState` singleton removed (module state is shared between users during SSR).

### How to check no-JS behaviour
- `PUBLIC_NO_JS=1 npm run dev` serves pages with `csr = false`.
- Or disable JavaScript in the browser dev tools.

## Remaining

### Phase 4 — Breathing exercise without JS (~½ day)
Today the "Thở 5s" button opens a JS-only modal (`SquareBreathingModal`, `setInterval`), so it does
nothing without JavaScript.
- Add a `/tho-vuong` route (sharable, works everywhere); the navbar button becomes a link to it.
- Rewrite the 20 s box-breathing cycle in pure CSS: one `@keyframes` for the square (inhale → hold
  → exhale → hold); phase labels stacked and shown in turn with `animation-delay`; the seconds
  counter with `@property --n` + `counter()`.
- Pause/resume: a checkbox + `:has(input:checked) { animation-play-state: paused }`.
- Enhancement: with JS, intercept the link and open the same component in a `<dialog>`/`popover`
  (or shallow-route it like search), so the current page stays underneath.
- Keep `prefers-reduced-motion` handling.

### Phase 5 — Hand-drawn look rendered on the server (~1 day)
`WiredButton` / `WiredCard` / `WiredDivider` draw with rough.js after mount (ResizeObserver).
Without JS there is no border (a `<noscript>` CSS fallback in `app.html` covers it for now), and
with JS the borders pop in after load.
- Use `rough.generator()` (no DOM needed) with a fixed `seed` to compute the path strings in a
  `$derived`, identical on server and client → no hydration mismatch.
- Render into `<svg viewBox="0 0 100 100" preserveAspectRatio="none">` with
  `vector-effect="non-scaling-stroke"`; pick 2–3 aspect-ratio presets if wide elements look stretched.
- Delete the ResizeObserver / `onMount` / redraw `$effect`s; hover/press becomes a CSS transform
  on the shadow path. Remove the `<noscript>` fallback afterwards.
- Replace all remaining `material-symbols-outlined` uses (mic, open_in_new, breathing modal icons,
  folder icons not in `ICONS_SVG_MAP`) with `RoughIcon`, then drop the render-blocking Material
  Symbols font. Consider one snippet per icon instead of `{@html}` strings.
- Self-host Be Vietnam Pro with `@fontsource`.

### Phase 6 — Mascot, images, cleanup (~½ day)
- `@sveltejs/enhanced-img` for the six cat PNGs (~80–104 KB each, ~576 KB total) → AVIF/WebP at display size.
- Greeting animation in pure CSS (per-pose opacity keyframes with `steps()`); the click-wave stays a JS extra.
- Remove the Storybook boilerplate (`src/stories/`) and the Storybook deps or restore `.storybook/`
  (its vitest project was removed in phase 1–3 because the config folder doesn't exist).
- Move the last hard-coded Vietnamese strings (breathing modal) into `messages/vi.json`.
- Enable `kit.csp` (automatic nonces) and basic security headers.
- Add a Playwright e2e suite with a `javaScriptEnabled: false` project covering: gate → No →
  deep link → topic → search → result anchor → breathing page; and the same with JS on.

## Notes — SvelteKit rendering optimization (not started)

Came up while reviewing current SSR setup; not yet implemented.

**Why `/trang-chu` and `/trang-chu/[folder]` can't be prerendered**, even though their content
(`FOLDERS_DATA`) is static and identical for every visitor: `hooks.server.js`'s `handleSafetyGate`
enforces the `meo_safety_gate` cookie check on every request via the `handle` hook. Prerendered
routes are baked to static HTML at build time and, once served as static files, never go through
`hooks.server.js` again — so prerendering either route would let visitors reach content directly
without ever passing the safety gate, defeating its whole purpose. `trang-chu/+page.server.js` also
handles legacy `?folder=&sub=` / `?slide=1` redirects per-query-string, which prerendering (one
static output per route, no query variants) can't reproduce either. Conclusion: keep both dynamic.

**Real optimization available: convert `+page.server.js` → `+page.js` (universal load) for
`trang-chu` and `trang-chu/[folder]`.** `$lib/server/content.js` (`listFolders`, `getFolder`) has no
server-only dependency — it's a pure function over the bundled `folderData.js` array, so it's safe to
move out of `$lib/server/` and load universally. Today, being a server load means every client-side
navigation between these routes triggers a `__data.json` round-trip to the Node server for data that
never changes. As a universal load, SSR on the first request stays identical, but the load function
also runs client-side using data already in the JS bundle — so subsequent navigation (home → folder →
home → another folder) becomes instant with no network call. The safety gate is unaffected: it's
enforced by the `handle` hook on the first hard navigation that sets the session cookie, not tied to
load type.

**Minor:** the root `/` → `/trang-chu` redirect in `+page.server.js` uses `redirect(307, ...)`
(temporary); since it's permanent by design, `308` would let browsers cache the redirect and skip
the hop on repeat visits.

## Known environment issue
`project.inlang/settings.json` loads Paraglide plugins from `cdn.jsdelivr.net`. Where that host is
blocked, message compilation silently produces an empty `messages/_index.js` and every `m.*()` is
undefined at runtime. Consider vendoring the plugins (npm `@inlang/plugin-message-format`,
`@inlang/plugin-m-function-matcher`) so builds don't depend on the CDN.
