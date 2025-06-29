import { getSRMStatus } from "@/api/srm";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  isOnBoardingRoutes: boolean;
}

/**
 * SRMConditionalWrapper protects onboarding/setup routes like:
 * - /srm/intro
 * - /srm/contracts/new
 * - /srm/tax-info
 *
 * It checks if SRM setup is complete via API:
 * - If setup IS complete (data !== null), render child routes.
 * - If setup is NOT complete (data === null), redirect to /srm/intro.
 */
export const SRMConditionalWrapper = ({
  isOnBoardingRoutes = false,
}: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["srm-status"],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 1000);
      }),
  });

  if (isLoading) return <LazyLoader />;

  if (isError) {
    throw new Error("Failed to fetch srm status");
  }

  // User has completed onboarding — redirect if they're trying to revisit onboarding routes
  if (data !== null && isOnBoardingRoutes) {
    return <Navigate to="/srm/dashboard" replace />;
  }

  // User has not completed onboarding and is trying to access a valid onboarding page
  if (data === null && isOnBoardingRoutes) {
    return <Outlet />;
  }

  // For any other case, redirect to /srm/intro
  if (data === null && !isOnBoardingRoutes) {
    return <Navigate to="/srm/intro" replace />;
  }

  return <Outlet />;
};
