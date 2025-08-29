import TaxInfoForm from "@/components/form/srm-form/TaxInfoForm";
import PageWrapper from "@/components/PageWrapper";

export default function SRMCountryTaxInfoAddPage() {
  return (
    <PageWrapper heading="Some information before we begin!">
      <TaxInfoForm type="Add" />
    </PageWrapper>
  );
}
