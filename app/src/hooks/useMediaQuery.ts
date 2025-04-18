import { useState, useEffect } from 'react';

/**
 * Custom hook to track the state of a CSS media query.
 * @param query The media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating whether the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Get initial state on the client side
    if (typeof window !== 'undefined') {
      return window.matchMedia(query.replace('@media ', '')).matches;
    }
    return false; // Default value for SSR
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query.replace('@media ', ''));

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    // Using addEventListener for modern browsers, addListener for older ones (optional fallback)
    try {
        mediaQueryList.addEventListener('change', listener);
    } catch (e) {
        // Fallback for older browsers
        mediaQueryList.addListener(listener);
    }

    // Set initial state correctly after hydration
    setMatches(mediaQueryList.matches);

    // Cleanup listener on component unmount
    return () => {
      try {
          mediaQueryList.removeEventListener('change', listener);
      } catch (e) {
          // Fallback for older browsers
          mediaQueryList.removeListener(listener);
      }
    };
  }, [query]); // Re-run effect if query changes

  return matches;
} 