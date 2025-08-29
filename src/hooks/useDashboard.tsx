import { fetchAllVehicles } from "@/api/vehicle";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import useUserId from "./useUserId";
import { fetchEnquiriesStats, fetchPortfolioStats } from "@/api/dashboard";

export default function useDashboard() {
  const currentDate = new Date();
  const startOfMonthDate = startOfMonth(currentDate); // This correctly gets the 1st of the month

  // Format dates correctly
  const dateStartRange = format(startOfMonthDate, "yyyy-MM-dd"); // First day of current month
  const dateEndRange = format(currentDate, "yyyy-MM-dd");

  const { userId } = useUserId();

  // Fetch vehicles if userId is present
  const { data: vehicleData, isLoading: isVehiclesLoading } = useQuery({
    queryKey: ["vehicles", 1, 10, "ASC"],
    queryFn: () =>
      fetchAllVehicles({
        page: 1,
        limit: 1,
        sortOrder: "ASC",
        userId: userId as string,
      }),
    enabled: !!userId,
  }); // Fetch from cached vehicle data

  // Fetch all-time portfolio stats
  const { data: portfolioData, isLoading: isPortfolioLoading } = useQuery({
    queryKey: ["portfolioStats"],
    queryFn: () => fetchPortfolioStats(),
    staleTime: 0,
  });

  // Fetch all-time enquiries stats
  const { data: enquiriesData, isLoading: isEnquiriesLoading } = useQuery({
    queryKey: ["enquiriesStats"],
    queryFn: () => fetchEnquiriesStats(),
    staleTime: 0,
  });

  // Fetch current month portfolio stats
  const { data: monthlyPortfolioData, isLoading: isMonthlyPortfolioLoading } =
    useQuery({
      queryKey: ["monthlyPortfolioStats", dateStartRange, dateEndRange],
      queryFn: () => fetchPortfolioStats(dateStartRange, dateEndRange),
      staleTime: 0,
    });

  // Fetch current month enquiries stats
  const { data: monthlyEnquiriesData, isLoading: isMonthlyEnquiriesLoading } =
    useQuery({
      queryKey: ["monthlyEnquiriesStats", dateStartRange, dateEndRange],
      queryFn: () => fetchEnquiriesStats(dateStartRange, dateEndRange),
      staleTime: 0,
    });

  const vehicleCount = vehicleData?.result.total || 0;
  const totalPortfolioCount = portfolioData?.result.count || 0;
  const totalEnquiriesCount = enquiriesData?.result.count || 0;

  const monthlyPortfolioCount = monthlyPortfolioData?.result.count || 0;
  const monthlyEnquiriesCount = monthlyEnquiriesData?.result.count || 0;

  const metricCards: {
    title: string;
    value: number | string;
    isLoading: boolean;
  }[] = [
    {
      title: "Total portfolio views",
      value: totalPortfolioCount,
      isLoading: isPortfolioLoading,
    },
    {
      title: "Total enquiries",
      value: totalEnquiriesCount,
      isLoading: isEnquiriesLoading,
    },
    {
      title: "Monthly portfolio views",
      value: monthlyPortfolioCount,
      isLoading: isMonthlyPortfolioLoading,
    },
    {
      title: "Monthly Enquiries",
      value: monthlyEnquiriesCount,
      isLoading: isMonthlyEnquiriesLoading,
    },
  ];

  return {
    vehicleCount,
    isVehiclesLoading,
    metricCards,
    userId,
  };
}
