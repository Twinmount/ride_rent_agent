import PageWrapper from "@/components/PageWrapper";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SRMContractEditPage() {
  const { contractId } = useParams<{
    contractId: string;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["srm-contract", contractId],
    queryFn: () => {},
  });

  return <PageWrapper heading="Update Contract">""</PageWrapper>;
}
