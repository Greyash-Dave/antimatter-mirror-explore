import { useState } from 'react';
import { 
  Heart, 
  Microscope, 
  Rocket, 
  Zap, 
  RotateCw,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection, { AnimateOnScroll } from './AnimatedSection';
import StaggeredAnimation from './StaggeredAnimation';

interface Application {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  details: string;
}

export default function ApplicationsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const applications: Application[] = [
    {
      id: 'pet',
      name: 'PET Scanning',
      description: 'Medical imaging using positron emission',
      icon: <Heart size={48} />,
      color: 'bg-antimatter-red',
      details: `Positron Emission Tomography (PET) scans use antimatter to create detailed 3D images of the body's internal processes. A radioactive tracer that emits positrons (the antimatter counterpart of electrons) is injected into the patient. When these positrons encounter electrons in the body, they annihilate, producing gamma rays that are detected by the scanner to create an image.`
    },
    {
      id: 'research',
      name: 'Particle Physics',
      description: 'Studying the fundamental building blocks of matter',
      icon: <Microscope size={48} />,
      color: 'bg-antimatter-blue',
      details: `Scientists create and study antimatter in particle accelerators like CERN's Large Hadron Collider to better understand the fundamental laws of physics. By comparing the properties of antimatter to matter, researchers can test theories about why our universe appears to be made almost entirely of matter, despite equal amounts of both being created in the Big Bang.`
    },
    {
      id: 'propulsion',
      name: 'Spacecraft Propulsion',
      description: 'Theoretical antimatter-powered spacecraft',
      icon: <Rocket size={48} />,
      color: 'bg-antimatter-yellow',
      details: `Antimatter propulsion could revolutionize space travel by providing the most efficient fuel possible. Because matter-antimatter annihilation converts 100% of mass into energy, a spacecraft using antimatter could reach speeds approaching a significant fraction of the speed of light, potentially enabling interstellar travel within a human lifetime.`
    },
    {
      id: 'energy',
      name: 'Energy Generation',
      description: 'Theoretical power plants of the future',
      icon: <Zap size={48} />,
      color: 'bg-antimatter-blue',
      details: `While currently impractical due to the difficulty and energy cost of producing antimatter, theoretical antimatter power plants could generate enormous amounts of clean energy. Just 1 gram of antimatter annihilating with 1 gram of matter would produce energy equivalent to about 43 kilotons of TNT—enough to power a city for weeks or months.`
    }
  ];
  
  const nextApplication = () => {
    setActiveIndex((prev) => (prev + 1) % applications.length);
  };
  
  const prevApplication = () => {
    setActiveIndex((prev) => (prev - 1 + applications.length) % applications.length);
  };

  return (
    <section id="uses" className="section bg-gradient-to-b from-antimatter-bg to-antimatter-bg/90">
      <div className="container mx-auto flex flex-col h-full">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
            Applications of <span className="text-antimatter-yellow">Antimatter</span>
          </h2>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.2}>
          <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-antimatter-textDim">
            From medical diagnostics to the future of space travel, antimatter has 
            both current and potential applications that could transform our world.
          </p>
        </AnimateOnScroll>
        
        {/* Application carousel */}
        <div className="flex-1 flex flex-col items-center">
          {/* Navigation dots */}
          <AnimateOnScroll delay={0.4} className="w-full">
            <StaggeredAnimation 
              className="flex justify-center mb-8 gap-2"
              staggerDelay={0.05} 
              direction="up"
            >
              {applications.map((app, index) => (
                <motion.button
                  key={app.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex 
                      ? `${applications[activeIndex].color} transform scale-125` 
                      : 'bg-antimatter-gray opacity-50'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View ${app.name}`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </StaggeredAnimation>
          </AnimateOnScroll>
          
          {/* Application card */}
          <AnimateOnScroll delay={0.6} className="w-full max-w-4xl">
            <motion.div 
              className="bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`app-header-${activeIndex}`}
                  className={`${applications[activeIndex].color} p-6 flex items-center justify-between`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="text-antimatter-bg"
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {applications[activeIndex].icon}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold text-antimatter-bg"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {applications[activeIndex].name}
                  </motion.h3>
                  
                  <RotateCw size={24} className="text-antimatter-bg animate-spin opacity-20" />
                </motion.div>
              </AnimatePresence>
              
              <div className="p-8 flex flex-col md:flex-row gap-8">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`app-content-${activeIndex}`}
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-xl font-bold mb-4">Overview</h4>
                    <p className="text-antimatter-textDim mb-4">
                      {applications[activeIndex].description}
                    </p>
                    
                    <h4 className="text-xl font-bold mb-4">Details</h4>
                    <p className="text-antimatter-textDim">
                      {applications[activeIndex].details}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`app-icon-${activeIndex}`}
                    className="w-full md:w-1/3 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <div className={`w-48 h-48 rounded-full ${applications[activeIndex].color} bg-opacity-30 flex items-center justify-center animate-pulse-glow`}>
                      {applications[activeIndex].icon}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimateOnScroll>
          
          {/* Navigation buttons */}
          <AnimateOnScroll delay={0.8} className="flex justify-center gap-4 mt-8">
            <motion.button 
              onClick={prevApplication}
              className="p-2 rounded-full bg-antimatter-gray bg-opacity-20 hover:bg-opacity-40 transition-colors"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            
            <motion.button 
              onClick={nextApplication}
              className="p-2 rounded-full bg-antimatter-gray bg-opacity-20 hover:bg-opacity-40 transition-colors"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
