# MÈO

MÈO is a Vietnamese-language self-help/mental-health resource site (SvelteKit, Paraglide i18n, `vi` as the only active locale).

## Language

**Landing page**:
The site's main content hub, at the `trang-chu` route: a hero screen (`#gioi-thieu`) and the 4-topic hub (`#chu-de`) side by side as CSS scroll-snap slides. Each topic has its own URL, `/trang-chu/<folder>`, and every section/item inside it has an anchor (`/trang-chu/<folder>#<section>`), which search results link to. Old `?slide=`/`?folder=`/`?sub=` deep links redirect to these URLs.
_Avoid_: Home page, index

**Cat mascot**:
A recurring illustrated cat character (static PNG poses: happy, waving, etc., under `src/lib/assets/cat/`) used across pages to give the site a warmer, guiding presence. It is a character, not a generic icon.
_Avoid_: Cat icon, logo

**Safety check-in gate**:
A page shown before any other route loads (once per browser session, enforced on the server via a session cookie in `hooks.server.js`, so it also applies without JavaScript) that asks the visitor whether they are having thoughts of self-harm, and routes them to crisis help or on to their originally requested page depending on the answer.
_Avoid_: Consent screen, disclaimer page, chatbox intro (this is the mechanism; "chatbox" describes only its visual styling)

**Hotline hours window**:
The Đường dây nóng Ngày mai crisis hotline's staffed hours: 13:00–20:30, Wednesday through Sunday, Vietnam time (Asia/Ho_Chi_Minh). Outside this window the hotline site (https://duongdaynongngaymai.vn/) exists but isn't staffed; the safety check-in gate still offers a manual link to it, framed accordingly.
