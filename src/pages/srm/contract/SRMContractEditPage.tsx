import { getSRMUserTaxAndContractInfo } from "@/api/srm";
import SRMContractForm from "@/components/form/srm-form/SRMContractForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import PageWrapper from "@/components/PageWrapper";
import { SRMContractFormType } from "@/types/srm-types";
import { useQuery } from "@tanstack/react-query";

export default function SRMContractEditPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["srm-contract"],
    queryFn: getSRMUserTaxAndContractInfo,
  });

  const formData = data?.result
    ? {
        termsNCondition: data?.result?.termsNCondition,
      }
    : null;

  return (
    <PageWrapper heading="Update Contract">
      {isLoading ? (
        <FormSkelton />
      ) : (
        <SRMContractForm
          type="Update"
          formData={formData as SRMContractFormType}
        />
      )}
    </PageWrapper>
  );
}
