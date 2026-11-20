---
name: MÈO — Calm Sketchbook Design System
description: A quiet, friendly, hand-drawn visual language for a Vietnamese counselling-navigation site, designed so that nothing on screen startles, rushes or judges the visitor.
version: 2.0.0
tokens:
  # Mirrors the @theme block in src/routes/layout.css. Change both together.
  colors:
    backdrop: '#EDE8DF' # outside the content column
    background: '#FAF8F5' # page paper
    background-soft: '#F4EFEA'
    surface-off-white: '#FCFBF9' # bars, headers
    white: '#FFFFFF' # clickable rows and cards
    warm-cream: '#FAF4E8' # the cat's speech, hints
    warm-sage: '#E8F0EA' # gentle "go" / selected
    warm-amber: '#FEF6E4' # tips, "good to know"
    warm-terracotta: '#FAECE9' # care / crisis surfaces
    primary: '#1F523D' # deep sage: links, actions, focus
    primary-light: '#2D6E54'
    primary-container: '#E4EFE8'
    tertiary: '#8B4D3E' # small eyebrow labels only
    text-main: '#242B28' # soft charcoal, never pure black
    text-subtle: '#5C6662'
    sketch-border: '#242B28' # the pencil line
    emergency-red: '#B8403B' # crisis help only (see Colour)
  typography:
    family: "'Be Vietnam Pro', 'Be Vietnam Pro Fallback', system-ui, sans-serif"
    body-size: '1rem' # never smaller for reading text
    small-size: '0.875rem' # hints, metadata
    heading-size: '1.25rem' # section headings, questions
    title-size: '1.5rem' # one page title
    line-height-body: 1.65 # room for stacked Vietnamese diacritics
    line-height-heading: 1.3
    measure: '65ch'
    weights: { body: 400, emphasis: 600, label: 700, heading: 800 }
  shape:
    radius-card: '1rem'
    radius-control: '0.75rem'
    radius-pill: '9999px'
  spacing:
    gutter: '24px'
    gutter-phone: '20px'
    section-gap: '60px'
    touch-target: '48px'
    content-max: '1200px'
    reading-column: '24rem' # landing picker, safety gate
  sketch:
    roughness: 1.1
    bowing: 0.8
    stroke-width: 1.6
    shadow-offset: '2px 2px' # 3px on hover, 1px on press
  motion:
    fast: '120ms' # press feedback
    base: '300ms' # fades
    slow: '400ms' # page slides, entrances
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)' # ease-out, no overshoot
---

# MÈO Design System — Calm Sketchbook

MÈO helps Vietnamese young people and their families understand counselling: what it is, who
can help, and how to find someone trustworthy. Many visitors arrive anxious, embarrassed, or in a
hard moment. **The design's job is to lower their heart rate, not raise it.** Every rule below
serves one test:

> Would this feel safe and kind to someone who opened the site at 1 a.m. after a bad day?

If a choice makes the page louder, faster, more clinical or more demanding, it fails that test.

---

## 1. Who we design for

The Landing picker ("Bạn là ai?") names our three main visitors. Design decisions should be
checked against all three.

| Visitor | Who they are | What they feel arriving | What the design must do |
| --- | --- | --- | --- |
| **Học sinh** — "Mình là học sinh" | Teenagers who have only heard of counselling on social media. On a phone, often late at night, often in private. | Sadness, worry, exam pressure; afraid of being labelled "sick"; afraid parents or teachers will find out. | Feel like a friend, not a clinic. Short text, one question at a time, no judgement. Nothing that looks like a test, a score, or a diagnosis. Discreet enough to read in a classroom. |
| **Phụ huynh** — "Mình là phụ huynh" | Parents looking for help for their child. Less used to "app" patterns; may read on a phone at arm's length. | Worry, guilt, not knowing who to trust, unsure if the child's behaviour is "serious". | Trustworthy and plain. Larger readable text, clear labels instead of icon-only controls, obvious next step, no jargon without a gloss. Warm, but grown-up — never cutesy to the point of seeming unserious. |
| **Đã biết về tham vấn** — international/overseas students, international-school students | Already know what counselling is; often bilingual; comparing options (counselor vs psychologist vs psychiatrist). | Impatient with basics; may be unhappy with current help; want specifics. | Let them skip ahead: the full Journey is always one tap away, the detailed version is a link away, and English terms appear alongside Vietnamese where they help. |

Shared needs across all three: **privacy, control, and an easy way out** — of a trail, of a
section, of the site.

---

## 2. Principles

1. **Quiet first.** One idea per screen region, generous space, soft colours. If two things
   compete for attention, remove one.
2. **The visitor is in control.** Nothing moves, plays, redirects or times out without their
   say-so. Every flow can be left, paused, or reversed ("Quay lại", "Thoát lộ trình").
3. **Friendly, not childish.** The cat mascot and hand-drawn lines bring warmth; the words and
   layout stay clear and respectful so parents trust it too.
4. **Never alarming.** No flashing, pulsing, shaking, red banners, countdowns, or "WARNING"
   styling — including for crisis help, which is presented as a caring offer, not an alarm.
5. **Gentle honesty.** Sensitive topics are named plainly and introduced softly; we never hide
   help, and we never use fear to push someone toward it.
6. **Works for everyone.** Readable without JavaScript, on cheap phones, slow networks, with
   reduced motion, with a screen reader, and with the text zoomed to 200%.

---

## 3. Colour

The palette is **warm paper + deep sage + pencil charcoal**, with soft pastel washes. Sage is
the colour of calm and growth; warm off-whites avoid the cold glare of pure white screens.

### Roles

- **Paper** (`background`, `background-soft`, `backdrop`): page and column backgrounds.
- **White** (`white`): only for things you can press — rows in the picker, cards that link.
  Being slightly brighter than the paper is part of the "clickable look".
- **Washes** (`warm-cream`, `warm-sage`, `warm-amber`, `warm-terracotta`): soft tinted
  backgrounds that group content by mood:
  - cream — the cat speaking, hints, gentle notes
  - sage — reassurance, "you're on the right track", selected state
  - amber — tips and "good to know"
  - terracotta — care and safety topics (confidentiality limits, crisis help)
- **Primary** (`primary`): links, primary buttons, icons that mean "go", focus rings. Use it
  sparingly so it stays meaningful.
- **Text** (`text-main`, `text-subtle`): soft charcoal, never `#000`. Subtle text is for
  secondary information only, never for instructions the visitor needs.
- **Tertiary** (`tertiary`): small eyebrow labels ("BƯỚC 3 / 7"). Not for body text.

### The red rule

`emergency-red` exists for **one purpose: pointing to urgent human help** (the hotline, "Có" on
the safety check-in, crisis contacts). It is used as text or an icon colour on a terracotta
wash, or as a solid button for the single most important crisis action.

Never use red for:
- form validation, empty search results, or "you did something wrong" states — use calm
  `text-subtle` copy instead ("Chưa tìm thấy kết quả — thử từ khác nhé");
- recording / listening indicators (use `primary` or `warm-sage`);
- decoration, badges, counts, or emphasis in ordinary content.

Red is never animated (no pulse, blink, or shake).

### Contrast

All text meets WCAG AA (4.5:1 for body, 3:1 for ≥ 18.66px bold). Pairs already verified:
`text-main` on every surface; `primary` on paper and washes; `emergency-red` on
`error-container` (4.65:1); white on `emergency-red` (5.48:1). New pairs must be checked before
use and noted next to the token in `layout.css`.

### Not in this palette

Neon or saturated colours, gradients that shimmer or shift, black backgrounds, and
"medical" blue-and-white. A dim night palette is a possible future addition (many students read
late at night); until then the site stays in its light scheme (`color-scheme: light`).

---

## 4. Typography

- **Typeface:** Be Vietnam Pro for everything. It was designed for Vietnamese and renders
  diacritics cleanly. The metric-matched Arial fallback keeps the layout steady while it loads.
- **Sizes:** one scale for the whole site, and only these four exist (`@theme` in
  `layout.css` clears Tailwind's others): `text-sm` 0.875rem for hints and metadata, `text-base`
  1rem for all reading text (item titles too, in 600), `text-xl` 1.25rem for section headings and
  questions, `text-2xl` 1.5rem for the one page title. Nothing smaller than `text-sm`. Make a
  screen calmer with space, not with a bigger or smaller font.
- **Line height:** 1.65 for body text, so stacked accents (ẫ, ệ, ở) never collide with the line
  above. Headings 1.3.
- **Measure:** keep paragraphs under ~65 characters wide.
- **Weight:** headings 700, labels and button text 600, emphasis 500, body 400 (only these
  are loaded). Be Vietnam Pro runs heavy, so nothing goes above 700 — a page full of heavy type
  feels like shouting.
- **Case:** sentence case everywhere. Uppercase only for tiny eyebrow labels of one to three
  words (with letter-spacing); long uppercase Vietnamese is hard to read.
- **Balance:** use `text-balance` on headings and short centred text so lines don't leave a
  lonely last word.

---

## 5. Voice and words

Design includes the words. The voice is a **kind older friend**: warm, plain, unhurried.

- Address the visitor as **"bạn"** and speak as **"mình"**. Never "người bệnh" or "bệnh nhân";
  say **"thân chủ"** or simply "bạn".
- Short sentences. One idea each. Explain a term the first time it appears.
- Validate before informing: "Cảm thấy như vậy là bình thường" comes before the facts.
- Offer, don't order: "Bạn có thể…", "Nếu bạn muốn…" rather than "Hãy…!" / "Phải…".
- No exclamation-mark urgency, no guilt ("Đừng bỏ lỡ!"), no scare statistics.
- Never describe methods of self-harm, and never use graphic or stigmatising words ("điên",
  "tâm thần" as an insult).
- Before a section about suicide, abuse or crisis, a one-line soft heads-up on a terracotta wash
  lets the visitor choose to read on or skip.

---

## 6. Shape and the hand-drawn line

The sketchbook look (rough.js / Wired-style lines) makes the site feel human and handmade, like a
journal rather than a hospital form.

- **Clickable look:** a hand-drawn border with a small offset shadow means *this can be
  pressed*. Only links and buttons get it. Content is never boxed in a sketch frame — so the
  visitor can always tell what is interactive at a glance.
- **Seeds:** each sketched element has a fixed seed, so its wobble is identical on every render.
  Lines never redraw or jitter on hover — movement of the outline itself is unsettling.
- **Hover / press:** only the shadow layer moves (2px → 3px on hover, → 1px on press). Small,
  physical, predictable.
- **Corners:** soft. Cards `1rem`, controls `0.75rem`, chips fully round. No sharp corners on
  anything the visitor touches.
- **Line weight:** 1.5–1.8px charcoal. Lighter (`sketch-border` at ~25% opacity) for dividers.
- **Content blocks** use a wash background and rounded corners, not borders.

---

## 7. Layout and spacing

- **Phone first.** Most visitors — especially students — are on a phone. Design at 360px, then
  widen.
- **One column for decisions.** The Landing picker and the safety check-in use a narrow
  centred column (`24rem`) with one question at a time. Fewer choices visible = less pressure.
- **Breathing room:** 20px side gutter on phones, 24px wider up; 60px between major sections.
  When a screen feels busy, add space before shrinking anything.
- **Touch targets:** at least 48px tall, with at least 8px between adjacent targets.
- **Predictable places:** back / exit links sit top-left; the next step sits at the bottom of the
  reading. The cat mascot in the navbar always returns to the Landing page.
- **No dead ends:** every page ends with a gentle next step and keeps the Journey one tap away.

---

## 8. Motion

Motion should feel like a slow exhale.

- **Allowed:** fades (≈300ms), short upward settles of ≤12px (≈400ms), the sideways slide
  between the Landing page and the Journey (≈350ms), 1–2px press feedback. All ease-out with no
  overshoot or bounce.
- **Not allowed:** pulsing, blinking, shaking, spinning, parallax, autoplaying carousels,
  confetti, attention-grabbing loops, or anything that moves while the visitor is reading.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, travel becomes a plain fade or
  nothing; page slides and view transitions turn off. Press feedback may stay.
- **No hurry:** no countdowns, progress pressure or auto-advance. If something must move on by
  itself (e.g. a confirmation leading to the next page), it waits long enough to read, shows a
  link to go now, and never cuts off text mid-read.
- **Breathing exercise:** its expanding/contracting shape is the one slow loop on the site. It
  only starts when the visitor starts it, and stops when asked.

---

## 9. The cat mascot

The cat is a character, not a logo: a small companion who guides, waves and reassures.

- Use the happy, waving and open-eyed poses. The cat is never shown sad, crying, hurt or
  frightened — visitors bring enough of that themselves.
- It speaks in the cream speech-bubble style, in the same "mình / bạn" voice.
- At most one cat per screen region, sized as a companion (≈ 40–120px), never covering content.
- It never blocks crisis information or appears inside it as a joke. On crisis content it may sit
  alongside quietly, or not at all.
- Decorative cats have `alt=""`; a cat that carries meaning gets a short description.

---

## 10. Imagery and icons

- Icons are the same rough, hand-drawn line style (`RoughIcon`), charcoal or primary, 16–20px,
  always paired with a text label for anything important (parents should never have to guess an
  icon).
- No photographs of distressed people, no hospital or pill imagery, no blood, ropes, heights,
  water, or other self-harm-associated imagery — even as metaphor.
- Prefer soft, abstract or nature motifs (leaves, paths, windows, tea) when illustration is
  needed.

---

## 11. Components

### Choice row (Landing picker)
White fill, sketch border, full width, ≥ 56px tall. Bold label, optional subtle hint underneath,
a primary arrow on the right. The whole row is the link. One question's rows per screen.

### Primary button
Primary fill, white text, sketch border and shadow, rounded `0.75rem`. One per screen region.

### Secondary button / link
Cream or sage fill with charcoal text, or a plain primary-coloured text link with an arrow.

### Answer / takeaway card
Sage wash, no border, rounded `1rem`. A short title and 2–3 points. Reassurance first.

### Tip / note
Amber wash, small icon, one or two sentences.

### Care note (sensitive topic heads-up)
Terracotta wash, `text-main` copy, a "Đọc tiếp" / "Bỏ qua phần này" choice. No warning icon,
no red heading.

### Crisis help block
Terracotta wash. A calm heading ("Luôn có người sẵn sàng lắng nghe bạn"), the hotline as a
large tap-to-call / tap-to-open action, its staffed hours in plain text (13:00–20:30, Thứ Tư –
Chủ nhật), and what to do outside those hours. The phone action may be the single solid
`emergency-red` button on the page. Never pulsing, never full-screen takeover.

### Safety check-in gate
A chat-like conversation with the cat in a narrow column. Messages appear one at a time with
gentle fades. "Có" and "Không" are equal-sized, equal-weight choices — the design must not nudge
either answer. Choosing "Có" leads to the crisis help block with warmth, not alarm.

### Trail header
Shows "Lộ trình của bạn · Phần 2 / 3" with a calm progress indication (dots or a thin line, no
percentages) and "Thoát lộ trình" always visible.

### Step reader
Short version by default; the detailed version is a link away. Section headings are anchors;
a deep-linked section is marked with a soft dashed primary outline, not a flash.

### Search
Sage-tinted controls. "No results" is a friendly sentence with a suggestion, never an error
colour. The voice-search "listening" state uses primary/sage, not red.

### Usage hints
Cream card at the bottom, small, dismissible, fades out by itself after a few seconds and never
returns in the same visit.

---

## 12. Accessibility checklist

- [ ] Body text ≥ 16px, line-height ≥ 1.6, contrast AA.
- [ ] Every interactive element ≥ 48px, has a visible focus ring (2px `primary`, 2px offset).
- [ ] Works without JavaScript: picker answers, short/detailed switch, safety gate are plain
      links/forms.
- [ ] Respects `prefers-reduced-motion`.
- [ ] Icons that mean something have text labels or `aria-label`.
- [ ] Live regions (`aria-live="polite"`) for content that changes in place — never
      `assertive`.
- [ ] Usable at 200% zoom and at 320px width without horizontal scrolling.
- [ ] Nothing flashes more than never.

---

## 13. Review checklist for any new screen

1. Would a worried student, a worried parent, and an informed student each know what to do next?
2. Is there exactly one obvious primary action, and an easy way back or out?
3. Is anything red that isn't crisis help? Is anything pulsing, shaking or counting down?
4. Is any text smaller than 16px that someone actually needs to read?
5. Do the words judge, label, or rush the visitor?
6. Is anything boxed in a sketch frame that isn't clickable?
7. Does it still feel calm with reduced motion, no JavaScript, and a slow connection?
