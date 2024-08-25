import {
  FetchBrandsResponse,
  FetchSpecificBrandResponse,
} from '@/types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

// fetch all brands
export const fetchAllBrands = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
  vehicleCategoryId: string
  search: string
}): Promise<FetchBrandsResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      vehicleCategoryId: urlParams.vehicleCategoryId,
      search: urlParams.search,
    }).toString()

    const slugWithParams = `${Slug.GET_ALL_BRANDS}?${queryParams}`

    const data = await API.get<FetchBrandsResponse>({
      slug: slugWithParams,
    })

    if (!data) {
      throw new Error('Failed to fetch brands data')
    }
    return data
  } catch (error) {
    console.error('Error fetching brands:', error)
    throw error
  }
}

// fetch specific brand by ID
export const fetchBrandById = async (
  brandId: string
): Promise<FetchSpecificBrandResponse> => {
  try {
    const data = await API.get<FetchSpecificBrandResponse>({
      slug: `${Slug.GET_BRAND}?id=${brandId}`,
    })
    if (!data) {
      throw new Error('Failed to fetch brand data ')
    }

    return data
  } catch (error) {
    console.error('Error fetching brand:', error)
    throw error
  }
}
