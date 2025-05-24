import { useState } from "react";
import ConfirmationDialog from "./common/ConfirmationDialog";
import { SingleVehicleType } from "@/types/API-types";
import ListingsGridSkeleton from "./loading-skelton/ListingsGridSkeleton";
import VehicleCard from "./cards/VehicleCard";
import { useToggleVehicleVisibility } from "@/pages/listings/ListingPage.hooks";
import { Link } from "react-router-dom";

interface ListedVehiclesProps {
  vehicles: SingleVehicleType[];
  isLoading: boolean;
  search: string;
  userId?: string;
}

export default function ListedVehicles({
  vehicles,
  isLoading,
  search,
  userId,
}: ListedVehiclesProps) {
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleType | null>(null);
  const { toggleVisibility, isUpdating } = useToggleVehicleVisibility();

  const handleSwitchChange = (vehicle: SingleVehicleType) => {
    setSelectedVehicle(vehicle);
  };

  const handleConfirmChange = async (
    vehicle: SingleVehicleType,
    isEnabled: boolean
  ) => {
    await toggleVisibility(vehicle, isEnabled);
    setSelectedVehicle(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <ListingsGridSkeleton />
      </div>
    );
  }

  if (vehicles.length === 0 && search) {
    return (
      <div className="pt-28 text-center text-gray-500">
        <Link
          to={`/listings/add/${userId}`}
          className="max-sm:hidden mb-6 flex-center bg-yellow text-white py-2 whitespace-nowrap w-32 min-w-32 font-semibold rounded-2xl transition-all animate-scale-up-down hover:animate-none hover:scale-[1.02]"
        >
          List Vehicle +
        </Link>
        <p className="text-lg font-semibold">No results found for "{search}"</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="pt-28 text-gray-500 flex flex-col items-center">
        <Link
          to={`/listings/add/${userId}`}
          className="max-sm:hidden mb-6 flex-center bg-yellow text-white py-2 whitespace-nowrap w-32 min-w-32 font-semibold rounded-2xl transition-all animate-scale-up-down hover:animate-none hover:scale-[1.02]"
        >
          List Vehicle +
        </Link>
        <p className="text-lg font-semibold">
          No vehicles found in this category
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {/* Render the existing vehicle cards */}
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            handleSwitchChange={handleSwitchChange}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      {selectedVehicle && (
        <ConfirmationDialog
          vehicle={selectedVehicle}
          onConfirm={handleConfirmChange}
          onCancel={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}
