import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MotionSection from './components/MotionSection';
import EngineeredSection from './components/EngineeredSection';
import FinalImpactSection from './components/FinalImpactSection';
import Footer from './components/Footer';

export default function App() {
  const [imageMode, setImageMode] = useState('cutout');

  const handleReplay = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative min-h-screen bg-[#050508] text-slate-100 overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Navbar Header */}
      <Navbar 
        imageMode={imageMode} 
        setImageMode={setImageMode} 
        onReplay={handleReplay} 
      />

      {/* Main Content Sections */}
      <main>
        {/* Section 01: Hero 3D Floating Sneaker */}
        <HeroSection imageMode={imageMode} />

        {/* Section 02: Motion Sequence (GSAP ScrollTrigger Pinned) */}
        <MotionSection imageMode={imageMode} />

        {/* Section 03: Engineered Specification Spotlights */}
        <EngineeredSection imageMode={imageMode} />

        {/* Section 04: Final Impact & Replay */}
        <FinalImpactSection imageMode={imageMode} onReplay={handleReplay} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

