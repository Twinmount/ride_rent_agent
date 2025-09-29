import React from "react";
import { useAdminEnquiryManagement } from "@/hooks/useAdminEnquiryManagement";
import { adminEnquiryUtils, ENQUIRY_STATUSES } from "@/utils/adminEnquiryUtils";

/**
 * Example component demonstrating the usage of useAdminEnquiryManagement hook
 */
export const AdminEnquiriesExample: React.FC = () => {
  const {
    enquiries,
    filteredEnquiries,
    pagination,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    // pageSize,
    // setPageSize,
    clearFilters,
    refetch,
    // statusCounts,
    // uniqueAgents,
    // uniqueVehicleLocations,
  } = useAdminEnquiryManagement({
    page: 1,
    limit: 20,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const stats = adminEnquiryUtils.getEnquiryStats(enquiries);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading enquiries...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading enquiries</h3>
        <p className="text-red-600 text-sm mt-1">
          {error?.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Enquiries</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-800 font-medium">Total Enquiries</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-800 font-medium">New</h3>
            <p className="text-2xl font-bold text-green-900">{stats.newEnquiries}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-yellow-800 font-medium">Accepted</h3>
            <p className="text-2xl font-bold text-yellow-900">{stats.acceptedEnquiries}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-800 font-medium">Unique Vehicles</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.uniqueVehicles}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, vehicle..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {Object.values(ENQUIRY_STATUSES).map((status) => (
                <option key={status} value={status}>
                  {adminEnquiryUtils.formatStatus(status).label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Enquiries ({filteredEnquiries.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rental Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnquiries.map((enquiry) => {
                const userInfo = adminEnquiryUtils.formatUserInfo(enquiry);
                const statusInfo = adminEnquiryUtils.formatStatus(enquiry.status);
                const duration = adminEnquiryUtils.calculateRentalDuration(
                  enquiry.rentalStartDate,
                  enquiry.rentalEndDate
                );

                return (
                  <tr key={enquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {userInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">{userInfo.email}</div>
                        <div className="text-sm text-gray-500">{userInfo.phone}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {enquiry.vehicle.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          📍 {enquiry.vehicle.location}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {adminEnquiryUtils.formatDate(enquiry.rentalStartDate)} -
                      </div>
                      <div className="text-sm text-gray-900">
                        {adminEnquiryUtils.formatDate(enquiry.rentalEndDate)}
                      </div>
                      <div className="text-sm text-gray-500">{duration} days</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                          ${statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                          ${statusInfo.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                          ${statusInfo.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                          ${statusInfo.color === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
                        `}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adminEnquiryUtils.formatDateTime(enquiry.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pagination.limit) + 1} to{" "}
              {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
