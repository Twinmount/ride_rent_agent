import { FetchUserResponse } from '@/types/API-types'
import { API } from '../ApiService'
import { Slug } from '../Api-Endpoints'

// fetch user data
export const getUser = async (): Promise<FetchUserResponse> => {
  try {
    const data = await API.get<FetchUserResponse>({
      slug: `${Slug.GET_USER}`,
    })

    if (!data) {
      throw new Error('Failed to fetch user data')
    }

    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}
