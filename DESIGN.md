# Design System — Design Revision

> **Direction:** Light cream canvas. Blue typography throughout. Pink and white as accents.
> Clean, uncluttered layout (kawe.ski) with scroll interactions and a floating nav (aither.co).
> Side-stack component for visual interest (feedagency.co concept, different animation).

---

## Palette

| Name    | Hex       | Role                                                    |
|---------|-----------|---------------------------------------------------------|
| Cream   | `#FAF7F2` | Page background — warm off-white, the canvas            |
| Ink     | `#1A2744` | Primary text — deep navy, all headings and body         |
| Cobalt  | `#2E5EF5` | Interactive accent — links, active states, CTAs         |
| Pink    | `#F0527A` | Highlight accent — tags, badges, hover states, underlines |
| Cloud   | `#FFFFFF` | Elevated surfaces — cards, inputs, navbar               |
| Steel   | `#5A7BA8` | Secondary text — supporting copy, timestamps, muted labels |

Light theme. Cream is the canvas; ink reads cleanly on top of it.
No gradients. No dark mode variant in v4 — commit to the light direction.

---

## Token Map

### Backgrounds
| Token           | Value                    | Description                           |
|-----------------|--------------------------|---------------------------------------|
| `--bg-primary`  | `#FAF7F2`                | Main page background (cream)          |
| `--bg-surface`  | `#FFFFFF`                | Cards, panels — pure white lift       |
| `--bg-elevated` | `rgba(250,247,242,0.85)` | Frosted cream — floating navbar fill  |
| `--bg-tint`     | `rgba(46,94,245,0.05)`   | Cobalt tint — hover states on cards   |

### Borders
| Token             | Value                       | Description                          |
|-------------------|-----------------------------|--------------------------------------|
| `--border`        | `rgba(26,39,68,0.12)`       | Ink-tinted, subtle                   |
| `--border-subtle` | `rgba(26,39,68,0.06)`       | Dividers, fine lines                 |
| `--border-accent` | `rgba(240,82,122,0.40)`     | Pink — active card borders, focus    |

### Text
| Token              | Value                       | Description                          |
|--------------------|-----------------------------|--------------------------------------|
| `--text-primary`   | `#1A2744`                   | Ink — headings and body              |
| `--text-secondary` | `#5A7BA8`                   | Steel — supporting text              |
| `--text-muted`     | `rgba(90,123,168,0.60)`     | Muted steel — timestamps, hints      |
| `--text-inverse`   | `#FFFFFF`                   | White — text on cobalt/pink fills    |

### Accent
| Token              | Value                       | Description                          |
|--------------------|-----------------------------|--------------------------------------|
| `--accent-blue`    | `#2E5EF5`                   | Cobalt — primary interactive color   |
| `--accent-blue-hover` | `#1A4AD4`               | Deepened cobalt for hover            |
| `--accent-pink`    | `#F0527A`                   | Pink — highlights, badges, tags      |
| `--accent-pink-hover` | `#D63D64`               | Deepened pink for hover              |

### Shadows
Softer than v3 — light themes need lighter shadows.

| Token         | Value                                   |
|---------------|-----------------------------------------|
| `--shadow-sm` | `0 1px 4px rgba(26,39,68,0.08)`         |
| `--shadow-md` | `0 4px 16px rgba(26,39,68,0.10)`        |
| `--shadow-lg` | `0 8px 32px rgba(26,39,68,0.12)`        |
| `--shadow-float` | `0 8px 40px rgba(26,39,68,0.14)`     |

---

## Typography

Two-family pairing: display serif for headings, humanist sans for body.

| Role           | Family               | Weight    | Notes                              |
|----------------|----------------------|-----------|------------------------------------|
| Display / H1   | `DM Serif Display`   | 400       | Elegant, editorial feel            |
| Headings H2–H4 | `DM Serif Display`   | 400       | Slightly smaller scale             |
| Body           | `Inter`              | 400 / 500 | Existing — keep for consistency    |
| Mono / code    | `JetBrains Mono`     | 400       | Existing — keep                    |

### Type Scale
| Token      | Size     | Weight | Usage                         |
|------------|----------|--------|-------------------------------|
| `--t-xs`   | `0.75rem`| 500    | Labels, badges, timestamps    |
| `--t-sm`   | `0.875rem`| 400   | Secondary body, captions      |
| `--t-base` | `1rem`   | 400    | Body text                     |
| `--t-lg`   | `1.25rem`| 500    | Subheadings, card titles      |
| `--t-xl`   | `1.75rem`| 400    | Section titles (DM Serif)     |
| `--t-2xl`  | `2.5rem` | 400    | Page titles (DM Serif)        |
| `--t-3xl`  | `3.5rem` | 400    | Hero headline (DM Serif)      |

Typography is blue (`--text-primary` ink) everywhere by default.
Pink (`--accent-pink`) is used for inline highlights, underlines, and tags only — not body text.

---

## Components

### Navbar — Floating
Inspired by aither.co. The navbar detaches from the top on scroll and floats as a pill.

- **Resting state** (at top of page): full-width, transparent, no border
- **Floating state** (on scroll > 60px):
  - Shrinks to a centered pill, max-width ~700px
  - Background: `--bg-elevated` (`rgba(250,247,242,0.85)`) with `backdrop-filter: blur(16px)`
  - Border: `1px solid rgba(26,39,68,0.10)`
  - Shadow: `--shadow-float`
  - Subtle scale transition: `0.3s ease`
- Text: `--text-primary` (ink)
- Active link: `--accent-pink` underline (2px, offset 4px) — not a color change, just an underline
- Hover: `--accent-blue` text transition `0.15s`
- Logo: ink text, no accent character (cleaner than v3)

### Hero
- Background: `--bg-primary` (cream) — flat canvas behind the 3D room
- **3D room** centred at ~50% viewport width/height — see `ROOM3D.md` for full spec
- **Name card** (right of room, overlapping its right edge):
  - Flat card with 22% cream backdrop-blur, no blob shape
  - Name: `DM Serif Display`, `clamp(1.6rem, 2.5vw, 2.2rem)`, ink
  - Title: `Inter`, `clamp(0.8rem, 0.95vw, 0.92rem)`, steel
  - Bottom divider: 2px solid `--accent-pink` (same as navbar active underline)
  - `filter: drop-shadow(0 10px 28px rgba(26,39,68,0.13))`
- **Tagline + CTAs** stacked directly below the name card, right-aligned
  - Tagline: `--font-mono`, `--t-sm`, `--text-muted`; slight cream text-shadow for legibility over the room
  - CTA primary: cobalt fill, white text; hover → `--accent-blue-hover`
  - CTA outline: ink border + ink text; hover → cobalt border + cobalt text
- **Stats-for-nerds card** (bottom-left of hero):
  - Flat card, 22% cream backdrop-blur, no blob
  - Top divider: 2px solid `--accent-pink`
  - `filter: drop-shadow(0 10px 24px rgba(26,39,68,0.12))`
  - Content: live fps, cursor %, rotation, scale, current xkcd number in `--font-mono`
- **Mobile (≤ 720 px):**
  - Hero compacts to `min(56vw, 70vh)` — room visible without full-screen lock
  - Name card + tagline + CTAs move below the hero in normal scroll flow
  - Room still renders (all images are JPEG ≤ 400 KB)
  - Single-finger swipe rotates the room; two-finger pinch scales it

### Buttons
- **Primary** — `#2E5EF5` fill, white text; hover → `#1A4AD4`; border-radius: `8px`
- **Outline** — `#1A2744` border + text; hover → cobalt border + cobalt text
- **Ghost** — transparent, steel text; hover → cobalt text, cobalt-tinted bg
- **Danger** — pink fill at 12% opacity, pink text; hover → pink fill 20%

### Cards
- Background: `#FFFFFF` (cloud)
- Border: `--border` (ink 12%)
- Border-radius: `12px`
- Shadow: `--shadow-sm` resting; `--shadow-md` on hover
- Hover border: `--accent-pink` (`rgba(240,82,122,0.40)`)
- Hover bg: `--bg-tint` (cobalt 5%)
- Transition: `0.2s ease`

### Side-Stack Component
Inspired by feedagency.co stacked layout, but animated differently.
Used on the Work/Experience section — cards are stacked with a visible offset, each one
sliding into place and the previous one receding as you scroll down through the section.

- **Layout:** Cards are position-sticky within a tall scroll container
- **Stacking behaviour:**
  - Card enters from bottom, previous card scales down to `0.95` and moves up by `24px`
  - Each card has a `z-index` increment so the latest is always on top
  - Stack peek: previous cards show their top edge (~60px) behind the active card
  - **Animation diff from feedagency:** They use horizontal slide; ours uses vertical scale-and-recede
- **Card appearance:** White surface, pink left accent bar (4px), ink title, steel body
- **Stack depth visual:** Cards behind active drop to `opacity: 0.6` so stack depth is readable
- Limit stack depth to 3 visible cards max; older ones disappear

### Section Titles
- Font: `DM Serif Display`, `--t-xl`
- Color: `--text-primary` (ink)
- Optional: a short pink underline decoration (2px, 40px wide) beneath the title

### Experience Cards (within Side-Stack)
- Left accent bar: `--accent-pink` (pink) — 4px solid
- Company: ink, `--t-lg`
- Duration badge: cloud bg, ink border, steel text
- Bullet descriptions: body size, steel

### Blog Cards
- Tags: `rgba(240,82,122,0.10)` bg, `--accent-pink` border, pink text
- Title hover: cobalt

### Rambling Cards
- Left quote border: `--accent-pink` (pink)
- Mood badge: cobalt at 10% bg, cobalt text, cobalt border

### Skills
- Pill: cloud bg, ink border 12%, ink text
- Hover: cobalt fill, white text

### Contact Form
- Input bg: `#FFFFFF` (cloud)
- Border: `--border` (ink 12%)
- Focus border: `--accent-cobalt` (cobalt)
- Focus ring: `rgba(46,94,245,0.15)`
- Label: steel, uppercase, `--t-xs`

### Scrollbar
- Track: cream
- Thumb: `rgba(26,39,68,0.15)` (ink-tinted)
- Thumb hover: `--accent-pink`

---

## Scroll Interactions

Three distinct patterns — use deliberately, not on every element.

### 1. Section Reveal (all pages)
Elements enter the viewport with a subtle fade + upward translate.
- Initial state: `opacity: 0`, `transform: translateY(20px)`
- Triggered state: `opacity: 1`, `transform: translateY(0)`
- Duration: `0.5s`, easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Stagger children by `80ms` intervals
- Use `IntersectionObserver` with `threshold: 0.15`

### 2. Side-Stack Scroll (Experience/Work section)
Described above under the Side-Stack Component.
The section container has a height of `100vh × (n cards + 1)`.
Cards are `position: sticky`, top-aligned at `10vh`.
Scroll progress within the section drives the scale + translate values via JS scroll handler.

### 3. Parallax Hero Elements (Home page only)
Headline and subheading shift at different rates on scroll.
- Headline: `translateY(scrollY × 0.15)` (slowest)
- Subheading: `translateY(scrollY × 0.25)`
- CTA: `translateY(scrollY × 0.35)` (fastest, exits earliest)
- Keep subtle — max 60px shift before clamping
- Do not apply to background (flat cream, no parallax needed)

---

## Layout

- **Max content width:** `1100px`, centered
- **Page padding:** `0 clamp(1.5rem, 5vw, 4rem)`
- **Section vertical spacing:** `120px` top/bottom (desktop), `80px` (mobile)
- **Grid:** 12-column, `gap: 24px`; most content uses 8/12 or 6/12 centered columns
- No full-bleed color blocks between sections — cream runs edge to edge, sections are
  distinguished by spacing and typography alone (kawe.ski influence — uncluttered)

---

## What changed from the previous design

| Previous design | This revision |
|---|---|
| Dark maroon background `#723d46` | Light cream background `#FAF7F2` |
| Cream text `#ffe1a8` | Ink (deep navy) text `#1A2744` |
| Coral accent `#e26d5c` | Cobalt blue accent `#2E5EF5` |
| Sage secondary `#c9cba3` | Steel secondary `#5A7BA8` |
| Espresso surfaces `#472d30` | White/cloud surfaces `#FFFFFF` |
| No scroll interactions | Section reveal + side-stack + parallax hero |
| Fixed inline navbar | Floating pill navbar on scroll |
| No display font | DM Serif Display for headings |
| No side-stack component | Side-stack for Experience section |
