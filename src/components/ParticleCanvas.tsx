
import { useRef, useEffect } from 'react';

interface ParticleCanvasProps {
  className?: string;
  particleCount?: number;
  particleSize?: number;
  matterColor?: string;
  antimatterColor?: string;
  energyColor?: string;
  speed?: number;
  interactive?: boolean;
}

export default function ParticleCanvas({
  className = "",
  particleCount = 50,
  particleSize = 2,
  matterColor = "#1a2b47", // Matter Blue
  antimatterColor = "#722f37", // Antimatter Red
  energyColor = "#f9d423", // Energy Yellow
  speed = 1,
  interactive = true
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Track mouse position for interactive mode
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      type: 'matter' | 'antimatter' | 'energy';
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * particleSize + 1;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = (Math.random() - 0.5) * speed;
        
        // Determine particle type
        const particleType = Math.random();
        if (particleType < 0.4) {
          this.type = 'matter';
          this.color = matterColor;
        } else if (particleType < 0.8) {
          this.type = 'antimatter';
          this.color = antimatterColor;
        } else {
          this.type = 'energy';
          this.color = energyColor;
          this.size = Math.random() * (particleSize * 1.5) + 1; // Energy particles slightly larger
        }
      }
      
      update() {
        // Move particles
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around canvas boundaries
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Interactive mode - particles drift toward mouse position
        if (interactive && (this.type === 'energy')) {
          const dx = mousePosition.current.x - this.x;
          const dy = mousePosition.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            this.speedX += dx * 0.0003;
            this.speedY += dy * 0.0003;
            
            // Cap speed
            const maxSpeed = 2;
            const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            if (currentSpeed > maxSpeed) {
              this.speedX = (this.speedX / currentSpeed) * maxSpeed;
              this.speedY = (this.speedY / currentSpeed) * maxSpeed;
            }
          }
        }
      }
      
      draw() {
        // Draw glow effect for energy particles
        if (this.type === 'energy') {
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between close particles
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            // Only connect similar particle types
            if (particles[i].type === particles[j].type || 
                particles[i].type === 'energy' || 
                particles[j].type === 'energy') {
              ctx.strokeStyle = particles[i].type === 'energy' || particles[j].type === 'energy' 
                ? energyColor : particles[i].color;
              ctx.globalAlpha = 1 - distance / 100;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [particleCount, particleSize, matterColor, antimatterColor, energyColor, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  );
}
