import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Palette, Eye, ZoomIn, ZoomOut, RefreshCw, Sun, Box } from 'lucide-react';

export default function Studio360Section({ imageMode }) {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [theme, setTheme] = useState('red'); // 'red', 'cyan', 'lime', 'gold'
  const [wireframe, setWireframe] = useState(false);

  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const themes = {
    red: { name: 'Crimson Fire', accent: 'text-red-400', border: 'border-red-500/40', glow: 'from-red-600/20 via-rose-500/10' },
    cyan: { name: 'Cyber Cyan', accent: 'text-cyan-400', border: 'border-cyan-500/40', glow: 'from-cyan-600/20 via-blue-500/10' },
    lime: { name: 'Neon Lime', accent: 'text-lime-400', border: 'border-lime-500/40', glow: 'from-lime-500/20 via-emerald-500/10' },
    gold: { name: 'Liquid Gold', accent: 'text-amber-400', border: 'border-amber-500/40', glow: 'from-amber-500/20 via-yellow-500/10' },
  };

  const currentTheme = themes[theme];
  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    setRotationY((prev) => prev + deltaX * 0.5);
    setRotationX((prev) => Math.max(-45, Math.min(45, prev - deltaY * 0.3)));

    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section 
      id="studio"
      className="relative min-h-screen w-full bg-[#050508] border-t border-white/5 py-24 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Lighting Spotlight Theme Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr ${currentTheme.glow} to-transparent rounded-full blur-[160px] pointer-events-none transition-all duration-700`} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col justify-between min-h-[85vh]">
        
        {/* Top Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-[0.3em] mb-1">
              <Compass className={`w-4 h-4 ${currentTheme.accent}`} />
              <span>06. INTERACTIVE 360 STUDIO LAB</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase text-white tracking-tight">
              360° INSPECT LAB<span className={currentTheme.accent}>.</span>
            </h2>
          </div>

          {/* Theme Color Picker */}
          <div className="flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/10 p-2 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2">LIGHTING:</span>
            {Object.keys(themes).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  theme === t ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Center Interactive Drag Canvas */}
        <div 
          className="relative flex-1 flex items-center justify-center perspective-viewport my-8 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Floor Shadow */}
          <div className="absolute w-96 h-16 rounded-full bg-black/90 blur-xl pointer-events-none rotate-x-80 bottom-4" />

          {/* 3D Orbiting Sneaker Container */}
          <div 
            className="preserve-3d transition-transform duration-75 ease-out"
            style={{
              transform: `
                rotateY(${rotationY}deg)
                rotateX(${rotationX}deg)
                scale(${zoom})
              `,
            }}
          >
            <img
              src={imageSrc}
              alt="STRIDE 360 Studio Sneaker"
              className={`max-w-full max-h-[420px] object-contain transition-all duration-200 ${
                imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-2xl border border-white/10 shadow-2xl'
              } ${wireframe ? 'brightness-150 contrast-200 hue-rotate-90 invert-0' : ''}`}
              draggable={false}
            />
          </div>

          {/* Drag Instruction Banner */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-black/60 border border-white/10 px-4 py-2 rounded-full text-[11px] font-mono text-slate-300 flex items-center gap-2 pointer-events-none">
            <Compass className={`w-3.5 h-3.5 ${currentTheme.accent} animate-spin`} />
            <span>DRAG ANYWHERE TO ROTATE 360°</span>
          </div>

        </div>

        {/* Bottom Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono border-t border-white/10 pt-4 gap-4">
          
          {/* Rotation telemetry */}
          <div className="text-slate-400 flex items-center gap-4">
            <span>ROTATION Y: <strong className="text-white">{rotationY.toFixed(0)}°</strong></span>
            <span>PITCH X: <strong className="text-white">{rotationX.toFixed(0)}°</strong></span>
            <span>ZOOM: <strong className="text-white">{(zoom * 100).toFixed(0)}%</strong></span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`p-2.5 rounded-xl border font-mono text-xs flex items-center gap-1.5 ${
                wireframe ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{wireframe ? 'HUD MODE ON' : 'HUD MODE'}</span>
            </button>
            <button
              onClick={() => { setRotationY(0); setRotationX(0); setZoom(1); setWireframe(false); }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
              title="Reset View"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
