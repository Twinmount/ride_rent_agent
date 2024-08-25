import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import { FetchDashboardResponse } from '@/types/API-types'

// fetch portfolio stats
export const fetchPortfolioStats = async (
  dateStartRange?: string,
  dateEndRange?: string
): Promise<FetchDashboardResponse> => {
  try {
    const params = new URLSearchParams()
    if (dateStartRange) params.append('dateStartRange', dateStartRange)
    if (dateEndRange) params.append('dateEndRange', dateEndRange)

    const url = `${Slug.GET_PORTFOLIO}?${params.toString()}`
    const data = await API.get<FetchDashboardResponse>({ slug: url })

    if (!data) {
      throw new Error('Failed to fetch portfolio data')
    }

    return data
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    throw error
  }
}

// fetch enquiries stats
export const fetchEnquiriesStats = async (
  dateStartRange?: string,
  dateEndRange?: string
): Promise<FetchDashboardResponse> => {
  try {
    const params = new URLSearchParams()
    if (dateStartRange) params.append('dateStartRange', dateStartRange)
    if (dateEndRange) params.append('dateEndRange', dateEndRange)

    const url = `${Slug.GET_ENQUIRIES}?${params.toString()}`
    const data = await API.get<FetchDashboardResponse>({ slug: url })

    if (!data) {
      throw new Error('Failed to fetch enquiries data')
    }

    return data
  } catch (error) {
    console.error('Error fetching enquiries data:', error)
    throw error
  }
}
