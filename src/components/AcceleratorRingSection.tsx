import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Clock, Rewind, FastForward, Pause, Play, ZoomIn, ZoomOut } from 'lucide-react';
import AnimatedSection, { AnimateOnScroll } from './AnimatedSection';
import { motion } from 'framer-motion';

export default function AcceleratorRingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(1.0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(500);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const heatmapRef = useRef<THREE.Mesh | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000814);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      2000
    );
    camera.position.set(0, 200, cameraDistance);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);
    
    // Post-processing for bloom effects
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,  // bloom strength
      0.4,  // bloom radius
      0.85  // bloom threshold
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Update camera position when cameraDistance changes
    camera.position.z = cameraDistance;
    camera.updateProjectionMatrix();
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(1, 3, 2);
    scene.add(dirLight);
    
    // Accelerator ring components
    const ringRadius = 200;
    const tubeRadius = 5;
    const ringGeometry = new THREE.TorusGeometry(ringRadius, tubeRadius, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a4365,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    // Add detection chambers (4 at different points of the ring)
    const chamberGeometry = new THREE.CylinderGeometry(25, 25, 40, 32);
    const chamberMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a5568,
      metalness: 0.6,
      roughness: 0.2,
    });
    
    const chambers = [];
    const chamberPositions = [
      { x: ringRadius, y: 0, z: 0, angle: 0 },
      { x: 0, y: 0, z: ringRadius, angle: Math.PI / 2 },
      { x: -ringRadius, y: 0, z: 0, angle: Math.PI },
      { x: 0, y: 0, z: -ringRadius, angle: -Math.PI / 2 }
    ];
    
    for (let pos of chamberPositions) {
      const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
      chamber.position.set(pos.x, 0, pos.z);
      chamber.rotation.y = pos.angle;
      scene.add(chamber);
      chambers.push(chamber);
    }
    
    // Particle beams
    const beam1Material = new THREE.MeshBasicMaterial({ 
      color: 0x3182ce, 
      transparent: true, 
      opacity: 0.8 
    });
    
    const beam2Material = new THREE.MeshBasicMaterial({ 
      color: 0xe53e3e, 
      transparent: true, 
      opacity: 0.8 
    });
    
    const particleCount = 100;
    const particleSize = 1.5;
    const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
    
    const particles1: THREE.Mesh[] = [];
    const particles2: THREE.Mesh[] = [];
    
    // Create particles for beam 1
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;
      
      const particle = new THREE.Mesh(particleGeometry, beam1Material.clone());
      particle.position.set(x, 0, z);
      particle.userData = { angle, speed: 0.01 + Math.random() * 0.002 };
      scene.add(particle);
      particles1.push(particle);
    }
    
    // Create particles for beam 2 (opposite direction)
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;
      
      const particle = new THREE.Mesh(particleGeometry, beam2Material.clone());
      particle.position.set(x, 0, z);
      particle.userData = { angle, speed: 0.01 + Math.random() * 0.002 };
      scene.add(particle);
      particles2.push(particle);
    }
    
    // Collision effects
    const collisionEffects: {
      mesh: THREE.Mesh,
      lifetime: number,
      maxLifetime: number,
      position: THREE.Vector3
    }[] = [];
    
    // Heat map for energy distribution
    const heatmapSize = 40;
    const heatmapGeometry = new THREE.PlaneGeometry(400, 400, heatmapSize - 1, heatmapSize - 1);
    
    // Use position for colors
    const heatmapVertices = heatmapGeometry.attributes.position.array;
    const colors = new Float32Array(heatmapVertices.length);
    
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = 0;     // R
      colors[i + 1] = 0; // G
      colors[i + 2] = 0; // B
    }
    
    heatmapGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const heatmapMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    
    const heatmap = new THREE.Mesh(heatmapGeometry, heatmapMaterial);
    heatmapRef.current = heatmap;
    heatmap.rotation.x = -Math.PI / 2;
    heatmap.visible = showHeatmap;
    scene.add(heatmap);
    
    // Function to update heatmap based on collision positions
    const updateHeatmap = (position: THREE.Vector3, intensity: number) => {
      const colors = heatmapGeometry.attributes.color.array;
      const positions = heatmapGeometry.attributes.position.array;
      
      // Update color values based on distance to collision
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        
        const dx = x - position.x;
        const dz = z - position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Influence radius
        const radius = 50;
        
        if (distance < radius) {
          // Heat increases with proximity to collision
          const heat = 1 - distance / radius;
          
          // Add heat to the existing color
          colors[i] = Math.min(1, colors[i] + heat * intensity * 0.5); // Red
          colors[i + 1] = Math.min(1, colors[i + 1] + heat * intensity * 0.3); // Green
          colors[i + 2] = Math.min(1, colors[i + 2] + heat * intensity * 0.1); // Blue
        }
      }
      
      heatmapGeometry.attributes.color.needsUpdate = true;
    };
    
    // Create initial heat for visibility
    const addInitialHeat = () => {
      // Add some initial heat spots for better visibility
      for (const pos of chamberPositions) {
        updateHeatmap(new THREE.Vector3(pos.x, 0, pos.z), 0.8);
      }
    };
    
    // Initialize heatmap with some data
    addInitialHeat();
    
    // Animation loop
    const clock = new THREE.Clock();
    let lastTime = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta() * timeScale;
      
      if (isPlaying) {
        // Move particles in beam 1 (clockwise)
        for (const particle of particles1) {
          particle.userData.angle += particle.userData.speed * delta * 30;
          const x = Math.cos(particle.userData.angle) * ringRadius;
          const z = Math.sin(particle.userData.angle) * ringRadius;
          particle.position.set(x, 0, z);
        }
        
        // Move particles in beam 2 (counter-clockwise)
        for (const particle of particles2) {
          particle.userData.angle -= particle.userData.speed * delta * 30;
          const x = Math.cos(particle.userData.angle) * ringRadius;
          const z = Math.sin(particle.userData.angle) * ringRadius;
          particle.position.set(x, 0, z);
        }
        
        // Check for collisions at detection chambers
        for (let i = 0; i < particles1.length; i++) {
          for (let j = 0; j < particles2.length; j++) {
            const p1 = particles1[i];
            const p2 = particles2[j];
            
            const dx = p1.position.x - p2.position.x;
            const dz = p1.position.z - p2.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            // Particles are close enough to collide
            if (distance < 5) {
              // Only collide near detector chambers (cross check with chamber positions)
              for (const pos of chamberPositions) {
                const dx1 = p1.position.x - pos.x;
                const dz1 = p1.position.z - pos.z;
                const chamberDistance = Math.sqrt(dx1 * dx1 + dz1 * dz1);
                
                if (chamberDistance < 30) {
                  // Create collision effect
                  const explosionGeometry = new THREE.SphereGeometry(1, 8, 8);
                  const explosionMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffdd00,
                    transparent: true,
                    opacity: 0.8
                  });
                  
                  const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
                  explosion.position.set(
                    (p1.position.x + p2.position.x) / 2,
                    0,
                    (p1.position.z + p2.position.z) / 2
                  );
                  
                  scene.add(explosion);
                  
                  const lifetime = 1.5 + Math.random() * 0.5;
                  collisionEffects.push({
                    mesh: explosion,
                    lifetime: lifetime,
                    maxLifetime: lifetime,
                    position: explosion.position.clone()
                  });
                  
                  // Update heatmap with collision data
                  if (showHeatmap) {
                    updateHeatmap(explosion.position, 0.2);
                  }
                  
                  // Make particles invisible for a while (they've collided)
                  p1.visible = false;
                  p2.visible = false;
                  
                  // Reset particles to appear somewhere else on the ring
                  setTimeout(() => {
                    p1.visible = true;
                    p2.visible = true;
                    
                    // New random position on the ring
                    const newAngle1 = Math.random() * Math.PI * 2;
                    p1.userData.angle = newAngle1;
                    p1.position.x = Math.cos(newAngle1) * ringRadius;
                    p1.position.z = Math.sin(newAngle1) * ringRadius;
                    
                    const newAngle2 = Math.random() * Math.PI * 2;
                    p2.userData.angle = newAngle2;
                    p2.position.x = Math.cos(newAngle2) * ringRadius;
                    p2.position.z = Math.sin(newAngle2) * ringRadius;
                  }, 1000);
                  
                  break;
                }
              }
            }
          }
        }
        
        // Update collision effects
        for (let i = collisionEffects.length - 1; i >= 0; i--) {
          const effect = collisionEffects[i];
          effect.lifetime -= delta;
          
          if (effect.lifetime <= 0) {
            scene.remove(effect.mesh);
            collisionEffects.splice(i, 1);
          } else {
            // Scale up the explosion
            const scale = 4 * (1 - effect.lifetime / effect.maxLifetime) + 1;
            effect.mesh.scale.set(scale, scale, scale);
            
            // Fade out
            const material = effect.mesh.material as THREE.MeshBasicMaterial;
            material.opacity = effect.lifetime / effect.maxLifetime;
          }
        }
      }
      
      // Update heatmap visibility
      if (heatmapRef.current) {
        heatmapRef.current.visible = showHeatmap;
        
        // Make it more visible by raising it slightly
        heatmapRef.current.position.y = 2;
        
        // Update heatmap materials
        const heatmapMat = heatmapRef.current.material as THREE.MeshBasicMaterial;
        heatmapMat.wireframe = false;
        heatmapMat.opacity = showHeatmap ? 0.7 : 0;
      }
      
      controls.update();
      composer.render();
    };
    
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of all geometries and materials
      ringGeometry.dispose();
      ringMaterial.dispose();
      chamberGeometry.dispose();
      chamberMaterial.dispose();
      particleGeometry.dispose();
      beam1Material.dispose();
      beam2Material.dispose();
      heatmapGeometry.dispose();
      heatmapMaterial.dispose();
      
      // Remove all objects from the scene
      scene.clear();
    };
  }, []);  // Only run on mount
  
  // Create separate effect to handle control changes
  useEffect(() => {
    if (!sceneRef.current || !heatmapRef.current) return;
    
    // Update heatmap visibility
    heatmapRef.current.visible = showHeatmap;
    
    // Add some initial heat if just turned on
    if (showHeatmap && containerRef.current) {
      // Force heatmap to be more visible
      const heatmapMat = heatmapRef.current.material as THREE.MeshBasicMaterial;
      heatmapMat.wireframe = false;
      heatmapMat.opacity = 0.7;
      heatmapRef.current.position.y = 2;
    }
    
  }, [showHeatmap]);
  
  // Handle camera distance changes
  useEffect(() => {
    const canvas = containerRef.current;
    if (!canvas) return;
    
    const resize = new Event('resize');
    window.dispatchEvent(resize);
    
  }, [cameraDistance]);
  
  return (
    <section id="accelerator" className="section bg-gradient-to-r from-antimatter-blue/30 to-antimatter-red/30">
      <div className="container mx-auto flex flex-col h-full">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
            <span className="text-antimatter-yellow">Accelerator Ring</span>
          </h2>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.2}>
          <p className="text-center max-w-3xl mx-auto mb-8 text-lg text-antimatter-textDim">
            Particle accelerators propel charged particles to near light speed. 
            When these high-energy particles collide in detection chambers, they 
            create conditions similar to those moments after the Big Bang, allowing 
            scientists to study fundamental physics.
          </p>
        </AnimateOnScroll>
        
        <AnimateOnScroll variant="fadeIn" delay={0.3} className="flex-1 flex flex-col bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-xl">
          <motion.div 
            className="p-4 bg-black bg-opacity-40"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-wrap justify-between gap-4">
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button
                  onClick={() => setIsPlaying(prev => !prev)}
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
                      <Play size={18} /> Play
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setTimeScale(0.2)}
                  className={`btn-secondary flex items-center gap-2 ${timeScale === 0.2 ? 'bg-antimatter-blue/50' : ''}`}
                  title="Slow Motion"
                  aria-label="Slow motion"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rewind size={18} />
                </motion.button>
                
                <motion.button
                  onClick={() => setTimeScale(1.0)}
                  className={`btn-secondary flex items-center gap-2 ${timeScale === 1.0 ? 'bg-antimatter-blue/50' : ''}`}
                  title="Normal Speed"
                  aria-label="Normal speed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Clock size={18} />
                </motion.button>
                
                <motion.button
                  onClick={() => setTimeScale(3.0)}
                  className={`btn-secondary flex items-center gap-2 ${timeScale === 3.0 ? 'bg-antimatter-blue/50' : ''}`}
                  title="Fast Forward"
                  aria-label="Fast forward"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FastForward size={18} />
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.button
                  onClick={() => setCameraDistance(prev => Math.min(prev + 100, 1000))}
                  className="btn-secondary flex items-center gap-2"
                  title="Zoom Out"
                  aria-label="Zoom out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ZoomOut size={18} />
                </motion.button>
                
                <motion.button
                  onClick={() => setCameraDistance(prev => Math.max(prev - 100, 100))}
                  className="btn-secondary flex items-center gap-2"
                  title="Zoom In"
                  aria-label="Zoom in"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ZoomIn size={18} />
                </motion.button>
                
                <motion.button
                  onClick={() => setShowHeatmap(prev => !prev)}
                  className={`btn-secondary flex items-center gap-2 ${showHeatmap ? 'bg-antimatter-red/50' : ''}`}
                  aria-label={showHeatmap ? "Hide heatmap" : "Show heatmap"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            ref={containerRef} 
            className="flex-1 min-h-[500px] relative"
            role="region"
            aria-label="Interactive 3D particle accelerator simulation"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          ></motion.div>
        </AnimateOnScroll>
        
        <AnimateOnScroll delay={0.8} className="mt-8 bg-black bg-opacity-30 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">How It Works</h3>
          <p className="text-antimatter-textDim">
            In this simulation, two beams of particles travel in opposite directions around the accelerator ring.
            When they cross paths at detection chambers, collisions can occur, releasing energy and creating new particles.
            Scientists analyze these collision products to understand the fundamental building blocks of our universe.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
} 