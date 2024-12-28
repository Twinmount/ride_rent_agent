import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPortfolioStats, fetchEnquiriesStats } from "@/api/dashboard";
import { format, startOfMonth, endOfDay } from "date-fns";
import DashboardSkelton from "@/components/loading-skelton/DashboardSkelton";
import { Link } from "react-router-dom";
import { fetchAllVehicles } from "@/api/vehicle";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import useUserId from "@/hooks/useUserId";

const AgentDashboard: React.FC = () => {
  const currentDate = new Date();
  const startOfMonthDate = startOfMonth(currentDate);
  const endOfDayDate = endOfDay(currentDate);

  const dateStartRange = format(startOfMonthDate, "yyyy-MM-dd");
  const dateEndRange = format(endOfDayDate, "yyyy-MM-dd");

  const { userId } = useUserId();

  // Fetch vehicles if userId is present
  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", 1, 10, "ASC"],
    queryFn: () =>
      fetchAllVehicles({
        page: 1,
        limit: 10,
        sortOrder: "ASC",
        userId: userId as string,
      }),
    enabled: !!userId,
    refetchOnWindowFocus: true,
    staleTime: 0,
  }); // Fetch from cached vehicle data

  const vehiclesListLength = data?.result.list.length || 0;

  // Fetch all-time stats
  const { data: portfolioData, isLoading: isPortfolioLoading } = useQuery({
    queryKey: ["portfolioStats"],
    queryFn: () => fetchPortfolioStats(),
    staleTime: 0,
  });

  const { data: enquiriesData, isLoading: isEnquiriesLoading } = useQuery({
    queryKey: ["enquiriesStats"],
    queryFn: () => fetchEnquiriesStats(),
    staleTime: 0,
  });

  // Fetch current month stats
  const { data: monthlyPortfolioData, isLoading: isMonthlyPortfolioLoading } =
    useQuery({
      queryKey: ["monthlyPortfolioStats", dateStartRange, dateEndRange],
      queryFn: () => fetchPortfolioStats(dateStartRange, dateEndRange),
      staleTime: 0,
    });

  const { data: monthlyEnquiriesData, isLoading: isMonthlyEnquiriesLoading } =
    useQuery({
      queryKey: ["monthlyEnquiriesStats", dateStartRange, dateEndRange],
      queryFn: () => fetchEnquiriesStats(dateStartRange, dateEndRange),
      staleTime: 0,
    });

  if (isLoading) {
    return <LazyLoader />;
  }

  return (
    <section className="relative p-6 py-10 h-auto min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <h2 className="fixed top-[4.7rem] left-0 pl-10 lg:pl-80 bg-white/20 backdrop-blur-md  z-10 mb-4   text-2xl lg:text-3xl font-bold w-full h-14 flex items-center  shadow-sm ">
          Agent Dashboard
        </h2>

        <div className="grid grid-cols-1 gap-4 mt-8 mb-6 md:grid-cols-2">
          {/* Total Portfolio Views */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isPortfolioLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Total portfolio views</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {portfolioData?.result.count}
                </p>
              </>
            )}
          </div>

          {/* Total Enquiries */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isEnquiriesLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Total enquiries</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {enquiriesData?.result.count}
                </p>
              </>
            )}
          </div>

          {/* Monthly Portfolio Views */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isMonthlyPortfolioLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Monthly portfolio views</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {monthlyPortfolioData?.result.count}
                </p>
              </>
            )}
          </div>

          {/* Monthly Enquiries */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isMonthlyEnquiriesLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Monthly Enquiries</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {monthlyEnquiriesData?.result.count}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Free Boost Information */}
        <div className="p-4 text-center text-white bg-black rounded-lg shadow">
          <p className="text-lg font-semibold text-yellow">
            Listings are boosted!
          </p>
          <p className="text-sm">
            Your fleet is now receiving more visibility.
          </p>
          <p className="mt-2 text-4xl font-bold text-yellow">
            Your Free Boost is active now
          </p>
        </div>

        {/* Conditional Overlay */}
        {vehiclesListLength === 0 && (
          <div className="flex absolute inset-0 z-20 justify-center pt-0 bg-gray-200 bg-opacity-30 backdrop-blur-md">
            <div className="flex flex-col text-center w-full max-sm:max-w-[90%] max-w-[500px]  mt-52 rounded-lg ">
              <h3 className="mb-4 text-2xl font-extrabold text-gray-800">
                Add your first vehicle now and start tracking your dashboard
                stats.
              </h3>

              <Link
                to={`/listings/add/${userId}`}
                className="inline-block px-6 py-3 font-semibold text-white rounded-md transition-all bg-yellow hover:bg-yellow focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 focus:outline-none"
              >
                Add Your First Vehicle
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgentDashboard;
