import { getSRMUserTaxAndContractInfo } from "@/api/srm";
import TaxInfoForm from "@/components/form/srm-form/TaxInfoForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import PageWrapper from "@/components/PageWrapper";
import { SRMTaxInfoFormType } from "@/types/srm-types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SRMCountryTaxInfoUpdatePage() {
  const { contractId } = useParams<{
    contractId: string;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["srm-contract", contractId],
    queryFn: getSRMUserTaxAndContractInfo,
  });

  const formData = data?.result
    ? {
        countryId: data?.result?.country,
        taxNumber: data?.result?.taxNumber,
      }
    : null;

  return (
    <PageWrapper heading="Some information before we begin!">
      {isLoading ? (
        <FormSkelton />
      ) : (
        <TaxInfoForm type="Update" formData={formData as SRMTaxInfoFormType} />
      )}
    </PageWrapper>
  );
}
