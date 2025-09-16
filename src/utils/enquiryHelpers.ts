// Additional enquiry-related utility functions and types
import { type TransformedEnquiry } from './enquiryUtils';

// Export additional types for better type safety
export interface EnquiryFilters {
  searchTerm: string;
  statusFilter: string;
  locationFilter: string;
}

export interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  cancelled: number;
}

// Utility functions for enquiry management
export const enquiryHelpers = {
  // Sort enquiries by date and amount
  sortEnquiries: (enquiries: TransformedEnquiry[], sortBy: 'date' | 'amount' = 'date'): TransformedEnquiry[] => {
    return [...enquiries].sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.booking.totalAmount - a.booking.totalAmount;
        
        case 'date':
        default:
          return new Date(b.enquiryDate).getTime() - new Date(a.enquiryDate).getTime();
      }
    });
  },

  // Get enquiries that need attention (new enquiries)
  getUrgentEnquiries: (enquiries: TransformedEnquiry[]): TransformedEnquiry[] => {
    return enquiries.filter(enquiry => 
      enquiry.status === 'new'
    );
  },

  // Calculate average booking amount
  getAverageBookingAmount: (enquiries: TransformedEnquiry[]): number => {
    if (enquiries.length === 0) return 0;
    const total = enquiries.reduce((sum, enquiry) => sum + enquiry.booking.totalAmount, 0);
    return Math.round(total / enquiries.length);
  },

  // Get top customers by booking amount
  getTopCustomers: (enquiries: TransformedEnquiry[], limit: number = 5): Array<{
    name: string;
    email: string;
    totalAmount: number;
    enquiryCount: number;
  }> => {
    const customerMap = new Map();
    
    enquiries.forEach(enquiry => {
      const key = enquiry.customer.email;
      if (customerMap.has(key)) {
        const existing = customerMap.get(key);
        existing.totalAmount += enquiry.booking.totalAmount;
        existing.enquiryCount += 1;
      } else {
        customerMap.set(key, {
          name: enquiry.customer.name,
          email: enquiry.customer.email,
          totalAmount: enquiry.booking.totalAmount,
          enquiryCount: 1,
        });
      }
    });

    return Array.from(customerMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  },

  // Export enquiries to CSV format
  exportToCSV: (enquiries: TransformedEnquiry[]): string => {
    const headers = [
      'ID',
      'Vehicle',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Location',
      'Start Date',
      'End Date',
      'Duration (Days)',
      'Price per Day (AED)',
      'Total Amount (AED)',
      'Status',
      'Enquiry Date',
      'Message'
    ];

    const rows = enquiries.map(enquiry => [
      enquiry.id,
      enquiry.car.name,
      enquiry.customer.name,
      enquiry.customer.email,
      enquiry.customer.phone,
      enquiry.car.location,
      enquiry.booking.startDate,
      enquiry.booking.endDate,
      enquiry.booking.duration.toString(),
      enquiry.booking.price.toString(),
      enquiry.booking.totalAmount.toString(),
      enquiry.status,
      enquiry.enquiryDate,
      `"${enquiry.booking.message.replace(/"/g, '""')}"` // Escape quotes in message
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
  },

  // Download CSV file
  downloadCSV: (enquiries: TransformedEnquiry[], filename: string = 'enquiries.csv'): void => {
    const csvContent = enquiryHelpers.exportToCSV(enquiries);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = 'AED'): string => {
    return `${amount.toLocaleString()} ${currency}`;
  },

  // Format date range
  formatDateRange: (startDate: string, endDate: string): string => {
    return `${startDate} - ${endDate}`;
  },

  // Calculate trends (compare with previous period)
  calculateTrends: (currentPeriod: TransformedEnquiry[], previousPeriod: TransformedEnquiry[]) => {
    const current = {
      total: currentPeriod.length,
      totalAmount: currentPeriod.reduce((sum, e) => sum + e.booking.totalAmount, 0),
      newEnquiries: currentPeriod.filter(e => e.status === 'new').length,
    };

    const previous = {
      total: previousPeriod.length,
      totalAmount: previousPeriod.reduce((sum, e) => sum + e.booking.totalAmount, 0),
      newEnquiries: previousPeriod.filter(e => e.status === 'new').length,
    };

    return {
      totalChange: previous.total === 0 ? 0 : ((current.total - previous.total) / previous.total) * 100,
      amountChange: previous.totalAmount === 0 ? 0 : ((current.totalAmount - previous.totalAmount) / previous.totalAmount) * 100,
      newEnquiriesChange: previous.newEnquiries === 0 ? 0 : ((current.newEnquiries - previous.newEnquiries) / previous.newEnquiries) * 100,
    };
  },
};
