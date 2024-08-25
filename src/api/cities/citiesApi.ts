import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import { FetchCitiesResponse } from '@/types/API-types'

// fetch all cities
export const fetchAllCities = async (
  stateId: string
): Promise<FetchCitiesResponse> => {
  try {
    const data = await API.get<FetchCitiesResponse>({
      slug: `${Slug.GET_ALL_CITIES}?stateId=${stateId}`,
    })
    if (!data) {
      throw new Error('Failed to fetch city data')
    }

    return data
  } catch (error) {
    console.error('Error fetching cities:', error)
    throw error
  }
}
