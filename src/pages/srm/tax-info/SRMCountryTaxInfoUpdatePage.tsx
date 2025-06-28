import TaxInfoForm from "@/components/form/srm-form/TaxInfoForm";
import PageWrapper from "@/components/PageWrapper";

export default function SRMCountryTaxInfoUpdatePage() {
  return (
    <PageWrapper heading="Some information before we begin!">
      <TaxInfoForm type="Update" />
    </PageWrapper>
  );
}
