import DashboardSkelton from "@/components/loading-skelton/DashboardSkelton";
import { Box } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SRMDashboard: React.FC = () => {
  // For now, we are hardcoding the data, but this will later be integrated with react-query.

  const customerListCount = 289;
  const vehicleListCount = 47;
  const ongoingTripsCount = 70;
  const completedTripsCount = 3;

  return (
    <section className="relative p-6 py-10 h-auto min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        {/* Title and Logo */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <Box className="text-yellow-500" size={36} />
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-800">
                The Simple Rental Manager (SRM) by Ride.Rent
              </h2>
              <p className="text-sm text-gray-600">
                Securely upload & manage customer details, with built-in fraud
                detection to identify & prevent fraudulent rentals.
              </p>
            </div>
          </div>
        </div>

        {/* If isLoading is true, show the loading skeleton */}
        {false ? (
          <DashboardSkelton />
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
              {/* Customer List */}
              <div className="p-4 text-center bg-white rounded-lg shadow">
                <p className="text-lg font-semibold">Customer List</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {customerListCount}
                </p>
              </div>

              {/* Vehicle List */}
              <div className="p-4 text-center bg-white rounded-lg shadow">
                <p className="text-lg font-semibold">Vehicle List</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {vehicleListCount}
                </p>
              </div>

              {/* Ongoing Trips */}
              <div className="p-4 text-center bg-white rounded-lg shadow">
                <p className="text-lg font-semibold">Ongoing Trips</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {ongoingTripsCount}
                </p>
              </div>

              {/* Completed Trips */}
              <div className="p-4 text-center bg-white rounded-lg shadow">
                <p className="text-lg font-semibold">Completed Trips</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {completedTripsCount}
                </p>
              </div>
            </div>

            {/* Add New Trip Button */}
            <div className="flex justify-center">
              <Link
                to="/srm/trips/new" // Assuming this is the route for adding a new trip
                className="inline-block px-6 py-3 font-semibold text-white bg-yellow-500 rounded-full transition-all hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 focus:outline-none"
              >
                Add a New Trip
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SRMDashboard;
