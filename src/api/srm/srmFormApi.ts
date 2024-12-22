import { Slug } from "@/api/Api-Endpoints";
import { API } from "@/api/ApiService";
import {
  AddPaymentFormResponse,
  AddCustomerFormResponse,
  AddVehicleFormResponse,
  SearchCustomerResponse,
  CreateCustomerBookingResponse,
} from "@/types/srm-api-types";
import {
  SRMPaymentDetailsFormType,
  SRMCustomerDetailsFormType,
  SRMVehicleDetailsFormType,
} from "@/types/srm-types";

export const addCustomerDetailsForm = async (
  values: SRMCustomerDetailsFormType,
  countryCode: string
): Promise<AddCustomerFormResponse> => {
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
      passportNumber: values.passportNumber,
      drivingLicenseNumber: values.drivingLicenseNumber,
      phoneNumber,
      customerProfilePic: values.customerProfilePic || null, // Optional field for user profile, default to null if not provided
    };

    // Sending the request as a JSON object
    const data = await API.post<AddCustomerFormResponse>({
      slug: Slug.POST_SRM_CUSTOMER_FORM,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to post customer registration response");
    }

    return data;
  } catch (error) {
    console.error("Error on customer registration", error);
    throw error;
  }
};

export const createCustomerBooking = async (
  customerId: string
): Promise<CreateCustomerBookingResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      customerId,
    };

    // Sending the request as a JSON object
    const data = await API.post<CreateCustomerBookingResponse>({
      slug: Slug.POST_SRM_BOOKING_CUSTOMER,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to post customer booking");
    }

    return data;
  } catch (error) {
    console.error("Error on customer booking", error);
    throw error;
  }
};

export const updateCustomerDetailsForm = async (
  values: SRMCustomerDetailsFormType,
  countryCode: string
): Promise<AddCustomerFormResponse> => {
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
      passportNumber: values.passportNumber,
      drivingLicenseNumber: values.drivingLicenseNumber,
      phoneNumber,
      customerProfilePic: values.customerProfilePic || null, // Optional field for user profile, default to null if not provided
    };

    // Sending the request as a JSON object
    const data = await API.put<AddCustomerFormResponse>({
      slug: Slug.PUT_SRM_CUSTOMER_FORM,
      body: requestBody,
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
      rentalDetails: JSON.stringify(values.rentalDetails),
      vehiclePhoto: values.vehiclePhoto,
    };

    // Sending the request as a JSON object
    const data = await API.post<AddVehicleFormResponse>({
      slug: Slug.POST_SRM_VEHICLE_FORM,
      body: requestBody,
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
      rentalDetails: values.rentalDetails,
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

// search customer api based on search term
export const searchCustomer = async (
  searchTerm: string
): Promise<SearchCustomerResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: "1",
      limit: "7",
      sortOrder: "ASC",
      search: searchTerm,
    }).toString();

    const slugWithParams = `${Slug.GET_SRM_CUSTOMER_LIST}?${queryParams}`;

    const data = await API.get<SearchCustomerResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to get customer list");
    }

    return data;
  } catch (error) {
    console.error("Error getting customer list", error);
    throw error;
  }
};
