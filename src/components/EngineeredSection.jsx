import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Shield, Cpu, ChevronRight, Sparkles } from 'lucide-react';

export default function EngineeredSection({ imageMode }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const shoeRef = useRef(null);

  const features = [
    {
      id: 0,
      title: "Lightweight design",
      icon: Feather,
      subtitle: "MINIMAL MASS // MAXIMUM SPEED",
      description: "Structured knit weave eliminates redundant weight while preserving full structural integrity for effortless movement.",
      rotation: { rotX: -15, rotY: 40, rotZ: -8, scale: 1.15, x: 0, y: -20 },
      badge: "ULTRAFEATHER MESH",
    },
    {
      id: 1,
      title: "Responsive cushioning",
      icon: Cpu,
      subtitle: "ENERGY RETURN MIDSOLE",
      description: "Dual-density foam matrix absorbs heel impact and converts downward force into forward momentum.",
      rotation: { rotX: 25, rotY: -35, rotZ: 12, scale: 1.25, x: 20, y: 10 },
      badge: "KINETIC FOAM MATRIX",
    },
    {
      id: 2,
      title: "Everyday performance",
      icon: Shield,
      subtitle: "ALL-TERRAIN TRACTION",
      description: "Multi-directional tread outsole guarantees grip across street asphalt, gym hardwood, and wet surfaces.",
      rotation: { rotX: 5, rotY: 0, rotZ: 0, scale: 1.1, x: -10, y: 0 },
      badge: "MULTI-GRIP OUTSOLE",
    }
  ];

  // Auto-cycle through features every 5 seconds if user doesn't click
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = features[activeFeature];
  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  return (
    <section 
      id="engineered" 
      className="relative min-h-screen w-full bg-radial-blue bg-[#050508] py-24 flex items-center justify-center overflow-hidden border-t border-white/5"
    >
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col justify-between min-h-[85vh]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>03. PRECISION SPECIFICATION</span>
            </div>
            <h2 className="font-display font-black text-5xl sm:text-7xl uppercase tracking-tight text-white">
              ENGINEERED<span className="text-cyan-400">.</span>
            </h2>
          </div>
          <p className="text-sm font-sans text-slate-400 max-w-md">
            Three core design pillars engineered for optimal human motion, performance feedback, and daily comfort.
          </p>
        </div>

        {/* Center Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-12">
          
          {/* Left Feature Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              const isActive = activeFeature === idx;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeature(idx)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 to-white/5 border-cyan-500/50 shadow-2xl shadow-cyan-500/10' 
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400"
                    />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${isActive ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-display font-extrabold text-xl tracking-tight text-white">
                        {feat.title}
                      </span>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'translate-x-1 text-cyan-400' : 'text-slate-600'}`} />
                  </div>

                  <p className="text-xs font-sans text-slate-400 line-clamp-2 pl-12">
                    {feat.description}
                  </p>

                  <div className="mt-3 pl-12 flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 uppercase">
                      {feat.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 3D Sneaker Interactive Viewport */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative perspective-viewport min-h-[420px]">
            
            {/* Dynamic Spotlight Glow */}
            <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Floor Shadow */}
            <div className="absolute w-80 h-14 rounded-full bg-black/90 blur-xl pointer-events-none rotate-x-80 bottom-4" />

            {/* 3D Sneaker with Motion Interpolation on Active Feature Change */}
            <motion.div
              key={activeFeature}
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                rotateX: current.rotation.rotX - 20, 
                rotateY: current.rotation.rotY + 30 
              }}
              animate={{ 
                opacity: 1, 
                scale: current.rotation.scale, 
                rotateX: current.rotation.rotX, 
                rotateY: current.rotation.rotY, 
                rotateZ: current.rotation.rotZ,
                x: current.rotation.x,
                y: current.rotation.y
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative preserve-3d z-10 cursor-pointer"
            >
              <img
                src={imageSrc}
                alt={current.title}
                className={`max-w-full max-h-[380px] sm:max-h-[440px] object-contain select-none ${
                  imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-2xl border border-white/10 shadow-2xl'
                }`}
                draggable={false}
              />
            </motion.div>

            {/* Floating Active Feature Callout Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-0 right-4 backdrop-blur-xl bg-black/60 border border-cyan-500/30 px-4 py-2.5 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-2xl"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>SPOTLIGHT // {current.title.toUpperCase()}</span>
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

        {/* Bottom Specs Ticker */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 border-t border-white/10 pt-4 gap-4">
          <div className="flex items-center gap-6">
            <span>UPPER: COMPOSITE FLYKNIT</span>
            <span className="hidden sm:inline">•</span>
            <span>MIDSOLE: DUAL DENSITY EVA</span>
            <span className="hidden sm:inline">•</span>
            <span>WEIGHT: 245 GRAMS</span>
          </div>
          <div className="text-cyan-400 font-bold">
            03 / 04 STAGE
          </div>
        </div>

      </div>
    </section>
  );
}

