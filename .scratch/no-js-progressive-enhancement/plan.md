Status: phases 1–6 done

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

### Phase 4 — Breathing exercise without JS
- `/tho-vuong` is a real route; the navbar "Thở 5s" button links to `/tho-vuong?quay-lai=<current page>`
  ("Hoàn tất" goes back there; the param is sanitised like the gate's `dest`, see `$lib/breathing.js`).
- `BoxBreathing.svelte`: the 20 s cycle is pure CSS on one clock — square scale/colour, a dot tracing
  the edges, phase labels via `visibility` keyframes with negative delays, seconds and cycle counters
  via `@property` integers + `counter()`. Pause is a checkbox + `:has(:checked)`. Reduced motion keeps
  the cues and drops the movement.
- With JS, the link is shallow-routed (`pushState`, `page.state.breathing`) into a native `<dialog>`
  (`BreathingDialog.svelte`); Escape / Đóng / Hoàn tất go back in history. `SquareBreathingModal` removed.

### Phase 5 — Hand-drawn look rendered on the server
- `$lib/wired/rough.js` computes rough.js paths with `rough.generator()` and a fixed seed (memoised,
  unit-tested for determinism) in preset boxes (`square`, `wide`, `banner`, `bar`) stretched with
  `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`. `RoughRect.svelte` renders them.
- `WiredButton` / `WiredCard` / `WiredDivider` have no `onMount` / ResizeObserver / redraw effects;
  hover/press only translates the shadow layer in CSS. The `<noscript>` fallback is gone.
- All icons are `RoughIcon` SVGs (mic, open_in_new, pause, play added); the Material Symbols
  fallback and font are gone. Be Vietnam Pro is self-hosted via `@fontsource` (400–900).

### Phase 6 — Mascot, images, cleanup
- Cat poses go through `@sveltejs/enhanced-img` (AVIF/WebP at 64–240 px wide; `sizes` prop on `CatMascot`).
- The greeting is CSS (`cat-frame` / `cat-hide` keyframes, one `step-end` animation per frame);
  the click-wave stays a JS extra. No page autoplays it today (all use `autoplay={false}`), so it is
  covered by an SSR unit test (`CatMascot.test.js`).
- Storybook boilerplate, stories and deps removed (`.storybook/` never existed in the repo).
- Breathing strings (and the folder-end line) moved to `messages/vi.json`.
- `csp` (mode `auto`: nonces for SvelteKit's inline script; `style-src 'unsafe-inline'` because
  components use style attributes) + `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy` (microphone kept for voice search) in `hooks.server.js`.
- Paraglide plugins vendored from npm (`project.inlang/settings.json` → `./node_modules/...`), so
  builds no longer depend on cdn.jsdelivr.net (the "known environment issue" below is fixed).

### Bugs found by the e2e suite and fixed
- Gate + JS: the no-JS `<meta refresh>` was inserted for one render before `enhanced` flipped, so a
  full reload raced the client-side `goto` after "No". `enhanced` is now set when the submit starts.
- Search overlay: an aborted `preloadData` (newer query / following a result) was an unhandled rejection.

### Tests
- `npm test` — unit tests (vitest), incl. rough path determinism, breathing return path, mascot SSR.
- `npm run test:e2e` — Playwright against the production build (`npm run build && node build`),
  every spec in two projects: `no-js` (`javaScriptEnabled: false`) and `js`. Covers gate → No →
  deep link → topic → search → result anchor → breathing → back; the breathing clock, counter and
  pause; server-rendered borders, no icon font, no third-party requests, no page/CSP errors,
  self-hosted font, optimised mascot images, security headers.
  Where Playwright's bundled Chromium isn't installed: `PLAYWRIGHT_CHROMIUM_PATH=/path/to/chromium`.
- Test-only quirk: with JS disabled, Playwright's actionability checks stall after a meta refresh or
  a `#fragment` load; the `click()` helper in `e2e/helpers.js` sends a real pointer click instead
  (verified that real clicks land fine — visitors are not affected).

### How to check no-JS behaviour
- `PUBLIC_NO_JS=1 npm run dev` serves pages with `csr = false`.
- Or disable JavaScript in the browser dev tools, or run `npm run test:e2e -- --project=no-js`.

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

## Known environment issue (fixed in phase 6)
`project.inlang/settings.json` loads Paraglide plugins from `cdn.jsdelivr.net`. Where that host is
blocked, message compilation silently produces an empty `messages/_index.js` and every `m.*()` is
undefined at runtime. Consider vendoring the plugins (npm `@inlang/plugin-message-format`,
`@inlang/plugin-m-function-matcher`) so builds don't depend on the CDN.
