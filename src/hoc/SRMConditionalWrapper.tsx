import { getSRMUserTaxAndContractInfo } from "@/api/srm";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const SRMConditionalWrapper = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["srm-onboarding-status"],
    queryFn: getSRMUserTaxAndContractInfo,
  });

  const location = useLocation();
  const currentPath = location.pathname;

  if (isLoading) return <LazyLoader />;
  if (isError) throw new Error("Failed to fetch SRM onboarding status");

  const country = data?.result?.country || null;
  const taxNumber = data?.result?.taxNumber || null;
  const termsNCondition = data?.result?.termsNCondition || null;

  const taxInfoCompleted = !!country && !!taxNumber;
  const contractCompleted = !!termsNCondition;
  const onboardingCompleted = taxInfoCompleted && contractCompleted;

  // ✅ Allow /srm/intro only if tax info is NOT completed
  if (currentPath === "/srm/intro") {
    if (!taxInfoCompleted) {
      return <Outlet />;
    }
    // If tax info is already filled, skip /srm/intro and move to next step
    return (
      <Navigate
        to={contractCompleted ? "/srm/dashboard" : "/srm/contract"}
        replace
      />
    );
  }

  //  If onboarding is complete, block access to any onboarding route
  if (
    onboardingCompleted &&
    ["/srm/tax-info", "/srm/contract"].includes(currentPath)
  ) {
    return <Navigate to="/srm/dashboard" replace />;
  }

  // If user has NOT filled tax info, allow only tax-info
  if (!taxInfoCompleted) {
    if (currentPath === "/srm/tax-info") return <Outlet />;
    return <Navigate to="/srm/tax-info" replace />;
  }

  // Tax info is filled, contract is not filled → allow only contract
  if (taxInfoCompleted && !contractCompleted) {
    if (currentPath === "/srm/tax-info" || currentPath === "/srm/into") {
      return <Navigate to="/srm/contract" replace />;
    }
    if (currentPath === "/srm/contract") return <Outlet />;
    return <Navigate to="/srm/contract" replace />;
  }

  // If onboarding is complete and accessing a valid route
  return <Outlet />;
};
