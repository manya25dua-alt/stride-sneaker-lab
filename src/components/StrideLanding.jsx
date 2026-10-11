import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Particle Background ──────────────────────────────────────────────────────
function AmbientParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() / 1000;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(t * 1.2 + p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({ children, className, onClick }) {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 80;
    if (dist < maxDist) {
      const strength = (1 - dist / maxDist) * 14;
      pos.current = { x: (dx / dist) * strength, y: (dy / dist) * strength };
    } else {
      pos.current = { x: 0, y: 0 };
    }
    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0px, 0px)';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [onMove]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
    >
      {children}
    </button>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function StrideLanding() {
  const containerRef = useRef(null);
  const shoeRef = useRef(null);
  const shadowRef = useRef(null);
  const glowRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const [isLoaded, setIsLoaded] = useState(false);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // 60fps physics loop
  useEffect(() => {
    let animId;
    let startTime = Date.now();

    const onMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };
    const onEnter = () => { mouseRef.current.isHovered = true; };
    const onLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    }

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.07;
      m.y += (m.targetY - m.y) * 0.07;

      // Organic float
      const floatY = Math.sin(elapsed * 1.8) * 13;
      const floatX = Math.cos(elapsed * 1.3) * 7;
      const floatRotZ = Math.sin(elapsed * 1.1) * 2.5;

      // 3D angles
      const rotX = -m.y * 20;
      const rotY = m.x * 25;
      const rotZ = floatRotZ - m.x * 5;
      const scale = m.isHovered ? 1.07 : 1.0;
      const transZ = m.isHovered ? 50 : 0;

      if (shoeRef.current) {
        shoeRef.current.style.transform = `
          translate3d(${m.x * 30 + floatX}px, ${m.y * 22 + floatY}px, ${transZ}px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          rotateZ(${rotZ}deg)
          scale(${scale})
        `;
      }

      // Floor shadow tracks float
      if (shadowRef.current) {
        const shadowScale = Math.max(0.55, 1 - floatY / 95 - (m.isHovered ? 0.12 : 0));
        const shadowOpacity = Math.max(0.25, 0.7 - (floatY / 55) * 0.18);
        shadowRef.current.style.transform = `
          translate3d(${m.x * 12}px, ${52 + floatY * 0.28}px, -80px)
          rotateX(78deg)
          scale(${shadowScale})
        `;
        shadowRef.current.style.opacity = shadowOpacity.toString();
      }

      // Dynamic spotlight
      if (glowRef.current) {
        const gx = 50 + m.x * 22;
        const gy = 46 + m.y * 18;
        const intensity = m.isHovered ? 0.38 : 0.24;
        glowRef.current.style.background = `
          radial-gradient(circle at ${gx}% ${gy}%,
            rgba(255,42,75,${intensity}) 0%,
            rgba(0,240,255,0.07) 42%,
            transparent 68%)
        `;
      }

      // Orbs drift with mouse (soft parallax)
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${-m.x * 18}px, ${-m.y * 12}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${m.x * 14}px, ${m.y * 10}px)`;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (el) {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      }
      cancelAnimationFrame(animId);
    };
  }, []);

  // Scroll → depth perspective effect only (no new sections revealed)
  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.5));
      if (containerRef.current) {
        containerRef.current.style.perspective = `${1000 + progress * 400}px`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0b0b10] text-white select-none"
      style={{ perspective: '1000px' }}
    >
      {/* ── Video background (muted, looping, subtle) ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      >
        <source src="/sneakersss.mp4" type="video/mp4" />
      </video>

      {/* ── Dot-grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Particles ── */}
      <AmbientParticles />

      {/* ── Dynamic glow (follows mouse) ── */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none z-1 transition-all duration-300"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(255,42,75,0.22) 0%, rgba(0,240,255,0.06) 42%, transparent 68%)',
        }}
      />

      {/* ── Ambient orbs ── */}
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none z-0"
        style={{
          top: '18%', left: '6%',
          width: 420, height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,42,75,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none z-0"
        style={{
          bottom: '20%', right: '6%',
          width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* ══════════════════════════════════════════
          TOP NAV
      ══════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 sm:px-12 pt-7"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#ff2a4b] to-[#c0152f] shadow-lg shadow-red-600/30">
            <span className="font-black text-white text-sm tracking-wider">S</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span
            className="font-black text-lg tracking-[0.25em] text-white uppercase"
            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.3em' }}
          >
            STRIDE
          </span>
        </div>

        {/* Nav link */}
        <a
          href="#"
          className="text-[11px] font-mono tracking-[0.22em] text-slate-400 hover:text-white uppercase transition-colors duration-200 hidden sm:block"
        >
          Explore Sneaker →
        </a>
      </motion.header>

      {/* ══════════════════════════════════════════
          CENTER HERO STAGE
      ══════════════════════════════════════════ */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">

        {/* Product label */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -16 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#ff2a4b]" />
          <span
            className="text-[10px] font-mono font-semibold tracking-[0.35em] text-[#ff2a4b] uppercase px-3 py-0.5 rounded-full border border-[#ff2a4b]/25 bg-[#ff2a4b]/8"
            style={{ letterSpacing: '0.3em' }}
          >
            STRIDE / SIGNATURE SERIES
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#ff2a4b]" />
        </motion.div>

        {/* Oversized headline — sits BEHIND sneaker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="relative w-full text-center pointer-events-none mb-[-2rem] sm:mb-[-3.5rem]"
          style={{ zIndex: 5 }}
        >
          {/* Ghost stroked version */}
          <h1
            className="font-black uppercase leading-none tracking-tighter text-[14vw] sm:text-[11vw]"
            style={{
              fontFamily: 'Syne, sans-serif',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.13)',
              color: 'transparent',
            }}
          >
            BUILT TO MOVE
          </h1>
          {/* Gradient overlay */}
          <h1
            className="absolute inset-0 font-black uppercase leading-none tracking-tighter text-[14vw] sm:text-[11vw] bg-clip-text text-transparent"
            style={{
              fontFamily: 'Syne, sans-serif',
              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)',
            }}
          >
            BUILT TO MOVE
          </h1>
        </motion.div>

        {/* ── 3D SNEAKER STAGE ── */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: '100%', maxWidth: 680, height: 'clamp(260px, 42vw, 480px)', zIndex: 20 }}
        >
          {/* Floor shadow */}
          <div
            ref={shadowRef}
            className="absolute pointer-events-none"
            style={{
              width: 320, height: 56,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, transparent 75%)',
              filter: 'blur(14px)',
              bottom: '4%',
              left: '50%',
              transform: 'translateX(-50%)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Sneaker entrance + float container */}
          <motion.div
            initial={{ scale: 0.35, opacity: 0, y: 60, rotateX: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            style={{ transformStyle: 'preserve-3d', cursor: 'grab' }}
          >
            {/* Mouse-driven tilt wrapper */}
            <div
              ref={shoeRef}
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transition: 'transform 0.06s linear',
              }}
            >
              <img
                src="/sneaker.png"
                alt="STRIDE Signature Series Sneaker"
                draggable={false}
                style={{
                  maxHeight: 'clamp(200px, 38vw, 440px)',
                  objectFit: 'contain',
                  userSelect: 'none',
                  filter:
                    'drop-shadow(0 35px 50px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(255,42,75,0.32)) drop-shadow(0 -8px 20px rgba(0,240,255,0.08))',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Subtitle + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 22 }}
          transition={{ duration: 0.95, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-5 text-center mt-[-0.5rem] sm:mt-[-1rem]"
          style={{ zIndex: 30 }}
        >
          <p
            className="text-sm sm:text-base text-slate-300 max-w-sm tracking-wide"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400 }}
          >
            Engineered for motion. Designed to stand out.
          </p>

          <MagneticButton
            className="group relative flex items-center gap-3 text-[11px] font-mono font-bold px-8 py-3.5 rounded-2xl text-white uppercase tracking-[0.2em] overflow-hidden"
            style={{}}
          >
            {/* Gradient fill */}
            <span
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff2a4b] via-[#e11d48] to-[#ff2a4b] opacity-100 group-hover:opacity-90 transition-opacity"
              style={{ boxShadow: '0 0 40px rgba(255,42,75,0.45), 0 8px 24px rgba(0,0,0,0.4)' }}
            />
            {/* Shimmer overlay */}
            <span className="absolute inset-0 rounded-2xl overflow-hidden">
              <span
                className="absolute top-0 left-[-75%] w-1/2 h-full bg-white/20 skew-x-[-20deg] group-hover:left-[125%] transition-all duration-700"
              />
            </span>
            <span className="relative z-10">DISCOVER THE DESIGN</span>
            <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
        </motion.div>

      </div>

      {/* ══════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-between px-8 sm:px-12 pb-6 border-t border-white/[0.06] pt-4"
      >
        <span
          className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase"
        >
          DESIGNED FOR EVERY STEP.
        </span>

        {/* Live status pulse */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-slate-500 uppercase">
            SIGNATURE SERIES — 2026
          </span>
        </div>
      </motion.footer>

      {/* Subtle vignette edges */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(5,5,8,0.7) 100%)',
        }}
      />
    </div>
  );
}

