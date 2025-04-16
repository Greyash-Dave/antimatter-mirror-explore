import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { AnimateOnScroll } from './AnimatedSection';
import { X, ChevronRight } from 'lucide-react';

interface Physicist {
  id: string;
  name: string;
  quote: string;
  knownFor: string;
  shortBio: string;
  image: string;
  contribution: string;
  size: 'large' | 'medium' | 'small';
  era: 'early' | 'mid' | 'modern';
  collaborators?: string[];
}

export default function BentoGridPhysicists() {
  const [selectedPhysicist, setSelectedPhysicist] = useState<string | null>(null);
  const [hoveredPhysicist, setHoveredPhysicist] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  
  // Define physicists data
  const physicists: Physicist[] = [
    {
      id: 'dirac',
      name: 'Paul Dirac',
      quote: "A physical law must possess mathematical beauty.",
      knownFor: "Predicting the existence of antimatter",
      shortBio: "British theoretical physicist who was one of the founders of quantum mechanics and quantum electrodynamics.",
      image: '/assets/physicists/dirac.jpg',
      contribution: "In 1928, Dirac derived the Dirac equation, which described the behavior of electrons and predicted the existence of positrons, the antimatter counterpart of electrons.",
      size: 'large',
      era: 'early',
      collaborators: ['heisenberg', 'bohr']
    },
    {
      id: 'anderson',
      name: 'Carl Anderson',
      quote: "The positron is a hole in the sea of negative energy electrons.",
      knownFor: "Discovering the positron (antimatter electron)",
      shortBio: "American physicist who discovered the positron in 1932, confirming Dirac's prediction.",
      image: '/assets/physicists/anderson.jpg',
      contribution: "In 1932, Anderson discovered the positron while studying cosmic rays, providing the first experimental evidence for antimatter.",
      size: 'large',
      era: 'early'
    },
    {
      id: 'feynman',
      name: 'Richard Feynman',
      quote: "For a successful technology, reality must take precedence over public relations, for nature cannot be fooled.",
      knownFor: "Quantum electrodynamics explaining particle interactions",
      shortBio: "American theoretical physicist known for his work in quantum mechanics and particle physics.",
      image: '/assets/physicists/feynman.jpg',
      contribution: "Feynman developed a mathematical framework for quantum electrodynamics that explained how matter and antimatter particles interact through electromagnetic forces.",
      size: 'medium',
      era: 'mid',
      collaborators: ['gell-mann']
    },
    {
      id: 'curie',
      name: 'Marie Curie',
      quote: "Nothing in life is to be feared, it is only to be understood.",
      knownFor: "Pioneering research on radioactivity",
      shortBio: "Polish-born physicist and chemist who conducted pioneering research on radioactivity.",
      image: '/assets/physicists/curie.jpg',
      contribution: "While Curie didn't work directly on antimatter, her discoveries in radioactivity laid crucial groundwork for understanding nuclear physics and particle behavior.",
      size: 'medium',
      era: 'early'
    },
    {
      id: 'fermi',
      name: 'Enrico Fermi',
      quote: "There are two possible outcomes: if the result confirms the hypothesis, then you've made a measurement. If the result is contrary to the hypothesis, then you've made a discovery.",
      knownFor: "Work on beta decay and neutrinos",
      shortBio: "Italian-American physicist known for his work on nuclear reactions and elementary particles.",
      image: '/assets/physicists/fermi.jpg',
      contribution: "Fermi's work on beta decay and weak interactions provided key insights into particle behavior that would later inform antimatter research.",
      size: 'medium',
      era: 'mid'
    },
    {
      id: 'heisenberg',
      name: 'Werner Heisenberg',
      quote: "The first gulp from the glass of natural sciences will turn you into an atheist, but at the bottom of the glass God is waiting for you.",
      knownFor: "Uncertainty principle",
      shortBio: "German theoretical physicist and key pioneer of quantum mechanics.",
      image: '/assets/physicists/heisenberg.jpg',
      contribution: "Heisenberg's formulation of quantum mechanics was essential to the theoretical framework that would later predict antimatter.",
      size: 'small',
      era: 'early',
      collaborators: ['bohr', 'dirac']
    },
    {
      id: 'bohr',
      name: 'Niels Bohr',
      quote: "If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet.",
      knownFor: "Atomic model and quantum mechanics",
      shortBio: "Danish physicist who made foundational contributions to understanding atomic structure and quantum theory.",
      image: '/assets/physicists/bohr.jpg',
      contribution: "Bohr's model of atomic structure and his contributions to quantum theory established principles that would be critical to understanding antimatter.",
      size: 'small',
      era: 'early',
      collaborators: ['heisenberg', 'dirac']
    },
    {
      id: 'gell-mann',
      name: 'Murray Gell-Mann',
      quote: "The quark model originated as a tidy way of arranging the forest of particles into families.",
      knownFor: "Quark theory",
      shortBio: "American physicist who proposed the quark model, introducing a classification system for hadrons.",
      image: '/assets/physicists/gell-mann.jpg',
      contribution: "Gell-Mann's quark theory helped explain the properties of both matter and antimatter hadrons, showing they are made of quarks and antiquarks respectively.",
      size: 'small',
      era: 'modern',
      collaborators: ['feynman']
    },
    {
      id: 'wu',
      name: 'Chien-Shiung Wu',
      quote: "It is the courage to doubt what has long been established, that leads to progress.",
      knownFor: "Disproving conservation of parity",
      shortBio: "Chinese-American experimental physicist who made significant contributions to nuclear physics.",
      image: '/assets/physicists/wu.jpg',
      contribution: "Wu's experiment disproving the conservation of parity revealed fundamental differences in how matter and antimatter interact with the weak force.",
      size: 'small',
      era: 'mid'
    }
  ];

  // Three.js setup for particle effects
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    // Fill position and color arrays
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Positions - spread across the entire scene
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;
      
      // Colors - use antimatter theme colors (blue, red, yellow)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Blue (matter)
        colorArray[i] = 0.1;
        colorArray[i + 1] = 0.17;
        colorArray[i + 2] = 0.28;
      } else if (colorChoice < 0.66) {
        // Red (antimatter)
        colorArray[i] = 0.45;
        colorArray[i + 1] = 0.18;
        colorArray[i + 2] = 0.22;
      } else {
        // Yellow (energy)
        colorArray[i] = 0.98;
        colorArray[i + 1] = 0.83;
        colorArray[i + 2] = 0.14;
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;
    
    // Animation function
    const animate = () => {
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0005;
        particlesRef.current.rotation.y += 0.0005;
      }
      
      // Only render when canvas is in view
      if (canvasRef.current && isInViewport(canvasRef.current)) {
        rendererRef.current?.render(scene, camera);
      }
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    // Check if element is in viewport
    function isInViewport(element: HTMLElement) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      scene.remove(particles);
      
      rendererRef.current?.dispose();
    };
  }, []);
  
  // Function to handle connection lines between collaborating physicists
  const renderCollaborationLines = () => {
    const lines = [];
    
    if (hoveredPhysicist || selectedPhysicist) {
      const sourceId = hoveredPhysicist || selectedPhysicist;
      const source = physicists.find(p => p.id === sourceId);
      
      if (source?.collaborators) {
        source.collaborators.forEach(targetId => {
          const sourceElement = document.getElementById(`physicist-${sourceId}`);
          const targetElement = document.getElementById(`physicist-${targetId}`);
          
          if (sourceElement && targetElement) {
            const sourceRect = sourceElement.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            
            const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
            
            const startX = (sourceRect.left + sourceRect.right) / 2 - containerRect.left;
            const startY = (sourceRect.top + sourceRect.bottom) / 2 - containerRect.top;
            const endX = (targetRect.left + targetRect.right) / 2 - containerRect.left;
            const endY = (targetRect.top + targetRect.bottom) / 2 - containerRect.top;
            
            const isSourceMatter = source.era === 'early';
            const isTargetModern = physicists.find(p => p.id === targetId)?.era === 'modern';
            
            // Determine line color based on eras (representing matter-antimatter connection)
            let color = 'rgba(249, 212, 35, 0.5)'; // Default yellow
            if (isSourceMatter && isTargetModern) {
              color = 'rgba(114, 47, 55, 0.5)'; // Antimatter red
            } else if (isSourceMatter) {
              color = 'rgba(26, 43, 71, 0.5)'; // Matter blue
            }
            
            lines.push(
              <motion.svg
                key={`${sourceId}-${targetId}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 10
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </motion.svg>
            );
          }
        });
      }
    }
    
    return lines;
  };
  
  // Function to render the physicist card based on size
  const renderPhysicistCard = (physicist: Physicist) => {
    const isSelected = selectedPhysicist === physicist.id;
    const isHovered = hoveredPhysicist === physicist.id;
    
    // Determine styling based on size
    let sizeClasses = '';
    switch (physicist.size) {
      case 'large':
        sizeClasses = 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
        break;
      case 'medium':
        sizeClasses = 'col-span-2 row-span-1 md:col-span-1 md:row-span-1';
        break;
      case 'small':
        sizeClasses = 'col-span-1 row-span-1';
        break;
    }
    
    // Era-based color theme
    let colorTheme = '';
    switch (physicist.era) {
      case 'early':
        colorTheme = 'bg-antimatter-blue/20 hover:bg-antimatter-blue/30 group-hover:shadow-antimatter-blue/20';
        break;
      case 'mid':
        colorTheme = 'bg-antimatter-yellow/20 hover:bg-antimatter-yellow/30 group-hover:shadow-antimatter-yellow/20';
        break;
      case 'modern':
        colorTheme = 'bg-antimatter-red/20 hover:bg-antimatter-red/30 group-hover:shadow-antimatter-red/20';
        break;
    }

    // Create variants for hover animations
    const cardVariants = {
      initial: {
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        scale: 1
      },
      hover: {
        boxShadow: physicist.era === 'early' 
          ? "0 0 20px rgba(26, 43, 71, 0.3)"
          : physicist.era === 'mid'
            ? "0 0 20px rgba(249, 212, 35, 0.3)"
            : "0 0 20px rgba(114, 47, 55, 0.3)",
        scale: 1.02,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }
    };
    
    // Create particle animation variants
    const particleVariants = {
      initial: {
        scale: 1,
        opacity: 0.4
      },
      hover: {
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.8, 0.4],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };
    
    return (
      <motion.div
        id={`physicist-${physicist.id}`}
        className={`relative overflow-hidden rounded-xl p-4 ${sizeClasses} ${colorTheme} transition-all
                  group cursor-pointer backdrop-blur-sm flex flex-col h-full`}
        onClick={() => setSelectedPhysicist(physicist.id)}
        onMouseEnter={() => setHoveredPhysicist(physicist.id)}
        onMouseLeave={() => setHoveredPhysicist(null)}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        layout
      >
        {/* Particle overlay effect */}
        <motion.div 
          className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none"
          variants={{
            initial: { opacity: 0.2 },
            hover: { opacity: 0.4, transition: { duration: 0.3 } }
          }}
        >
          {physicist.size === 'large' && (
            <div className="relative w-full h-full">
              <motion.div 
                className={`absolute w-20 h-20 rounded-full blur-xl ${
                  physicist.era === 'early' ? 'bg-antimatter-blue' :
                  physicist.era === 'mid' ? 'bg-antimatter-yellow' :
                  'bg-antimatter-red'
                }`}
                style={{ left: '35%', top: '40%' }}
                variants={particleVariants}
              />
              <motion.div 
                className={`absolute w-12 h-12 rounded-full blur-lg ${
                  physicist.era === 'early' ? 'bg-antimatter-blue' :
                  physicist.era === 'mid' ? 'bg-antimatter-yellow' :
                  'bg-antimatter-red'
                }`}
                style={{ left: '25%', top: '65%' }}
                initial={{ opacity: 0.2 }}
                variants={{
                  hover: {
                    opacity: [0.2, 0.6, 0.2],
                    x: [0, 10, 0],
                    y: [0, -15, 0],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.5, 1]
                    }
                  }
                }}
              />
              <motion.div 
                className={`absolute w-8 h-8 rounded-full blur-md ${
                  physicist.era === 'early' ? 'bg-antimatter-blue' :
                  physicist.era === 'mid' ? 'bg-antimatter-yellow' :
                  'bg-antimatter-red'
                }`}
                style={{ left: '65%', top: '35%' }}
                initial={{ opacity: 0.3 }}
                variants={{
                  hover: {
                    opacity: [0.3, 0.7, 0.3],
                    x: [0, -10, 0],
                    y: [0, 10, 0],
                    transition: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.5, 1]
                    }
                  }
                }}
              />
            </div>
          )}
        </motion.div>
        
        {/* Content */}
        <div className="flex flex-col flex-1 z-10 relative">
          <motion.h3 
            className="text-xl font-bold mb-2"
            variants={{
              hover: {
                color: physicist.era === 'early' 
                  ? "#1a2b47" 
                  : physicist.era === 'mid'
                    ? "#f9d423"
                    : "#722f37",
                transition: { duration: 0.3 }
              }
            }}
          >
            {physicist.name}
          </motion.h3>
          
          {/* Quote with typewriter effect */}
          <motion.p 
            className="text-antimatter-textDim italic mb-4 flex-grow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {physicist.id === 'dirac' ? (
              <span className="typewriter">"{physicist.quote}"</span>
            ) : (
              <>"{physicist.quote}"</>
            )}
          </motion.p>
          
          {/* Known for */}
          <div className="mt-auto">
            <p className="text-sm font-semibold">Known for:</p>
            <motion.p 
              className="text-sm text-antimatter-textDim"
              variants={{
                hover: {
                  opacity: [0.7, 1, 0.7],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }
              }}
            >
              {physicist.knownFor}
            </motion.p>
          </div>
          
          {/* Hover indicator */}
          <motion.div 
            className="absolute bottom-2 right-2 text-antimatter-textDim"
            initial={{ x: 5, opacity: 0.6 }}
            variants={{
              hover: {
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }
            }}
          >
            <ChevronRight size={20} />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="physicists" className="section bg-gradient-to-b from-antimatter-bg/80 to-antimatter-bg">
      <div className="container mx-auto z-10 relative">
        {/* Three.js canvas for background particles effect */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
        
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
            Pioneers of <span className="text-antimatter-yellow">Particle Physics</span>
          </h2>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.2}>
          <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-antimatter-textDim">
            Visionaries who defined our understanding of matter, antimatter, and the fundamental forces of the universe.
          </p>
        </AnimateOnScroll>
        
        {/* Bento grid container */}
        <motion.div 
          ref={containerRef} 
          className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Render physicist cards with staggered animation */}
          {physicists.map((physicist, index) => (
            <motion.div
              key={physicist.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * index,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {renderPhysicistCard(physicist)}
            </motion.div>
          ))}
          
          {/* Render collaboration lines */}
          <AnimatePresence>
            {renderCollaborationLines()}
          </AnimatePresence>
        </motion.div>
        
        {/* Detail modal for expanded physicist info */}
        <AnimatePresence>
          {selectedPhysicist && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPhysicist(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-antimatter-bg border border-antimatter-gray/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const physicist = physicists.find(p => p.id === selectedPhysicist);
                  if (!physicist) return null;
                  
                  // Era-based color accent
                  const accentColor = physicist.era === 'early' 
                    ? 'bg-antimatter-blue' 
                    : physicist.era === 'mid' 
                      ? 'bg-antimatter-yellow' 
                      : 'bg-antimatter-red';
                  
                  return (
                    <>
                      <div className="relative p-6">
                        <button 
                          onClick={() => setSelectedPhysicist(null)}
                          className="absolute top-4 right-4 text-antimatter-textDim hover:text-antimatter-text transition-colors"
                        >
                          <X size={24} />
                        </button>
                        
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <div className="relative overflow-hidden rounded-lg bg-antimatter-gray/20 aspect-square">
                              <div className={`absolute top-0 left-0 h-1 w-full ${accentColor}`}></div>
                              {/* Placeholder for physicist image */}
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl font-bold text-antimatter-textDim opacity-20">
                                  {physicist.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:w-2/3">
                            <h3 className="text-2xl font-bold mb-2">{physicist.name}</h3>
                            
                            <div className={`h-1 w-20 ${accentColor} mb-4`}></div>
                            
                            <p className="text-antimatter-textDim italic mb-6">
                              "{physicist.quote}"
                            </p>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-lg font-semibold">Known For</h4>
                                <p className="text-antimatter-textDim">{physicist.knownFor}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-lg font-semibold">Biography</h4>
                                <p className="text-antimatter-textDim">{physicist.shortBio}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-lg font-semibold">Contribution to Antimatter Research</h4>
                                <p className="text-antimatter-textDim">{physicist.contribution}</p>
                              </div>
                              
                              {physicist.collaborators && physicist.collaborators.length > 0 && (
                                <div>
                                  <h4 className="text-lg font-semibold">Collaborators & Influences</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {physicist.collaborators.map(id => {
                                      const collaborator = physicists.find(p => p.id === id);
                                      return collaborator ? (
                                        <button 
                                          key={id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPhysicist(id);
                                          }}
                                          className={`px-3 py-1 rounded text-sm 
                                            ${collaborator.era === 'early' 
                                              ? 'bg-antimatter-blue/20 hover:bg-antimatter-blue/40' 
                                              : collaborator.era === 'mid' 
                                                ? 'bg-antimatter-yellow/20 hover:bg-antimatter-yellow/40' 
                                                : 'bg-antimatter-red/20 hover:bg-antimatter-red/40'
                                            } transition-colors`}
                                        >
                                          {collaborator.name}
                                        </button>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
} 