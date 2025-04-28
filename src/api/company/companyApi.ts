import { CompanyFormType, ProfileUpdateFormType } from "@/types/types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchSpecificCompanyResponse,
  FetchIsEmailAlreadyVerifiedResponse,
  SendOTPResponse,
} from "@/types/API-types";

export interface CompanyType {
  companyName: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: Date;
  regNumber: string;
}

// add company
export const addCompany = async (values: CompanyFormType, userId: string) => {
  try {
    // Send the data as a JSON object
    const data = await API.post({
      slug: Slug.POST_COMPANY,
      body: {
        userId: userId,
        companyName: values.companyName,
        expireDate: values.expireDate!.toISOString(),
        regNumber: values.regNumber,
        companyLogo: values.companyLogo, // Assuming this is a URL or string
        commercialLicense: values.commercialLicense, // Assuming this is a URL or string'
        companyAddress: values.companyAddress,
        companyLanguages: values.companyLanguages,
        accountType: values.accountType,
      },
    });

    return data;
  } catch (error) {
    console.error("Error adding company:", error);
    throw error;
  }
};

// update company
export const updateCompanyProfile = async (
  values: ProfileUpdateFormType,
  companyId: string
) => {
  try {
    const data = await API.put({
      slug: Slug.PUT_COMPANY,
      body: {
        companyId: companyId,
        expireDate: values.expireDate!.toISOString(),
        regNumber: values.regNumber,
        commercialLicense: values.commercialLicense, // Assuming this is a URL or string
        companyAddress: values.companyAddress,
        companyLanguages: values.companyLanguages,
      },
    });

    return data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

// update company
export const updateCompany = async (values: CompanyType, companyId: string) => {
  try {
    const data = await API.put({
      slug: Slug.PUT_COMPANY,
      body: {
        companyId: companyId,
        companyName: values.companyName,
        expireDate: values.expireDate!.toISOString(),
        regNumber: values.regNumber,
        companyLogo: values.companyLogo, // Assuming this is a URL or string
        commercialLicense: values.commercialLicense, // Assuming this is a URL or string
      },
    });

    return data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

// fetch company
export const getCompany = async (
  userId: string
): Promise<FetchSpecificCompanyResponse> => {
  try {
    const data = await API.get<FetchSpecificCompanyResponse>({
      slug: `${Slug.GET_COMPANY}?userId=${userId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch Company data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Company:", error);
    throw error;
  }
};

// Send OTP function
export const sendOtp = async (email: string): Promise<SendOTPResponse> => {
  try {
    const data = await API.post<SendOTPResponse>({
      slug: Slug.POST_SEND_OTP,
      body: {
        email,
      },
    });

    if (!data) {
      throw new Error("Failed to send otp data");
    }

    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// Verify OTP function
export const verifyOtp = async (otp: string) => {
  try {
    const data = await API.post({
      slug: Slug.POST_VERIFY_OTP,
      body: {
        otp,
      },
    });

    return data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const fetchIsEmailAlreadyVerified = async (
  email: string
): Promise<FetchIsEmailAlreadyVerifiedResponse> => {
  try {
    const slug = `${Slug.GET_IS_EMAIL_ALREADY_VERIFIED}?email=${email}`;

    const data = await API.get<FetchIsEmailAlreadyVerifiedResponse>({
      slug: slug,
    });

    if (!data) {
      throw new Error("Failed to verify whether email is verified or not");
    }

    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};
