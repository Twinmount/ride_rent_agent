import { fetchSRMDashboard } from "@/api/srm";
import SRMDashboardDownloadSection from "@/components/SRMDashboardDownloadSection";
import SRMDashboardTaxAndContractSection from "@/components/SRMDashboardTaxAndContractSection";

import { getDashboardStats } from "@/helpers";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Box, Plus } from "lucide-react";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const SRMDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["srm-dashboard"],
    queryFn: fetchSRMDashboard,
    staleTime: 0,
  });

  const stats = useMemo(() => getDashboardStats(data?.result), [data]);

  return (
    <section className="relative p-6 py-10 h-auto min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl pb-12">
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

        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            {stats.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden relative bg-white rounded-lg shadow group"
              >
                <Link to={item.link} className="p-4 text-center">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className={`mt-2 text-4xl font-bold text-yellow`}>
                    {isLoading ? "..." : item.count}
                  </p>

                  {/* Overlay */}
                  <div className="flex absolute inset-0 justify-center items-center opacity-0 transition duration-300 ease-in-out bg-yellow group-hover:opacity-100">
                    <span className="text-lg font-semibold text-white flex-center">
                      {item.overlayText} <ArrowUpRight className="ml-2" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {/* Add New Trip Button */}
          <div className="flex justify-center">
            <Link
              to="/srm/trips/new"
              className="px-6 py-3 font-semibold text-white rounded-2xl transition-all bg-yellow hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 focus:outline-none flex-center"
            >
              Add a New Trip <Plus />
            </Link>
          </div>
          {/* download reports */}
          <SRMDashboardDownloadSection />

          {/* tax and contract */}
          <SRMDashboardTaxAndContractSection />
        </>
      </div>
    </section>
  );
};

export default SRMDashboard;
