import { Checkbox } from "@/components/ui/checkbox";
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
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { SERVICE_OPTIONS } from "@/constants/form.constants";



type AdditionalTypesDropdownProps = {
  value: string[];
  onChangeHandler: (value: string[]) => void;
  isDisabled?: boolean;
  vehicleTypeId: string;
};

const AdditionalTypesDropdown = ({
  value = [],
  onChangeHandler,
  isDisabled = false,
  vehicleTypeId,
}: AdditionalTypesDropdownProps) => {
  const [selectedAdditionalTypes, setSelectedAdditionalTypes] = useState<
    string[]
  >(value || []);

  // Filter service options based on vehicleTypeId selection
  const filteredServices = SERVICE_OPTIONS.filter(
    (types) =>
      types.typeId !== vehicleTypeId ||
      selectedAdditionalTypes.includes(types.typeId)
  );

  useEffect(() => {
    // Update selectedAdditionalTypes if vehicleTypeId is in selected type
    if (selectedAdditionalTypes.includes(vehicleTypeId)) {
      const updatedSelectedAdditionalTypes = selectedAdditionalTypes.filter(
        (serviceId) => serviceId !== vehicleTypeId
      );
      setSelectedAdditionalTypes(updatedSelectedAdditionalTypes);
      onChangeHandler(updatedSelectedAdditionalTypes);
    }
  }, [vehicleTypeId]); // Only re-run when vehicleTypeId changes

  const handleSelectAdditionalType = (serviceId: string) => {
    let updatedSelectedAdditionalTypes: string[];

    if (selectedAdditionalTypes.includes(serviceId)) {
      updatedSelectedAdditionalTypes = selectedAdditionalTypes.filter(
        (id) => id !== serviceId
      );
    } else {
      updatedSelectedAdditionalTypes = [...selectedAdditionalTypes, serviceId];
    }

    setSelectedAdditionalTypes(updatedSelectedAdditionalTypes);
    onChangeHandler(updatedSelectedAdditionalTypes);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          disabled={isDisabled || !vehicleTypeId}
          className="justify-between w-full font-normal"
        >
          {!vehicleTypeId
            ? "choose a vehicle type first"
            : selectedAdditionalTypes.length > 0
            ? `${selectedAdditionalTypes.length} services selected`
            : `Choose services offered`}
          <ChevronDown className="w-6 h-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:!w-96 p-0">
        <Command shouldFilter={false}>
          <CommandList>
            {filteredServices.length === 0 ? (
              <CommandEmpty>No services found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredServices.map((service) => (
                  <CommandItem
                    key={service.typeId}
                    value={service.typeId}
                    onSelect={() => handleSelectAdditionalType(service.typeId)}
                    className="flex gap-x-2 items-center mt-1"
                  >
                    <Checkbox
                      checked={selectedAdditionalTypes.includes(service.typeId)}
                      onCheckedChange={() =>
                        handleSelectAdditionalType(service.typeId)
                      }
                      className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none "
                    />
                    {service.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AdditionalTypesDropdown;
