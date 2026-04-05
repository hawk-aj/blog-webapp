# Design System — v3

Palette source: [coolors.co/palette/c9cba3-ffe1a8-e26d5c-723d46-472d30](https://coolors.co/palette/c9cba3-ffe1a8-e26d5c-723d46-472d30)

---

## Palette

| Name     | Hex       | Role                                               |
|----------|-----------|----------------------------------------------------|
| Espresso | `#472d30` | Navbar, sidebar, deepest surfaces                  |
| Maroon   | `#723d46` | Primary background — every page                    |
| Coral    | `#e26d5c` | Accent — buttons, links, highlights, active states |
| Cream    | `#ffe1a8` | Primary text, headings, logo                       |
| Sage     | `#c9cba3` | Secondary text, muted labels, tags                 |

Dark theme. Maroon is the canvas; cream reads on top of it.
No gradients anywhere.

---

## Token Map

### Backgrounds
| Token           | Value                       | Description                              |
|-----------------|-----------------------------|------------------------------------------|
| `--bg-primary`  | `#723d46`                   | Main page background (maroon)            |
| `--bg-surface`  | `rgba(255,255,255,0.07)`    | Cards — slightly lighter lift over bg    |
| `--bg-elevated` | `rgba(0,0,0,0.20)`          | Inputs — recessed/darker than bg         |
| `--bg-deep`     | `#472d30`                   | Navbar, sidebar, footer-level depth      |

### Borders
| Token             | Value                        | Description              |
|-------------------|------------------------------|--------------------------|
| `--border`        | `rgba(201,203,163,0.20)`     | Sage-tinted, subtle      |
| `--border-subtle` | `rgba(201,203,163,0.10)`     | Dividers, fine lines     |

### Text
| Token              | Value                        | Description                     |
|--------------------|------------------------------|---------------------------------|
| `--text-primary`   | `#ffe1a8`                    | Cream — headings and body       |
| `--text-secondary` | `#c9cba3`                    | Sage — supporting text          |
| `--text-muted`     | `rgba(201,203,163,0.60)`     | Muted sage — timestamps, hints  |

### Accent
| Token            | Value     | Description                           |
|------------------|-----------|---------------------------------------|
| `--accent`       | `#e26d5c` | Coral — buttons, links, active states |
| `--accent-hover` | `#d4574a` | Darkened coral for hover              |
| `--accent-deep`  | `#472d30` | Espresso — maximum depth              |

### Shadows
Shadows tinted with espresso, heavier than a light theme needs.

| Token         | Value                                    |
|---------------|------------------------------------------|
| `--shadow-sm` | `0 1px 4px rgba(71,45,48,0.50)`          |
| `--shadow-md` | `0 4px 16px rgba(71,45,48,0.60)`         |
| `--shadow-lg` | `0 8px 32px rgba(71,45,48,0.70)`         |

---

## Components

### Navbar
- Background: `#472d30` (espresso) — solid, no blur
- Text: `#ffe1a8` (cream)
- Active link: `#e26d5c` (coral) text
- Hover: `rgba(255,255,255,0.08)` bg pill
- Logo accent character: `#e26d5c` (coral)
- Border-bottom: `rgba(201,203,163,0.12)`

### Hero
- Background: `#723d46` (maroon) — flat, no pseudo-elements
- Title: `#ffe1a8` (cream)
- Subtitle: `#c9cba3` (sage)
- Tagline: `rgba(201,203,163,0.60)` (muted sage)
- Floating icons: sage at 12% opacity
- CTA primary: coral fill, cream text
- CTA outline: cream border + text; hover → coral border + text

### Buttons
- **Primary** — `#e26d5c` fill, `#ffe1a8` cream text; hover → `#d4574a`
- **Outline** — transparent, `#ffe1a8` border + text; hover → coral border + coral text

### Cards
- Background: `rgba(255,255,255,0.07)` over maroon (renders ~`#7e4b54`)
- Border: `rgba(201,203,163,0.20)`
- Hover border: `#e26d5c` (coral)
- Hover shadow: espresso-tinted

### Section Titles (`.section-title`)
- Color: `#ffe1a8` (cream) — solid

### Experience Cards
- Left accent bar: `#e26d5c` (coral) solid
- Duration badge: espresso bg, sage border, sage text

### Blog Cards
- Tags: coral at 15% opacity bg, coral border, sage text

### Rambling Cards
- Left quote border: `#e26d5c` (coral)
- Mood badge: coral 15% bg, sage text, coral border

### Skills
- Pill: espresso bg, sage border, sage text
- Hover: coral fill, cream text

### Contact Form
- Input bg: `rgba(0,0,0,0.20)` (recessed)
- Focus border: `#e26d5c`
- Focus ring: `rgba(226,109,92,0.25)`

### Scrollbar
- Track: maroon
- Thumb: `rgba(201,203,163,0.30)` (sage)
- Thumb hover: `#e26d5c` (coral)

### Spinner
- Track: `rgba(201,203,163,0.20)`
- Active arc: `#e26d5c` (coral)

---

## Admin Panel
Follows the same dark theme:
- Sidebar: `#472d30` (espresso), cream text, coral active
- Content area: `#723d46` (maroon)
- Cards: rgba lift over maroon
- Inputs: recessed dark
- Primary button: coral; ghost: sage-outlined; danger: coral-tinted

---

## What was removed / changed from v2
- Light cream background → dark maroon background
- Teal text → cream text (with sage for secondary)
- Amber accent → coral accent
- All remaining gradient references removed
- Shadows are heavier (dark themes need deeper shadows)
