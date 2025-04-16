import { ArrowDown } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import { handleSmoothScrollLinkClick, scrollToNextSection } from '@/lib/scroll-utils';
import AnimatedSection, { AnimateOnScroll } from './AnimatedSection';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const handleNextSectionClick = () => {
    scrollToNextSection('hero');
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
      <div className="z-10 text-center max-w-4xl px-4">
        <AnimateOnScroll variant="fadeIn" duration={1.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            <motion.span 
              className="text-antimatter-blue inline-block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Antimatter:
            </motion.span>
            <br />
            <motion.span 
              className="text-antimatter-red inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The Mirror of Our Universe
            </motion.span>
          </h1>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.4} duration={0.8}>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-antimatter-textDim">
            Explore the fascinating world where particles meet their opposite twins
          </p>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.8} variant="zoomIn" duration={0.6}>
          <div className="space-x-4">
            <button onClick={handleNextSectionClick} className="btn-primary">
              Begin Exploration
            </button>
            
            <a 
              href="#learn" 
              className="btn-secondary"
              onClick={(e) => handleSmoothScrollLinkClick(e, 'learn')}
            >
              Learn More
            </a>
          </div>
        </AnimateOnScroll>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.button 
          onClick={handleNextSectionClick} 
          className="text-antimatter-textDim hover:text-antimatter-text transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <ArrowDown size={32} />
        </motion.button>
      </motion.div>
    </section>
  );
}
