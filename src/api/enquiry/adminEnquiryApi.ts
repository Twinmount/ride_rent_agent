import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import { AdminEnquiriesResponse } from "@/types/API-types";

export interface AdminEnquiryParams {
  page?: number;
  limit?: number;
  status?: 'NEW' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
}

/**
 * Fetch admin enquiries with pagination and filtering
 */
export const fetchAdminEnquiries = async (
  params: AdminEnquiryParams = {}
): Promise<AdminEnquiriesResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Set default values
    const page = params.page || 1;
    const limit = params.limit || 20;
    
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    
    if (params.status) {
      queryParams.append("status", params.status);
    }

    const url = `${Slug.GET_ADMIN_ENQUIRIES}?${queryParams.toString()}`;
    const data = await API.get<AdminEnquiriesResponse>({ slug: url });

    if (!data) {
      throw new Error("Failed to fetch admin enquiries");
    }

    return data;
  } catch (error) {
    console.error("Error fetching admin enquiries:", error);
    throw error;
  }
};
