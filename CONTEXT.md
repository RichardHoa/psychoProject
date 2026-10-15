# MÈO

MÈO is a Vietnamese-language self-help/mental-health resource site (SvelteKit, Paraglide i18n, `vi` as the only active locale).

## Language

**Landing page**:
The site's front door, at `/trang-chu`: the hero (title, search, "start the journey"), which the cat mascot in the navbar always returns to, at the top. Moving from it to the **Journey** page slides sideways; it is a separate page, not a second slide. Every section/item inside a journey step has an anchor (`/hanh-trinh/<step>#<section>`), which search results link to. Older URLs (`/trang-chu/<step>`, `/trang-chu#chu-de`, `?slide=`/`?folder=`/`?sub=`) redirect to the current ones.
_Avoid_: Home page, index

**Journey**:
The guided path through the content: numbered steps in reading order (you are the client → who can help → what happens in the counselling room → choosing a trustworthy professional → where to start looking), plus "Where are you?" shortcuts that start a visitor part-way along. The Journey is its own page (`/hanh-trinh`), and each step page sits under it (`/hanh-trinh/<step>`); "back" or "up" from a step always means the Journey page. Each step page shows its position ("Bước 3 / 7") and ends with the next step and why to read it. In code a step is still a `Folder` in `folderData.js`.
_Avoid_: Folders, topics, 4-topic hub

**Short / detailed version**:
Every step page reads in a short version (default) or a detailed one (`?che-do=chi-tiet`), switched by plain links so it works without JavaScript; the choice carries over to the previous/next step. Some sections exist only in the detailed version, and the short one says so.
_Avoid_: Simple mode, expanded view

**Clickable look**:
A hand-drawn border with an offset shadow (Wired card/button) means "this can be pressed". Content is never boxed; only links and buttons get the sketch frame.

**Cat mascot**:
A recurring illustrated cat character (static PNG poses: happy, waving, etc., under `src/lib/assets/cat/`) used across pages to give the site a warmer, guiding presence. It is a character, not a generic icon.
_Avoid_: Cat icon, logo

**Safety check-in gate**:
A page shown before any other route loads (once per browser session, enforced on the server via a session cookie in `hooks.server.js`, so it also applies without JavaScript) that asks the visitor whether they are having thoughts of self-harm, and routes them to crisis help or on to their originally requested page depending on the answer.
_Avoid_: Consent screen, disclaimer page, chatbox intro (this is the mechanism; "chatbox" describes only its visual styling)

**Hotline hours window**:
The Đường dây nóng Ngày mai crisis hotline's staffed hours: 13:00–20:30, Wednesday through Sunday, Vietnam time (Asia/Ho_Chi_Minh). Outside this window the hotline site (https://duongdaynongngaymai.vn/) exists but isn't staffed; the safety check-in gate still offers a manual link to it, framed accordingly.
