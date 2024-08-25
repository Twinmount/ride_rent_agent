import { FetchTypesResponse } from '@/types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

// fetch all vehicle types
export const fetchAllVehicleTypes = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
  vehicleCategoryId: string
}): Promise<FetchTypesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      vehicleCategoryId: urlParams.vehicleCategoryId,
    }).toString()

    const slugWithParams = `${Slug.GET_ALL_VEHICLE_TYPE}?${queryParams}`

    const data = await API.get<FetchTypesResponse>({
      slug: slugWithParams,
    })

    if (!data) {
      throw new Error('Failed to fetch categories data')
    }
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}
