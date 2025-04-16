import React, { ReactNode } from 'react';
import { motion, useAnimation, Variant } from 'framer-motion';
import { useInView } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  duration?: number;
  /** Animation variant to use (defaults to fadeInUp) */
  variant?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'zoomIn' | 'scaleIn';
  /** Amount of element that needs to be in view before animation starts (0-1) */
  threshold?: number;
  /** Whether to animate only once or every time element comes into view */
  once?: boolean;
}

const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: 75 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: -75 },
    visible: { opacity: 1, x: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  }
};

export default function AnimatedSection({
  children,
  id,
  className = '',
  delay = 0,
  duration = 0.6,
  variant = 'fadeInUp',
  threshold = 0.15,
  once = true
}: AnimatedSectionProps) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold
  });
  
  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, isInView, once]);
  
  const selectedVariant = variants[variant];
  
  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={controls}
      variants={selectedVariant}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A component that animates its children when they come into view
 */
export function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  variant = 'fadeInUp',
  threshold = 0.15,
  once = true
}: Omit<AnimatedSectionProps, 'id'>) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold
  });
  
  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, isInView, once]);
  
  const selectedVariant = variants[variant];
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={selectedVariant}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
} 