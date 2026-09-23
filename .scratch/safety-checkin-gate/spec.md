Status: ready-for-agent

# Safety check-in gate before entering the site

## Problem Statement

MÈO is a Vietnamese self-help/mental-health site. Some visitors may arrive in acute distress, including active thoughts of self-harm, and land directly on content (the Landing page or any deep link into it) without ever being asked whether they need more urgent help than the site itself can offer. There is currently no mechanism that checks in with a visitor before they see any page content, and no path that connects a visitor in crisis to the Đường dây nóng Ngày mai crisis hotline.

## Solution

Introduce a Safety check-in gate: a chat-styled interstitial that appears before a visitor reaches any page, once per browser session, asking directly whether they are having thoughts of self-harm. A "No" answer leads them on to whatever page they were trying to reach (Landing page or a specific deep link). A "Yes" answer connects them to the hotline — either directly, if it's within Hotline hours window, or with a clear note that it isn't staffed right now (while still offering the option to go there anyway) if it's outside those hours.

## User Stories

1. As a first-time visitor to any URL on the site, I want to be asked a safety check-in question before I see any page content, so that the site can connect me to appropriate help if I need it.
2. As a visitor who navigates straight to a deep link (e.g. a specific slide/folder/subfolder on the Landing page), I want the safety check-in gate to appear first, and to still land on that exact deep link afterward (not get bounced to the generic landing page), so that the link I followed still takes me where I intended.
3. As a visitor who already answered the safety check-in earlier in my browsing session, I want to navigate freely to other pages without being asked again every single time, so that the check-in doesn't become repetitive friction within one visit.
4. As a returning visitor in a new browser session (e.g. a new tab session, or after closing and reopening the browser), I want to be asked the safety check-in question again, so that the check happens fresh each time I return, not just once ever.
5. As a visitor reading the gate, I want it presented as a short conversational sequence (intro messages about what MÈO does, then the question), so that it feels like being greeted by someone rather than filling out a form.
6. As a visitor who answers "No", I want a brief, warm acknowledgment before I'm taken to my destination, so that the interaction feels human rather than abrupt.
7. As a visitor who answers "Yes" during Hotline hours window, I want to see a short countdown before being automatically connected to the crisis hotline, so that I know what's about to happen and have a moment to prepare.
8. As a visitor who answers "Yes" during Hotline hours window but doesn't want to wait, I want a way to go straight to the hotline immediately, so that I'm not forced to sit through the countdown if I need help right away.
9. As a visitor who answers "Yes" outside Hotline hours window, I want to be told clearly that the hotline isn't staffed right now, so that I'm not left waiting for a response that won't come.
10. As a visitor who answers "Yes" outside Hotline hours window, I want the option to go to the hotline's site anyway (it may still have useful information even when unstaffed), so that I'm not left with no path forward at all.
11. As a site operator, I want the in-hours/off-hours determination to be based on a fixed Vietnam timezone rather than the visitor's device clock, so that the hotline availability shown is always accurate regardless of the visitor's own time zone or clock settings.
12. As a developer, I want the hours-check and destination-resolution logic to be plain, framework-independent functions, so that they can be unit tested without spinning up a browser or the full app.

## Implementation Decisions

- **Route**: the gate is a new page at `/kiem-tra-an-toan`.
- **Interception**: on first navigation of a browser session to any route (including direct deep links, e.g. `trang-chu?slide=1&folder=quyen-than-chu&sub=10-quyen-loi`), the visitor is sent to the gate first. The originally requested URL (full path + query string) is captured and carried through so it can be the redirect target after a "No" answer. Once the gate has been answered in the current browser session, subsequent navigations within that session skip it.
- **Session scope**: "session" means the current browser session as tracked client-side (e.g. via `sessionStorage`), not a server-side session — it resets when the browser tab/session ends, and is independent per session.
- **Presentation**: a sequential chat-bubble UI on the gate page. Message bubbles reveal in order: first, intro copy briefly explaining what MÈO does (placeholder Vietnamese copy, to be drafted and reviewed — not final content in this spec); then a question bubble with the exact text "Bạn đang có ý định làm hại bản thân không?" alongside Yes/No buttons.
- **"No" path**: a short, warm acknowledgment appears as the next bubble in the same chat thread for about 2 seconds, then the visitor is automatically taken to their originally requested destination (the Landing page, or the specific deep link they'd requested).
- **"Yes" path — hours check**: performed server-side, using a fixed `Asia/Ho_Chi_Minh` timezone, against the Hotline hours window (13:00–20:30, Wednesday through Sunday).
  - **In hours**: the next bubble in the same chat thread shows a countdown (e.g. "Connecting you in 5...4...3...") and auto-redirects to `https://duongdaynongngaymai.vn/` when it reaches zero; a manual button lets the visitor skip ahead immediately instead of waiting.
  - **Off hours**: the next bubble in the same chat thread states plainly that the hotline isn't staffed right now, with a manual "Go anyway" button linking to the same `https://duongdaynongngaymai.vn/` (the hotline's own site may still carry useful information even when unstaffed) — no auto-countdown, and no separate resource list beyond that same link.
- **Modules**:
  - A framework-independent module exposing `getHotlineStatus(now)` (or equivalent), returning whether `now` falls inside the Hotline hours window, given a fixed Vietnam-timezone definition of the window.
  - A framework-independent module exposing `resolveGateDestination(url)` (or equivalent), computing the post-"No" redirect target from the originally requested URL.
  - The gate page itself (chat UI, session-storage check, wiring the above two modules together) — no existing gating/auth hook exists yet in this codebase (`hooks.server.js` currently only handles Paraglide locale routing), so this is new.

## Testing Decisions

- The seam under test is the two framework-independent modules above (`getHotlineStatus`, `resolveGateDestination`), tested with plain vitest — no DOM/browser needed, since they take plain inputs (a `Date`, a `URL`/string) and return plain outputs.
- `getHotlineStatus` tests should cover: a time inside the window on a valid day, a time outside the window on a valid day (both before opening and after closing), and a day the hotline doesn't operate at all (e.g. Monday/Tuesday), all anchored to `Asia/Ho_Chi_Minh`, independent of the machine's local timezone.
- `resolveGateDestination` tests should cover: a bare root/landing request, and a deep-link request carrying query params (e.g. `slide`/`folder`/`sub`), confirming the full path and query string round-trip unchanged.
- No prior art exists in this codebase (no test files currently exist) — this establishes the first test files, using the project's already-configured vitest setup.
- The chat UI itself (bubble sequencing, session-storage gating, button interactions) is not covered by automated tests in this build; verify manually per the golden path and edge cases (fresh session load, deep link, repeat navigation within session, Yes in-hours, Yes off-hours, No) before calling this done.

## Out of Scope

- Building the checkin page — it doesn't exist in the codebase yet and is unrelated to this gate.
- Real off-hours resource content beyond the hotline's own link — confirmed by the user that the same `https://duongdaynongngaymai.vn/` link is the only destination needed; no separate resource list is being built.
- Final intro copy — this spec ships with placeholder Vietnamese copy that needs review/approval before considering the content final.
- Server-persisted (cross-device/cross-session) memory of whether a visitor has passed the gate before — this is intentionally session-scoped only, not account- or device-level.
- Making the site work without JavaScript — a pre-existing backlog idea noted in this repo's README, unrelated to this feature.

## Further Notes

- This is one of two related specs from the same design session; see `.scratch/cat-mascot/spec.md` for the other. They are independent and can be implemented in either order.
- Domain vocabulary for this feature ("Landing page", "Safety check-in gate", "Hotline hours window") is recorded in the repo's `CONTEXT.md`.
