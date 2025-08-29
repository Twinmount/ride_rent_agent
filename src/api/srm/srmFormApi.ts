import { Slug } from "@/api/Api-Endpoints";
import { API } from "@/api/ApiService";
import { ShareFormData } from "@/components/dialog/CustomerLinkShareFormDialog";
import {
  AddPaymentFormResponse,
  AddCustomerFormResponse,
  AddVehicleFormResponse,
  SearchCustomerResponse,
  CreateCustomerBookingResponse,
  SearchVehicleResponse,
  FetchTripEndResponse,
  GetIsCustomerSpamResponse,
  FetchUpcomingBookingDatesResponse,
  GetSRMLevelsFilledResponse,
  GetSRMCustomerDetailsResponse,
  GetSRMVehicleDetailsResponse,
  GetSRMPaymentDetailsResponse,
  GetSRMChecklistResponse,
  GetSRMUserTaxAndContractInfoResponse,
  PublicCustomerLinkShareResponse,
  FetchSRMDashboardAnalytics,
} from "@/types/srm-api-types";
import {
  SRMPaymentDetailsFormType,
  SRMCustomerDetailsFormType,
  SRMVehicleDetailsFormType,
  TripEndFormType,
} from "@/types/srm-types";
import axios from "axios";

export const fetchSRMDashboard =
  async (): Promise<FetchSRMDashboardAnalytics> => {
    try {
      const data = await API.get<FetchSRMDashboardAnalytics>({
        slug: Slug.GET_SRM_DASHBOARD,
      });

      if (!data) {
        throw new Error("Failed to fetch srm dashboard data");
      }

      return data;
    } catch (error) {
      console.error("Error fetching srm dashboard:", error);
      throw error;
    }
  };

/*
 * API function to create a new customer
 */
export const createCustomer = async (
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
      email: values.email,
      nationality: values.nationality,
      passportNumber: values.passportNumber,
      passport: values.passport,
      drivingLicenseNumber: values.drivingLicenseNumber,
      phoneNumber,
      drivingLicense: values.drivingLicense,
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

export const sendCustomerFormLink = async (
  values: ShareFormData,
  countryCode: string,
  bookingId: string
): Promise<AddCustomerFormResponse> => {
  try {
    const phoneNumber = values.phoneNumber
      .replace(`+${countryCode}`, "")
      .trim();

    // Prepare the request body for the customer creation API
    const requestBody = {
      countryCode,
      customerName: values.customerName,
      phoneNumber,
      email: values.email,
    };

    /**
     * first create the customer and get the customerId
     */
    const customerCreationResponse = await API.post<AddCustomerFormResponse>({
      slug: Slug.POST_SRM_CUSTOMER_FORM,
      body: requestBody,
    });

    if (!customerCreationResponse) {
      throw new Error("Failed to create customer for public link share");
    }

    // Prepare the request body for the temp-auth-token API
    const newRequestBody = {
      email: values.email,
      countryCode,
      phoneNumber,
      customerId: customerCreationResponse.result.customerId,
      bookingId,
      customerName: values.customerName,
    };

    // after creating the customer, call the temp-auth-token POST endpoint to send teh link
    const linkSendResponse = await API.post<PublicCustomerLinkShareResponse>({
      slug: Slug.POST_SEND_LINK_FORM_CUSTOMER_CREATION,
      body: newRequestBody,
    });

    if (!linkSendResponse) {
      throw new Error("Failed to create public link");
    }

    return customerCreationResponse;
  } catch (error) {
    console.error("Error on generating public link", error);
    throw error;
  }
};

export const updateCustomerByPublic = async (
  values: SRMCustomerDetailsFormType,
  countryCode: string,
  token: string,
  customerId: string
): Promise<AddCustomerFormResponse> => {
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    // Extracting phone number and removing country code
    const phoneNumber = values.phoneNumber
      .replace(`+${countryCode}`, "")
      .trim();

    // Prepare the request body for the API
    const requestBody = {
      customerId,
      countryCode,
      customerName: values.customerName,
      email: values.email,
      nationality: values.nationality,
      passportNumber: values.passportNumber,
      passport: values.passport,
      drivingLicenseNumber: values.drivingLicenseNumber,
      phoneNumber,
      drivingLicense: values.drivingLicense,
      customerProfilePic: values.customerProfilePic || null,
    };

    const data: AddCustomerFormResponse = await axios.put(
      `${API_URL}${Slug.PUT_SRM_CUSTOMER_FORM}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!data) {
      throw new Error("Failed to post customer registration response");
    }

    return data;
  } catch (error) {
    console.error("Error on customer registration", error);
    throw error;
  }
};

export const getSRMCustomerFormDetails = async (
  customerId: string
): Promise<GetSRMCustomerDetailsResponse> => {
  try {
    // Sending the request as a JSON object
    const data = await API.get<GetSRMCustomerDetailsResponse>({
      slug: `${Slug.GET_SRM_CUSTOMER_FORM}?customerId=${customerId}`,
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

export const updateCustomerBooking = async (
  customerId: string,
  bookingId: string
): Promise<CreateCustomerBookingResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      customerId,
      bookingId,
    };

    // Sending the request as a JSON object
    const data = await API.put<CreateCustomerBookingResponse>({
      slug: Slug.PUT_SRM_BOOKING_CUSTOMER,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update srm customer booking");
    }

    return data;
  } catch (error) {
    console.error("Error on customer booking", error);
    throw error;
  }
};

// checks whether the existing customer is red flagged or not
export const isCustomerSpam = async (
  customerId: string
): Promise<GetIsCustomerSpamResponse> => {
  try {
    const slugWithParams = `${Slug.GET_SRM_IS_CUSTOMER_SPAM}?customerId=${customerId}`;

    // Sending the request as a JSON object
    const data = await API.get<GetIsCustomerSpamResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to get customer spam info");
    }

    return data;
  } catch (error) {
    console.error("Error on getting spam info", error);
    throw error;
  }
};

export const createBookingDataForVehicle = async (
  vehicleId: string
): Promise<CreateCustomerBookingResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      vehicleId,
    };

    // Sending the request as a JSON object
    const data = await API.post<CreateCustomerBookingResponse>({
      slug: Slug.POST_SRM_BOOKING_VEHICLE,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update vehicle");
    }

    return data;
  } catch (error) {
    console.error("Error on updating vehicle", error);
    throw error;
  }
};

export const updateBookingDataForPayment = async (values: {
  bookingId: string;
  paymentId: string;
  bookingStartDate: string;
  bookingEndDate: string;
}): Promise<CreateCustomerBookingResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = values;

    // Sending the request as a JSON object
    const data = await API.put<CreateCustomerBookingResponse>({
      slug: Slug.PUT_SRM_BOOKING_PAYMENT,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update Payment");
    }

    return data;
  } catch (error) {
    console.error("Error on updating payment data", error);
    throw error;
  }
};

export const fetchUpcomingBookingDates = async (
  vehicleId: string
): Promise<FetchUpcomingBookingDatesResponse> => {
  try {
    // Sending the request as a JSON object
    const data = await API.get<FetchUpcomingBookingDatesResponse>({
      slug: `${Slug.GET_SRM_UPCOMING_BOOKINGS}?vehicleId=${vehicleId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch upcoming booking dates");
    }

    return data;
  } catch (error) {
    console.error("Error on fetching upcoming booking dates", error);
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

export const getSRMVehicleFormDetails = async (
  vehicleId: string
): Promise<GetSRMVehicleDetailsResponse> => {
  try {
    // Sending the request as a JSON object
    const data = await API.get<GetSRMVehicleDetailsResponse>({
      slug: `${Slug.GET_SRM_VEHICLE_FORM}?vehicleId=${vehicleId}`,
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
      vehiclePhoto: values.vehiclePhoto,
      // convert to number
      numberOfPassengers: Number(values.numberOfPassengers),
      vehicleColor: values.vehicleColor,
      bodyType: values.bodyType,
      chassisNumber: values.chassisNumber,
      additionalMilageChargePerKm: values.additionalMilageChargePerKm,
      registrationDate: values.registrationDate,
      registrationDueDate: values.registrationDueDate,
      trafficFineId: values.trafficFineId,
      lastServiceDate: values.lastServiceDate,
      currentKilometre: values.currentKilometre,
      serviceKilometre: values.serviceKilometre,
      nextServiceKilometre: values.nextServiceKilometre,
      nextServiceDate: values.nextServiceDate,
      rentalDetails: values.rentalDetails,
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
  vehicleId: string,
  values: SRMVehicleDetailsFormType
): Promise<AddVehicleFormResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = {
      vehicleId,
      vehicleCategoryId: values.vehicleCategoryId,
      vehicleBrandId: values.vehicleBrandId,
      vehicleRegistrationNumber: values.vehicleRegistrationNumber,
      vehiclePhoto: values.vehiclePhoto,
      numberOfPassengers: values.numberOfPassengers,
      vehicleColor: values.vehicleColor,
      bodyType: values.bodyType,
      chassisNumber: values.chassisNumber,
      additionalMilageChargePerKm: values.additionalMilageChargePerKm,
      registrationDate: values.registrationDate,
      registrationDueDate: values.registrationDueDate,
      trafficFineId: values.trafficFineId,
      lastServiceDate: values.lastServiceDate,
      currentKilometre: values.currentKilometre,
      serviceKilometre: values.serviceKilometre,
      nextServiceKilometre: values.nextServiceKilometre,
      nextServiceDate: values.nextServiceDate,
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

export const getSRMPaymentFormDetails = async (
  bookingId: string
): Promise<GetSRMPaymentDetailsResponse> => {
  try {
    // Sending the request as a JSON object
    const data = await API.get<GetSRMPaymentDetailsResponse>({
      slug: `${Slug.GET_SRM_PAYMENT_FORM}?bookingId=${bookingId}`,
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
      securityDeposit: values.securityDeposit,
    };

    // Sending the request as a JSON object
    const data = await API.post<AddPaymentFormResponse>({
      slug: Slug.POST_SRM_PAYMENT_FORM,
      body: requestBody,
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

// get srm check list
export const getSRMCheckListFormData = async (
  vehicleId: string
): Promise<GetSRMChecklistResponse> => {
  try {
    // Sending the request as a JSON object
    const data = await API.get<GetSRMChecklistResponse>({
      slug: `${Slug.GET_SRM_CHECKLIST}?vehicleId=${vehicleId}`,
    });

    if (!data) {
      throw new Error("Failed to srm check list response");
    }

    return data;
  } catch (error) {
    console.error("Error on srm check list", error);
    throw error;
  }
};

export const postSRMCheckList = async (values: {
  vehicleId: string;
  checklistMetadata: string;
}): Promise<GetSRMChecklistResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = values;

    // Sending the request as a JSON object
    const data = await API.post<GetSRMChecklistResponse>({
      slug: Slug.POST_SRM_CHECKLIST,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update check list");
    }

    return data;
  } catch (error) {
    console.error("Error on updating check list data", error);
    throw error;
  }
};

export const putSRMCheckList = async (values: {
  vehicleId: string;
  checklistMetadata: string;
}): Promise<GetSRMChecklistResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody = values;

    // Sending the request as a JSON object
    const data = await API.put<GetSRMChecklistResponse>({
      slug: Slug.PUT_SRM_CHECKLIST,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update check list");
    }

    return data;
  } catch (error) {
    console.error("Error on updating check list data", error);
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

// search vehicle api based on search term
export const searchVehicle = async (
  searchTerm: string
): Promise<SearchVehicleResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: "1",
      limit: "7",
      sortOrder: "ASC",
      search: searchTerm,
      isFileUrlNeeded: "false",
    }).toString();

    const slugWithParams = `${Slug.GET_SRM_VEHICLE_LIST}?${queryParams}`;

    const data = await API.get<SearchVehicleResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to get vehicle list");
    }

    return data;
  } catch (error) {
    console.error("Error getting vehicle list", error);
    throw error;
  }
};

// type for end trip arguments
type EndTripArgs = {
  values: TripEndFormType;
  bookingId: string;
  companyId: string;
};

export const endTrip = async ({
  values,
  bookingId,
  companyId,
}: EndTripArgs): Promise<FetchTripEndResponse> => {
  try {
    // combining bookingId and companyId with values to generate a single object as requestBody
    const requestBody = {
      ...values,
      bookingId,
      companyId,
    };

    const data = await API.post<FetchTripEndResponse>({
      slug: Slug.POST_SRM_END_TRIP, // Replace with the actual endpoint
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to end trip. No response received.");
    }

    return data;
  } catch (error) {
    console.error("Error in endTrip API:", error);
    throw error;
  }
};

export const getSRMLevelsFilled = async (
  bookingId: string
): Promise<GetSRMLevelsFilledResponse> => {
  try {
    const url = `${Slug.GET_SRM_LEVELS_FILLED}?bookingId=${bookingId}`;

    const data = await API.get<GetSRMLevelsFilledResponse>({
      slug: url,
    });

    if (!data) {
      throw new Error("Failed to fetch srm levels filled");
    }

    return data;
  } catch (error) {
    console.error("Error fetching srm levels filled data:", error);
    throw error;
  }
};

export const getSRMUserTaxAndContractInfo =
  async (): Promise<GetSRMUserTaxAndContractInfoResponse> => {
    try {
      const slug = `${Slug.GET_SRM_USER_TAX_AND_CONTRACT_INFO}`;

      const data = await API.get<GetSRMUserTaxAndContractInfoResponse>({
        slug,
      });

      if (!data) {
        throw new Error("Failed to fetch tax info");
      }

      return data;
    } catch (error) {
      console.error("Error on tax info fetch", error);
      throw error;
    }
  };

interface UpdateTaxAndContractArgs {
  country?: string;
  taxNumber?: string;
  termsNCondition?: string;
}

export const updateSRMUserTaxAndContractInfo = async ({
  country,
  taxNumber,
  termsNCondition,
}: UpdateTaxAndContractArgs): Promise<GetSRMUserTaxAndContractInfoResponse> => {
  try {
    // Prepare the request body for the API
    const requestBody: UpdateTaxAndContractArgs = {};

    if (country) {
      requestBody.country = country;
    }
    if (taxNumber) {
      requestBody.taxNumber = taxNumber;
    }
    if (termsNCondition) {
      requestBody.termsNCondition = termsNCondition;
    }

    // Sending the request as a JSON object
    const data = await API.put<GetSRMUserTaxAndContractInfoResponse>({
      slug: Slug.PUT_SRM_USER_TAX_AND_CONTRACT_INFO,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update tax info");
    }

    return data;
  } catch (error) {
    console.error("Error on tax info update", error);
    throw error;
  }
};

export async function downloadSRMExcelBlob({
  slug,
  fileName,
  params,
}: {
  slug: string;
  fileName: string;
  params: URLSearchParams;
}): Promise<void> {
  try {
    const res = await API.get<any>({
      slug: `${slug}?${params.toString()}`,
      axiosConfig: {
        responseType: "blob",
      },
    });

    const blob = new Blob([res.data], {
      type: res.headers["content-type"],
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    // Optionally log to Sentry, etc.
    console.error("Excel download failed:", err);
    throw new Error("Failed to download file. Please try again.");
  }
}
