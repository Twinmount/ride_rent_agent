import { useAgentContext } from '@/context/AgentContext'
import { BellPlus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const NewUpdateSidebar = () => {
  const { toggleSidebar } = useAgentContext()
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (link: string) => {
    navigate(link)
    toggleSidebar()
  }

  const isActive = location.pathname.startsWith('/new-updates')

  return (
    <div
      onClick={() => handleClick('/new-updates')}
      className={`w-[95%] relative  mx-auto flex items-center gap-2 h-12 py-2 px-4 rounded-lg transition-all duration-100 ease-out ${
        isActive
          ? 'bg-yellow text-white hover:text-white'
          : 'hover:text-yellow hover:bg-slate-100'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick('/new-updates')}
    >
      <BellPlus className="text-xl" size={20} strokeWidth={3} />
      <span className="font-medium">New Updates {'(4)'}</span>
      {!isActive && (
        <span className="absolute flex w-3 h-3 top-1 right-1">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-yellow animate-ping"></span>
          <span className="relative inline-flex w-3 h-3 rounded-full bg-yellow"></span>
        </span>
      )}
    </div>
  )
}

export default NewUpdateSidebar
