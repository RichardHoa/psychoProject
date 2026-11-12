# MÈO

MÈO is a Vietnamese-language self-help/mental-health resource site (SvelteKit, Paraglide i18n, `vi` as the only active locale).

## Language

**Landing page**:
The site's front door, at `/trang-chu`: the **Landing picker** alone, filling the screen with no navbar (the cat mascot in the navbar on every other page returns to it). Moving from it to the **Journey** page slides sideways; it is a separate page, not a second slide. Every section/item inside a journey step has an anchor (`/hanh-trinh/<step>#<section>`), which search results link to. Older URLs (`/trang-chu/<step>`, `/trang-chu#chu-de`, `?slide=`/`?folder=`/`?sub=`) redirect to the current ones.
_Avoid_: Home page, index

**Journey**:
The guided path through the content: numbered steps in reading order (you are the client → who can help → what happens in the counselling room → choosing a trustworthy professional → where to start looking), plus "Where are you?" shortcuts that start a visitor part-way along. The Journey is its own page (`/hanh-trinh`), and each step page sits under it (`/hanh-trinh/<step>`); "back" or "up" from a step always means the Journey page. Each step page shows its position ("Bước 3 / 7") and ends with the next step and why to read it. In code a step is still a `Folder` in `folderData.js`.
_Avoid_: Folders, topics, 4-topic hub

**Landing picker**:
The Landing page's "Bạn là ai?" questions, one at a time: who the visitor is (a student who has only heard of counselling on social media, a parent looking for help for their child, or someone who already knows what counselling is), then what is worrying them. Picking a worry shows a short answer straight away and the **Trail** behind it. Each answer is a plain link (`?ban-la=<persona>&lo-ve=<concern>`), so it works without JavaScript and "back" steps back one question; the whole Journey is always one tap away. Its content lives in `trailData.js`.
_Avoid_: Quiz, onboarding, wizard

**Trail**:
The 2–3 journey steps worth reading for one worry picked in the **Landing picker**, in the order that answers it, each with the section to read first. While following one (`?lo-trinh=<persona>.<concern>` on a step page) the step shows "Lộ trình của bạn · Phần 2 / 3" instead of its Journey position, and "next" goes to the Trail's next stop, not the Journey's next step. A Trail visits each step at most once. "Thoát lộ trình" and the Journey's next step stay one tap away, so the visitor can leave it at any point.
_Avoid_: Route (clashes with SvelteKit routes), path, playlist

**Short / detailed version**:
Every step page reads in a short version (default) or a detailed one (`?che-do=chi-tiet`), switched by plain links so it works without JavaScript; the choice carries over to the previous/next step. Some sections exist only in the detailed version, and the short one says so.
_Avoid_: Simple mode, expanded view

**Clickable look**:
A hand-drawn border with an offset shadow (Wired card/button) means "this can be pressed". Content is never boxed; only links and buttons get the sketch frame.

**Cat mascot**:
A recurring illustrated cat character (static PNG poses: happy, waving, etc., under `src/lib/cat/`) used across pages to give the site a warmer, guiding presence. It is a character, not a generic icon.
_Avoid_: Cat icon, logo

**Safety check-in gate**:
A page shown before any other route loads (once per browser session, enforced on the server via a session cookie in `hooks.server.js`, so it also applies without JavaScript) that asks the visitor whether they are having thoughts of self-harm, and routes them to crisis help or on to their originally requested page depending on the answer.
_Avoid_: Consent screen, disclaimer page, chatbox intro (this is the mechanism; "chatbox" describes only its visual styling)

**Hotline hours window**:
The Đường dây nóng Ngày mai crisis hotline's staffed hours: 13:00–20:30, Wednesday through Sunday, Vietnam time (Asia/Ho_Chi_Minh). Outside this window the hotline site (https://duongdaynongngaymai.vn/) exists but isn't staffed; the safety check-in gate still offers a manual link to it, framed accordingly.
