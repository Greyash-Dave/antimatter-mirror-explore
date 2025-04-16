import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { smoothScrollToElement, handleSmoothScrollLinkClick } from '@/lib/scroll-utils';

interface NavigationLink {
  id: string;
  label: string;
}

const links: NavigationLink[] = [
  { id: 'hero', label: 'Home' },
  { id: 'mirror', label: 'Mirror World' },
  { id: 'annihilation', label: 'Annihilation' },
  { id: 'accelerator', label: 'Accelerator Ring' },
  { id: 'uses', label: 'Applications' },
  { id: 'physicists', label: 'Pioneers' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'learn', label: 'Learn More' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      
      // Determine active section
      const sections = links.map(link => document.getElementById(link.id))
                          .filter(section => section !== null) as HTMLElement[];
      
      const current = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });
      
      if (current) {
        setActiveSection(current.id);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (id: string) => {
    // Prevent default navigation behavior
    if (typeof window !== 'undefined') {
      // Force the new scroll position to be calculated from the current scroll position
      const element = document.getElementById(id);
      if (element) {
        // Calculate position for smoother effect
        smoothScrollToElement(id, { 
          offset: 80, // Slightly larger offset to account for fixed header
          highlight: true  
        });
      }
    }
    
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Skip to content - accessibility */}
      <a 
        href="#hero" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-antimatter-blue focus:text-white focus:p-4"
        onClick={(e) => handleSmoothScrollLinkClick(e, 'hero')}
      >
        Skip to content
      </a>
    
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-antimatter-yellow transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent px-4 py-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-antimatter-red animate-pulse-glow"></div>
            <span className="font-exo font-bold text-xl hidden md:block">Antimatter</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  activeSection === link.id 
                    ? "text-antimatter-yellow" 
                    : "text-antimatter-textDim hover:text-antimatter-text"
                )}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-antimatter-yellow rounded-full" />
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-antimatter-text"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black bg-opacity-95 border-t border-antimatter-gray animate-fade-in-up">
            <div className="py-4 px-4 flex flex-col space-y-4">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={cn(
                    "text-base py-2 transition-colors",
                    activeSection === link.id 
                      ? "text-antimatter-yellow font-medium" 
                      : "text-antimatter-textDim"
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
