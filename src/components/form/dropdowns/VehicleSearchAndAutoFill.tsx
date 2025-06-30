import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Plus } from "lucide-react";
import { debounce } from "@/lib/utils";
import { searchVehicle } from "@/api/srm";
import { VehicleType } from "@/types/srm-types";
import PreviewImageComponent from "../PreviewImageComponent";
import { Link } from "react-router-dom";

type VehicleSearchProps = {
  value?: string;
  onChangeHandler: (value: string, vehicleData?: any) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

const VehicleSearch = ({
  value,
  onChangeHandler,
  placeholder = "Search vehicle name...",
  isDisabled = false,
}: VehicleSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(""); // Default to an empty string
  const [open, setOpen] = useState(false);

  // Fetch vehicle data based on the search term
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["srm-vehicles", searchTerm],
    queryFn: () => searchVehicle(searchTerm),
    enabled: false, // Do not fetch initially
    staleTime: 0,
  });

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        refetch(); // Trigger the query only if a valid search term exists
      }
    }, 500),
    [refetch]
  );

  // Handle search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  // Handle selecting a vehicle from the dropdown
  const handleSelectVehicle = (
    vehicleRegistrationNumber: string,
    vehicleData?: VehicleType
  ) => {
    setSearchTerm(vehicleRegistrationNumber); // Set the selected name in the field
    setOpen(false);
    onChangeHandler(vehicleRegistrationNumber, vehicleData); // Pass the selected vehicle data
    // scroll to bottom after 500 ms
    if (vehicleData?.id) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 500);
    }
  };

  const vehicleData = data?.result.list;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isDisabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-w-full">
        <Command>
          <input
            value={searchTerm}
            placeholder={placeholder}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full border-b outline-none focus:ring-0 h-10 text-sm"
          />
          <CommandList>
            {isFetching ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : vehicleData?.length ? (
              <CommandGroup>
                {searchTerm && (
                  <CommandItem
                    key="manual-entry"
                    onSelect={() =>
                      handleSelectVehicle(searchTerm, {} as VehicleType)
                    }
                    className="border mb-1"
                  >
                    <AddNewVehicle searchTerm={searchTerm} />
                  </CommandItem>
                )}
                {vehicleData.map((vehicle: VehicleType) => (
                  <VehicleItem
                    key={vehicle.id}
                    vehicle={vehicle}
                    handleSelectVehicle={handleSelectVehicle}
                  />
                ))}
              </CommandGroup>
            ) : (
              <>
                <CommandEmpty>
                  {searchTerm.length > 0
                    ? "No Vehicles found"
                    : "Search vehicle name..."}
                </CommandEmpty>
                {searchTerm && (
                  <CommandGroup>
                    <CommandItem key="manual-entry">
                      <AddNewVehicle searchTerm={searchTerm} />
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VehicleSearch;

// individual vehicle box
const VehicleItem = ({
  vehicle,
  handleSelectVehicle,
}: {
  vehicle: VehicleType;
  handleSelectVehicle: (
    vehicleRegistrationNumber: string,
    vehicleData?: VehicleType
  ) => void;
}) => {
  return (
    <CommandItem
      key={vehicle.id}
      onSelect={() =>
        handleSelectVehicle(vehicle.vehicleRegistrationNumber, vehicle)
      }
      className="border mb-1"
    >
      <div className="flex h-12 gap-x-3">
        <div className="h-12 bg-slate-200 w-12 rounded-xl overflow-hidden">
          <PreviewImageComponent imagePath={vehicle.vehiclePhoto} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-medium">
            {vehicle.vehicleRegistrationNumber}
          </span>

          <span className="text-sm text-gray-500">
            {vehicle.vehicleBrand.brandName || "N/A"}
          </span>
        </div>
      </div>
    </CommandItem>
  );
};

// Add new vehicle Link
const AddNewVehicle = ({ searchTerm }: { searchTerm: string }) => (
  <Link
    to={`/srm/manage-vehicles/add?from=srm&vehicleRegistrationNumber=${encodeURIComponent(
      searchTerm
    )}`}
    className="flex items-center gap-x-2 h-12"
  >
    <div className="h-12  bg-slate-200 w-12 flex-center rounded-xl overflow-hidden">
      <Plus />
    </div>
    Add new vehicle
    <span className="font-medium italic">"{searchTerm}"</span>?
  </Link>
);
