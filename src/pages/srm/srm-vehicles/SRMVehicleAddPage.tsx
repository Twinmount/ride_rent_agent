import SRMVehicleDetailsForm from "@/components/form/srm-form/VehicleDetailsForm";
import PageWrapper from "@/components/PageWrapper";

export default function SRMVehicleAddPage() {
  return (
    <PageWrapper heading="Add Vehicle">
      <SRMVehicleDetailsForm
        type={"Add"}
        isAddOrIncomplete={true}
        showDescription={false}
        isDedicatedAddPage={true}
      />
    </PageWrapper>
  );
}
