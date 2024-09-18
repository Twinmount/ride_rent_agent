import { API } from '../ApiService'
import { Slug } from '../Api-Endpoints'
import {
  AddPrimaryFormResponse,
  FeaturesFormResponse,
  FetchAllVehiclesResponse,
  GetFeaturesFormDataResponse,
  GetLevelsFilledResponse,
  GetPrimaryFormResponse,
  GetSpecificationFormDataResponse,
  GetSpecificationFormFieldsResponse,
} from '@/types/API-types'

// rental details sub type
export type RentalDetailType = {
  enabled: boolean
  rentInAED?: string
  mileageLimit?: string
}

type PrimaryFormType = {
  vehicleCategoryId: string
  vehicleTypeId: string
  vehicleBrandId: string
  vehicleModel: string
  vehiclePhotos: (File | string)[] // Array of files or URLs
  vehicleRegistrationNumber: string
  vehicleRegisteredYear: string
  commercialLicenses: (File | string)[] // Array of files or URLs
  commercialLicenseExpireDate: Date
  isLease: boolean
  isCryptoAccepted: boolean
  isSpotDeliverySupported: boolean
  specification: 'UAE_SPEC' | 'USA_SPEC' | 'OTHERS'
  rentalDetails: {
    day: RentalDetailType
    week: RentalDetailType
    month: RentalDetailType
  }
  phoneNumber: string
  stateId: string
  cityIds: string[]
}

export const addPrimaryDetailsForm = async (
  values: PrimaryFormType,
  countryCode: string,
  userId: string
): Promise<AddPrimaryFormResponse> => {
  try {
    // Extracting phone number and country code
    const phoneNumber = values.phoneNumber.replace(`+${countryCode}`, '').trim()

    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('userId', userId)
    formData.append('countryCode', countryCode)
    formData.append('vehicleCategoryId', values.vehicleCategoryId)
    formData.append('vehicleTypeId', values.vehicleTypeId)
    formData.append('vehicleBrandId', values.vehicleBrandId)
    formData.append('vehicleModel', values.vehicleModel)
    formData.append(
      'vehicleRegistrationNumber',
      values.vehicleRegistrationNumber
    )
    formData.append('vehicleRegisteredYear', values.vehicleRegisteredYear)
    formData.append(
      'commercialLicenseExpireDate',
      values.commercialLicenseExpireDate.toISOString()
    )
    formData.append('isLease', values.isLease.toString())
    formData.append('isCryptoAccepted', values.isCryptoAccepted.toString())
    formData.append(
      'isSpotDeliverySupported',
      values.isSpotDeliverySupported.toString()
    )
    formData.append('specification', values.specification)
    formData.append('phoneNumber', phoneNumber)
    formData.append('stateId', values.stateId)

    formData.append('cityIds', values.cityIds.join(','))

    // Append rentalDetails as a JSON string
    formData.append('rentalDetails', JSON.stringify(values.rentalDetails))

    // Append vehicle photos
    values.vehiclePhotos.forEach((photo) => {
      if (photo instanceof File) {
        formData.append(`vehiclePhotos`, photo)
      }
    })

    // Append commercial license
    values.commercialLicenses.forEach((license) => {
      if (license instanceof File) {
        formData.append(`commercialLicenses`, license)
      }
    })

    // Send the FormData object using the API post method
    const data = await API.post<AddPrimaryFormResponse>({
      slug: Slug.POST_PRIMARY_FORM,
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      },
    })

    if (!data) {
      throw new Error('Failed to get registration response')
    }

    return data
  } catch (error) {
    console.error('Error on agent registration', error)
    throw error
  }
}

export const updatePrimaryDetailsForm = async (
  vehicleId: string,
  values: PrimaryFormType,
  countryCode: string
): Promise<AddPrimaryFormResponse> => {
  try {
    // Extracting phone number and country code
    const phoneNumber = values.phoneNumber.replace(`+${countryCode}`, '').trim()

    const formData = new FormData()

    // Append necessary fields to the FormData object
    formData.append('vehicleId', vehicleId)
    formData.append('countryCode', countryCode)
    formData.append('vehicleCategoryId', values.vehicleCategoryId)
    formData.append('vehicleTypeId', values.vehicleTypeId)
    formData.append('vehicleBrandId', values.vehicleBrandId)
    formData.append('vehicleModel', values.vehicleModel)
    formData.append(
      'vehicleRegistrationNumber',
      values.vehicleRegistrationNumber
    )
    formData.append('vehicleRegisteredYear', values.vehicleRegisteredYear)
    formData.append(
      'commercialLicenseExpireDate',
      values.commercialLicenseExpireDate.toISOString()
    )
    formData.append('isLease', values.isLease.toString())
    formData.append('isCryptoAccepted', values.isCryptoAccepted.toString())
    formData.append(
      'isSpotDeliverySupported',
      values.isSpotDeliverySupported.toString()
    )
    formData.append('specification', values.specification)
    formData.append('phoneNumber', phoneNumber)
    formData.append('stateId', values.stateId)

    formData.append('cityIds', values.cityIds.join(','))

    // Append rentalDetails as a JSON string
    formData.append('rentalDetails', JSON.stringify(values.rentalDetails))

    // Append vehicle photos only if they are new files
    values.vehiclePhotos.forEach((photo) => {
      if (photo instanceof File) {
        formData.append(`vehiclePhotos`, photo)
      }
    })

    // Append commercial licenses only if they are new files
    values.commercialLicenses.forEach((license) => {
      if (license instanceof File) {
        formData.append(`commercialLicenses`, license)
      }
    })

    // Send the FormData object using the API post method
    const data = await API.put<AddPrimaryFormResponse>({
      slug: Slug.PUT_PRIMARY_FORM,
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      },
    })

    if (!data) {
      throw new Error('Failed to get update response')
    }

    return data
  } catch (error) {
    console.error('Error updating agent details', error)
    throw error
  }
}
type GetSpecificationFormDataParams = {
  page?: number
  limit?: number
  sortOrder?: string
  vehicleCategoryId: string
  vehicleTypeId: string
}

// fetch specification form data
export const getPrimaryDetailsFormData = async (
  vehicleId: string
): Promise<GetPrimaryFormResponse> => {
  try {
    const url = `${Slug.GET_PRIMARY_FORM}?vehicleId=${vehicleId}`

    const data = await API.get<GetPrimaryFormResponse>({
      slug: url,
    })

    if (!data) {
      throw new Error('Failed to fetch primary form data')
    }

    return data
  } catch (error) {
    console.error('Error fetching primary form data:', error)
    throw error
  }
}

// fetch specification form data
export const getSpecificationFormFieldData = async ({
  page = 1,
  limit = 50,
  sortOrder = 'ASC',
  vehicleCategoryId,
  vehicleTypeId,
}: GetSpecificationFormDataParams): Promise<GetSpecificationFormFieldsResponse> => {
  console.log(
    'get specification form field api called, here is the vehicleCategoryId',
    vehicleCategoryId
  )
  try {
    const url = `${Slug.GET_SPEC_FORM_FIELD_LIST}?vehicleCategoryId=${vehicleCategoryId}&vehicleTypeId=${vehicleTypeId}&page=${page}&limit=${limit}&sortOrder=${sortOrder}`

    const data = await API.get<GetSpecificationFormFieldsResponse>({
      slug: url,
    })

    if (!data) {
      throw new Error('Failed to fetch specification form data')
    }

    return data
  } catch (error) {
    console.error('Error fetching specification form data:', error)
    throw error
  }
}

// API function returning the above type
export const getSpecificationFormData = async (
  vehicleId: string
): Promise<GetSpecificationFormDataResponse> => {
  try {
    const url = `${Slug.GET_SPEC_FORM_DATA}?vehicleId=${vehicleId}`

    const data = await API.get<GetSpecificationFormDataResponse>({
      slug: url,
    })

    if (!data) {
      throw new Error('Failed to fetch specification form data')
    }

    return data
  } catch (error) {
    console.error('Error fetching specification form data:', error)
    throw error
  }
}

// add specification form data type
type SpecificationItem = {
  name: string
  value: string
  selected: boolean
}

// add specification form argument type
type AddSpecificationsRequestBody = {
  specs: Record<string, SpecificationItem> // Dynamic keys for specs
  userId: string
  vehicleId: string
  vehicleCategoryId: string
}

//add specifications
export const addSpecifications = async (
  requestBody: AddSpecificationsRequestBody
) => {
  try {
    const data = await API.post({
      slug: Slug.POST_SPECIFICATION_FORM,
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error posting specification form data:', error)
    throw error
  }
}

// Update specification form argument type
type UpdateSpecificationsRequestBody = {
  specs: Record<string, { name: string; value: string; selected: boolean }>
  vehicleId: string
}

// Update specifications
export const updateSpecifications = async (
  requestBody: UpdateSpecificationsRequestBody
) => {
  try {
    const data = await API.put({
      slug: Slug.PUT_SPECIFICATION_FORM,
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error updating specification form data:', error)
    throw error
  }
}

type GetFeaturesFormDataParams = {
  page?: number
  limit?: number
  sortOrder?: string
  vehicleCategoryId: string
}

// fetch specification form data
export const getFeaturesFormFieldsData = async ({
  page = 1,
  limit = 50,
  sortOrder = 'ASC',
  vehicleCategoryId,
}: GetFeaturesFormDataParams): Promise<FeaturesFormResponse> => {
  try {
    const url = `${Slug.GET_FEATURES_FORM_FIELD_LIST}?vehicleCategoryId=${vehicleCategoryId}&page=${page}&limit=${limit}&sortOrder=${sortOrder}`

    const data = await API.get<FeaturesFormResponse>({
      slug: url,
    })

    if (!data) {
      throw new Error('Failed to fetch specification form data')
    }

    return data
  } catch (error) {
    console.error('Error fetching specification form data:', error)
    throw error
  }
}

// API function to get features form data for a specific vehicle (type === 'Update')
export const getFeaturesFormData = async (
  vehicleId: string
): Promise<GetFeaturesFormDataResponse> => {
  try {
    const url = `${Slug.GET_FEATURES_FORM_DATA}?vehicleId=${vehicleId}`

    const data = await API.get<GetFeaturesFormDataResponse>({
      slug: url,
    })

    if (!data) {
      throw new Error('Failed to fetch features form data')
    }

    return data
  } catch (error) {
    console.error('Error fetching features form data:', error)
    throw error
  }
}

// add features form item type
type FeatureItem = {
  name: string
  value: string
  selected: boolean
}

// add features form function
type AddFeaturesRequestBody = {
  features: Record<string, FeatureItem[]> // Dynamic keys for features, each key contains an array of selected features
  userId: string
  vehicleId: string
  vehicleCategoryId: string
}

// Add features
export const addFeatures = async (requestBody: AddFeaturesRequestBody) => {
  try {
    const data = await API.post({
      slug: Slug.POST_FEATURES_FORM, // Adjust the slug to match your API endpoint
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error posting features form data:', error)
    throw error
  }
}

// Type for the update features request body
type UpdateFeaturesRequestBody = {
  features: Record<string, { name: string; value: string; selected: boolean }[]>
  vehicleId: string
}

// API function to update features
export const updateFeatures = async (
  requestBody: UpdateFeaturesRequestBody
) => {
  try {
    const data = await API.put({
      slug: Slug.PUT_FEATURES_FORM_DATA,
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error updating features form data:', error)
    throw error
  }
}

// fetch all vehicles
export const fetchAllVehicles = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
  approvalStatus?: 'ALL' | 'APPROVED' | 'REJECTED' | 'PENDING' | 'UNDER_REVIEW'
  isModified?: boolean
  userId: string
}): Promise<FetchAllVehiclesResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      userId: urlParams.userId,
    })

    if (urlParams.approvalStatus) {
      queryParams.append('approvalStatus', urlParams.approvalStatus)
    }
    if (urlParams.isModified === true || urlParams.isModified === false) {
      queryParams.append('isModified', urlParams.isModified.toString())
    }

    const slugWithParams = `${Slug.GET_ALL_VEHICLES}?${queryParams}`

    const data = await API.get<FetchAllVehiclesResponse>({
      slug: slugWithParams,
    })

    if (!data) {
      throw new Error('Failed to fetch vehicles data')
    }
    return data
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    throw error
  }
}

// enable or disable vehicle
export const toggleVehicleVisibility = async ({
  vehicleId,
  isDisabled,
}: {
  vehicleId: string
  isDisabled: boolean
}) => {
  try {
    const data = await API.put({
      slug: Slug.PUT_TOGGLE_VEHICLE_VISIBILITY,
      body: {
        vehicleId,
        isDisabled,
      },
    })

    return data
  } catch (error) {
    console.error('Error toggling vehicle visibility', error)
    throw error
  }
}

// API function to get features form data for a specific vehicle (type === 'Update')
export const getLevelsFilled = async (
  vehicleId: string
): Promise<GetLevelsFilledResponse> => {
  try {
    const url = `${Slug.GET_LEVELS_FILLED}?vehicleId=${vehicleId}`

    const data = await API.get<GetLevelsFilledResponse>({
      slug: url,
    })

    if (!data) {
      throw new Error('Failed to fetch levels filled')
    }

    return data
  } catch (error) {
    console.error('Error fetching levels filled data:', error)
    throw error
  }
}
