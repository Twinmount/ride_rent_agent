import { RegisterResponse, VerifyOTPResponse } from '@/types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

type registerArgsType = {
  phoneNumber: string
  password: string
}
type resendOtpArgsType = {
  phoneNumber: string
  password: string
  countryCode: string
}
type verifyOtpArgsType = {
  otpId: string
  userId: string
  otp: string
}

// register a agent
export const register = async (
  values: registerArgsType,
  countryCode: string
): Promise<RegisterResponse> => {
  try {
    // extracting phone number and country code
    const phoneNumber = values.phoneNumber.replace(`+${countryCode}`, '').trim()

    const requestBody = {
      countryCode,
      phoneNumber,
      password: values.password,
    }

    // Send the FormData object using the API post method
    const data = await API.post<RegisterResponse>({
      slug: Slug.REGISTER,
      body: requestBody,
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

// resend OTP
export const resendOTP = async (
  values: resendOtpArgsType
): Promise<RegisterResponse> => {
  try {
    // Send the FormData object using the API post method
    const data = await API.post<RegisterResponse>({
      slug: Slug.REGISTER,
      body: values,
    })

    if (!data) {
      throw new Error('Failed to get resend otp response')
    }

    return data
  } catch (error) {
    console.error('Error on resend OTP', error)
    throw error
  }
}

//verify otp
export const verifyOTP = async (
  values: verifyOtpArgsType
): Promise<VerifyOTPResponse> => {
  try {
    // Send the FormData object using the API post method
    const data = await API.post<VerifyOTPResponse>({
      slug: Slug.VERIFY_OTP,
      body: values,
    })

    if (!data) {
      throw new Error('Failed to verify OTP')
    }

    return data
  } catch (error) {
    console.error('Error on OTP verification', error)
    throw error
  }
}
