import { useEffect, useRef, useState } from 'react';

const ART = ['/tree.jpg', '/global_warming.jpg', '/kalakaari.jpg'];
const FLOOR_SRC = '/mosaic_2.jpg';
const MAX_ROT = 75;
// Resting rotation — negative RY swings left wall into view,
// negative RX tilts floor toward viewer. Kept moderate so cube reads clean.
const IDLE_RX = -14;
const IDLE_RY = -18;
// Use 89.6° instead of a perfect 90° for plane-to-plane rotations so adjacent
// planes never become exactly coplanar with the camera plane (kills z-fighting +
// the "flat slab" look at small angles).
const PERP = 89.6;

// Base dimensions at scale=1 (desktop).
const BASE_W = 720;
const BASE_H = 480;
const BASE_D = 520;
const T = 32; // slab thickness — the chunky "lego" rim around every plane

// DESIGN.md tokens used in this component
const CREAM       = '#FAF7F2';
const CREAM_EDGE  = '#EFE9DD'; // slightly darker cream for the rim
const INK         = '#1A2744';
const STEEL       = '#5A7BA8';
const PINK        = '#F0527A';
const CLOUD       = '#FFFFFF';

async function fetchXkcd() {
  // Routed through our own Lambda (/api/xkcd) — no third-party CORS proxy needed.
  try {
    const { today, yesterday } = await fetch('/api/xkcd').then(r => r.json());
    return [today, yesterday];
  } catch {
    return [null, null];
  }
}

function pickScale(vw, vh) {
  if (vw < 640) return Math.max(0.28, Math.min(0.44, (vw * 0.82) / BASE_W));
  if (vw < 1024) return Math.max(0.45, Math.min(0.7, (vw * 0.6) / BASE_W));
  return Math.max(0.55, Math.min(0.9, (Math.min(vw, vh * 1.6) * 0.5) / BASE_W));
}


export default function Room3D() {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const statsRef = useRef(null);
  const fpsRef   = useRef({ frames: 0, last: typeof performance !== 'undefined' ? performance.now() : 0, value: 0, ticks: 0 });
  const xkcdRef  = useRef([null, null]);
  const target   = useRef({ rx: IDLE_RX, ry: IDLE_RY, px: 50, py: 50 });
  const current  = useRef({ rx: IDLE_RX, ry: IDLE_RY, px: 50, py: 50 });
  const [xkcd, setXkcd] = useState([null, null]);
  const [scale, setScale] = useState(() =>
    typeof window === 'undefined' ? 0.7 : pickScale(window.innerWidth, window.innerHeight)
  );
  const pinchRef = useRef({ active: false, startDist: 0, startScale: 0.7 });

  useEffect(() => {
    fetchXkcd().then((x) => { xkcdRef.current = x; setXkcd(x); });
  }, []);

  useEffect(() => {
    const onResize = () => setScale(pickScale(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Pinch-to-scale: two-finger pinch adjusts the room scale directly.
  useEffect(() => {
    const pinchDist = (t) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchRef.current = { active: true, startDist: pinchDist(e.touches), startScale: scale };
      }
    };
    const onTouchMove = (e) => {
      const p = pinchRef.current;
      if (!p.active || e.touches.length !== 2) return;
      const ratio = pinchDist(e.touches) / p.startDist;
      setScale(Math.min(1.4, Math.max(0.28, p.startScale * ratio)));
    };
    const onTouchEnd = () => { pinchRef.current.active = false; };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [scale]);

  // Single-finger swipe → rotation. Accumulates delta from touch-start so the
  // finger can start anywhere on screen (not just over the stage).
  const swipeRef = useRef({ active: false, x: 0, y: 0, baseRx: IDLE_RX, baseRy: IDLE_RY });
  useEffect(() => {
    const SENSITIVITY = 0.28; // degrees per pixel of swipe

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      swipeRef.current = {
        active: true,
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        baseRx: target.current.rx,
        baseRy: target.current.ry,
      };
    };
    const onTouchMove = (e) => {
      const s = swipeRef.current;
      if (!s.active || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - s.x;
      const dy = e.touches[0].clientY - s.y;
      target.current = {
        ...target.current,
        ry: s.baseRy + dx * SENSITIVITY,
        rx: s.baseRx - dy * SENSITIVITY,
      };
    };
    const onTouchEnd = () => { swipeRef.current.active = false; };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: true });
    window.addEventListener('touchend',   onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top)  / r.height));
      target.current = {
        ry:  (x - 0.5) * 2 * MAX_ROT + IDLE_RY,
        rx: -(y - 0.5) * 2 * MAX_ROT + IDLE_RX,
        px: x * 100,
        py: y * 100,
      };
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const tick = () => {
      const t = target.current, c = current.current;
      c.rx += (t.rx - c.rx) * 0.08;
      c.ry += (t.ry - c.ry) * 0.08;
      c.px += (t.px - c.px) * 0.12;
      c.py += (t.py - c.py) * 0.12;
      if (sceneRef.current) {
        sceneRef.current.style.transform =
          `scale(${scale}) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;
      }
      if (stageRef.current) {
        stageRef.current.style.perspectiveOrigin = `${c.px}% ${c.py}%`;
      }

      const f = fpsRef.current;
      f.frames++; f.ticks++;
      const now = performance.now();
      if (now - f.last > 500) {
        f.value = Math.round((f.frames * 1000) / (now - f.last));
        f.frames = 0; f.last = now;
      }
      if (statsRef.current && (f.ticks & 3) === 0) {
        const xk = xkcdRef.current;
        const sign = (n) => (n >= 0 ? '+' : '');
        statsRef.current.textContent =
          `fps     ${String(f.value).padStart(3)}\n` +
          `cur    ${t.px.toFixed(0).padStart(2)}% × ${t.py.toFixed(0).padStart(2)}%\n` +
          `rot  ${sign(c.rx)}${c.rx.toFixed(0).padStart(2)}/${sign(c.ry)}${c.ry.toFixed(0).padStart(2)}\n` +
          `tgt  ${sign(t.rx)}${t.rx.toFixed(0).padStart(2)}/${sign(t.ry)}${t.ry.toFixed(0).padStart(2)}\n` +
          `scale  ${scale.toFixed(2)}\n` +
          `xkcd  #${xk[0]?.num ?? '----'}`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [scale]);

  const W = BASE_W, H = BASE_H, D = BASE_D;

  // Picture-frame look (DESIGN-friendly: ink border on cloud surface).
  // backfaceVisibility:hidden so the back of the cube reads as solid cream — not
  // mirrored content showing through from the front.
  const frameStyle = {
    position: 'absolute',
    background: CLOUD,
    border: `3px solid ${INK}`,
    boxShadow: '0 6px 18px rgba(26, 39, 68, 0.18)',
    padding: 8,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };
  const frameImg = { width: '100%', height: '100%', objectFit: 'cover' };

  // Warm light cast that matches the yellow bulb. Wider stops so the wash
  // is broad and equally radial on each surface (not a tight corner spot).
  const lightOverlay = (ox, oy) => ({
    position: 'absolute', inset: 0,
    background: `radial-gradient(circle at ${ox} ${oy},
      rgba(251, 225, 122, 0.28) 0%,
      rgba(251, 225, 122, 0.18) 20%,
      rgba(217, 174, 72, 0.09) 45%,
      rgba(217, 174, 72, 0.03) 70%,
      rgba(0,0,0,0) 95%)`,
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  });

  // ---- Rim strips ----
  // Each plane is a thin slab; the 4 perpendicular rim faces give visible thickness.
  // Rims protrude from each wall surface in its -normal direction (away from interior).

  const rim = { position: 'absolute', left: 0, top: 0, background: CREAM_EDGE };

  // Back wall plane sits at z = -D. Slab extends into z ∈ [-D - T, -D].
  const backWallRims = (
    <>
      <div style={{ ...rim, width: W, height: T,
        transform: `translateY(${-T / 2}px) translateZ(${-D - T / 2}px) rotateX(90deg)` }} />
      <div style={{ ...rim, width: W, height: T,
        transform: `translateY(${H - T / 2}px) translateZ(${-D - T / 2}px) rotateX(90deg)` }} />
      <div style={{ ...rim, width: T, height: H,
        transform: `translateX(${-T / 2}px) translateZ(${-D - T / 2}px) rotateY(90deg)` }} />
      <div style={{ ...rim, width: T, height: H,
        transform: `translateX(${W - T / 2}px) translateZ(${-D - T / 2}px) rotateY(90deg)` }} />
    </>
  );

  // Left wall plane sits at x = 0. Slab extends into x ∈ [-T, 0].
  const leftWallRims = (
    <>
      <div style={{ ...rim, width: T, height: D,
        transform: `translateX(${-T}px) translateY(${-D / 2}px) translateZ(${-D / 2}px) rotateX(90deg)` }} />
      <div style={{ ...rim, width: T, height: D,
        transform: `translateX(${-T}px) translateY(${H - D / 2}px) translateZ(${-D / 2}px) rotateX(90deg)` }} />
      <div style={{ ...rim, width: T, height: H,
        transform: `translateX(${-T}px) translateZ(${-D}px)` }} />
      <div style={{ ...rim, width: T, height: H,
        transform: `translateX(${-T}px) translateZ(0px)` }} />
    </>
  );

  // Floor plane sits at y = H. Slab extends into y ∈ [H, H + T].
  const floorRims = (
    <>
      <div style={{ ...rim, width: W, height: T,
        transform: `translateY(${H}px) translateZ(${-D}px)` }} />
      <div style={{ ...rim, width: W, height: T,
        transform: `translateY(${H}px)` }} />
      <div style={{ ...rim, width: D, height: T,
        transform: `translateX(${-D / 2}px) translateY(${H}px) translateZ(${-D / 2}px) rotateY(90deg)` }} />
      <div style={{ ...rim, width: D, height: T,
        transform: `translateX(${W - D / 2}px) translateY(${H}px) translateZ(${-D / 2}px) rotateY(90deg)` }} />
    </>
  );

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
    }}>
      {/* 3D stage — centered "lego block" */}
      <div
        ref={stageRef}
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: W * scale, height: H * scale,
          transform: 'translate(-50%, -50%)',
          perspective: `${1200 * scale}px`,
          perspectiveOrigin: '50% 50%',
          overflow: 'visible',
        }}
      >
        {/* Soft halo so the block reads as a floating object */}
        <div style={{
          position: 'absolute',
          inset: '-14%',
          background: 'radial-gradient(ellipse at center, rgba(26,39,68,0.10) 0%, rgba(0,0,0,0) 65%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }} />

        <div
          ref={sceneRef}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: W, height: H,
            marginLeft: -W / 2, marginTop: -H / 2,
            // Include IDLE rotations in initial render so there is no jump
            // on the first rAF tick from "flat" to "rotated".
            transform: `scale(${scale}) rotateX(${IDLE_RX}deg) rotateY(${IDLE_RY}deg)`,
            transformOrigin: `50% 50% ${-D / 2}px`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* ── Back wall ───────────────────────────────────────────── */}
          {backWallRims}
          {/* exterior back face — visible when the cube rotates past 90° */}
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: W, height: H,
            transform: `translateZ(${-D - T}px)`,
            background: CREAM_EDGE,
            borderRadius: 4,
          }} />
          <div style={{
            position: 'absolute',
            left: 0, top: 0,
            width: W, height: H,
            transform: `translateZ(-${D}px)`,
            background: CREAM,
            transformStyle: 'preserve-3d',
            borderRadius: 4,
            boxShadow: 'inset 0 0 80px rgba(26, 39, 68, 0.10)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}>
            {/* Bulb sits at scene (170, 110, -260); projects onto the back wall
                at (170/720, 110/480) ≈ (24%, 23%) */}
            <div style={lightOverlay('24%', '23%')} />

            {/* Three individual frames across the back wall:
                left art · today's xkcd (cloud panel) · right art */}
            {(() => {
              const fw = 140, fh = 180, gap = 22;
              const totalW = fw * 3 + gap * 2;
              const startX = (W - totalW) / 2;
              const top = 150;
              return (
                <>
                  <div style={{ ...frameStyle, width: fw, height: fh, left: startX, top }}>
                    <img src={ART[0]} alt="" style={frameImg} />
                  </div>
                  <div style={{
                    ...frameStyle, width: fw, height: fh,
                    left: startX + fw + gap, top,
                    flexDirection: 'column', gap: 4, padding: 8,
                  }}>
                    {xkcd[0] ? (
                      <>
                        <div style={{
                          color: PINK,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 8,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}>
                          xkcd #{xkcd[0].num} · today
                        </div>
                        <img src={xkcd[0].img} alt={xkcd[0].alt}
                          style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
                      </>
                    ) : (
                      <div style={{ color: STEEL, fontFamily: 'monospace', fontSize: 9 }}>
                        loading xkcd…
                      </div>
                    )}
                  </div>
                  <div style={{
                    ...frameStyle, width: fw, height: fh,
                    left: startX + (fw + gap) * 2, top,
                  }}>
                    <img src={ART[1]} alt="" style={frameImg} />
                  </div>
                </>
              );
            })()}
          </div>

          {/* ── Hanging bulb — free 3D object dangling from the (invisible) ceiling ── */}
          {(() => {
            const bulbX = 170;          // x inside the room
            const bulbZ = -D + 260;     // z (some distance forward from the back wall)
            const bulbDrop = 110;       // how far below the ceiling it hangs
            const bulbR = 13;           // bulb radius
            // Two crossed billboards give the bulb a 3D feel as the room rotates.
            const sphere = (rotY = 0) => ({
              position: 'absolute',
              left: -bulbR, top: -bulbR,
              width: bulbR * 2, height: bulbR * 2,
              borderRadius: '50%',
              // Warm yellow tuned to the floor mosaic — softer than cobalt at this scale
              background: `radial-gradient(circle at 35% 30%, #FFF6CF 0%, #FBE17A 30%, #D9AE48 65%, #8A6420 100%)`,
              boxShadow: `0 0 22px 8px rgba(217, 174, 72, 0.48), 0 0 80px 36px rgba(217, 174, 72, 0.20)`,
              transform: `rotateY(${rotY}deg)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            });
            return (
              <div style={{
                position: 'absolute',
                left: 0, top: 0,
                transform: `translate3d(${bulbX}px, ${bulbDrop}px, ${bulbZ}px)`,
                transformStyle: 'preserve-3d',
                pointerEvents: 'none',
              }}>
                {/* stem: thin vertical bar going up to the ceiling at y = 0 */}
                <div style={{
                  position: 'absolute',
                  left: -1, top: -bulbDrop,
                  width: 2, height: bulbDrop,
                  background: INK,
                  opacity: 0.85,
                  backfaceVisibility: 'hidden',
                }} />
                {/* tiny ceiling mount disc */}
                <div style={{
                  position: 'absolute',
                  left: -6, top: -bulbDrop - 2,
                  width: 12, height: 4,
                  background: INK,
                  borderRadius: 2,
                  backfaceVisibility: 'hidden',
                }} />
                {/* socket cap */}
                <div style={{
                  position: 'absolute',
                  left: -5, top: -bulbR - 4,
                  width: 10, height: 6,
                  background: INK,
                  borderRadius: 2,
                  backfaceVisibility: 'hidden',
                }} />
                {/* Two crossed billboards for the glowing bulb itself */}
                <div style={sphere(0)} />
                <div style={sphere(90)} />
              </div>
            );
          })()}

          {/* ── Left wall ───────────────────────────────────────────── */}
          {leftWallRims}
          {/* exterior back face of left wall */}
          <div style={{
            position: 'absolute',
            width: D, height: H,
            left: 0, top: 0,
            transform: `translateX(${-T}px) rotateY(${PERP}deg)`,
            transformOrigin: 'left center',
            background: CREAM_EDGE,
            borderRadius: 4,
          }} />
          <div style={{
            position: 'absolute',
            width: D, height: H,
            left: 0, top: 0,
            transform: `rotateY(${PERP}deg)`,
            transformOrigin: 'left center',
            background: CREAM,
            transformStyle: 'preserve-3d',
            borderRadius: 4,
            boxShadow: 'inset 0 0 80px rgba(26, 39, 68, 0.10)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}>
            {/* Left wall: bulb projects to (|z|/D, y/H) = (260/520, 110/480) ≈ (50%, 23%) */}
            <div style={lightOverlay('50%', '23%')} />

            {/* Art frame: kalakaari */}
            <div style={{
              ...frameStyle,
              width: 170, height: 200,
              left: 70, top: 140,
            }}>
              <img src={ART[2]} alt="" style={frameImg} />
            </div>

            {/* xkcd frame: yesterday */}
            <div style={{
              ...frameStyle,
              width: 170, height: 200,
              left: 280, top: 140,
              flexDirection: 'column',
              gap: 4,
            }}>
              {xkcd[1] ? (
                <>
                  <div style={{
                    color: PINK,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    xkcd #{xkcd[1].num} · yesterday
                  </div>
                  <img src={xkcd[1].img} alt={xkcd[1].alt}
                    style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
                  <div style={{
                    color: STEEL,
                    fontSize: 9,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    maxHeight: 22,
                    overflow: 'hidden',
                  }}>
                    {xkcd[1].safe_title}
                  </div>
                </>
              ) : (
                <div style={{ color: STEEL, fontFamily: 'monospace', fontSize: 10 }}>
                  loading xkcd…
                </div>
              )}
            </div>
          </div>

          {/* ── Floor ───────────────────────────────────────────────── */}
          {floorRims}
          {/* exterior underside of floor */}
          <div style={{
            position: 'absolute',
            width: W, height: D,
            left: 0, top: 0,
            transform: `translateY(${H + T}px) rotateX(-${PERP}deg)`,
            transformOrigin: 'top center',
            background: CREAM_EDGE,
            borderRadius: 4,
          }} />
          <div style={{
            position: 'absolute',
            width: W, height: D,
            left: 0, top: 0,
            transform: `translateY(${H}px) rotateX(-${PERP}deg)`,
            transformOrigin: 'top center',
            background: CREAM,
            transformStyle: 'preserve-3d',
            backgroundImage: `url(${FLOOR_SRC})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 4,
            // No backfaceVisibility:hidden — viewer looks at the back face of this
            // rotateX(-90°) plane from above, hiding it would erase the floor image.
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(250, 247, 242, 0.18)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              /* Floor: bulb projects to (x/W, |z|/D) = (170/720, 260/520) ≈ (24%, 50%) */
              background: `radial-gradient(ellipse at 24% 50%,
                rgba(251, 225, 122, 0.26) 0%,
                rgba(251, 225, 122, 0.14) 25%,
                rgba(217, 174, 72, 0.05) 55%,
                rgba(0,0,0,0) 90%)`,
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>

      {/* ── Stats for nerds — flat card, bottom-left corner ─────────── */}
      <div style={{
        position: 'absolute',
        left: 'clamp(20px, 4vw, 48px)',
        bottom: 'clamp(20px, 4vw, 48px)',
        // Light cream film + blur for readability over the room
        background: 'rgba(250, 247, 242, 0.22)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderRadius: '0 0 4px 4px',
        padding: '10px 12px 14px',
        // Drop shadow below
        filter: 'drop-shadow(0 10px 24px rgba(26, 39, 68, 0.12))',
        pointerEvents: 'auto',
      }}>
        {/* Solid pink top divider — matches navbar active link style */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: '#F0527A',
          borderRadius: '4px 4px 0 0',
        }} />
        <div style={{
          color: PINK,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: 8,
          fontWeight: 500,
          paddingTop: 6,
        }}>
          stats / nerds
        </div>
        <pre
          ref={statsRef}
          style={{
            margin: 0,
            color: INK,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            lineHeight: 1.5,
            whiteSpace: 'pre',
            textAlign: 'left',
          }}
        >fps      ---
cur     50% × 50%
rot   +0.0/+0.0
tgt   +0.0/+0.0
scale  ----
xkcd   #----</pre>
      </div>
    </div>
  );
}
