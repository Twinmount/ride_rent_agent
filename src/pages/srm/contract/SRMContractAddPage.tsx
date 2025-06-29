import SRMContractForm from "@/components/form/srm-form/SRMContractForm";
import PageWrapper from "@/components/PageWrapper";

export default function SRMContractAddPage() {
  return (
    <PageWrapper heading="Add Contract">
      <SRMContractForm type="Add" />
    </PageWrapper>
  );
}
