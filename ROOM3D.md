# 3D Room Hero — Reference

The hero section of the home page renders a pure CSS 3D room using `perspective` and `preserve-3d`. No WebGL, no canvas — just CSS transforms on `<div>` elements.

---

## Geometry

The room is a three-sided open box (back wall, left wall, floor). All three planes meet at one inner corner.

| Constant | Value | Role |
|----------|-------|------|
| `BASE_W` | 720 px | Back wall width / floor width |
| `BASE_H` | 480 px | Wall height |
| `BASE_D` | 520 px | Depth (left-wall width / floor depth) |
| `T`      | 32 px  | Rim slab thickness |
| `PERP`   | 89.6°  | Plane-to-plane rotation (not exactly 90° — avoids z-fighting seams) |

### Plane positions (scene-local)

| Plane | CSS transform | Interior face direction |
|-------|--------------|------------------------|
| Back wall | `translateZ(-D)` | +Z (toward viewer) |
| Left wall | `rotateY(89.6deg)`, origin `left center` | +X (into room) |
| Floor | `translateY(H) rotateX(-89.6deg)`, origin `top center` | −Y (up) |

Each plane also has:
- An exterior back-face sibling (solid `CREAM_EDGE`) for opacity when the cube is rotated past 90°
- Four rim strips (also `CREAM_EDGE`) along its edges to give slab/Lego thickness

### Transform pivot

`transformOrigin: 50% 50% ${-D/2}px` — rotation is around the box centre, so the block appears to spin in place rather than swing from one edge.

---

## Cursor tracking

```
mousemove → target.{rx, ry} = cursor-offset × MAX_ROT + IDLE_{RX,RY}
            target.{px, py} = cursor position in %  (perspectiveOrigin)
rAF loop  → current lerps toward target at 0.08 factor (smooth follow)
           → sceneRef.style.transform updated imperatively (no re-renders)
```

| Constant | Value | Effect |
|----------|-------|--------|
| `MAX_ROT` | 75° | Full cursor-edge swing |
| `IDLE_RX` | −14° | Resting tilt (floor visible) |
| `IDLE_RY` | −18° | Resting swing (left wall visible) |

**Why negative IDLE values:** left-wall normal is +X; for it to face the viewer, `sin(RY)` must be negative → `RY < 0`. Floor normal is −Y; `sin(RX)` must be negative → `RX < 0`.

**Touch / pinch-to-scale:** a separate `useEffect` tracks two-finger pinch distance ratio and maps it to the `scale` state (clamped `[0.28, 1.4]`).

---

## Scale

`pickScale(vw, vh)` maps viewport size to a CSS scale factor applied to the scene wrapper:

| Viewport | Scale range |
|----------|-------------|
| < 640 px | 0.32 – 0.55 |
| 640–1024 px | 0.45 – 0.70 |
| > 1024 px | 0.55 – 0.90 |

The stage element dimensions are `BASE_W × scale` by `BASE_H × scale`. The scene wrapper is full `BASE_W × BASE_H` and scaled via CSS transform, keeping all child pixel values (frame positions, bulb offset, etc.) in unscaled coordinates.

---

## Lighting

A single warm-yellow bulb hangs from the invisible ceiling at scene position `(170, 110, −260)`. It is a `translate3d` element with two crossed billboard divs (rotated 90° to each other) for a pseudo-3D sphere.

Each wall has a `radial-gradient` light overlay anchored at the bulb's projected position on that surface:

| Surface | Gradient origin | Derivation |
|---------|----------------|------------|
| Back wall | `(24%, 23%)` | `(bulbX/W, bulbY/H)` |
| Left wall | `(50%, 23%)` | `(\|bulbZ\|/D, bulbY/H)` — bulb at mid-depth |
| Floor | `(24%, 50%)` | `(bulbX/W, \|bulbZ\|/D)` |

Bulb glow colours: `#FFF6CF → #FBE17A → #D9AE48 → #8A6420` (warm gold matching the `mosaic_2.png` floor tile average).

---

## Content

### Back wall
Three individual frames in a row:
1. `tree.png` (art)
2. Today's xkcd comic (fetched via `corsproxy.io → xkcd.com/info.0.json`)
3. `global_warming.png` (art)

### Left wall
Two frames:
1. `kalakaari.png` (art)
2. Yesterday's xkcd (`xkcd.com/${num−1}/info.0.json`)

### Floor
`mosaic_2.png` tiled as `background-image` on the floor plane with an 18% cream wash overlay and warm-yellow radial glow.

---

## Performance notes

- All cursor/rotation updates are imperative (`element.style.transform`). React state is never written inside the rAF loop.
- xkcd JSON is fetched once on mount and stored in a `useRef` to avoid re-renders.
- Stats text updates every 4 frames via `textContent` on a `<pre>` ref — no virtual DOM diffing.
- `backfaceVisibility: hidden` on frame/bulb content ensures frame images don't bleed through the back of the cube when it rotates past 90°.
- **Images in `public/`** should be kept compressed (WebP preferred, ≤ 400 KB each). The originals from Gimp exports can be multi-MB — re-export at 1200 px max-width before placing here.
- On mobile (< 640 px viewport): the 3D room is replaced by a lightweight 2D fallback to avoid GPU overload from `preserve-3d` + `backdrop-filter`.

---

## Tuning guide

| You want to… | Change |
|---|---|
| More left-wall visible at rest | Make `IDLE_RY` more negative (e.g. −25) |
| More floor visible at rest | Make `IDLE_RX` more negative (e.g. −20) |
| Wider cursor swing | Increase `MAX_ROT` |
| Faster cursor follow | Increase lerp factor (currently `0.08`) |
| Change bulb position | Edit `bulbX`, `bulbDrop`, `bulbZ` in the bulb IIFE; update the 3 light overlay origins to match |
| Replace floor texture | Copy new PNG to `public/`, update `FLOOR_SRC` |
| Replace wall art | Copy to `public/`, update the `ART` array |
