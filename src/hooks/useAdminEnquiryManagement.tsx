import { useState, useMemo, useCallback } from "react";
import { useAdminEnquiries, UseAdminEnquiriesOptions } from "./useAdminEnquiries";
import { AdminEnquiry } from "@/types/API-types";

export interface UseAdminEnquiryManagementOptions extends UseAdminEnquiriesOptions {
  initialFilters?: {
    searchTerm?: string;
    statusFilter?: string;
    dateRange?: {
      start?: string;
      end?: string;
    };
  };
}

export interface UseAdminEnquiryManagementReturn {
  // Data
  enquiries: AdminEnquiry[];
  filteredEnquiries: AdminEnquiry[];
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;

  // Filter states
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateRange: {
    start?: string;
    end?: string;
  };
  setDateRange: (range: { start?: string; end?: string }) => void;

  // Actions
  refetch: () => void;
  clearFilters: () => void;
  
  // Pagination controls
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;

  // Computed values
  uniqueAgents: string[];
  uniqueVehicleLocations: string[];
  statusCounts: Record<string, number>;
}

/**
 * Comprehensive hook for managing admin enquiries with filtering, pagination, and search
 */
export const useAdminEnquiryManagement = (
  options: UseAdminEnquiryManagementOptions = {}
): UseAdminEnquiryManagementReturn => {
  const {
    initialFilters = {},
    ...queryOptions
  } = options;

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [statusFilter, setStatusFilter] = useState(initialFilters.statusFilter || "");
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || {});
  const [currentPage, setCurrentPage] = useState(queryOptions.page || 1);
  const [pageSize, setPageSize] = useState(queryOptions.limit || 20);

  // Fetch enquiries with current pagination and status filter
  const {
    enquiries,
    pagination,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useAdminEnquiries({
    ...queryOptions,
    page: currentPage,
    limit: pageSize,
    status: statusFilter && ['NEW', 'ACCEPTED', 'REJECTED', 'CANCELLED'].includes(statusFilter) 
      ? statusFilter as 'NEW' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
      : undefined,
  });

  // Filter enquiries based on search term and date range (client-side filtering)
  const filteredEnquiries = useMemo(() => {
    let filtered = [...enquiries];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enquiry) =>
          enquiry.user.name.toLowerCase().includes(searchLower) ||
          enquiry.user.email.toLowerCase().includes(searchLower) ||
          enquiry.user.phone.includes(searchTerm) ||
          enquiry.vehicle.name.toLowerCase().includes(searchLower) ||
          enquiry.vehicle.location.toLowerCase().includes(searchLower) ||
          enquiry.agent.name.toLowerCase().includes(searchLower) ||
          enquiry.message.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((enquiry) => {
        const enquiryDate = new Date(enquiry.createdAt);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        if (startDate && enquiryDate < startDate) return false;
        if (endDate && enquiryDate > endDate) return false;
        return true;
      });
    }

    return filtered;
  }, [enquiries, searchTerm, dateRange]);

  // Computed values
  const uniqueAgents = useMemo(() => {
    const agents = enquiries.map((enquiry) => enquiry.agent.name);
    return [...new Set(agents)].filter(Boolean);
  }, [enquiries]);

  const uniqueVehicleLocations = useMemo(() => {
    const locations = enquiries.map((enquiry) => enquiry.vehicle.location);
    return [...new Set(locations)].filter(Boolean);
  }, [enquiries]);

  const statusCounts = useMemo(() => {
    return enquiries.reduce((counts, enquiry) => {
      counts[enquiry.status] = (counts[enquiry.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }, [enquiries]);

  // Actions
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("");
    setDateRange({});
    setCurrentPage(1);
  }, []);

  return {
    // Data
    enquiries,
    filteredEnquiries,
    
    // Pagination
    pagination,

    // Loading states
    isLoading,
    isError,
    error,
    isRefetching,

    // Filter states
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,

    // Actions
    refetch,
    clearFilters,
    
    // Pagination controls
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,

    // Computed values
    uniqueAgents,
    uniqueVehicleLocations,
    statusCounts,
  };
};
