import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles, ArrowUp, Flame, Play, RefreshCw } from 'lucide-react';

export default function FinalImpactSection({ imageMode, onReplay }) {
  const [isSpinning, setIsSpinning] = useState(true);
  const shoeRef = useRef(null);

  useEffect(() => {
    let animId;
    let angle = 0;

    const spin = () => {
      if (isSpinning && shoeRef.current) {
        angle += 0.4;
        shoeRef.current.style.transform = `
          rotateY(${angle}deg)
          rotateX(${Math.sin(angle * 0.02) * 12}deg)
          translateZ(20px)
        `;
      }
      animId = requestAnimationFrame(spin);
    };

    spin();

    return () => cancelAnimationFrame(animId);
  }, [isSpinning]);

  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  return (
    <section 
      id="impact" 
      className="relative min-h-screen w-full bg-[#050508] flex items-center justify-center overflow-hidden border-t border-white/5 py-24"
    >
      {/* Cinematic Red Flare Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-red-600/20 via-rose-500/10 to-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-between min-h-[85vh] text-center">
        
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-[0.3em] bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20"
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span>04 // FINAL CINEMATIC IMPACT</span>
        </motion.div>

        {/* 3D Center Stage Sneaker Zoom */}
        <div className="relative w-full max-w-2xl h-[380px] sm:h-[460px] flex items-center justify-center perspective-viewport my-6">
          
          {/* Dynamic Floor Reflection Glow */}
          <div className="absolute w-96 h-16 rounded-full bg-red-600/30 blur-2xl pointer-events-none rotate-x-80 bottom-0 animate-pulse-slow" />
          <div className="absolute w-80 h-12 rounded-full bg-black/90 blur-xl pointer-events-none rotate-x-80 bottom-2" />

          {/* Continuous 360 3D Orbiting Sneaker */}
          <div 
            ref={shoeRef}
            className="preserve-3d transition-transform duration-100 ease-linear cursor-pointer"
            onClick={() => setIsSpinning(!isSpinning)}
          >
            <img
              src={imageSrc}
              alt="STRIDE Final Impact Sneaker"
              className={`max-w-full max-h-[380px] sm:max-h-[450px] object-contain select-none ${
                imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-2xl border border-white/10 shadow-2xl'
              }`}
              draggable={false}
            />
          </div>
        </div>

        {/* Headline "MAKE EVERY MOVE COUNT." */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-none uppercase tracking-tight text-white">
            MAKE EVERY<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
              MOVE COUNT.
            </span>
          </h2>

          <p className="text-base sm:text-lg font-sans text-slate-400 max-w-xl mx-auto leading-relaxed">
            Experience complete kinetic sync. Built for those who defy gravity and break boundaries.
          </p>

          {/* Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            {/* Replay Experience Button */}
            <button
              onClick={onReplay}
              className="w-full sm:w-auto flex items-center justify-center gap-3 text-sm font-mono font-bold px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white shadow-2xl shadow-red-600/40 hover:shadow-red-500/60 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="tracking-widest uppercase">REPLAY EXPERIENCE</span>
            </button>

            {/* Toggle 360 Spin */}
            <button
              onClick={() => setIsSpinning(!isSpinning)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-mono px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all duration-300"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'PAUSE 360° SPIN' : 'RESUME 360° SPIN'}</span>
            </button>
          </div>
        </motion.div>

        {/* Section Footer */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-slate-500 border-t border-white/10 pt-6 mt-12">
          <span>STRIDE / PORTFOLIO EXHIBIT</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 text-red-400" />
          </button>
        </div>

      </div>
    </section>
  );
}

