import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Ambient Dust Particles ───────────────────────────────────────────────────
function DustCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      base: Math.random() * 0.28 + 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() / 1000;
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        const a = p.base * (0.6 + 0.4 * Math.sin(t * 0.9 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 3,
        mixBlendMode: 'screen',
      }}
    />
  );
}

// ─── Main Experience ──────────────────────────────────────────────────────────
export default function StridePureStage() {
  // Refs for imperative animation (never cause React re-renders)
  const wrapperRef    = useRef(null); // scroll-pinned section
  const stageRef      = useRef(null); // the visible 100vh stage
  const shoeRef       = useRef(null); // tilt target
  const shadow1Ref    = useRef(null); // contact shadow (dark)
  const shadow2Ref    = useRef(null); // floor ring (light)
  const spotRef       = useRef(null); // spotlight gradient
  const orb1Ref       = useRef(null);
  const orb2Ref       = useRef(null);
  const progressRef   = useRef(null); // bottom progress bar

  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0, hovered: false });
  const scroll = useRef({ rotY: 0 }); // driven by ScrollTrigger

  const [entered, setEntered] = useState(false);
  useEffect(() => { const t = setTimeout(() => setEntered(true), 60); return () => clearTimeout(t); }, []);

  // ── 1. GSAP ScrollTrigger — pinned 360° rotation ───────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1.0,
        onUpdate: (self) => {
          scroll.current.rotY = self.progress * 360;
          // drive progress bar
          if (progressRef.current) {
            progressRef.current.style.width = (self.progress * 100) + '%';
          }
        },
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  // ── 2. Mouse tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const mx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.current.tx = mx;
      mouse.current.ty = my;
    };
    const onEnter = () => { mouse.current.hovered = true; };
    const onLeave = () => { mouse.current.hovered = false; mouse.current.tx = 0; mouse.current.ty = 0; };
    const el = stageRef.current;
    if (el) { el.addEventListener('mousemove', onMove); el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); }
    return () => { if (el) { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); } };
  }, []);

  // ── 3. 60 fps RAF loop — float + tilt + shadow + spotlight + orbs ──────────
  useEffect(() => {
    let raf;
    const t0 = Date.now();

    const loop = () => {
      const t  = (Date.now() - t0) / 1000;
      const m  = mouse.current;
      const sr = scroll.current;

      // LERP mouse
      m.x += (m.tx - m.x) * 0.065;
      m.y += (m.ty - m.y) * 0.065;

      // Organic float
      const fY    = Math.sin(t * 1.75) * 13;
      const fX    = Math.cos(t * 1.25) * 7;
      const fRotZ = Math.sin(t * 1.1)  * 3;

      // Combined rotations
      const rotX   = -m.y * 20;
      const rotY   = m.x * 30 + sr.rotY;   // mouse + scroll
      const rotZ   = fRotZ - m.x * 4;
      const scale  = m.hovered ? 1.07 : 1.0;
      const transZ = m.hovered ? 55  : 0;

      // ── Shoe transform ──
      if (shoeRef.current) {
        shoeRef.current.style.transform = `
          translate3d(${m.x * 28 + fX}px, ${m.y * 18 + fY}px, ${transZ}px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          rotateZ(${rotZ}deg)
          scale(${scale})
        `;
      }

      // ── Contact shadow — shrinks as shoe rises ──
      const shadowScale   = Math.max(0.5, 1 - fY / 90 - (m.hovered ? 0.12 : 0));
      const shadowOpacity = Math.max(0.2, 0.72 - (fY / 50) * 0.18);
      if (shadow1Ref.current) {
        shadow1Ref.current.style.transform = `
          translate3d(${m.x * 10}px, ${48 + fY * 0.28}px, 0)
          scale(${shadowScale})
        `;
        shadow1Ref.current.style.opacity = shadowOpacity.toString();
      }
      if (shadow2Ref.current) {
        shadow2Ref.current.style.transform = `
          translate3d(${m.x * 6}px, ${36 + fY * 0.18}px, 0)
          scale(${Math.max(0.6, shadowScale + 0.1)})
        `;
        shadow2Ref.current.style.opacity = (shadowOpacity * 0.45).toString();
      }

      // ── Spotlight follows mouse ──
      if (spotRef.current) {
        const sx = 50 + m.x * 24;
        const sy = 46 + m.y * 20;
        const peak = m.hovered ? 0.3 : 0.18;
        spotRef.current.style.background = `
          radial-gradient(circle at ${sx}% ${sy}%,
            rgba(255,42,75,${peak}) 0%,
            rgba(0,200,255,0.06) 40%,
            transparent 65%)
        `;
      }

      // ── Orbs drift opposite to cursor ──
      if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${-m.x * 22}px, ${-m.y * 14}px)`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${m.x * 16}px, ${m.y * 10}px)`;

      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    /*
      wrapperRef = scroll trigger anchor (height: 400vh so ScrollTrigger has room)
      The inner stageRef = the actual visible 100vh that gets pinned
    */
    <div
      ref={wrapperRef}
      style={{ position: 'relative', height: '400vh', background: '#0a0a0d' }}
    >
      {/* ── THE PINNED STAGE ───────────────────────────────────────────────── */}
      <section
        ref={stageRef}
        aria-label="STRIDE Signature Series sneaker showcase"
        style={{
          position: 'relative',
          width: '100%', height: '100vh',
          overflow: 'hidden',
          background: '#0a0a0d',
          cursor: 'none',      // hide cursor — shoe IS the cursor experience
        }}
      >

        {/* ── Dot texture ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* ── Ambient colour orbs ── */}
        <div ref={orb1Ref} style={{
          position: 'absolute', zIndex: 2, pointerEvents: 'none',
          top: '8%', left: '3%', width: 560, height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,42,75,0.09) 0%, transparent 70%)',
          filter: 'blur(55px)',
          transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
        }} />
        <div ref={orb2Ref} style={{
          position: 'absolute', zIndex: 2, pointerEvents: 'none',
          bottom: '10%', right: '3%', width: 480, height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 70%)',
          filter: 'blur(55px)',
          transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
        }} />

        {/* ── Dust particles ── */}
        <DustCanvas />

        {/* ── Mouse-tracking spotlight ── */}
        <div ref={spotRef} style={{
          position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 46%, rgba(255,42,75,0.18) 0%, rgba(0,200,255,0.05) 40%, transparent 65%)',
          transition: 'background 0.1s linear',
        }} />

        {/* ── Vignette edges ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(5,5,10,0.82) 100%)',
        }} />

        {/* ══════════════════════════════════════════
            CENTER 3D STAGE  (perspective container)
        ══════════════════════════════════════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
        }}>
          {/* Shoe + platform group */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* ── 3D sneaker ── */}
            <motion.div
              initial={{ scale: 0.28, opacity: 0, y: 90 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                ref={shoeRef}
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  transition: 'transform 0.055s linear',
                }}
              >
                <img
                  src="/sneaker.png"
                  alt="STRIDE Signature Series sneaker"
                  draggable={false}
                  style={{
                    display: 'block',
                    width: 'clamp(280px, 42vw, 580px)',
                    height: 'auto',
                    objectFit: 'contain',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    filter: `
                      drop-shadow(0 40px 55px rgba(0,0,0,0.92))
                      drop-shadow(0 0 35px rgba(255,42,75,0.30))
                      drop-shadow(0 -6px 22px rgba(0,200,255,0.07))
                    `,
                  }}
                />
              </div>
            </motion.div>

            {/* ── Platform ring (light) ── */}
            <div
              ref={shadow2Ref}
              style={{
                width: 'clamp(200px, 32vw, 440px)',
                height: 20,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.055) 0%, transparent 72%)',
                filter: 'blur(5px)',
                marginTop: -10,
                transition: 'transform 0.06s linear, opacity 0.06s linear',
                willChange: 'transform, opacity',
              }}
            />

            {/* ── Contact shadow (dark) ── */}
            <div
              ref={shadow1Ref}
              style={{
                width: 'clamp(180px, 28vw, 380px)',
                height: 26,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, transparent 78%)',
                filter: 'blur(18px)',
                marginTop: -4,
                transition: 'transform 0.06s linear, opacity 0.06s linear',
                willChange: 'transform, opacity',
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            WORDMARK — top left, minimal
        ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16,1,0.3,1], delay: 0.8 }}
          style={{
            position: 'absolute', top: 32, left: 36,
            zIndex: 40, display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: '0.32em',
            color: 'rgba(255,255,255,0.90)',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            STRIDE
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 500,
            fontSize: 8.5,
            letterSpacing: '0.38em',
            color: 'rgba(255,42,75,0.75)',
            textTransform: 'uppercase',
          }}>
            SIGNATURE SERIES
          </span>
        </motion.div>

        {/* ══════════════════════════════════════════
            SCROLL HINT — bottom centre, fades after scroll starts
        ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.1 }}
          style={{
            position: 'absolute', bottom: 36, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.32em',
            color: 'rgba(255,255,255,0.22)',
            textTransform: 'uppercase',
          }}>
            SCROLL TO ROTATE
          </span>
          {/* Mouse-wheel icon */}
          <div style={{
            width: 22, height: 36,
            borderRadius: 11,
            border: '1.5px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 5,
          }}>
            <div style={{
              width: 2, height: 7, borderRadius: 2,
              background: 'rgba(255,42,75,0.7)',
              animation: 'scrollBob 1.6s ease-in-out infinite',
            }} />
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            SCROLL PROGRESS BAR — 2px, bottom edge
        ══════════════════════════════════════════ */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: 2,
          background: 'rgba(255,255,255,0.05)',
          zIndex: 50,
        }}>
          <div
            ref={progressRef}
            style={{
              height: '100%', width: '0%',
              background: 'linear-gradient(90deg, #ff2a4b 0%, #00c8ff 100%)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>

      </section>
    </div>
  );
}

