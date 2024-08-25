import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchAllVehicleTypes } from '@/api/vehicle-types'

type VehicleTypesDropdownProps = {
  vehicleCategoryId: string | undefined
  value?: string
  onChangeHandler: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
}

type VehicleType = {
  typeId: string
  name: string
  value: string
}

const VehicleTypesDropdown = ({
  vehicleCategoryId,
  value,
  onChangeHandler,
  isDisabled = false,
}: VehicleTypesDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-types', vehicleCategoryId],
    queryFn: () =>
      fetchAllVehicleTypes({
        page: 1,
        limit: 20,
        sortOrder: 'ASC',
        vehicleCategoryId: vehicleCategoryId || '',
      }),
    enabled: !!vehicleCategoryId,
  })

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])

  useEffect(() => {
    if (data) {
      setVehicleTypes(data.result.list)
    }
  }, [data])

  const getPlaceholderText = () => {
    if (isLoading) {
      return 'Fetching types...'
    } else if (!vehicleCategoryId) {
      return 'choose a vehicle category first'
    } else if (!vehicleTypes.length) {
      return 'No vehicle types found'
    } else {
      return 'Choose vehicle type'
    }
  }

  return (
    <Select
      onValueChange={onChangeHandler}
      value={value} // Handle default value selection
      disabled={isDisabled || isLoading || !vehicleCategoryId}
    >
      <SelectTrigger
        className={`select-field ring-0 focus:ring-0 input-fields ${
          (isDisabled || isLoading || !vehicleCategoryId) &&
          '!opacity-60 !cursor-default'
        }`}
        disabled={isDisabled || isLoading || !vehicleCategoryId}
      >
        <SelectValue
          className="!font-bold !text-black"
          placeholder={getPlaceholderText()}
        />
      </SelectTrigger>
      <SelectContent>
        {vehicleTypes.length > 0 &&
          vehicleTypes.map((type) => (
            <SelectItem
              key={type.typeId}
              value={type.typeId} // The value returned to the form
              className="select-item p-regular-14"
            >
              {type.name} {/* The name displayed in the UI */}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

export default VehicleTypesDropdown
