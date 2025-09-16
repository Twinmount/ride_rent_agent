import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DEFAULT_API_CONFIG } from "@/api/Api-config";
import {
  transformEnquiryData,
  type TransformedEnquiry,
  type ApiEnquiry,
} from "@/utils/enquiryUtils";

// Query Keys
export const enquiryKeys = {
  all: ["enquiries"] as const,
  lists: () => [...enquiryKeys.all, "list"] as const,
  list: (agentId: string, status?: string, page?: number, limit?: number) =>
    [
      ...enquiryKeys.lists(),
      agentId,
      status || "all",
      page?.toString() || "1",
      limit?.toString() || "20",
    ] as const,
  details: () => [...enquiryKeys.all, "detail"] as const,
  detail: (id: string) => [...enquiryKeys.details(), id] as const,
};

// API Response Interface
interface EnquiryApiResponse {
  result: {
    list: ApiEnquiry[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
}

// API call functions
const fetchEnquiriesApi = async (
  agentId: string,
  status?: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  data: TransformedEnquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  // Build query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    queryParams.append("status", status);
  }

  const response = await axios.get<EnquiryApiResponse>(
    `${
      DEFAULT_API_CONFIG.baseURL
    }/enquiries/agent/${agentId}?${queryParams.toString()}`
  );

  if (response.data?.result && Array.isArray(response.data.result.list)) {
    const transformedData = transformEnquiryData(response.data.result.list);
    console.log("Transformed enquiries: ", transformedData);

    return {
      data: transformedData,
      pagination: {
        page: response.data.result.page,
        limit: response.data.result.limit,
        total: response.data.result.total,
        totalPages: response.data.result.totalNumberOfPages,
      },
    };
  } else {
    throw new Error("Failed to fetch enquiries");
  }
};

const updateEnquiryStatusApi = async ({
  enquiryId,
  status,
  agentId,
  cancelReason,
}: {
  enquiryId: string;
  status: string;
  agentId: string;
  cancelReason?: string;
}) => {
  // Build query parameters with agentId
  const queryParams = new URLSearchParams({
    agentId: agentId,
  });

  // Build request body
  const body: { status: string; cancelReason?: string } = { status };
  if (cancelReason) {
    body.cancelReason = cancelReason;
  }

  const response = await axios.patch(
    `${
      DEFAULT_API_CONFIG.baseURL
    }/enquiries/${enquiryId}/status?${queryParams.toString()}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return { response: response.data, agentId };
};

const cancelEnquiryApi = async ({
  enquiryId,
  agentId,
  cancelReason,
}: {
  enquiryId: string;
  agentId: string;
  cancelReason?: string;
}) => {
  // Build query parameters with agentId
  const queryParams = new URLSearchParams({
    agentId: agentId,
  });

  // Build request body
  const body: { status: string; cancelReason?: string } = {
    status: "CANCELLED",
  };
  if (cancelReason) {
    body.cancelReason = cancelReason;
  }

  const response = await axios.patch(
    `${
      DEFAULT_API_CONFIG.baseURL
    }/enquiries/${enquiryId}/status?${queryParams.toString()}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return { response: response.data, agentId };
};

// Hook to fetch enquiries
export const useEnquiries = (
  agentId: string,
  status?: string,
  page: number = 1,
  limit: number = 20
) => {
  const result = useQuery({
    queryKey: enquiryKeys.list(agentId, status, page, limit),
    queryFn: () => fetchEnquiriesApi(agentId, status, page, limit),
    enabled: !!agentId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    ...result,
    data: result.data?.data || [],
    pagination: result.data?.pagination,
  };
};

// Hook to update enquiry status
export const useUpdateEnquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEnquiryStatusApi,
    onSuccess: (data) => {
      // Invalidate all enquiry list queries for this agent
      queryClient.invalidateQueries({
        queryKey: enquiryKeys.lists(),
        predicate: (query) => {
          const [, , agentId] = query.queryKey;
          return agentId === data.agentId;
        },
      });

      // Also invalidate the general enquiry lists
      queryClient.invalidateQueries({
        queryKey: enquiryKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to update enquiry status:", error);
    },
  });
};

// Hook to delete/cancel enquiry
export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelEnquiryApi,
    onSuccess: (data) => {
      // Invalidate all enquiry list queries for this agent
      queryClient.invalidateQueries({
        queryKey: enquiryKeys.lists(),
        predicate: (query) => {
          const [, , agentId] = query.queryKey;
          return agentId === data.agentId;
        },
      });

      // Also invalidate the general enquiry lists
      queryClient.invalidateQueries({
        queryKey: enquiryKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to cancel enquiry:", error);
    },
  });
};

// Hook to prefetch enquiries (useful for preloading)
export const usePrefetchEnquiries = () => {
  const queryClient = useQueryClient();

  return (
    agentId: string,
    status?: string,
    page: number = 1,
    limit: number = 20
  ) => {
    queryClient.prefetchQuery({
      queryKey: enquiryKeys.list(agentId, status, page, limit),
      queryFn: () => fetchEnquiriesApi(agentId, status, page, limit),
      staleTime: 0,
    });
  };
};
