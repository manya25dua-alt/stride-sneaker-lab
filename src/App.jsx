import React, { useState } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import SingleHeroExperience from './components/SingleHeroExperience';

export default function App() {
  const [imageMode, setImageMode] = useState('cutout');

  return (
    <div className="relative min-h-screen bg-[#050508] text-slate-100 overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Background Zero-G Ambient Dust Particles */}
      <ParticleCanvas />

      {/* Single Hero 3D Sneaker Experience */}
      <main>
        <SingleHeroExperience 
          imageMode={imageMode} 
          setImageMode={setImageMode} 
        />
      </main>
    </div>
  );
}
