import TaxInfoForm from "@/components/form/srm-form/TaxInfoForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import PageWrapper from "@/components/PageWrapper";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SRMCountryTaxInfoUpdatePage() {
  const { contractId } = useParams<{
    contractId: string;
  }>();

  const { isLoading } = useQuery({
    queryKey: ["srm-contract", contractId],
    queryFn: () => {},
  });
  return (
    <PageWrapper heading="Some information before we begin!">
      {isLoading ? <FormSkelton /> : <TaxInfoForm type="Update" />}
    </PageWrapper>
  );
}
