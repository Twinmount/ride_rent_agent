import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import { FetchStatesResponse } from '@/types/API-types'

export interface StateType {
  stateName: string
  stateValue: string
  subHeading: string
  metaTitle: string
  metaDescription: string
  stateImage: File | string
}

// fetch all States
export const fetchAllStates = async (): Promise<FetchStatesResponse> => {
  try {
    const data = await API.get<FetchStatesResponse>({
      slug: Slug.GET_ALL_STATES,
    })

    if (!data) {
      throw new Error('Failed to fetch state data')
    }

    return data
  } catch (error) {
    console.error('Error fetching States:', error)
    throw error
  }
}
