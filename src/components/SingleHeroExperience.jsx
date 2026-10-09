import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, ArrowDown, RotateCcw, Zap, Compass, MoveRight, Layers, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SingleHeroExperience({ imageMode, setImageMode }) {
  const containerRef = useRef(null);
  const pinSectionRef = useRef(null);
  const shoeRef = useRef(null);
  const shadowRef = useRef(null);
  const glowRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);

  // Mouse Physics lerp values
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Setup GSAP ScrollTrigger for Pinned Hero Scene Animation Evolution
  useEffect(() => {
    setIsLoaded(true);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinSectionRef.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, pinSectionRef);

    return () => ctx.revert();
  }, []);

  // 2. 60 FPS rAF Physics Loop for Mouse Tilt, Yaw, Pitch, Float, and Shadow
  useEffect(() => {
    let animationFrameId;
    let startTime = Date.now();

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Lerp mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const { x, y, isHovered } = mouseRef.current;

      // Zero-G floating offset (sine waves)
      const floatY = Math.sin(elapsed * 2) * 14;
      const floatX = Math.cos(elapsed * 1.5) * 8;
      const floatRotZ = Math.sin(elapsed * 1.2) * 3;

      // Combine Mouse Physics with Scroll Progress Transforms
      // Scroll progress adds continuous 360-degree transformation angles:
      const scrollRotY = scrollProgress * 360;
      const scrollRotX = Math.sin(scrollProgress * Math.PI * 2) * 25;
      const scrollScale = 1 + Math.sin(scrollProgress * Math.PI) * 0.25;
      const scrollTransX = Math.cos(scrollProgress * Math.PI * 2) * 40;

      // Final 3D angles
      const rotX = -y * 22 + scrollRotX;
      const rotY = x * 28 + scrollRotY;
      const rotZ = floatRotZ + (x * -6);
      const scale = (isHovered ? 1.08 : 1.0) * scrollScale;
      const transZ = isHovered ? 60 : 0;

      if (shoeRef.current) {
        shoeRef.current.style.transform = `
          translate3d(${x * 35 + floatX + scrollTransX}px, ${y * 25 + floatY}px, ${transZ}px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          rotateZ(${rotZ}deg)
          scale(${scale})
        `;
      }

      // Dynamic floor shadow position, scale, opacity
      if (shadowRef.current) {
        const shadowScale = (1 - (floatY / 100) - (isHovered ? 0.15 : 0)) * (1 + scrollProgress * 0.2);
        const shadowOpacity = 0.75 - (floatY / 60) * 0.2;
        shadowRef.current.style.transform = `
          translate3d(${x * 15 + scrollTransX * 0.5}px, ${60 + floatY * 0.3}px, -80px)
          rotateX(80deg)
          scale(${Math.max(0.5, shadowScale)})
        `;
        shadowRef.current.style.opacity = Math.max(0.25, shadowOpacity).toString();
      }

      // Ambient Spotlight Glow reaction
      if (glowRef.current) {
        const glowX = 50 + x * 20;
        const glowY = 45 + y * 20;
        const intensity = isHovered ? 0.35 : 0.22;
        glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 42, 75, ${intensity}) 0%, rgba(0, 240, 255, ${0.08 + scrollProgress * 0.1}) 45%, transparent 70%)`;
      }

      // Parallax headline shift based on scroll progress
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate3d(${-scrollTransX * 0.8}px, ${scrollProgress * -30}px, -40px) scale(${1 - scrollProgress * 0.05})`;
        headlineRef.current.style.opacity = (1 - scrollProgress * 0.3).toString();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress]);

  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  const handleReplayScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={pinSectionRef} className="relative w-full bg-[#050508] overflow-hidden">
      
      {/* 100vh Viewport Hero Scene Container */}
      <section 
        id="hero" 
        ref={containerRef}
        className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-grid-pattern px-6 py-6"
      >
        {/* Dynamic Lighting Spotlight Canvas Glow */}
        <div 
          ref={glowRef}
          className="absolute inset-0 pointer-events-none transition-all duration-300 bg-radial-glow"
        />

        {/* Ambient Flares */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

        {/* ----------------- TOP MINIMAL NAVIGATION BAR ----------------- */}
        <header className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Top Left: STRIDE Wordmark & Badge */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 shadow-lg shadow-red-500/30">
              <span className="font-display font-extrabold text-white text-lg tracking-wider">S</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-widest text-white">STRIDE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                  MOTION SERIES / 001
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Image Mode Toggle & Discover CTA */}
          <div className="flex items-center gap-4">
            
            {/* Image Mode Switcher */}
            <button
              onClick={() => setImageMode(imageMode === 'cutout' ? 'original' : 'cutout')}
              className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all duration-200"
              title="Toggle between Transparent Cutout and Original Photo"
            >
              <Eye className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">
                {imageMode === 'cutout' ? 'Cutout Mode' : 'Framed Photo'}
              </span>
            </button>

            {/* Minimal Link */}
            <button
              onClick={handleReplayScroll}
              className="text-xs font-mono text-slate-400 hover:text-white uppercase tracking-widest hidden sm:flex items-center gap-1 transition-colors"
            >
              <span>DISCOVER</span>
            </button>
          </div>
        </header>

        {/* ----------------- CENTER 3D SNEAKER STAGE ----------------- */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center my-auto">
          
          {/* Subtitle Badge */}
          <motion.div
            ref={badgeRef}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-2"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-red-500" />
            <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-red-400 uppercase bg-red-500/10 px-3 py-0.5 rounded-full border border-red-500/20">
              MOTION SERIES / 001
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-red-500" />
          </motion.div>

          {/* Oversized Headline "BUILT TO MOVE." Layered Behind Sneaker */}
          <div ref={headlineRef} className="relative w-full text-center pointer-events-none select-none my-1 transition-transform duration-100 ease-out">
            <h1 className="font-display font-extrabold text-[13vw] sm:text-[11vw] leading-none tracking-tighter uppercase text-white/10 text-stroke-accent drop-shadow-2xl">
              BUILT TO MOVE<span className="text-red-500 opacity-60">.</span>
            </h1>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="font-display font-black text-[12.8vw] sm:text-[10.8vw] leading-none tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500/20 opacity-30">
                BUILT TO MOVE<span className="text-red-500">.</span>
              </h2>
            </div>
          </div>

          {/* Floating 3D Sneaker Canvas Container */}
          <div className="relative w-full max-w-2xl h-[360px] sm:h-[440px] flex items-center justify-center perspective-viewport -mt-20 sm:-mt-28">
            
            {/* Floor Shadow */}
            <div 
              ref={shadowRef}
              className="absolute w-80 h-14 rounded-full bg-black/85 blur-xl pointer-events-none transition-transform duration-75"
            />

            {/* 3D Floating Sneaker Image Element */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 50, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative preserve-3d cursor-grab active:cursor-grabbing z-20"
            >
              <div ref={shoeRef} className="preserve-3d transition-transform duration-75 ease-out">
                <img
                  src={imageSrc}
                  alt="STRIDE Ultra-Premium 3D Sneaker"
                  className={`max-w-full max-h-[350px] sm:max-h-[430px] object-contain select-none transition-all duration-300 ${
                    imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-2xl border border-white/10 shadow-2xl'
                  }`}
                  draggable={false}
                />
              </div>
            </motion.div>
          </div>

          {/* Supporting Text Line & CTA Button */}
          <motion.div
            ref={subtitleRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center gap-4 text-center z-30 -mt-6 sm:-mt-8"
          >
            <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-md tracking-wide">
              Engineered for motion. Designed to stand out.
            </p>

            {/* Minimal CTA Button */}
            <button
              onClick={() => {
                // Smoothly trigger a scroll pulse to evolve the 3D angle
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
              }}
              className="group flex items-center gap-3 text-xs font-mono font-bold px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white shadow-2xl shadow-red-600/40 hover:shadow-red-500/60 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="tracking-widest uppercase">EXPLORE THE MOTION</span>
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>

        {/* ----------------- BOTTOM SCROLL CUE & HUD ----------------- */}
        <footer className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-slate-400">
          
          {/* Telemetry Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-bold">3D ANGLE: {(scrollProgress * 360).toFixed(0)}°</span>
            </div>
          </div>

          {/* Animated Scroll Indicator Cue */}
          <div className="flex items-center gap-3">
            <span className="tracking-widest uppercase hidden sm:inline text-[11px] text-slate-400">
              SCROLL TO TRANSFORM 3D ANGLE
            </span>
            <div className="w-6 h-9 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
              <div className="w-1.5 h-2.5 bg-red-500 rounded-full animate-bounce" />
            </div>
          </div>

        </footer>

      </section>
    </div>
  );
}

