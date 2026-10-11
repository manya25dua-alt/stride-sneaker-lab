import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({ children, className, onClick }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 90;
    if (dist < maxDist) {
      const strength = (1 - dist / maxDist) * 16;
      el.style.transform = `translate(${(dx / dist) * strength}px, ${(dy / dist) * strength}px)`;
    } else {
      el.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
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
      style={{ transition: 'transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
    >
      {children}
    </button>
  );
}

// ─── Ambient Particles (canvas) ───────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      base: Math.random() * 0.35 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() / 1000;
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.base * (0.7 + 0.3 * Math.sin(t + p.phase))})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3, mixBlendMode: 'screen' }} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StrideLanding() {
  const [isLoaded, setIsLoaded] = useState(false);
  const glowRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Mouse-driven spotlight on the hero section
  useEffect(() => {
    const onMove = (e) => {
      if (!glowRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,42,75,0.18) 0%, transparent 55%)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const scrollToVideo = () => {
    document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#0b0b10] text-white">

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO (text + scroll cue)
      ════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 1,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Ambient orbs */}
        <div className="absolute pointer-events-none animate-pulse" style={{
          zIndex: 1, top: '10%', left: '5%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,42,75,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        <div className="absolute pointer-events-none" style={{
          zIndex: 1, bottom: '15%', right: '5%', width: 420, height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'pulse 5s ease-in-out infinite 1s',
        }} />

        {/* Mouse-tracking glow */}
        <div ref={glowRef} className="absolute inset-0 pointer-events-none transition-all duration-200" style={{ zIndex: 2 }} />

        {/* Particles */}
        <Particles />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 4,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,5,10,0.75) 100%)',
        }} />

        {/* ── NAV ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative flex items-center justify-between px-8 sm:px-14 pt-8"
          style={{ zIndex: 10 }}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#ff2a4b] to-[#c0152f] shadow-lg shadow-red-600/30">
              <span className="font-black text-white text-sm">S</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="font-black text-xl tracking-[0.28em] text-white uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>
              STRIDE
            </span>
          </div>
          <button
            onClick={scrollToVideo}
            className="text-[11px] font-mono tracking-[0.22em] text-slate-400 hover:text-white uppercase transition-colors duration-200 hidden sm:block"
          >
            Explore Sneaker →
          </button>
        </motion.header>

        {/* ── HERO CONTENT ── */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center pb-24" style={{ zIndex: 10 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -12 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#ff2a4b]" />
            <span className="text-[10px] font-mono font-semibold tracking-[0.35em] text-[#ff2a4b] uppercase px-3 py-1 rounded-full border border-[#ff2a4b]/25" style={{ background: 'rgba(255,42,75,0.07)' }}>
              STRIDE / SIGNATURE SERIES
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#ff2a4b]" />
          </motion.div>

          {/* Giant headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-black uppercase leading-none tracking-tighter mb-6"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(3.5rem, 12vw, 9rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e2e2 40%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            BUILT TO MOVE.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 16 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="text-base sm:text-lg text-slate-400 max-w-md tracking-wide mb-10"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400 }}
          >
            Engineered for motion. Designed to stand out.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 16 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          >
            <MagneticButton
              onClick={scrollToVideo}
              className="group relative flex items-center gap-3 text-[11px] font-mono font-bold px-9 py-4 rounded-2xl text-white uppercase tracking-[0.22em] overflow-hidden"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff2a4b] via-[#e11d48] to-[#ff2a4b]"
                style={{ boxShadow: '0 0 40px rgba(255,42,75,0.45), 0 8px 24px rgba(0,0,0,0.4)' }} />
              {/* shimmer */}
              <span className="absolute inset-0 rounded-2xl overflow-hidden">
                <span className="absolute top-0 left-[-75%] w-1/2 h-full bg-white/20 skew-x-[-20deg] group-hover:left-[125%] transition-all duration-700" />
              </span>
              <span className="relative z-10">DISCOVER THE DESIGN</span>
              <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </MagneticButton>
          </motion.div>
        </div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          style={{ zIndex: 10 }}
          onClick={scrollToVideo}
        >
          <span className="text-[10px] font-mono tracking-[0.25em] text-slate-500 uppercase">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-[#ff2a4b] animate-bounce" />
          </div>
        </motion.div>

        {/* Bottom label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-8 left-8 sm:left-14"
          style={{ zIndex: 10 }}
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-slate-600 uppercase">
            DESIGNED FOR EVERY STEP.
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-8 right-8 sm:right-14 flex items-center gap-2"
          style={{ zIndex: 10 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ position: 'absolute', right: 'calc(0.375rem + 2rem)', bottom: '2.25rem' }} />
          <span className="text-[10px] font-mono tracking-[0.25em] text-slate-600 uppercase">SIGNATURE SERIES — 2026</span>
        </motion.div>

      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — MAIN VIDEO SHOWCASE
      ════════════════════════════════════════════════════════════ */}
      <section id="video-section" className="relative w-full bg-[#060608]">

        {/* Section label */}
        <div className="relative z-10 flex flex-col items-center pt-20 pb-8 px-6 text-center">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#ff2a4b] uppercase mb-3">
            — IN MOTION —
          </span>
          <h2 className="font-black uppercase text-3xl sm:text-5xl leading-tight tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}>
            See It Move.
          </h2>
          <p className="text-slate-500 text-sm mt-3 max-w-xs tracking-wide">
            The STRIDE Signature Series, filmed in studio.
          </p>
        </div>

        {/* ── VIDEO — full-width, prominent ── */}
        <div className="relative w-full px-4 sm:px-8 pb-8">
          {/* Glow behind video */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
            <div style={{
              width: '70%', height: '60%',
              background: 'radial-gradient(ellipse, rgba(255,42,75,0.18) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }} />
          </div>

          <div
            className="relative mx-auto rounded-2xl overflow-hidden"
            style={{
              maxWidth: 960,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,42,75,0.12)',
              zIndex: 1,
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full"
              style={{ display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
            >
              <source src="/sneakersss.mp4" type="video/mp4" />
            </video>

            {/* Corner brand stamp */}
            <div className="absolute top-4 left-4 flex items-center gap-2" style={{ zIndex: 5 }}>
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#ff2a4b] to-[#c0152f] flex items-center justify-center">
                <span className="text-white font-black text-[10px]">S</span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 uppercase">STRIDE</span>
            </div>

            {/* LIVE pill */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', zIndex: 5 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-mono text-white/80 tracking-[0.2em] uppercase">Studio</span>
            </div>
          </div>
        </div>

        {/* ── BELOW VIDEO: brand copy ── */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-20 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[
              { label: 'RESPONSIVE CUSHIONING', desc: 'Every landing absorbed, every stride amplified.' },
              { label: '3D KINETIC MESH', desc: 'Engineered flex zones that move exactly as you do.' },
              { label: 'CARBON SHANK', desc: 'Structural precision from heel to forefoot.' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="h-px w-8 bg-[#ff2a4b] mb-2" />
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#ff2a4b] uppercase">{item.label}</span>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <MagneticButton className="group relative mx-auto flex items-center gap-3 text-[11px] font-mono font-bold px-9 py-4 rounded-2xl text-white uppercase tracking-[0.22em] overflow-hidden">
            <span className="absolute inset-0 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <span className="relative z-10 text-slate-300 group-hover:text-white transition-colors">Shop the Collection</span>
            <svg className="relative z-10 w-4 h-4 text-[#ff2a4b] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
        </div>

        {/* Footer strip */}
        <div className="border-t border-white/[0.06] px-8 sm:px-14 py-5 flex items-center justify-between">
          <span className="font-black text-sm tracking-[0.3em] text-white/30 uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>STRIDE</span>
          <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">© 2026 STRIDE LAB</span>
        </div>

      </section>
    </div>
  );
}
