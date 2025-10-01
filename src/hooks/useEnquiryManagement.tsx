import { useState, useCallback, useMemo } from "react";
import {
  useEnquiries,
  useUpdateEnquiryStatus,
  useDeleteEnquiry,
  usePrefetchEnquiries,
  useUpdateContactVisibility,
} from "./useEnquiryQueries";
import { type TransformedEnquiry } from "@/utils/enquiryUtils";
import { enquiryHelpers } from "@/utils/enquiryHelpers";

interface UseEnquiryManagementProps {
  agentId: string;
}

interface UseEnquiryManagementReturn {
  // Data
  enquiries: TransformedEnquiry[];
  filteredEnquiries: TransformedEnquiry[];
  uniqueLocations: string[];

  // Loading states
  loading: boolean;
  isRefetching: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error handling
  error: string | null;
  updateError: string | null;
  deleteError: string | null;

  // Data operations
  refetch: () => void;
  prefetchEnquiries: (agentId: string) => void;

  // Filter states
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  clearFilters: () => void;

  // Actions
  updateEnquiryStatus: (
    enquiryId: string,
    status: string,
    cancelReason?: string
  ) => Promise<void>;
  deleteEnquiry: (enquiryId: string, cancelReason?: string) => Promise<void>;
  contactEnquiry: (enquiryId: string) => Promise<void>;
  cancelEnquiry: (enquiryId: string, cancelReason?: string) => Promise<void>;
  reApproveEnquiry: (enquiryId: string) => Promise<void>;

  // Contact Visibility Actions
  handleContactVisibility: (
    enquiryId: string,
    action: "unlock" | "contact" | "enable_masking" | "disable_masking"
  ) => Promise<void>;

  // Statistics
  stats: {
    total: number;
    new: number;
    agentview: number;
    contacted: number;
    cancelled: number;
    expired: number;
  };

  // Additional utilities
  urgentEnquiries: TransformedEnquiry[];
  averageBookingAmount: number;
  topCustomers: Array<{
    name: string;
    email: string;
    totalAmount: number;
    enquiryCount: number;
  }>;

  // Helper functions
  sortEnquiries: (sortBy: "date" | "amount") => TransformedEnquiry[];
  exportToCSV: () => void;
  downloadCSV: (filename?: string) => void;
}

export const useEnquiryManagement = ({
  agentId,
}: UseEnquiryManagementProps): UseEnquiryManagementReturn => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  // Use the React Query hooks
  const {
    data: enquiries = [],
    isLoading: loading,
    error: queryError,
    refetch,
    isRefetching,
  } = useEnquiries(agentId);

  // Mutation hooks
  const updateStatusMutation = useUpdateEnquiryStatus();
  const deleteEnquiryMutation = useDeleteEnquiry();
  const updateContactVisibilityMutation = useUpdateContactVisibility();
  const prefetchEnquiries = usePrefetchEnquiries();

  // Convert query errors to strings
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "An error occurred while fetching enquiries"
    : null;

  const updateError = (() => {
    const statusError = updateStatusMutation.error;
    const visibilityError = updateContactVisibilityMutation.error;
    const error = statusError || visibilityError;

    if (!error) return null;

    return error instanceof Error ? error.message : "Failed to update enquiry";
  })();

  const deleteError = deleteEnquiryMutation.error
    ? deleteEnquiryMutation.error instanceof Error
      ? deleteEnquiryMutation.error.message
      : "Failed to delete enquiry"
    : null;

  // Filter enquiries based on search term and filters
  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.car.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.booking.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;
    const matchesLocation =
      locationFilter === "all" || enquiry.car.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Get unique locations for filter dropdown
  const uniqueLocations: string[] = [
    ...new Set(enquiries.map((e) => e.car.location)),
  ];

  // Calculate statistics
  const stats = useMemo(
    () => ({
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === "new").length,
      agentview: enquiries.filter((e) => e.status === "agentview").length,
      contacted: enquiries.filter((e) => e.status === "contacted").length,
      cancelled: enquiries.filter((e) => e.status === "cancelled").length,
      expired: enquiries.filter((e) => e.status === "expired").length,
    }),
    [enquiries]
  );

  // Additional computed values
  const urgentEnquiries = useMemo(
    () => enquiryHelpers.getUrgentEnquiries(enquiries),
    [enquiries]
  );
  const averageBookingAmount = useMemo(
    () => enquiryHelpers.getAverageBookingAmount(enquiries),
    [enquiries]
  );
  const topCustomers = useMemo(
    () => enquiryHelpers.getTopCustomers(enquiries, 5),
    [enquiries]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");
  }, []);

  // Action functions
  const updateEnquiryStatus = useCallback(
    async (enquiryId: string, status: string, cancelReason?: string) => {
      return new Promise<void>((resolve, reject) => {
        updateStatusMutation.mutate(
          { enquiryId, status, agentId, cancelReason },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });
    },
    [updateStatusMutation, agentId]
  );

  const deleteEnquiry = useCallback(
    async (enquiryId: string, cancelReason?: string) => {
      return new Promise<void>((resolve, reject) => {
        deleteEnquiryMutation.mutate(
          { enquiryId, agentId, cancelReason },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });
    },
    [deleteEnquiryMutation, agentId]
  );

  // Convenience action functions
  const contactEnquiry = useCallback(
    async (enquiryId: string) => {
      return updateEnquiryStatus(enquiryId, "CONTACTED");
    },
    [updateEnquiryStatus]
  );

  const cancelEnquiry = useCallback(
    async (enquiryId: string, cancelReason?: string) => {
      return updateEnquiryStatus(enquiryId, "CANCELLED", cancelReason);
    },
    [updateEnquiryStatus]
  );

  const reApproveEnquiry = useCallback(
    async (enquiryId: string) => {
      return updateEnquiryStatus(enquiryId, "NEW");
    },
    [updateEnquiryStatus]
  );

  // Contact visibility action functions
  const handleContactVisibility = useCallback(
    async (
      enquiryId: string,
      action: "unlock" | "contact" | "enable_masking" | "disable_masking"
    ) => {
      return new Promise<void>((resolve, reject) => {
        let mutationOptions;

        switch (action) {
          case "unlock":
            // Unlock button: NEW -> AGENTVIEW (show contact details)
            mutationOptions = { enquiryId, action: "mark_agentview" as const };
            break;
          case "contact":
            // Contact button: AGENTVIEW -> CONTACTED
            mutationOptions = { enquiryId, action: "mark_contacted" as const };
            break;
          case "enable_masking":
            mutationOptions = { enquiryId, action: "enable_masking" as const };
            break;
          case "disable_masking":
            mutationOptions = { enquiryId, action: "disable_masking" as const };
            break;
          default:
            reject(new Error(`Unknown action: ${action}`));
            return;
        }

        updateContactVisibilityMutation.mutate(mutationOptions, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [updateContactVisibilityMutation]
  );

  // Helper functions
  const sortEnquiries = useCallback(
    (sortBy: "date" | "amount") => {
      return enquiryHelpers.sortEnquiries(filteredEnquiries, sortBy);
    },
    [filteredEnquiries]
  );

  const exportToCSV = useCallback(() => {
    enquiryHelpers.exportToCSV(filteredEnquiries);
  }, [filteredEnquiries]);

  const downloadCSV = useCallback(
    (filename?: string) => {
      enquiryHelpers.downloadCSV(filteredEnquiries, filename);
    },
    [filteredEnquiries]
  );

  return {
    // Data
    enquiries,
    filteredEnquiries,
    uniqueLocations,

    // Loading states
    loading,
    isRefetching,
    isUpdating:
      updateStatusMutation.isPending ||
      updateContactVisibilityMutation.isPending,
    isDeleting: deleteEnquiryMutation.isPending,

    // Error handling
    error,
    updateError,
    deleteError,

    // Data operations
    refetch,
    prefetchEnquiries,

    // Filter states
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    locationFilter,
    setLocationFilter,
    clearFilters,

    // Actions
    updateEnquiryStatus,
    deleteEnquiry,
    contactEnquiry,
    cancelEnquiry,
    reApproveEnquiry,

    // Contact Visibility Actions
    handleContactVisibility,

    // Statistics
    stats,
    urgentEnquiries,
    averageBookingAmount,
    topCustomers,

    // Helper functions
    sortEnquiries,
    exportToCSV,
    downloadCSV,
  };
};
