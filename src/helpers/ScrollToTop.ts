import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation()

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Return null because this component doesn't render anything
  return null
}

export default ScrollToTop
