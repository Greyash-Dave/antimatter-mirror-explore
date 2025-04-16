
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define particle types with their properties
const particleTypes = {
  electron: {
    name: 'Electron',
    antiName: 'Positron',
    color: '#1a2b47',
    antiColor: '#722f37',
    size: 20,
    energy: 0.511, // MeV
  },
  proton: {
    name: 'Proton',
    antiName: 'Antiproton',
    color: '#1e40af',
    antiColor: '#991b1b',
    size: 30,
    energy: 938.27, // MeV
  },
  neutron: {
    name: 'Neutron',
    antiName: 'Antineutron',
    color: '#374151',
    antiColor: '#4c1d95',
    size: 30,
    energy: 939.57, // MeV
  }
};

export default function AnnihilationSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [particleCount, setParticleCount] = useState(0);
  const [selectedParticleType, setSelectedParticleType] = useState('electron');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
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
    setEnergy(0);
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
    
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particleType = particleTypes[selectedParticleType as keyof typeof particleTypes];
    
    // Create initial matter and antimatter particles
    particles.current = [
      // Matter particle
      {
        x: canvas.width * 0.25,
        y: canvas.height / 2,
        size: particleType.size,
        color: particleType.color,
        speedX: 1.5,
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
        speedX: -1.5,
        speedY: 0,
        type: 'antimatter',
        life: 100,
        maxLife: 100
      }
    ];
    
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      let matterParticle = particles.current.find(p => p.type === 'matter');
      let antimatterParticle = particles.current.find(p => p.type === 'antimatter');
      
      // Check for collision between matter and antimatter
      if (matterParticle && antimatterParticle) {
        const dx = matterParticle.x - antimatterParticle.x;
        const dy = matterParticle.y - antimatterParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < matterParticle.size + antimatterParticle.size) {
          // Collision occurred - annihilation
          const centerX = (matterParticle.x + antimatterParticle.x) / 2;
          const centerY = (matterParticle.y + antimatterParticle.y) / 2;
          
          // Remove the original particles
          particles.current = particles.current.filter(
            p => p.type !== 'matter' && p.type !== 'antimatter'
          );
          
          // Create energy flash
          ctx.fillStyle = '#f9d423';
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          
          // Calculate energy based on selected particle type
          const newEnergyAmount = Math.round(particleType.energy * 2);
          setEnergy(prev => prev + newEnergyAmount);
          
          // Create energy particles
          const particleNum = 80;
          for (let i = 0; i < particleNum; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            
            particles.current.push({
              x: centerX,
              y: centerY,
              size: 2 + Math.random() * 4,
              color: '#f9d423',
              speedX: Math.cos(angle) * speed,
              speedY: Math.sin(angle) * speed,
              type: 'energy',
              life: 50 + Math.random() * 100,
              maxLife: 150
            });
          }
          
          setParticleCount(prev => prev + particleNum);
          
          // Show E=mc² formula
          ctx.font = 'bold 32px "Space Mono", monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('E = mc²', centerX, centerY - 80);
        }
      }
      
      // Draw and update all particles
      particles.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Reduce life for energy particles
        if (particle.type === 'energy') {
          particle.life--;
          
          // Remove dead particles
          if (particle.life <= 0) {
            particles.current.splice(index, 1);
            return;
          }
          
          // Fade out based on remaining life
          const opacity = particle.life / particle.maxLife;
          particle.color = `rgba(249, 212, 35, ${opacity})`;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        
        // Add glow effect for energy particles
        if (particle.type === 'energy') {
          ctx.shadowColor = '#f9d423';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });
      
      // Draw energy counter
      ctx.font = '18px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`Energy Released: ${energy.toLocaleString()} MeV`, 20, 30);
      ctx.fillText(`Particles: ${particleCount}`, 20, 60);
      
      // Continue animation if playing
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const toggleSimulation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      startSimulation();
    }
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
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
          <span className="text-antimatter-yellow">Annihilation</span>
        </h2>
        
        <p className="text-center max-w-3xl mx-auto mb-8 text-lg text-antimatter-textDim">
          When matter meets antimatter, both are destroyed in a burst of pure energy.
          This process, called annihilation, converts 100% of their mass into energy according to Einstein's famous equation E=mc².
        </p>
        
        <div className="flex-1 flex flex-col bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 bg-black bg-opacity-40">
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
              
              <div className="flex gap-3">
                <button
                  onClick={toggleSimulation}
                  className="btn-primary flex items-center gap-2"
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
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw size={18} /> Reset
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 relative">
            <canvas 
              ref={canvasRef} 
              className="w-full h-[400px] rounded-lg"
            ></canvas>
          </div>
        </div>
        
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
