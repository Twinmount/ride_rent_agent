import { Slug } from "@/api/Api-Endpoints";
import { API } from "@/api/ApiService";
import { ExtendTripFormType } from "@/components/modal/srm-modal/ExtendTripModal";
import {
  FetchBookingsResponse,
  FetchCustomerListResponse,
  FetchVehicleListResponse,
  FetchEndTripResponse,
  FetchSingleBookingResponse,
  FetchExtendTripResponse,
  FetchCustomerDetailsByIdResponse,
  FetchPaymentFormRequiredDataResponse,
  ExtendTripResponse,
} from "@/types/srm-api-types";
import { BookingStatus } from "@/types/srm-types";

export interface CompletedTripDetails {
  tripId: string;
  brandName: string;
  customerName: string;
  nationality: string;
  passportNumber: string;
  licenseNumber: string;
  amountPaid: number;
  amountPending: number;
  customerStatus: "Banned" | "Active";
}

export const fetchTripByBookingId = async (
  bookingId: string
): Promise<FetchSingleBookingResponse> => {
  try {
    const slugWithParams = `${Slug.GET_SRM_TRIP_BY_BOOKING_ID}?bookingId=${bookingId}`;

    const data = await API.get<FetchSingleBookingResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch booking data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const fetchSRMBookings = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
  bookingStatus: BookingStatus;
  companyId?: string;
}): Promise<FetchBookingsResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      bookingStatus: urlParams.bookingStatus,
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    if (urlParams.companyId) {
      queryParams.append("companyId", urlParams.companyId);
    }

    const slugWithParams = `${Slug.GET_SRM_TRIPS}?${queryParams}`;

    const data = await API.get<FetchBookingsResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch bookings data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const downloadCompletedTrip = async ({ tripId }: { tripId: string }) => {
  const slug = `/completedTrips/download/${tripId}`;
  const response = await API.get({ slug });
  if (!response) throw new Error("Failed to download trip");
  return response;
};

// Vehicle list table api
export const fetchVehicleList = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<FetchVehicleListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      isFileUrlNeeded: "true",
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_SRM_VEHICLE_LIST}?${queryParams}`;

    const data = await API.get<FetchVehicleListResponse>({
      slug: slugWithParams,
    });
    if (!data) throw new Error("Failed to fetch vehicle list");
    return data;
  } catch (error) {
    console.error("Error fetching vehicle list:", error);
    throw error;
  }
};

// customer list api
export const fetchCustomerList = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<FetchCustomerListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      isFileUrlNeeded: "true",
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_SRM_CUSTOMER_LIST}?${queryParams}`;

    const data = await API.get<FetchCustomerListResponse>({
      slug: slugWithParams,
    });
    if (!data) throw new Error("Failed to fetch customer list");
    return data;
  } catch (error) {
    console.error("Error fetching customer list:", error);
    throw error;
  }
};

// customer list api
export const fetchCustomerDetails = async (
  customerId: string
): Promise<FetchCustomerDetailsByIdResponse> => {
  try {
    const slugWithParams = `${Slug.GET_SRM_CUSTOMER_FORM_BY_ID}?customerId=${customerId}`;

    const data = await API.get<FetchCustomerDetailsByIdResponse>({
      slug: slugWithParams,
    });
    if (!data) throw new Error("Failed to fetch customer details");
    return data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error;
  }
};

// fetch End Trip Data for calculating advanceCollected
export const fetchExtendTripDetails = async (
  bookingId: string
): Promise<FetchExtendTripResponse> => {
  try {
    const data = await API.get<FetchExtendTripResponse>({
      slug: `${Slug.GET_SRM_EXTEND_TRIP}?bookingId=${bookingId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch extend trip data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching extend trip data:", error);
    throw error;
  }
};

export const extendTrip = async (
  bookingId: string,
  values: ExtendTripFormType
): Promise<ExtendTripResponse> => {
  try {
    const requestBody = {
      bookingId,
      newEndDate: values.newEndDate,
      advanceAmount: values.advanceAmount,
      remainingAmount: values.remainingAmount,
    };

    const data = await API.post<ExtendTripResponse>({
      slug: `${Slug.POST_EXTEND_TRIP}`,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to  extend trip ");
    }

    return data;
  } catch (error) {
    console.error("Error updating extend trip :", error);
    throw error;
  }
};

// fetch End Trip Data for calculating advanceCollected
export const getEndTripData = async (
  bookingId: string
): Promise<FetchEndTripResponse> => {
  try {
    const data = await API.get<FetchEndTripResponse>({
      slug: `${Slug.GET_SRM_END_TRIP}?bookingId=${bookingId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch end trip data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching end trip data:", error);
    throw error;
  }
};

// fetch End Trip Data for calculating advanceCollected
export const getPaymentFormRequiredData = async (
  bookingId: string
): Promise<FetchPaymentFormRequiredDataResponse> => {
  try {
    const data = await API.get<FetchPaymentFormRequiredDataResponse>({
      slug: `${Slug.GET_SRM_END_TRIP}?bookingId=${bookingId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch end trip data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching end trip data:", error);
    throw error;
  }
};
