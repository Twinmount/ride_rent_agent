import { Slug } from "@/api/Api-Endpoints";
import { API } from "@/api/ApiService";
import {
  AddPaymentFormResponse,
  AddUserFormResponse,
  AddVehicleFormResponse,
} from "@/types/srm-types";

// rental details sub type
export type RentalDetailType = {
  enabled: boolean;
  rentInAED?: string;
  mileageLimit?: string;
};
export type SRMUserDetailsFormType = {
  userProfile?: string; // Optional field for profile photo or identifier
  userName: string; // User name
  nationality: string; // Nationality of the user
  passportNum: string; // Passport number
  drivingLicenseNum: string; // Driving license number
  phoneNumber: string; // Mobile number of the user
};

// Define the vehicle details form type
export type SRMVehicleDetailsFormType = {
  vehicleCategoryId: string; // Vehicle category ID
  vehicleBrandId: string; // Vehicle brand ID
  vehicleRegistrationNumber: string; // Registration number, max 15 characters
  bookingStartDate: Date; // Start date of booking
  bookingEndDate: Date; // End date of booking
};

// Define the payment details form type
export type SRMPaymentDetailsFormType = {
  currency: string; // Currency code, e.g., USD, AED
  advanceAmount: string; // Advance payment amount as a string
  remainingAmount: string; // Remaining payment amount as a string
};

export const addUserDetailsForm = async (
  values: SRMUserDetailsFormType,
  countryCode: string
): Promise<AddUserFormResponse> => {
  try {
    // Extracting phone number and removing country code
    const phoneNumber = values.phoneNumber
      .replace(`+${countryCode}`, "")
      .trim();

    // Prepare the request body for the API
    const requestBody = {
      countryCode,
      userName: values.userName,
      nationality: values.nationality,
      passportNum: values.passportNum,
      drivingLicenseNum: values.drivingLicenseNum,
      phoneNumber,
      userProfile: values.userProfile || null, // Optional field for user profile, default to null if not provided
    };

    // Sending the request as a JSON object
    const data = await API.post<AddUserFormResponse>({
      slug: Slug.POST_SRM_USER_FORM,
      body: requestBody,
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    });

    if (!data) {
      throw new Error("Failed to get registration response");
    }

    return data;
  } catch (error) {
    console.error("Error on user registration", error);
    throw error;
  }
};

export const updateUserDetailsForm = async (
  values: SRMUserDetailsFormType,
  countryCode: string
): Promise<AddUserFormResponse> => {
  try {
    // Extracting phone number and removing country code
    const phoneNumber = values.phoneNumber
      .replace(`+${countryCode}`, "")
      .trim();

    // Prepare the request body for the API
    const requestBody = {
      countryCode,
      userName: values.userName,
      nationality: values.nationality,
      passportNum: values.passportNum,
      drivingLicenseNum: values.drivingLicenseNum,
      phoneNumber,
      userProfile: values.userProfile || null, // Optional field for user profile, default to null if not provided
    };

    // Sending the request as a JSON object
    const data = await API.put<AddUserFormResponse>({
      slug: Slug.PUT_SRM_USER_FORM,
      body: requestBody,
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    });

    if (!data) {
      throw new Error("Failed to get update response");
    }

    return data;
  } catch (error) {
    console.error("Error updating user details", error);
    throw error;
  }
};

// Function to add vehicle details
export const addVehicleDetailsForm = async (
  values: SRMVehicleDetailsFormType
): Promise<AddVehicleFormResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      vehicleCategoryId: values.vehicleCategoryId,
      vehicleBrandId: values.vehicleBrandId,
      vehicleRegistrationNumber: values.vehicleRegistrationNumber,
      bookingStartDate: values.bookingStartDate.toISOString(),
      bookingEndDate: values.bookingEndDate.toISOString(),
    };

    // Sending the request as a JSON object
    const data = await API.post<AddVehicleFormResponse>({
      slug: Slug.POST_SRM_VEHICLE_FORM,
      body: requestBody,
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    });

    if (!data) {
      throw new Error("Failed to get vehicle addition response");
    }

    return data;
  } catch (error) {
    console.error("Error adding vehicle details", error);
    throw error;
  }
};

// Function to update vehicle details
export const updateVehicleDetailsForm = async (
  values: SRMVehicleDetailsFormType
): Promise<AddVehicleFormResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      vehicleCategoryId: values.vehicleCategoryId,
      vehicleBrandId: values.vehicleBrandId,
      vehicleRegistrationNumber: values.vehicleRegistrationNumber,
      bookingStartDate: values.bookingStartDate.toISOString(),
      bookingEndDate: values.bookingEndDate.toISOString(),
    };

    // Sending the request as a JSON object
    const data = await API.put<AddVehicleFormResponse>({
      slug: Slug.PUT_SRM_VEHICLE_FORM,
      body: requestBody,
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    });

    if (!data) {
      throw new Error("Failed to get vehicle update response");
    }

    return data;
  } catch (error) {
    console.error("Error updating vehicle details", error);
    throw error;
  }
};

// Function to add payment details
export const addPaymentDetailsForm = async (
  values: SRMPaymentDetailsFormType
): Promise<AddPaymentFormResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      currency: values.currency,
      advanceAmount: values.advanceAmount,
      remainingAmount: values.remainingAmount,
    };

    // Sending the request as a JSON object
    const data = await API.post<AddPaymentFormResponse>({
      slug: Slug.POST_SRM_PAYMENT_FORM,
      body: requestBody,
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    });

    if (!data) {
      throw new Error("Failed to get payment addition response");
    }

    return data;
  } catch (error) {
    console.error("Error adding payment details", error);
    throw error;
  }
};

// Function to update payment details
export const updatePaymentDetailsForm = async (
  values: SRMPaymentDetailsFormType
): Promise<AddPaymentFormResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      currency: values.currency,
      advanceAmount: values.advanceAmount,
      remainingAmount: values.remainingAmount,
    };

    // Sending the request as a JSON object
    const data = await API.put<AddPaymentFormResponse>({
      slug: Slug.PUT_SRM_PAYMENT_FORM,
      body: requestBody,
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    });

    if (!data) {
      throw new Error("Failed to get payment update response");
    }

    return data;
  } catch (error) {
    console.error("Error updating payment details", error);
    throw error;
  }
};
