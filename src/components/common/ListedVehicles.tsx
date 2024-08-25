import { useState } from 'react'
import { Plus, Share2 } from 'lucide-react'
import { Switch } from '../ui/switch'
import { useToast } from '../ui/use-toast'
import { Link } from 'react-router-dom'
import ConfirmationDialog from './ConfirmationDialog'
import { SingleVehicleType } from '@/types/API-types'
import ListingsGridSkelton from '../loading-skelton/ListingsGridSkelton'
import { toggleVehicleVisibility } from '@/api/vehicle'
import VehicleStatusOverlay from '../VehicleStatusOverlay'
import { useQueryClient } from '@tanstack/react-query'

interface ListedVehiclesProps {
  vehicles: SingleVehicleType[]
  isLoading: boolean
}

export default function ListedVehicles({
  vehicles,
  isLoading,
}: ListedVehiclesProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleType | null>(null)
  const [isUpdating, setIsUpdating] = useState<boolean>(false) // To handle the update process

  const handleShare = (vehicle: SingleVehicleType) => {
    if (navigator.share) {
      navigator
        .share({
          title: vehicle.vehicleModel,
          text: `Check out this vehicle: ${vehicle.vehicleModel}`,
          url: window.location.href,
        })
        .catch((error) => console.error('Error sharing', error))
    } else {
      toast({
        description: 'Share Option is not supported in your browser.',
        className: 'text-white font-semibold text-lg bg-red-500',
      })
    }
  }

  const handleSwitchChange = (vehicle: SingleVehicleType) => {
    setSelectedVehicle(vehicle)
  }

  const handleConfirmChange = async (
    vehicle: SingleVehicleType,
    isEnabled: boolean
  ) => {
    setIsUpdating(true)
    try {
      await toggleVehicleVisibility({
        vehicleId: vehicle.vehicleId,
        isDisabled: isEnabled,
      })
      toast({
        description: `${vehicle.vehicleModel} is ${
          !isEnabled ? 'enabled' : 'disabled'
        }`,
        className: `text-white font-semibold text-lg ${
          !isEnabled ? 'bg-yellow' : 'bg-red-500'
        }`,
      })
      // Invalidate the query to refresh the vehicles list
      queryClient.invalidateQueries({
        queryKey: ['vehicles'],
        exact: true,
      })
    } catch (error) {
      toast({
        description: `Failed to ${isEnabled ? 'enable' : 'disable'} ${
          vehicle.vehicleModel
        }`,
        className: 'text-white font-semibold text-lg bg-red-500',
      })
    } finally {
      setIsUpdating(false)
      setSelectedVehicle(null)
    }
  }
  return (
    <div className="">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <ListingsGridSkelton />
        </div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.vehicleId}
              className="overflow-hidden transition-all border rounded-lg shadow-lg group"
            >
              <div className="w-full h-[70%] min-h-[170px] max-h-[70%] overflow-hidden relative">
                <Link
                  to={`/listings/view/${vehicle.vehicleId}`}
                  className="w-full cursor-pointer"
                >
                  <img
                    src={
                      'https://storage.googleapis.com/ride-rent/' +
                      vehicle.vehiclePhotos
                    }
                    alt={vehicle.vehicleModel}
                    className="object-cover w-full h-full transition-all scale-100 group-hover:scale-110"
                  />
                  <VehicleStatusOverlay
                    approvalStatus={vehicle.approvalStatus}
                    isDisabled={vehicle.isDisabled}
                    disabledBy={vehicle.disabledBy}
                  />
                </Link>
              </div>
              <div className="px-2 pb-2">
                <Link to={`/listings/view/${vehicle.vehicleId}`}>
                  <h3 className="mt-2 text-lg font-bold line-clamp-1">
                    {vehicle.vehicleModel}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <button
                    className={`text-black ${
                      vehicle.approvalStatus !== 'APPROVED'
                        ? 'cursor-not-allowed text-gray-600'
                        : 'hover:text-yellow'
                    }`}
                    onClick={() => handleShare(vehicle)}
                    disabled={vehicle.approvalStatus !== 'APPROVED'}
                  >
                    <Share2 size={20} />
                  </button>
                  <Switch
                    className="data-[state=checked]:bg-yellow data-[state=unchecked]:bg-gray-500"
                    checked={!vehicle.isDisabled}
                    onCheckedChange={() => handleSwitchChange(vehicle)}
                    disabled={
                      vehicle.approvalStatus !== 'APPROVED' ||
                      isUpdating ||
                      vehicle.disabledBy === 'admin'
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full gap-2 mt-48 h-36">
          <h3 className="text-lg font-bold text-yellow">No Vehicles found!</h3>
        </div>
      )}
      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-3 md:right-10 bottom-10 shadow-xl hover:scale-[1.02] transition-all">
        <Link
          className="px-3 py-2 text-white flex-center gap-x-1 bg-yellow"
          to={`/listings/add`}
        >
          New Vehicle <Plus />
        </Link>
      </button>
      {selectedVehicle && (
        <ConfirmationDialog
          vehicle={selectedVehicle}
          onConfirm={handleConfirmChange}
          onCancel={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  )
}
