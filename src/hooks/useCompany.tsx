import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/api/company";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import useUserId from "./useUserId";

export const useCompany = () => {
  const navigate = useNavigate();

  //accessing userId from useUserId hook
  const { userId } = useUserId();

  // Use React Query to fetch company data based on userId
  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["company"],
    queryFn: () => getCompany(userId as string),
    enabled: !!userId,
  });

  const companyId = companyData?.result?.companyId;

  // Redirect if no userId or companyId is available
  if (!userId || !companyId) {
    toast({
      variant: "destructive",
      title: "Unauthorized! Login to continue",
    });
    navigate("/login", { replace: true });
  }

  return { userId, companyId, isCompanyLoading };
};
