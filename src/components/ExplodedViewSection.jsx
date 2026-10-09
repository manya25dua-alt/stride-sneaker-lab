import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sliders, Cpu, Shield, Zap, Info, Crosshair } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ExplodedViewSection({ imageMode }) {
  const [explosionProgress, setExplosionProgress] = useState(0.4); // 0 (assembled) to 1 (fully exploded)
  const [activeLayer, setActiveLayer] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          setExplosionProgress(self.progress);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  const layers = [
    {
      id: 'upper',
      name: '01 // FLYKNIT COMPOSITE UPPER',
      desc: 'Seamless targeted support with engineered zone-breathability.',
      offsetY: -110 * explosionProgress,
      offsetZ: 80 * explosionProgress,
      rotateX: -18 * explosionProgress,
      stat: '0.18 Cd DRAG',
      color: 'text-red-400 border-red-500/40 bg-red-500/10',
    },
    {
      id: 'shank',
      name: '02 // CARBON FIBER TORSIONAL SHANK',
      desc: 'Rigid midfoot plate prevents arch deflection during lateral cuts.',
      offsetY: -35 * explosionProgress,
      offsetZ: 30 * explosionProgress,
      rotateX: -10 * explosionProgress,
      stat: '3K TOW CARBON',
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    },
    {
      id: 'midsole',
      name: '03 // NITROGEN-INFUSED FOAM CORE',
      desc: 'Micro-cellular gas expansion delivers 88% kinetic energy recovery.',
      offsetY: 40 * explosionProgress,
      offsetZ: -20 * explosionProgress,
      rotateX: 8 * explosionProgress,
      stat: '88% KINETIC RETURN',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
    {
      id: 'outsole',
      name: '04 // ALL-TERRAIN TRACTION OUTSOLE',
      desc: 'Radial geometric lugs provide maximum friction coefficient on all surfaces.',
      offsetY: 115 * explosionProgress,
      offsetZ: -70 * explosionProgress,
      rotateX: 20 * explosionProgress,
      stat: '1.4µ GRIP INDEX',
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="exploded"
      className="relative min-h-screen w-full bg-[#050508] flex items-center justify-center overflow-hidden border-t border-white/5 py-20"
    >
      {/* Background Lighting & Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-screen flex flex-col justify-between py-16">
        
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-[0.3em] mb-1">
              <Layers className="w-4 h-4" />
              <span>KINEMATIC DECONSTRUCTION // EXPLODED VIEW</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-white">
              INTERNAL ARCHITECTURE<span className="text-red-500">.</span>
            </h2>
          </div>

          {/* Interactive Explosion Slider */}
          <div className="flex items-center gap-4 backdrop-blur-xl bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
            <Sliders className="w-4 h-4 text-red-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">DECONSTRUCTION STAGE</span>
              <span className="text-xs font-mono font-bold text-white">{(explosionProgress * 100).toFixed(0)}% SEPARATION</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={explosionProgress}
              onChange={(e) => setExplosionProgress(parseFloat(e.target.value))}
              className="w-32 accent-red-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Center Stage: 3D Exploded Layer Stack */}
        <div className="relative flex-1 flex items-center justify-center perspective-viewport my-6">
          
          {/* Floor Shadow */}
          <div className="absolute w-96 h-16 rounded-full bg-black/90 blur-xl pointer-events-none rotate-x-80 bottom-4" />

          {/* 3D Exploded Sneaker Layer Container */}
          <div className="relative w-full max-w-xl h-[400px] flex items-center justify-center preserve-3d">
            
            {/* Base Sneaker Image split via clip-path layers */}
            {layers.map((layer, idx) => {
              // Calculate clip-path bounds for each horizontal section
              const clipTop = idx * 25;
              const clipBottom = (idx + 1) * 25;
              const isSelected = activeLayer === layer.id;

              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => setActiveLayer(layer.id)}
                  onMouseLeave={() => setActiveLayer(null)}
                  className="absolute inset-0 flex items-center justify-center preserve-3d cursor-pointer transition-transform duration-300 ease-out"
                  style={{
                    transform: `
                      translate3d(0px, ${layer.offsetY}px, ${layer.offsetZ + (isSelected ? 40 : 0)}px)
                      rotateX(${layer.rotateX}deg)
                      rotateY(${explosionProgress * 25}deg)
                      scale(${isSelected ? 1.05 : 1})
                    `,
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={layer.name}
                    className={`max-w-full max-h-[400px] object-contain select-none transition-all duration-200 ${
                      imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-xl border border-white/10'
                    }`}
                    style={{
                      clipPath: `inset(${clipTop}% 0% ${100 - clipBottom}% 0%)`,
                      filter: isSelected ? 'brightness(1.25) drop-shadow(0 0 25px rgba(255, 42, 75, 0.6))' : 'none',
                    }}
                    draggable={false}
                  />

                  {/* Connecting HUD Indicator Lines when Exploded */}
                  {explosionProgress > 0.15 && (
                    <div className={`absolute left-full ml-4 hidden md:flex items-center gap-3 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-70'}`}>
                      <div className="w-12 h-px bg-gradient-to-r from-red-500 to-transparent" />
                      <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono backdrop-blur-xl ${layer.color}`}>
                        <div className="font-bold flex items-center gap-2">
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>{layer.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-300 font-sans mt-0.5">{layer.desc}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          </div>

          {/* Active Layer Details HUD Overlay for Mobile/Smaller Screens */}
          <AnimatePresence>
            {activeLayer && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="absolute bottom-4 left-6 right-6 md:hidden backdrop-blur-xl bg-black/80 border border-red-500/30 p-4 rounded-2xl text-xs font-mono shadow-2xl"
              >
                <div className="flex items-center justify-between text-red-400 font-bold mb-1">
                  <span>{layers.find(l => l.id === activeLayer)?.name}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-white">{layers.find(l => l.id === activeLayer)?.stat}</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">{layers.find(l => l.id === activeLayer)?.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom Specs Info Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-t border-white/10 pt-4">
          <div className="flex items-center gap-4">
            <span className="text-red-400 font-bold">INTERACTIVE DECONSTRUCTION</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">HOVER OR SCRUB SLIDER TO EXPLODE LAYERS</span>
          </div>
          <span>4 COMPONENT LAYERS</span>
        </div>

      </div>
    </section>
  );
}
