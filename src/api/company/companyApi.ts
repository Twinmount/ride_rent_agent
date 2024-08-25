import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchSpecificCompanyResponse,
  SendOTPResponse,
} from '@/types/API-types'

export interface CompanyType {
  companyName: string
  companyLogo: File | string
  commercialLicense: File | string
  expireDate: Date
  regNumber: string
}

// add company
export const addCompany = async (values: CompanyType, userId: string) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('userId', userId)
    formData.append('companyName', values.companyName)
    formData.append('expireDate', values.expireDate.toISOString())
    formData.append('regNumber', values.regNumber)
    formData.append('companyLogo', values.companyLogo)
    formData.append('commercialLicense', values.commercialLicense)

    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.POST_COMPANY,
      body: formData, // Passing formData instead of JSON object
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error adding company:', error)
    throw error
  }
}

// update company
export const updateCompany = async (values: CompanyType, userId: string) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('userId', userId)
    formData.append('companyName', values.companyName)
    formData.append('expireDate', values.expireDate.toISOString())
    formData.append('regNumber', values.regNumber)

    if (values.companyLogo instanceof File) {
      formData.append('companyLogo', values.companyLogo)
    }

    if (values.commercialLicense instanceof File) {
      formData.append('commercialLicense', values.commercialLicense)
    }

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_COMPANY, // Use the correct slug
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error updating state:', error)
    throw error
  }
}

// fetch company
export const getCompany = async (
  userId: string
): Promise<FetchSpecificCompanyResponse> => {
  try {
    const data = await API.get<FetchSpecificCompanyResponse>({
      slug: `${Slug.GET_COMPANY}?userId=${userId}`,
    })

    if (!data) {
      throw new Error('Failed to fetch Company data')
    }

    return data
  } catch (error) {
    console.error('Error fetching Company:', error)
    throw error
  }
}

// Send OTP function
export const sendOtp = async (email: string): Promise<SendOTPResponse> => {
  try {
    const data = await API.post<SendOTPResponse>({
      slug: Slug.POST_SEND_OTP,
      body: {
        email,
      },
    })

    if (!data) {
      throw new Error('Failed to send otp data')
    }

    return data
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw error
  }
}

// Verify OTP function
export const verifyOtp = async (otp: string) => {
  try {
    const data = await API.post({
      slug: Slug.POST_VERIFY_OTP,
      body: {
        otp,
      },
    })

    return data
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}
