import { useEffect } from 'react';
import { smoothScrollToElement } from '@/lib/scroll-utils';

/**
 * Provider component that adds smooth scrolling behavior to all anchor links
 * with fragment identifiers (e.g., href="#section-id")
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to handle clicks on anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      // Skip if the link has already been handled by other event handlers
      if (e.defaultPrevented) return;
      
      // Check if this is an internal anchor link
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      // Extract the ID from the href
      const id = href.substring(1);
      if (!id) return;
      
      // Prevent default link behavior and scroll to the element
      e.preventDefault();
      
      // Use a short delay to ensure other click handlers have executed first
      setTimeout(() => {
        smoothScrollToElement(id, { 
          offset: 80, 
          highlight: true 
        });
      }, 10);
    };
    
    // Add click event listener to the document
    document.addEventListener('click', handleAnchorClick);
    
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return <>{children}</>;
} 