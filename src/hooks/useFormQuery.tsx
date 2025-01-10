import { useQuery } from "@tanstack/react-query";
import {
  getFeaturesFormData,
  getFeaturesFormFieldsData,
  getSpecificationFormFieldData,
  getSpecificationFormData,
} from "@/api/vehicle";

interface UseSpecificationFormQueryParams {
  vehicleId: string;
  vehicleCategoryId: string | undefined;
  vehicleTypeId: string | undefined;
  isAddOrIncomplete: boolean;
}

/**
 * Custom hook to fetch specification form data.
 * If `isAddOrIncomplete` is true, fetches all specification fields for the given vehicle category and type.
 * If `isAddOrIncomplete` is false, fetches existing specifications for the given vehicle.
 *
 * @param {UseSpecificationFormQueryParams} params - Parameters for the hook.
 * @returns {UseQueryResult<GetSpecificationFormFieldsResponse>} The result of the query.
 */
export function useSpecificationFormQuery({
  vehicleId,
  vehicleCategoryId,
  vehicleTypeId,
  isAddOrIncomplete,
}: UseSpecificationFormQueryParams) {
  return useQuery({
    queryKey: [
      isAddOrIncomplete
        ? "specification-form-data"
        : "specification-update-form-data",
      vehicleId,
    ],

    queryFn: async () => {
      if (isAddOrIncomplete) {
        const data = await getSpecificationFormFieldData({
          vehicleCategoryId: vehicleCategoryId as string,
          vehicleTypeId: vehicleTypeId as string,
        });
        return {
          ...data,
          result: data.result.list,
        };
      } else {
        return await getSpecificationFormData(vehicleId);
      }
    },
    enabled: !!vehicleId,
  });
}

interface UseFeaturesFormQueryParams {
  vehicleId: string;
  vehicleCategoryId: string | undefined;
  isAddOrIncomplete: boolean;
}

/**
 * Hook to fetch features form data.
 * If `isAddOrIncomplete` is true, fetches all features for the given vehicle category.
 * If `isAddOrIncomplete` is false, fetches existing features for the given vehicle.
 * @param {UseFeaturesFormQueryParams} params - Parameters for the hook.
 * @returns {UseQueryResult<FeaturesFormResponse>} The result of the query.
 */
export function useFeaturesFormQuery({
  vehicleId,
  vehicleCategoryId,
  isAddOrIncomplete,
}: UseFeaturesFormQueryParams) {
  return useQuery({
    queryKey: [
      isAddOrIncomplete ? "features-form-data" : "features-update-form-data",
      vehicleId,
    ],
    queryFn: async () => {
      if (isAddOrIncomplete) {
        const data = await getFeaturesFormFieldsData({
          vehicleCategoryId: vehicleCategoryId as string,
        });
        return {
          ...data,
          result: data.result.list,
        };
      } else {
        return await getFeaturesFormData(vehicleId);
      }
    },
    enabled: !!vehicleId,
  });
}
