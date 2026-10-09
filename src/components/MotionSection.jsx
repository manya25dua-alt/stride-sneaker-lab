import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Wind, Zap, MoveRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function MotionSection({ imageMode }) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const shoeRef = useRef(null);
  const titleRef = useRef(null);
  const shadowRef = useRef(null);
  const textBgRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create pinned ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Smooth progress indicator update
          },
        },
      });

      // Step 1: Headline enters from deep Z-space & shoe moves horizontally right with 3D rotation
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        z: 0,
        duration: 1,
        ease: 'power2.out',
      })
      .to(textBgRef.current, {
        x: '-20%',
        opacity: 0.15,
        duration: 1,
      }, '<')
      .to(shoeRef.current, {
        x: '35%',
        rotateY: -45,
        rotateX: 18,
        rotateZ: -12,
        scale: 1.15,
        duration: 1.5,
        ease: 'power1.inOut',
      }, '<')
      .to(shadowRef.current, {
        x: '35%',
        scaleX: 1.2,
        duration: 1.5,
      }, '<');

      // Step 2: Feature cards pop in with staggered parallax
      tl.to(cardsRef.current, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'back.out(1.4)',
      });

      // Step 3: Shoe tilts left & zooms closer to reveal sole & upper details
      tl.to(shoeRef.current, {
        x: '-25%',
        rotateY: 35,
        rotateX: -15,
        rotateZ: 10,
        scale: 1.35,
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(shadowRef.current, {
        x: '-25%',
        scaleX: 1.4,
        duration: 1.5,
      }, '<')
      .to(titleRef.current, {
        color: '#ff2a4b',
        duration: 1,
      }, '<');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const imageSrc = imageMode === 'cutout' ? '/sneaker.png' : '/sneaker-original.png';

  return (
    <section 
      id="motion" 
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#050508] overflow-hidden flex items-center justify-center border-t border-white/5"
    >
      {/* Background Kinetic Text Marquee Parallax */}
      <div 
        ref={textBgRef}
        className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none select-none opacity-5 font-display font-black text-[22vw] uppercase tracking-tighter text-slate-100"
      >
        MOTION IS EVERYTHING // KINETICS // STRIDE
      </div>

      {/* Lighting Spotlight */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div ref={containerRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 h-screen flex flex-col justify-between py-24">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="tracking-widest uppercase">SECTION 02 // DYNAMIC TRANSFORM</span>
          </div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            3D PERSPECTIVE DEG: [X: +18° | Y: -45°]
          </div>
        </div>

        {/* Center Canvas Area: Pinned Shoe + Headline */}
        <div className="relative flex-1 flex items-center justify-center perspective-viewport">
          
          {/* Main Animated Headline */}
          <div className="absolute left-0 md:left-12 z-20 max-w-xl">
            <div 
              ref={titleRef}
              className="opacity-0 transform -translate-z-40 transition-colors duration-300"
            >
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-[0.3em] block mb-2">
                02. KINETIC ARCHITECTURE
              </span>
              <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-none uppercase tracking-tight text-white mb-6">
                MOTION IS<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
                  EVERYTHING.
                </span>
              </h2>
              <p className="text-sm font-sans text-slate-400 max-w-md leading-relaxed">
                Engineered to translate every biomechanical impulse into instant momentum. Precision geometry aligned with explosive propulsion.
              </p>
            </div>
          </div>

          {/* 3D Pinned Sneaker Container */}
          <div className="relative z-10 w-full max-w-xl h-[400px] sm:h-[480px] flex items-center justify-center">
            
            {/* Dynamic Shadow */}
            <div 
              ref={shadowRef}
              className="absolute w-80 h-14 rounded-full bg-black/90 blur-xl pointer-events-none rotate-x-80 -bottom-8"
            />

            <div ref={shoeRef} className="preserve-3d cursor-grab">
              <img
                src={imageSrc}
                alt="STRIDE Kinetic Motion Sneaker"
                className={`max-w-full max-h-[380px] sm:max-h-[440px] object-contain select-none ${
                  imageMode === 'cutout' ? 'sneaker-drop-shadow' : 'rounded-2xl border border-white/10 shadow-2xl'
                }`}
                draggable={false}
              />
            </div>
          </div>

          {/* Floating Feature Cards (Popping in via ScrollTrigger) */}
          <div className="absolute right-0 md:right-8 bottom-12 z-30 flex flex-col gap-4 max-w-xs">
            {[
              { icon: Wind, title: "Aerodynamic Drag", value: "0.18 Cd", desc: "Low profile air displacement channels." },
              { icon: Activity, title: "Torque Control", value: "+34%", desc: "Torsional shank stabilizes lateral cuts." },
              { icon: Zap, title: "Kinetic Return", value: "88%", desc: "Nitrogen infused energy rebound foam." }
            ].map((card, idx) => (
              <div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="opacity-0 translate-y-8 backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl hover:border-red-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <card.icon className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">{card.title}</span>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-red-400">{card.value}</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-t border-white/10 pt-4">
          <span>STRIDE LAB // 02 MOTION STAGE</span>
          <div className="flex items-center gap-2 text-slate-400">
            <span>CONTINUE SCROLLING</span>
            <MoveRight className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
        </div>

      </div>
    </section>
  );
}

