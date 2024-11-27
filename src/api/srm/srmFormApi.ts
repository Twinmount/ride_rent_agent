import { Slug } from "@/api/Api-Endpoints";
import { API } from "@/api/ApiService";
import {
  AddPaymentFormResponse,
  AddCustomerFormResponse,
  AddVehicleFormResponse,
} from "@/types/srm-api-types";
import {
  SRMPaymentDetailsFormType,
  SRMCustomerDetailsFormType,
  SRMVehicleDetailsFormType,
} from "@/types/types";

export const addCustomerDetailsForm = async (
  values: SRMCustomerDetailsFormType,
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
      customerName: values.customerName,
      nationality: values.nationality,
      passportNum: values.passportNum,
      drivingLicenseNum: values.drivingLicenseNum,
      phoneNumber,
      customerProfile: values.customerProfile || null, // Optional field for user profile, default to null if not provided
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

export const updateCustomerDetailsForm = async (
  values: SRMCustomerDetailsFormType,
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
      customerName: values.customerName,
      nationality: values.nationality,
      passportNum: values.passportNum,
      drivingLicenseNum: values.drivingLicenseNum,
      phoneNumber,
      customerProfile: values.customerProfile || null, // Optional field for user profile, default to null if not provided
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
