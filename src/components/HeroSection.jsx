import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function HeroSection({ imageMode }) {
  const containerRef = useRef(null);
  const shoeRef = useRef(null);
  const shadowRef = useRef(null);
  const glowRef = useRef(null);

  // Mouse physics target & current state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

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

    // 60FPS RAF Smooth Physics Loop (LERP)
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

      // Calculate 3D rotations
      const rotX = -y * 22; // Pitch
      const rotY = x * 28;  // Yaw
      const rotZ = floatRotZ + (x * -6); // Roll
      const scale = isHovered ? 1.08 : 1.0;
      const transZ = isHovered ? 60 : 0;

      if (shoeRef.current) {
        shoeRef.current.style.transform = `
          translate3d(${x * 35 + floatX}px, ${y * 25 + floatY}px, ${transZ}px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          rotateZ(${rotZ}deg)
          scale(${scale})
        `;
      }

      // Synchronize floor shadow movement & opacity
      if (shadowRef.current) {
        const shadowScale = 1 - (floatY / 100) - (isHovered ? 0.15 : 0);
        const shadowOpacity = 0.7 - (floatY / 60) * 0.2;
        shadowRef.current.style.transform = `
          translate3d(${x * 15}px, ${50 + floatY * 0.3}px, -80px)
          rotateX(80deg)
          scale(${Math.max(0.6, shadowScale)})
        `;
        shadowRef.current.style.opacity = Math.max(0.3, shadowOpacity).toString();
      }

      // Synchronize lighting glow intensity
      if (glowRef.current) {
        const glowX = 50 + x * 20;
        const glowY = 45 + y * 20;
        glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 42, 75, ${isHovered ? 0.35 : 0.22}) 0%, rgba(0, 240, 255, 0.08) 40%, transparent 70%)`;
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
  }, []);

  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  return (
    <section 
      id="hero" 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-grid-pattern pt-20"
    >
      {/* Dynamic Lighting Spotlight Canvas Glow */}
      <div 
        ref={glowRef}
        className="absolute inset-0 pointer-events-none transition-all duration-500 bg-radial-glow"
      />

      {/* Subtle Background Accent Flares */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Main 3D Perspective Viewport */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-red-500" />
          <span className="text-xs font-mono font-bold tracking-[0.3em] text-red-400 uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            STRIDE / MOTION SERIES
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-red-500" />
        </motion.div>

        {/* Oversized Background Headline "BUILT TO MOVE" Layered Behind Sneaker */}
        <div className="relative w-full text-center pointer-events-none select-none my-2">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-[12vw] leading-none tracking-tighter uppercase text-white/10 text-stroke-accent drop-shadow-2xl"
          >
            BUILT TO MOVE
          </motion.h1>

          {/* Foreground Overlay Accent Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h2 className="font-display font-black text-[11.8vw] leading-none tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500/20 opacity-30">
              BUILT TO MOVE
            </h2>
          </motion.div>
        </div>

        {/* Floating 3D Sneaker Anchor Container */}
        <div className="relative w-full max-w-2xl h-[420px] sm:h-[500px] flex items-center justify-center perspective-viewport -mt-24 sm:-mt-36">
          
          {/* Floor Shadow */}
          <div 
            ref={shadowRef}
            className="absolute w-80 h-16 rounded-full bg-black/80 blur-xl pointer-events-none transition-transform duration-75"
          />

          {/* 3D Floating Sneaker Element */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 60, rotateX: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative preserve-3d cursor-grab active:cursor-grabbing"
          >
            <div ref={shoeRef} className="preserve-3d transition-transform duration-75 ease-out">
              <img
                src={imageSrc}
                alt="STRIDE High Performance Sneaker"
                className={`max-w-full max-h-[380px] sm:max-h-[460px] object-contain select-none transition-all duration-300 ${
                  imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-2xl border border-white/10 shadow-2xl'
                }`}
                draggable={false}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Hero Metadata & Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 z-20"
        >
          {/* Tech Specs Badges */}
          <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" />
              <span>RESPONSIVE CUSHIONING</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>3D KINETIC MESH</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CARBON SHANK</span>
            </div>
          </div>

          {/* Minimal Animated Scroll Indicator */}
          <a
            href="#motion"
            className="flex items-center gap-3 text-xs font-mono text-slate-400 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="tracking-widest uppercase">SCROLL TO DISCOVER</span>
            <div className="w-7 h-11 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5 group-hover:border-red-500 transition-colors">
              <div className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce" />
            </div>
          </a>
        </motion.div>

      </div>
    </section>
  );
}

