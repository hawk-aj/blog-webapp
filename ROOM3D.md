# 3D Room Hero — Reference

The hero section renders a pure CSS 3D room using `perspective` and `preserve-3d`. No WebGL, no canvas — just CSS transforms on `<div>` elements. Source: `portfolio-webapp/frontend/src/components/Room3D.jsx`.

---

## Geometry

The room is a three-sided open box (back wall, left wall, floor). All three planes meet at one inner corner.

| Constant | Value | Role |
|----------|-------|------|
| `BASE_W` | 720 px | Back wall width / floor width |
| `BASE_H` | 480 px | Wall height |
| `BASE_D` | 520 px | Depth (left-wall width / floor depth) |
| `T`      | 32 px  | Rim slab thickness |
| `PERP`   | 89.6°  | Plane-to-plane rotation — avoids z-fighting at exact 90° |

### Plane positions (scene-local)

| Plane | CSS transform | Interior face direction |
|-------|--------------|------------------------|
| Back wall | `translateZ(-D)` | +Z (toward viewer) |
| Left wall | `rotateY(89.6deg)`, origin `left center` | +X (into room) |
| Floor | `translateY(H) rotateX(-89.6deg)`, origin `top center` | −Y (up) |

Each plane also has:
- An **exterior back-face sibling** (solid `CREAM_EDGE`) visible when the cube rotates past 90°
- **Four rim strips** (`CREAM_EDGE`, T px deep) along its edges for slab / Lego thickness
- `backfaceVisibility: hidden` on frame and bulb content so art doesn't bleed through the back

### Transform pivot

`transformOrigin: 50% 50% ${-D/2}px` — rotation pivots around the box centre so the block spins in place.

---

## Input

### Desktop — cursor follow
```
mousemove → target.{rx, ry} = cursor-offset × MAX_ROT + IDLE_{RX,RY}
            target.{px, py} = cursor position in %  (perspectiveOrigin)
rAF loop  → current lerps toward target at factor 0.08 (smooth follow)
           → sceneRef.style.transform updated imperatively (no re-renders)
```

| Constant | Value | Effect |
|----------|-------|--------|
| `MAX_ROT` | 75° | Full cursor-edge swing |
| `IDLE_RX` | −14° | Resting tilt — floor visible |
| `IDLE_RY` | −18° | Resting swing — left wall visible |

**Why negative IDLE values:** left-wall normal is +X; visible to viewer when `sin(RY) < 0` → `RY < 0`. Floor normal is −Y; visible when `sin(RX) < 0` → `RX < 0`.

**No rAF jump on first paint:** the initial JSX `transform` on the scene wrapper already includes `rotateX(IDLE_RX) rotateY(IDLE_RY)`, so there is no snap from flat → rotated on the first animation frame.

### Mobile — swipe-to-rotate + pinch-to-scale
Two independent touch `useEffect`s coexist by checking `touches.length`:

| Gesture | Guard | Action |
|---------|-------|--------|
| Single-finger swipe | `touches.length === 1` | Accumulates pixel-delta × 0.28°/px into `target.rx/ry` from the base rotation at touch-start |
| Two-finger pinch | `touches.length === 2` | Maps `currentDist / startDist` ratio to `scale` state (clamped `[0.28, 1.4]`) |

---

## Scale

`pickScale(vw, vh)` maps viewport width to a CSS scale factor:

| Viewport | Scale range |
|----------|-------------|
| < 640 px  | 0.28 – 0.44 |
| 640–1024 px | 0.45 – 0.70 |
| > 1024 px | 0.55 – 0.90 |

The **stage** element is sized `BASE_W × scale` by `BASE_H × scale`. The **scene** inside it is full `BASE_W × BASE_H` and CSS-scaled, so all child pixel values (frame positions, bulb coordinates, rim widths) stay in unscaled scene-local units.

---

## Lighting

A single warm-yellow bulb hangs from the invisible ceiling at scene-local position `(bulbX=170, bulbDrop=110, bulbZ=−260)`. It is a `translate3d` element with two crossed billboard divs for a pseudo-3D sphere effect.

Each surface has a `radial-gradient` light overlay anchored at the bulb's geometric projection:

| Surface | Overlay origin | Derivation |
|---------|---------------|------------|
| Back wall | `(24%, 23%)` | `(bulbX/W, bulbY/H)` |
| Left wall | `(50%, 23%)` | `(\|bulbZ\|/D, bulbY/H)` |
| Floor | `(24%, 50%)` | `(bulbX/W, \|bulbZ\|/D)` |

Bulb colours: `#FFF6CF → #FBE17A → #D9AE48 → #8A6420` (warm gold tuned to the mosaic_2 floor average).

---

## Content

### Back wall — three individual frames
1. `tree.jpg` (art)
2. Today's xkcd (fetched from **`/api/xkcd`** — Lambda proxy, no CORS issues)
3. `global_warming.jpg` (art)

### Left wall — two frames
1. `kalakaari.jpg` (art)
2. Yesterday's xkcd (same `/api/xkcd` response, `yesterday` key)

### Floor
`mosaic_2.jpg` as `background-image` on the floor plane, with an 18% cream wash and a warm-yellow radial glow from the bulb projection.

---

## xkcd API route

The Lambda function exposes `GET /api/xkcd` which calls `xkcd.com/info.0.json` and `xkcd.com/${num-1}/info.0.json` server-side and returns:

```json
{ "today": { ...xkcd fields... }, "yesterday": { ...xkcd fields... } }
```

Server-to-server calls have no CORS restrictions, making third-party proxy services unnecessary.

---

## Hero layout

| Viewport | Name / title | Tagline + CTAs | Stats blob |
|----------|-------------|----------------|------------|
| Desktop (> 720 px) | `.hero-right-panel` — absolute, overlaps room's right edge | Stacked below badge inside same panel | Bottom-left corner of hero |
| Mobile (≤ 720 px) | `.mobile-identity` — normal flow section below hero | Same section | Bottom-left corner of hero |

The panel `left` is computed in JS: `calc(50% + ${ROOM_BASE_W × roomScale / 2}px)` and updated on resize. `transformX(-50%)` centres the panel on the room's right edge. The parallax scroll handler preserves this with `translateX(-50%) translateY(-${shift}px)`.

Both name card and stats card use a **2 px solid `--accent-pink` divider line** (bottom for name card, top for stats) matching the navbar active-link style.

---

## Performance

- All rotation/scale updates are imperative (`element.style.transform`, `textContent`). React state is never written inside the rAF loop.
- xkcd JSON fetched once on mount and stored in a `useRef`.
- Stats `<pre>` updated every 4 rAF frames via `textContent`.
- **Images must be JPEG ≤ 400 KB** — originals from Gimp exports can be 10–14 MB. Re-export at ≤ 1200 px max-width before placing in `public/`. Current totals: ~830 KB for all four images.

---

## Tuning guide

| Goal | Change |
|------|--------|
| More left-wall at rest | `IDLE_RY` more negative (e.g. −25) |
| More floor at rest | `IDLE_RX` more negative (e.g. −20) |
| Wider cursor swing | Increase `MAX_ROT` |
| Faster follow | Increase lerp factor (default `0.08`) |
| Swipe sensitivity | Change `SENSITIVITY` constant (default `0.28°/px`) |
| Move bulb | Edit `bulbX`, `bulbDrop`, `bulbZ`; update the 3 light overlay origins |
| Replace floor texture | Add JPEG to `public/`, update `FLOOR_SRC` |
| Replace wall art | Add JPEG to `public/`, update `ART` array |
