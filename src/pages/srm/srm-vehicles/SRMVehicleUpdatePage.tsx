import { getSRMVehicleFormDetails } from "@/api/srm";
import SRMVehicleDetailsForm from "@/components/form/srm-form/SRMVehicleDetailsForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import PageWrapper from "@/components/PageWrapper";
import { mapToSRMVehicleForm } from "@/helpers/srm-form";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SRMVehicleUpdatePage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();

  sessionStorage.setItem("vehicleId", vehicleId || "");

  // Fetch primary form data
  const { data: vehicleFormResult, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["srm-vehicle-details-form", vehicleId],
    queryFn: () => getSRMVehicleFormDetails(vehicleId as string),
    staleTime: 60000,
    enabled: !!vehicleId,
  });

  const vehicleFormData = mapToSRMVehicleForm(vehicleFormResult?.result);

  return (
    <PageWrapper heading="Edit Vehicle">
      {isVehicleLoading ? (
        <FormSkelton />
      ) : (
        <SRMVehicleDetailsForm
          type={"Update"}
          formData={vehicleFormData}
          isDedicatedVehiclePage={true}
        />
      )}
    </PageWrapper>
  );
}
