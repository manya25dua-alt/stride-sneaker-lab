import React from 'react';
import { Sparkles, Eye, Compass, RotateCcw } from 'lucide-react';

export default function Navbar({ imageMode, setImageMode, onReplay }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-xl bg-[#050508]/60 border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 shadow-lg shadow-red-500/20">
            <span className="font-display font-extrabold text-white text-lg tracking-wider">S</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-widest text-white">STRIDE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">v3.0 3D</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 tracking-wider hidden sm:block">
              MOTION SERIES // HIGH-PERFORMANCE KINETICS
            </p>
          </div>
        </div>

        {/* Section Quick Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400 uppercase tracking-widest">
          <a href="#hero" className="hover:text-white transition-colors duration-200">01. Hero</a>
          <a href="#motion" className="hover:text-white transition-colors duration-200">02. Motion</a>
          <a href="#engineered" className="hover:text-white transition-colors duration-200">03. Engineered</a>
          <a href="#impact" className="hover:text-white transition-colors duration-200">04. Impact</a>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Image Mode Switcher (Transparent vs Original Photo) */}
          <button
            onClick={() => setImageMode(imageMode === 'cutout' ? 'original' : 'cutout')}
            className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all duration-200"
            title="Toggle between Transparent Cutout and Original Framed Photo"
          >
            <Eye className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">
              {imageMode === 'cutout' ? 'Cutout Mode' : 'Framed Photo'}
            </span>
          </button>

          {/* Replay Button */}
          <button
            onClick={onReplay}
            className="flex items-center gap-2 text-xs font-mono px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium shadow-lg shadow-red-600/30 transition-all duration-300 transform active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>REPLAY</span>
          </button>
        </div>
      </div>
    </header>
  );
}

