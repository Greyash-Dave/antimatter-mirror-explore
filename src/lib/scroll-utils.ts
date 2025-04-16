/**
 * Smooth scroll to an element with highlighting effect
 * @param id - The ID of the element to scroll to
 * @param options - Additional options for scrolling
 */
export const smoothScrollToElement = (
  id: string, 
  options: { 
    highlight?: boolean;
    offset?: number;
    duration?: number;
  } = {}
) => {
  const {
    highlight = true,
    offset = 0,
    duration = 1500
  } = options;
  
  const element = document.getElementById(id);
  if (!element) return;
  
  // Get the element's position
  const rect = element.getBoundingClientRect();
  const offsetTop = window.pageYOffset + rect.top - (offset || 0);
  
  // Use proper smooth scrolling with enhanced easing
  try {
    // Use scrollIntoView with behavior: smooth for better browser support
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Adjust for offset if needed
    if (offset) {
      // Small timeout to let scrollIntoView start working
      setTimeout(() => {
        window.scrollBy({
          top: -offset,
          behavior: 'smooth'
        });
      }, 50);
    }
  } catch (error) {
    // Fallback for older browsers
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
  
  // Add a visual cue for the section being navigated to
  if (highlight) {
    // Small delay to ensure highlighting happens after scrolling starts
    setTimeout(() => {
      element.classList.add('highlight-section');
      
      setTimeout(() => {
        element.classList.remove('highlight-section');
      }, duration);
    }, 100);
  }
};

/**
 * Handle click on anchor links with smooth scrolling
 * @param e - Click event
 * @param targetId - Target element ID
 */
export const handleSmoothScrollLinkClick = (
  e: React.MouseEvent<HTMLAnchorElement>, 
  targetId: string
) => {
  e.preventDefault();
  smoothScrollToElement(targetId);
};

/**
 * Scroll to the next section
 * @param currentSectionId - Current section ID
 */
export const scrollToNextSection = (currentSectionId: string) => {
  const sections = [
    'hero',
    'mirror',
    'annihilation',
    'accelerator',
    'uses',
    'mystery',
    'learn'
  ];
  
  const currentIndex = sections.indexOf(currentSectionId);
  if (currentIndex >= 0 && currentIndex < sections.length - 1) {
    smoothScrollToElement(sections[currentIndex + 1]);
  }
}; 