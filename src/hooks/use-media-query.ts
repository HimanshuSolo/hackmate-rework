'use client'

import { useState, useEffect } from 'react'

/**
 * A hook that returns a boolean indicating whether the current viewport matches
 * the given media query.
 * 
 * @param query The media query to check against
 * @returns Boolean indicating if the media query matches
 * 
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 * if (isDesktop) {
 *   // render desktop layout
 * } else {
 *   // render mobile layout
 * }
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    // Initial check in case the window is already defined
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query)
      
      // Set initial value
      setMatches(media.matches)
      
      // Create handler function
      const listener = () => setMatches(media.matches)
      
      // Add event listener
      media.addEventListener('change', listener)
      
      // Clean up
      return () => media.removeEventListener('change', listener)
    }
    
    // Return default value for SSR
    return undefined
  }, [query])
  
  return matches
}