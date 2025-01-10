import { fetchAllVehicles } from "@/api/vehicle";
import { ApprovalStatusTypes } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toggleVehicleVisibility } from "@/api/vehicle";
import { SingleVehicleType } from "@/types/API-types";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface UseVehiclesParams {
  page: number;
  limit?: number;
  search?: string;
  filter: ApprovalStatusTypes;
  userId?: string;
}

export const useVehicles = ({
  page,
  limit = 10,
  search,
  filter,
  userId,
}: UseVehiclesParams) => {
  return useQuery({
    queryKey: ["vehicles", page, search, filter],
    queryFn: () =>
      fetchAllVehicles({
        page,
        limit,
        sortOrder: "DESC",
        userId: userId as string,
        search: search || undefined,
        approvalStatus: filter !== "ALL" ? filter : undefined,
      }),
    enabled: !!userId,
  });
};

export const useToggleVehicleVisibility = () => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleVisibility = async (
    vehicle: SingleVehicleType,
    isEnabled: boolean
  ) => {
    setIsUpdating(true);
    try {
      await toggleVehicleVisibility({
        vehicleId: vehicle.vehicleId,
        isDisabled: isEnabled,
      });

      toast({
        description: `${vehicle.vehicleModel} is ${
          !isEnabled ? "enabled" : "disabled"
        }`,
        className: "text-white font-semibold text-lg bg-yellow",
      });

      // Invalidate the query to refresh the vehicles list
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    } catch (error) {
      toast({
        description: `Failed to ${isEnabled ? "enable" : "disable"} ${
          vehicle.vehicleModel
        }`,
        className: "text-white font-semibold text-lg bg-red-500",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { toggleVisibility, isUpdating };
};
