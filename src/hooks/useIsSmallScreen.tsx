import { useState, useEffect } from 'react'

const useIsSmallScreen = (breakpoint = 768) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint)
    }

    // Check if window is defined to handle server-side rendering
    if (typeof window !== 'undefined') {
      setIsSmallScreen(window.innerWidth < breakpoint)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      // Clean up the event listener
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [breakpoint])

  return isSmallScreen
}

export default useIsSmallScreen
