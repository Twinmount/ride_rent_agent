import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import { FetchCategoriesResponse } from '@/types/API-types'

// fetch all categories
export const fetchAllCategories = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
}): Promise<FetchCategoriesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    }).toString()

    // Attach the query parameters to the slug
    const slugWithParams = `${Slug.GET_ALL_CATEGORIES}?${queryParams}`

    const data = await API.get<FetchCategoriesResponse>({
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
