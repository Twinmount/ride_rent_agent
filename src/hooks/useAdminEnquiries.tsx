import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAdminEnquiries, AdminEnquiryParams } from "@/api/enquiry/adminEnquiryApi";
import { AdminEnquiriesResponse, AdminEnquiry } from "@/types/API-types";

// Query Keys
export const adminEnquiryKeys = {
  all: ["admin-enquiries"] as const,
  lists: () => [...adminEnquiryKeys.all, "list"] as const,
  list: (params: AdminEnquiryParams) => [
    ...adminEnquiryKeys.lists(),
    params.page?.toString() || "1",
    params.limit?.toString() || "20",
    params.status || "all",
  ] as const,
};

export interface UseAdminEnquiriesOptions extends AdminEnquiryParams {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

export interface UseAdminEnquiriesReturn {
  enquiries: AdminEnquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;
  refetch: () => void;
}

/**
 * Custom hook for fetching admin enquiries
 * @param options - Configuration options for the query
 * @returns Enquiries data, pagination info, and query state
 */
export const useAdminEnquiries = (
  options: UseAdminEnquiriesOptions = {}
): UseAdminEnquiriesReturn => {
  const {
    page = 1,
    limit = 20,
    status,
    enabled = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const queryParams: AdminEnquiryParams = { page, limit, status };

  const {
    data,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  }: UseQueryResult<AdminEnquiriesResponse, Error> = useQuery({
    queryKey: adminEnquiryKeys.list(queryParams),
    queryFn: () => fetchAdminEnquiries(queryParams),
    enabled,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    enquiries: data?.result.list || [],
    pagination: {
      page: data?.result.page || page,
      limit: data?.result.limit || limit,
      total: data?.result.total || 0,
      totalPages: data?.result.totalNumberOfPages || 0,
    },
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  };
};
