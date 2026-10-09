import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, Sparkles, Activity, Award, CheckCircle2 } from 'lucide-react';

export default function BrandStorySection({ imageMode }) {
  const stats = [
    { label: "DRAG COEFFICIENT", value: "0.18 Cd", detail: "Wind-tunnel tested aerodynamic silhouette" },
    { label: "KINETIC REBOUND", value: "88%", detail: "Energy return via nitrogen micro-cells" },
    { label: "TOTAL MASS", value: "245 Grams", detail: "Ultralight composite matrix weave" },
    { label: "GRIP COEFFICIENT", value: "1.4 µ", detail: "Multi-directional tread friction index" },
  ];

  const craftPillars = [
    {
      step: "01",
      title: "Biomechanical Telemetry",
      desc: "Pressure-map telemetry captured over 10,000 hours of athletic sprint cycles to calibrate shock absorption zones.",
    },
    {
      step: "02",
      title: "Nitrogen Expansion",
      desc: "Supercritical fluid foaming fuses gas bubbles into the midsole matrix for permanent elastic memory.",
    },
    {
      step: "03",
      title: "Precision Stitch Weave",
      desc: "Computerized jacquard knitting integrates targeted tensile strength directly into high-stress flex points.",
    },
  ];

  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  return (
    <section className="relative w-full bg-[#050508] border-t border-white/5 py-24 text-slate-100 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
        
        {/* Manifesto Chapter */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-[0.3em] bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
            <Sparkles className="w-4 h-4" />
            <span>THE STRIDE MANIFESTO</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-tight uppercase text-white tracking-tight">
            WE DO NOT DESIGN FOOTWEAR<span className="text-red-500">.</span><br />
            WE ENGINE <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">HUMAN KINETICS.</span>
          </h2>

          <p className="text-base sm:text-lg font-sans text-slate-400 max-w-2xl mx-auto leading-relaxed">
            STRIDE was conceived at the intersection of aerospace materials and athletic performance. Every line is drawn to eliminate drag, every foam density calibrated to amplify your natural motion.
          </p>
        </div>

        {/* Bento Grid Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-red-500/40 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">{item.label}</span>
              <span className="font-display font-black text-4xl text-white tracking-tight block mb-2 group-hover:text-red-400 transition-colors">{item.value}</span>
              <p className="text-xs font-sans text-slate-400">{item.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Craft & Engineering Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-white/10">
          
          {/* Left Craft Story */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-[0.3em] block mb-2">
                05. CRAFT & DISCIPLINE
              </span>
              <h3 className="font-display font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
                PROTOTYPED IN THE LAB<span className="text-cyan-400">.</span><br />PROVEN ON THE TRACK.
              </h3>
            </div>

            <div className="space-y-6">
              {craftPillars.map((pillar, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                  <span className="font-mono font-bold text-cyan-400 text-lg">{pillar.step}</span>
                  <div>
                    <h4 className="font-display font-bold text-white text-lg mb-1">{pillar.title}</h4>
                    <p className="text-xs font-sans text-slate-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Product Showcase Banner */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[400px] rounded-3xl bg-gradient-to-br from-red-950/30 via-slate-900/40 to-black border border-white/10 p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-radial-glow opacity-50" />
            <img
              src={imageSrc}
              alt="STRIDE Engineering Craft"
              className={`max-w-full max-h-[360px] object-contain transition-transform duration-700 group-hover:scale-105 ${
                imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-2xl border border-white/10 shadow-2xl'
              }`}
            />
            <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-black/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">AIR JORDAN 1 HIGH // STRIDE EDIT</span>
              <span className="text-red-400">LIMITED EDITION</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
