import React, { useState } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MotionSection from './components/MotionSection';
import ExplodedViewSection from './components/ExplodedViewSection';
import EngineeredSection from './components/EngineeredSection';
import BrandStorySection from './components/BrandStorySection';
import Studio360Section from './components/Studio360Section';
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
      {/* Background Zero-G Particle Dust */}
      <ParticleCanvas />

      {/* Glassmorphism Header */}
      <Navbar 
        imageMode={imageMode} 
        setImageMode={setImageMode} 
        onReplay={handleReplay} 
      />

      {/* Main Cinematic Sections */}
      <main className="relative z-10">
        {/* 01. Hero Section — Floating 3D Sneaker with Lerped Mouse Physics */}
        <HeroSection imageMode={imageMode} />

        {/* 02. Motion Section — GSAP ScrollTrigger Pinned Sequence */}
        <MotionSection imageMode={imageMode} />

        {/* 03. Architecture Section — 3D Exploded Layer Breakdown */}
        <ExplodedViewSection imageMode={imageMode} />

        {/* 04. Specs Section — Precision Feature Spotlights */}
        <EngineeredSection imageMode={imageMode} />

        {/* 05. Brand Story — Manifesto, Bento Stats, Craft Pillars */}
        <BrandStorySection imageMode={imageMode} />

        {/* 06. 360 Inspect Studio — Interactive Drag & Theme Controls */}
        <Studio360Section imageMode={imageMode} />

        {/* 07. Final Impact — Zoom Orbit & Replay Experience */}
        <FinalImpactSection imageMode={imageMode} onReplay={handleReplay} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
