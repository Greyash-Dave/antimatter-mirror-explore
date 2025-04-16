
import { ArrowDown } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';

export default function HeroSection() {
  const scrollToNextSection = () => {
    const mirrorSection = document.getElementById('mirror');
    if (mirrorSection) {
      mirrorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="section flex flex-col items-center justify-center relative">
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas 
          className="w-full h-full"
          particleCount={80}
          particleSize={3}
          interactive={true}
        />
      </div>
      
      {/* Content */}
      <div className="z-10 text-center max-w-4xl px-4 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="text-antimatter-blue">Antimatter:</span>
          <br />
          <span className="text-antimatter-red">The Mirror of Our Universe</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-antimatter-textDim">
          Explore the fascinating world where particles meet their opposite twins
        </p>
        
        <div className="space-x-4">
          <button onClick={scrollToNextSection} className="btn-primary">
            Begin Exploration
          </button>
          
          <a href="#learn" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <button onClick={scrollToNextSection} className="text-antimatter-textDim hover:text-antimatter-text transition-colors">
          <ArrowDown size={32} />
        </button>
      </div>
    </section>
  );
}
