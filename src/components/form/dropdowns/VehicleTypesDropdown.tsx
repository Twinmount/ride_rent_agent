import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchAllVehicleTypes } from '@/api/vehicle-types'
import { SERVICE_OPTIONS } from "@/constants/form.constants";

type VehicleTypesDropdownProps = {
  vehicleCategoryId: string | undefined;
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

type VehicleType = {
  typeId: string;
  name: string;
  value: string;
};

const VehicleTypesDropdown = ({
  vehicleCategoryId,
  value,
  onChangeHandler,
  isDisabled = false,
}: VehicleTypesDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-types", vehicleCategoryId],
    queryFn: () =>
      fetchAllVehicleTypes({
        page: 1,
        limit: 20,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId as string,
      }),
    enabled: !!vehicleCategoryId,
  });

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  useEffect(() => {
    if (data) {
      // Extract service option IDs to exclude
      const serviceOptionIds = SERVICE_OPTIONS.map((option) => option.typeId);

      // Filter out service options from the vehicle types
      const filteredTypes = data.result.list.filter(
        (type: VehicleType) => !serviceOptionIds.includes(type.typeId)
      );
      setVehicleTypes(filteredTypes);
    }
  }, [data]);

  const getPlaceholderText = () => {
    if (isLoading) {
      return "Fetching types...";
    } else if (!vehicleCategoryId) {
      return "choose a vehicle category first";
    } else if (!vehicleTypes.length) {
      return "No vehicle types found";
    } else {
      return "Choose vehicle type";
    }
  };

  return (
    <Select
      onValueChange={onChangeHandler}
      value={value}
      disabled={isDisabled || isLoading || !vehicleCategoryId}
    >
      <SelectTrigger
        className={`select-field ring-0 focus:ring-0 input-fields ${
          (isDisabled || isLoading || !vehicleCategoryId) &&
          "!opacity-60 !cursor-default"
        }`}
        disabled={isDisabled || isLoading || !vehicleCategoryId}
      >
        <SelectValue
          className="!font-bold !text-black"
          placeholder={getPlaceholderText()}
        />
      </SelectTrigger>
      <SelectContent>
        {vehicleTypes.length > 0 &&
          vehicleTypes.map((type) => (
            <SelectItem
              key={type.typeId}
              value={type.typeId}
              className="select-item p-regular-14"
            >
              {type.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default VehicleTypesDropdown
