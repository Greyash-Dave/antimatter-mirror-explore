import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimatedSection, { AnimateOnScroll } from './AnimatedSection';
import { motion } from 'framer-motion';

// Define particle types with their properties
const particleTypes = {
  electron: {
    name: 'Electron',
    antiName: 'Positron',
    color: '#1a2b47',
    antiColor: '#722f37',
    size: 20,
    energy: 0.511, // MeV
    energyJoules: 1.64e-13 // Joules
  },
  proton: {
    name: 'Proton',
    antiName: 'Antiproton',
    color: '#1e40af',
    antiColor: '#991b1b',
    size: 30,
    energy: 938.27, // MeV
    energyJoules: 3.00e-10 // Joules
  },
  neutron: {
    name: 'Neutron',
    antiName: 'Antineutron',
    color: '#374151',
    antiColor: '#4c1d95',
    size: 30,
    energy: 939.57, // MeV
    energyJoules: 3.01e-10 // Joules
  }
};

export default function AnnihilationSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [energyJoules, setEnergyJoules] = useState(0);
  const [particleCount, setParticleCount] = useState(0);
  const [selectedParticleType, setSelectedParticleType] = useState('electron');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  
  const particles = useRef<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    type: 'matter' | 'antimatter' | 'energy';
    life: number;
    maxLife: number;
  }[]>([]);
  
  const resetSimulation = () => {
    setIsPlaying(false);
    hasStartedRef.current = false;
    setEnergy(0);
    setEnergyJoules(0);
    setParticleCount(0);
    particles.current = [];
    
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    
    drawInitialScene();
  };
  
  const drawInitialScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particleType = particleTypes[selectedParticleType as keyof typeof particleTypes];
    
    // Draw matter particle on left
    ctx.beginPath();
    ctx.arc(canvas.width * 0.25, canvas.height / 2, particleType.size, 0, Math.PI * 2);
    ctx.fillStyle = particleType.color;
    ctx.fill();
    
    // Draw antimatter particle on right
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75, canvas.height / 2, particleType.size, 0, Math.PI * 2);
    ctx.fillStyle = particleType.antiColor;
    ctx.fill();
    
    // Draw labels
    ctx.font = '16px "Exo 2", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(particleType.name, canvas.width * 0.25, canvas.height / 2 + 60);
    ctx.fillText(particleType.antiName, canvas.width * 0.75, canvas.height / 2 + 60);
    
    // Draw arrow indicating they'll meet
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.30, canvas.height / 2);
    ctx.lineTo(canvas.width * 0.70, canvas.height / 2);
    ctx.strokeStyle = '#f9d423'; // Energy Yellow
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw arrowheads
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.35, canvas.height / 2 - 10);
    ctx.lineTo(canvas.width * 0.30, canvas.height / 2);
    ctx.lineTo(canvas.width * 0.35, canvas.height / 2 + 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.65, canvas.height / 2 - 10);
    ctx.lineTo(canvas.width * 0.70, canvas.height / 2);
    ctx.lineTo(canvas.width * 0.65, canvas.height / 2 + 10);
    ctx.stroke();
  };
  
  const startSimulation = () => {
    setIsPlaying(true);
    hasStartedRef.current = true;
    
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particleType = particleTypes[selectedParticleType as keyof typeof particleTypes];
    const centerX = canvas.width / 2;
    
    // Create initial matter and antimatter particles
    particles.current = [
      // Matter particle
      {
        x: canvas.width * 0.25,
        y: canvas.height / 2,
        size: particleType.size,
        color: particleType.color,
        speedX: 3.5,
        speedY: 0,
        type: 'matter',
        life: 100,
        maxLife: 100
      },
      // Antimatter particle
      {
        x: canvas.width * 0.75,
        y: canvas.height / 2,
        size: particleType.size,
        color: particleType.antiColor,
        speedX: -3.5,
        speedY: 0,
        type: 'antimatter',
        life: 100,
        maxLife: 100
      }
    ];

    let hasCollided = false;
    
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      let matterParticle = particles.current.find(p => p.type === 'matter');
      let antimatterParticle = particles.current.find(p => p.type === 'antimatter');
      
      if (matterParticle && antimatterParticle && !hasCollided) {
        // Update positions
        matterParticle.x += matterParticle.speedX;
        antimatterParticle.x += antimatterParticle.speedX;
        
        // Calculate distance between particles
        const dx = matterParticle.x - antimatterParticle.x;
        const dy = matterParticle.y - antimatterParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check for collision
        if (distance < matterParticle.size + antimatterParticle.size) {
          hasCollided = true;
          const collisionX = (matterParticle.x + antimatterParticle.x) / 2;
          const collisionY = (matterParticle.y + antimatterParticle.y) / 2;
          
          // Initial flash
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 5; i++) {
            const radius = (i + 1) * 30;
            const alpha = 0.8 - i * 0.15;
            ctx.beginPath();
            ctx.arc(collisionX, collisionY, radius, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
              collisionX, collisionY, 0,
              collisionX, collisionY, radius
            );
            gradient.addColorStop(0, `rgba(249, 212, 35, ${alpha})`);
            gradient.addColorStop(1, 'rgba(249, 212, 35, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
          }
          ctx.globalCompositeOperation = 'source-over';
          
          // Calculate and display energy
          const newEnergyAmount = Math.round(particleType.energy * 2);
          const newEnergyJoules = particleType.energyJoules;
          setEnergy(prev => prev + newEnergyAmount);
          setEnergyJoules(prev => prev + newEnergyJoules);
          
          // Create energy particles
          const particleNum = 150; // Increased for better effect
          for (let i = 0; i < particleNum; i++) {
            const angle = (Math.PI * 2 * i) / particleNum;
            const speed = 1 + Math.random() * 3;
            const size = 1 + Math.random() * 3;
            const life = 100 + Math.random() * 100;
            
            particles.current.push({
              x: collisionX,
              y: collisionY,
              size: size,
              color: '#f9d423',
              speedX: Math.cos(angle) * speed,
              speedY: Math.sin(angle) * speed,
              type: 'energy',
              life: life,
              maxLife: life
            });
          }
          
          // Remove original particles
          particles.current = particles.current.filter(
            p => p.type === 'energy'
          );
          
          setParticleCount(prev => prev + particleNum);
          
          // Show energy formula and values with glow effect
          ctx.shadowColor = '#f9d423';
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          
          ctx.font = 'bold 36px "Space Mono", monospace';
          ctx.fillText('E = mc²', collisionX, collisionY - 100);
          
          ctx.font = 'bold 24px "Space Mono", monospace';
          ctx.fillText(`${newEnergyAmount.toFixed(3)} MeV`, collisionX, collisionY - 60);
          ctx.fillText(`${newEnergyJoules.toExponential(2)} J`, collisionX, collisionY - 20);
          
          ctx.shadowBlur = 0;
        } else {
          // Draw particles before collision
          // Matter particle
          ctx.beginPath();
          ctx.arc(matterParticle.x, matterParticle.y, matterParticle.size, 0, Math.PI * 2);
          ctx.fillStyle = matterParticle.color;
          ctx.fill();
          
          // Antimatter particle
          ctx.beginPath();
          ctx.arc(antimatterParticle.x, antimatterParticle.y, antimatterParticle.size, 0, Math.PI * 2);
          ctx.fillStyle = antimatterParticle.color;
          ctx.fill();
          
          // Draw particle labels
          ctx.font = '16px "Exo 2", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(particleType.name, matterParticle.x, matterParticle.y + 40);
          ctx.fillText(particleType.antiName, antimatterParticle.x, antimatterParticle.y + 40);
        }
      }
      
      // Update and draw energy particles
      ctx.globalCompositeOperation = 'lighter';
      particles.current = particles.current.filter((particle, index) => {
        if (particle.type === 'energy') {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.life--;
          
          if (particle.life <= 0) return false;
          
          const opacity = Math.pow(particle.life / particle.maxLife, 1.5);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, `rgba(249, 212, 35, ${opacity})`);
          gradient.addColorStop(1, 'rgba(249, 212, 35, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
          
          return true;
        }
        return true;
      });
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw energy counters with glow effect
      ctx.font = '20px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.shadowColor = '#f9d423';
      ctx.shadowBlur = 5;
      ctx.fillText(`Energy Released: ${energy.toLocaleString()} MeV`, 20, 30);
      ctx.fillText(`Energy (Joules): ${energyJoules.toExponential(2)} J`, 20, 60);
      ctx.fillText(`Particles: ${particleCount}`, 20, 90);
      ctx.shadowBlur = 0;
      
      // Continue animation if playing
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const handleParticleChange = (value: string) => {
    setSelectedParticleType(value);
    resetSimulation();
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 400;
      }
      
      // Redraw the scene when canvas is resized
      if (!isPlaying) {
        drawInitialScene();
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawInitialScene();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedParticleType]);

  return (
    <section id="annihilation" className="section bg-gradient-to-r from-antimatter-blue/30 to-antimatter-red/30">
      <div className="container mx-auto flex flex-col h-full">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
            <span className="text-antimatter-yellow">Annihilation</span>
          </h2>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.2}>
          <p className="text-center max-w-3xl mx-auto mb-8 text-lg text-antimatter-textDim">
            When matter meets antimatter, both are destroyed in a burst of pure energy.
            This process, called annihilation, converts 100% of their mass into energy according to Einstein's famous equation E=mc².
          </p>
        </AnimateOnScroll>
        
        <AnimateOnScroll 
          variant="fadeIn" 
          delay={0.3} 
          className="flex-1 flex flex-col bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-xl"
        >
          <motion.div 
            className="p-4 bg-black bg-opacity-40"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-auto">
                <label className="block text-antimatter-textDim mb-2">Select Particle Pair:</label>
                <Select value={selectedParticleType} onValueChange={handleParticleChange}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-black bg-opacity-50 border-antimatter-blue/50">
                    <SelectValue placeholder="Select particles" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-antimatter-blue/50">
                    <SelectItem value="electron">Electron / Positron</SelectItem>
                    <SelectItem value="proton">Proton / Antiproton</SelectItem>
                    <SelectItem value="neutron">Neutron / Antineutron</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <motion.div 
                className="flex gap-3"
                whileInView={{ opacity: [0, 1], x: [20, 0] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.button
                  onClick={startSimulation}
                  className="btn-primary flex items-center gap-2"
                  aria-label={isPlaying ? "Pause animation" : "Play animation"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={18} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={18} /> {energy > 0 ? 'Resume' : 'Start Collision'}
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={resetSimulation}
                  className="btn-secondary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw size={18} /> Reset
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-[400px] bg-black"
            />
          </motion.div>
        </AnimateOnScroll>
        
        <div className="mt-8 bg-black bg-opacity-30 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Did You Know?</h3>
          <p className="text-antimatter-textDim">
            Just one gram of antimatter annihilating with one gram of matter would release energy equivalent to a 43-kiloton bomb —
            almost 3 times the energy of the atomic bomb dropped on Hiroshima.
            This makes antimatter the most energy-dense fuel known to science.
          </p>
        </div>
      </div>
    </section>
  );
}
