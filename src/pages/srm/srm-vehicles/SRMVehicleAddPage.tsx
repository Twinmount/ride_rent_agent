import SRMVehicleDetailsForm from "@/components/form/srm-form/SRMVehicleDetailsForm";
import PageWrapper from "@/components/PageWrapper";

export default function SRMVehicleAddPage() {
  return (
    <PageWrapper heading="Add Vehicle">
      <SRMVehicleDetailsForm
        type={"Add"}
        showDescription={false}
        isDedicatedVehiclePage={true}
      />
    </PageWrapper>
  );
}
