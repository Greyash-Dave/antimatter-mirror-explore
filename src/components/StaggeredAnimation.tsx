import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type StaggeredAnimationProps = {
  children: ReactNode[];
  className?: string;
  childClassName?: string;
  staggerDelay?: number;
  duration?: number;
  once?: boolean;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
};

const getDirectionVariants = (direction: string, distance: number) => {
  switch (direction) {
    case 'up':
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 }
      };
    case 'down':
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 }
      };
    case 'left':
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 }
      };
    case 'right':
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 }
      };
    default:
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 }
      };
  }
};

/**
 * A component that animates children with a staggered delay
 */
export default function StaggeredAnimation({
  children,
  className = '',
  childClassName = '',
  staggerDelay = 0.1,
  duration = 0.5,
  once = true,
  distance = 30,
  direction = 'up'
}: StaggeredAnimationProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = getDirectionVariants(direction, distance);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={childClassName}
          transition={{ 
            duration,
            type: "spring", 
            stiffness: 100, 
            damping: 12 
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
} 