import SRMContractForm from "@/components/form/srm-form/SRMContractForm";
import PageWrapper from "@/components/PageWrapper";

export default function SRMContractAddPage() {
  return (
    <PageWrapper heading="Submit your Contract and continue ">
      <SRMContractForm type="Add" />
    </PageWrapper>
  );
}
