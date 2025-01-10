import { SingleVehicleType } from "@/types/API-types";
import { Link } from "react-router-dom";
import VehicleStatusOverlay from "../VehicleStatusOverlay";
import { Share2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { generateModelDetailsUrl } from "@/helpers";
import { toast } from "../ui/use-toast";
import { useCompany } from "@/hooks/useCompany";

type VehicleCardProps = {
  vehicle: SingleVehicleType;
  handleSwitchChange: (vehicle: SingleVehicleType) => void;
  isUpdating: boolean;
};

export default function VehicleCard({
  vehicle,
  handleSwitchChange,
  isUpdating,
}: VehicleCardProps) {
  const { userId, companyId } = useCompany();

  const handleShare = (vehicle: SingleVehicleType) => {
    const modelDetails = generateModelDetailsUrl(vehicle);

    const vehiclePublicUrl = `https://ride.rent/${vehicle.state.stateValue}/${vehicle.vehicleCategory.value}/${modelDetails}/${vehicle.vehicleId}`;

    if (navigator.share) {
      navigator
        .share({
          title: vehicle.vehicleModel,
          text: `Check out this vehicle: ${vehicle.vehicleModel}`,
          url: vehiclePublicUrl,
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      toast({
        title: "Share option is not supported in your browser",
        description:
          "Visit the vehicle in the official website and share it from there.",
        className: "text-white font-semibold text-lg bg-red-500",
      });
    }
  };

  return (
    <div
      key={vehicle.vehicleId}
      className="overflow-hidden h-fit rounded-lg border shadow-lg transition-all group"
    >
      <div className="w-full h-24 min-h-24  overflow-hidden relative">
        <Link
          to={`/listings/view/${vehicle.vehicleId}/${companyId}/${userId}`}
          className="w-full cursor-pointer"
        >
          <img
            src={vehicle.thumbnail}
            alt={vehicle.vehicleModel}
            className="object-cover w-full h-full transition-all scale-100 group-hover:scale-[1.03]"
          />
          <VehicleStatusOverlay
            approvalStatus={vehicle.approvalStatus}
            isDisabled={vehicle.isDisabled}
            disabledBy={vehicle.disabledBy}
          />
        </Link>
      </div>
      <div className="px-2 pb-2">
        <Link to={`/listings/view/${vehicle.vehicleId}/${companyId}/${userId}`}>
          <h3 className="mt-2 text-base font-medium line-clamp-1">
            {vehicle.vehicleModel}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <button
            className={`text-black ${
              vehicle.approvalStatus !== "APPROVED"
                ? "cursor-not-allowed text-gray-600"
                : "hover:text-yellow"
            }`}
            onClick={() => handleShare(vehicle)}
            disabled={vehicle.approvalStatus !== "APPROVED"}
          >
            <Share2 size={18} />
          </button>
          <Switch
            className="data-[state=checked]:bg-yellow data-[state=unchecked]:bg-gray-500 scale-75"
            checked={!vehicle.isDisabled}
            onCheckedChange={() => handleSwitchChange(vehicle)}
            disabled={
              vehicle.approvalStatus !== "APPROVED" ||
              isUpdating ||
              (vehicle.disabledBy === "admin" && vehicle.isDisabled)
            }
          />
        </div>
      </div>
    </div>
  );
}
