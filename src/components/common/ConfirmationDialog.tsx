import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Spinner from '../general/Spinner'
import { SingleVehicleType } from '@/types/API-types'

type ConfirmationDialogProps = {
  vehicle: SingleVehicleType
  onConfirm: (vehicle: SingleVehicleType, isEnabled: boolean) => Promise<void>
  onCancel: () => void
}

function ConfirmationDialog({
  vehicle,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    await onConfirm(vehicle, !vehicle.isDisabled)
    setIsLoading(false)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogTrigger asChild>
        <span className="hidden"></span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {vehicle.isDisabled
              ? `Enable ${vehicle.vehicleModel}`
              : `Disable ${vehicle.vehicleModel}`}
          </DialogTitle>
          <DialogDescription>
            Do you want to {vehicle.isDisabled ? 'enable' : 'disable'} this
            vehicle?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="outline"
            disabled={isLoading}
            className={`${
              vehicle.isDisabled
                ? 'bg-yellow text-white hover:bg-yellow hover:text-white hover:shadow-md'
                : 'bg-red-500 text-white hover:bg-red-600 hover:text-white hover:shadow-md'
            } `}
          >
            {vehicle.isDisabled ? 'Enable' : 'Disable'}
            {isLoading && <Spinner />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
