import { useParams } from 'react-router-dom'
import { load, StorageKeys } from '@/utils/storage'

/**
 * A custom hook to retrieve vehicle identifiers (`vehicleId` and optionally `vehicleCategoryId`)
 * based on the form type ("Add" or "Update").
 *
 * - In "Add" mode, both `vehicleId` and `vehicleCategoryId` are fetched from `localStorage`.
 * - In "Update" mode, only `vehicleId` is retrieved from the URL parameters.
 *
 * @param {('Add' | 'Update')} type - The type of the form, either "Add" or "Update".
 * @returns {{ vehicleId: string, vehicleCategoryId?: string }} An object containing `vehicleId`
 *          and optionally `vehicleCategoryId` if in "Add" mode.
 *
 * @throws {Error} Throws an error if the required identifiers are not found in either mode.
 */
export function useVehicleIdentifiers(type: 'Add' | 'Update'): {
  vehicleId: string
  vehicleCategoryId?: string
} {
  const { vehicleId } = useParams<{ vehicleId: string }>()

  if (type === 'Update') {
    const vehicleCategoryId = load<string>(StorageKeys.CATEGORY_ID)

    if (!vehicleId) {
      throw new Error('Vehicle ID is required while updating the form')
    }

    if (vehicleCategoryId) {
      return { vehicleId, vehicleCategoryId }
    }

    return { vehicleId }
  } else {
    const vehicleId = load<string>(StorageKeys.VEHICLE_ID)
    const vehicleCategoryId = load<string>(StorageKeys.CATEGORY_ID)

    if (!vehicleId || !vehicleCategoryId) {
      throw new Error(
        'Vehicle ID and Category ID are required while adding a vehicle'
      )
    }

    return { vehicleId, vehicleCategoryId }
  }
}
