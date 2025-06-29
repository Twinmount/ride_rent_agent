import SRMContractForm from "@/components/form/srm-form/SRMContractForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
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

  return (
    <PageWrapper heading="Update Contract">
      {isLoading ? <FormSkelton /> : <SRMContractForm type="Update" />}
    </PageWrapper>
  );
}
