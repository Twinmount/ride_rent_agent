import { AdminEnquiry } from "@/types/API-types";

// Valid enquiry statuses
export const ENQUIRY_STATUSES = {
  NEW: 'NEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
} as const;

export type EnquiryStatus = typeof ENQUIRY_STATUSES[keyof typeof ENQUIRY_STATUSES];

// Status display configurations
export const statusConfig = {
  [ENQUIRY_STATUSES.NEW]: {
    label: 'New',
    color: 'blue',
    variant: 'default'
  },
  [ENQUIRY_STATUSES.ACCEPTED]: {
    label: 'Accepted',
    color: 'green',
    variant: 'success'
  },
  [ENQUIRY_STATUSES.REJECTED]: {
    label: 'Rejected',
    color: 'red',
    variant: 'destructive'
  },
  [ENQUIRY_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    color: 'gray',
    variant: 'secondary'
  }
};

/**
 * Utility functions for admin enquiries
 */
export const adminEnquiryUtils = {
  /**
   * Check if a status is valid
   */
  isValidStatus: (status: string): status is EnquiryStatus => {
    return Object.values(ENQUIRY_STATUSES).includes(status as EnquiryStatus);
  },

  /**
   * Format enquiry status for display
   */
  formatStatus: (status: string) => {
    if (adminEnquiryUtils.isValidStatus(status)) {
      return statusConfig[status];
    }
    return {
      label: status,
      color: 'gray',
      variant: 'secondary'
    };
  },

  /**
   * Calculate rental duration in days
   */
  calculateRentalDuration: (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Format date for display
   */
  formatDate: (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    });
  },

  /**
   * Format date and time for display
   */
  formatDateTime: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Mask user information if needed
   */
  formatUserInfo: (enquiry: AdminEnquiry) => {
    if (enquiry.isMasked) {
      return {
        name: enquiry.user.name,
        phone: `${enquiry.user.phone.slice(0, 3)}****${enquiry.user.phone.slice(-2)}`,
        email: `${enquiry.user.email.split('@')[0].slice(0, 3)}****@${enquiry.user.email.split('@')[1]}`
      };
    }
    return enquiry.user;
  },

  /**
   * Get enquiry summary statistics
   */
  getEnquiryStats: (enquiries: AdminEnquiry[]) => {
    const total = enquiries.length;
    const statusCounts = enquiries.reduce((acc, enquiry) => {
      acc[enquiry.status] = (acc[enquiry.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueVehicles = new Set(enquiries.map(e => e.vehicle._id)).size;
    const uniqueUsers = new Set(enquiries.map(e => e.user._id)).size;

    return {
      total,
      statusCounts,
      uniqueVehicles,
      uniqueUsers,
      newEnquiries: statusCounts[ENQUIRY_STATUSES.NEW] || 0,
      acceptedEnquiries: statusCounts[ENQUIRY_STATUSES.ACCEPTED] || 0,
      rejectedEnquiries: statusCounts[ENQUIRY_STATUSES.REJECTED] || 0,
      cancelledEnquiries: statusCounts[ENQUIRY_STATUSES.CANCELLED] || 0,
    };
  },

  /**
   * Sort enquiries by different criteria
   */
  sortEnquiries: (enquiries: AdminEnquiry[], sortBy: 'date' | 'status' | 'vehicle' | 'user' = 'date', order: 'asc' | 'desc' = 'desc') => {
    return [...enquiries].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'vehicle':
          comparison = a.vehicle.name.localeCompare(b.vehicle.name);
          break;
        case 'user':
          comparison = a.user.name.localeCompare(b.user.name);
          break;
      }

      return order === 'desc' ? -comparison : comparison;
    });
  }
};
