import { getSRMCustomerFormDetails } from "@/api/srm";
import { useQuery } from "@tanstack/react-query";

export default function useRefreshSRMCustomer({
  customerId,
}: {
  customerId: string | undefined;
}) {
  const {
    isLoading: isCustomerRefreshLoading,
    refetch: refetchRefreshCustomer,
  } = useQuery({
    queryKey: ["srm-customer-details-form", customerId],
    queryFn: () => getSRMCustomerFormDetails(customerId as string),
    enabled: !!customerId,
  });

  return {
    isCustomerRefreshLoading,
    refetchRefreshCustomer,
  };
}
