import useIsSmallScreen from '@/hooks/useIsSmallScreen'
import { AgentContextType } from '@/types/types'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

const AgentContext = createContext<AgentContextType | null>(null)

const useAgentContext = () => {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgentContext must be used within an AppProvider')
  }
  return context
}

type AgentProviderProps = {
  children: ReactNode
}

const AgentProvider = ({ children }: AgentProviderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const isSmallScreen = useIsSmallScreen(1100)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(false)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <AgentContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isSmallScreen,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}

export { useAgentContext, AgentProvider }
