import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button' // Assuming you have a Button component
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { remove, StorageKeys } from '@/utils/storage'

export default function LogoutModal() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    remove(StorageKeys.ACCESS_TOKEN)
    remove(StorageKeys.REFRESH_TOKEN)
    navigate('/login')
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        tabIndex={-1}
        className="w-full gap-2 mt-2 font-semibold text-white transition-colors bg-gray-900 border border-red-300 rounded-lg hover:bg-red-500 hover:text-white h-9 flex-center"
      >
        Logout <LogOut size={17} />
      </DialogTrigger>
      <DialogContent className="max-w-[400px] max-sm:w-[95%] mx-auto !rounded-3xl">
        <DialogTitle className="text-xl font-semibold text-center">
          Logout
        </DialogTitle>
        <DialogDescription aria-label="Are you sure you want to logout?" />
        <DialogHeader>
          <div className="text-center">
            <p className="text-lg">Are you sure you want to logout?</p>
            <div className="flex justify-center w-full gap-3 mt-6 ">
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 w-full rounded-xl !text-white !font-semibold"
              >
                Logout
              </Button>
              <Button
                onClick={handleClose}
                className="bg-gray-400 w-full hover:bg-gray-500 rounded-xl !text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
