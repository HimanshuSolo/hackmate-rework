'use client'

import { useState, useEffect } from 'react'

export const useScrollAnimation = () => {
  const [shouldMoveUp, setShouldMoveUp] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're on mobile device (width <= 640px)
      const isMobile = window.innerWidth <= 640
      
      if (!isMobile) {
        setShouldMoveUp(false)
        return
      }

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Calculate how close we are to the bottom
      const scrollBottom = scrollTop + windowHeight
      const distanceFromBottom = documentHeight - scrollBottom
      
      // Trigger animation when within 100px of the bottom
      const threshold = 100
      setShouldMoveUp(distanceFromBottom <= threshold)
    }

    const handleResize = () => {
      // Reset state when window is resized
      handleScroll()
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    // Check initial position
    handleScroll()
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { shouldMoveUp }
}