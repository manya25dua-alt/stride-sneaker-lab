import React from 'react';
import { Github, Layers, Code, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#030305] border-t border-white/10 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Brand info */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-display font-extrabold text-white text-lg tracking-widest">STRIDE</span>
            <span className="text-xs font-mono text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">3D EXPERIMENT</span>
          </div>
          <p className="text-xs font-mono text-slate-500 max-w-sm">
            Frontend animation experiment demonstrating CSS 3D perspective transforms, GSAP ScrollTrigger timeline scrubbing, and rAF mouse physics.
          </p>
        </div>

        {/* Center Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-300">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-cyan-400" /> React + Vite
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-red-400" /> GSAP ScrollTrigger
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Framer Motion
          </span>
        </div>

        {/* Right Asset swap note */}
        <div className="text-xs font-mono text-slate-500 text-center md:text-right">
          <p>© {new Date().getFullYear()} STRIDE LAB. All rights reserved.</p>
          <p className="text-[11px] text-slate-600 mt-1">
            Replace <code className="text-red-400 bg-red-950/40 px-1 py-0.5 rounded">public/sneaker.png</code> to showcase any shoe.
          </p>
        </div>

      </div>
    </footer>
  );
}

