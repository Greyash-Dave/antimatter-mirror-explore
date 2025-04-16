import { useState } from 'react';
import { ArrowLeftRight, PlusCircle, MinusCircle } from 'lucide-react';
import AnimatedSection, { AnimateOnScroll } from './AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';

interface MirrorPair {
  matter: {
    name: string;
    description: string;
    charge: string;
  };
  antimatter: {
    name: string;
    description: string;
    charge: string;
  };
}

export default function MirrorSection() {
  const [activePair, setActivePair] = useState(0);
  
  const mirrorPairs: MirrorPair[] = [
    {
      matter: {
        name: "Electron",
        description: "Negatively charged elementary particle",
        charge: "-1"
      },
      antimatter: {
        name: "Positron",
        description: "Antimatter counterpart of the electron",
        charge: "+1"
      }
    },
    {
      matter: {
        name: "Proton",
        description: "Positively charged subatomic particle",
        charge: "+1"
      },
      antimatter: {
        name: "Antiproton",
        description: "Antimatter counterpart of the proton",
        charge: "-1"
      }
    },
    {
      matter: {
        name: "Neutron",
        description: "Subatomic particle with no electric charge",
        charge: "0"
      },
      antimatter: {
        name: "Antineutron",
        description: "Antimatter counterpart of the neutron",
        charge: "0"
      }
    }
  ];
  
  const nextPair = () => {
    setActivePair((prev) => (prev + 1) % mirrorPairs.length);
  };
  
  const prevPair = () => {
    setActivePair((prev) => (prev - 1 + mirrorPairs.length) % mirrorPairs.length);
  };

  return (
    <section id="mirror" className="section bg-gradient-to-b from-antimatter-bg to-antimatter-bg/70">
      <div className="container mx-auto flex flex-col h-full">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
            The Mirror <span className="text-antimatter-yellow">World</span>
          </h2>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.2}>
          <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-antimatter-textDim">
            For every particle of matter, antimatter presents its perfect opposite reflection - 
            identical in many ways, but with key properties reversed.
          </p>
        </AnimateOnScroll>
        
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Matter side */}
          <AnimateOnScroll 
            variant="fadeInLeft" 
            className="bg-antimatter-blue bg-opacity-30 rounded-lg p-8 flex-1 h-full flex flex-col"
            delay={0.3}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Matter</h3>
              <motion.div 
                className="h-1 bg-antimatter-blue mx-auto"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              ></motion.div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`matter-${activePair}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="w-32 h-32 rounded-full bg-antimatter-blue flex items-center justify-center mb-6 glowing"
                >
                  <PlusCircle className="text-antimatter-text" size={mirrorPairs[activePair].matter.charge === "+1" ? 64 : 32} />
                  {mirrorPairs[activePair].matter.charge === "-1" && (
                    <MinusCircle className="text-antimatter-text" size={64} />
                  )}
                </motion.div>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`matter-text-${activePair}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h4 className="text-xl font-bold mb-2">{mirrorPairs[activePair].matter.name}</h4>
                  <p className="text-center text-antimatter-textDim">
                    {mirrorPairs[activePair].matter.description}
                  </p>
                  <p className="mt-4 font-space text-lg">
                    Charge: {mirrorPairs[activePair].matter.charge}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </AnimateOnScroll>
          
          {/* Middle arrow */}
          <AnimateOnScroll
            variant="fadeIn"
            className="flex items-center justify-center p-4"
            delay={0.5}
            duration={1}
          >
            <motion.div
              animate={{ 
                x: [0, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ArrowLeftRight size={32} className="text-antimatter-yellow" />
            </motion.div>
          </AnimateOnScroll>
          
          {/* Antimatter side */}
          <AnimateOnScroll 
            variant="fadeInRight" 
            className="bg-antimatter-red bg-opacity-30 rounded-lg p-8 flex-1 h-full flex flex-col"
            delay={0.3}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Antimatter</h3>
              <motion.div 
                className="h-1 bg-antimatter-red mx-auto"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              ></motion.div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`antimatter-${activePair}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="w-32 h-32 rounded-full bg-antimatter-red flex items-center justify-center mb-6 glowing"
                >
                  <MinusCircle className="text-antimatter-text" size={mirrorPairs[activePair].antimatter.charge === "-1" ? 64 : 32} />
                  {mirrorPairs[activePair].antimatter.charge === "+1" && (
                    <PlusCircle className="text-antimatter-text" size={64} />
                  )}
                </motion.div>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`antimatter-text-${activePair}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h4 className="text-xl font-bold mb-2">{mirrorPairs[activePair].antimatter.name}</h4>
                  <p className="text-center text-antimatter-textDim">
                    {mirrorPairs[activePair].antimatter.description}
                  </p>
                  <p className="mt-4 font-space text-lg">
                    Charge: {mirrorPairs[activePair].antimatter.charge}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </AnimateOnScroll>
        </div>
        
        {/* Navigation controls */}
        <AnimateOnScroll delay={0.6} className="flex justify-center gap-4 mt-12">
          <motion.button 
            onClick={prevPair} 
            className="px-4 py-2 bg-antimatter-gray bg-opacity-50 rounded-md hover:bg-opacity-70 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous Pair
          </motion.button>
          <motion.button 
            onClick={nextPair} 
            className="px-4 py-2 bg-antimatter-yellow text-antimatter-bg rounded-md hover:bg-opacity-90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next Pair
          </motion.button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
