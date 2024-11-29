import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormDescription, FormMessage } from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const ADDITIONAL_CHARGES_OPTIONS = [
  "Fuel Charges",
  "Excess Mileage Charges",
  "Cleaning Charges",
  "Late Return Fee",
  "Insurance Excess/Deductible",
  "Replacement/Repair of Lost/Damaged Accessories",
  "Additional Driver Fee",
  "Child Seat",
  "GPS/Navigation System",
  "Wi-Fi Hotspot Device",
  "Roadside Assistance",
  "Cross-Border Fee",
  "Smoking Penalty",
  "Lost Registration Card (Mulkiya)",
  "Replacement Car Delivery Fee",
  "Car Delivery Fee",
  "Car Return Fee",
  "Service Charge",
];

const AdditionalChargesField = () => {
  const { control, watch, setValue, clearErrors } = useFormContext();
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);

  // Watches for changes in additional charges
  const additionalCharges = watch("additionalCharges") || {};

  const handleCheckboxChange = () => {
    setIsEnabled((prev) => !prev);
    if (!isEnabled) {
      setSelectedCharges([]); // Clear selections if disabled
      setValue("additionalCharges", {});
    }
  };

  const handleChargeSelection = (charge: string) => {
    let updatedCharges: string[];
    if (selectedCharges.includes(charge)) {
      updatedCharges = selectedCharges.filter((item) => item !== charge);
      const newAdditionalCharges = { ...additionalCharges };
      delete newAdditionalCharges[charge];
      setValue("additionalCharges", newAdditionalCharges);
    } else {
      updatedCharges = [...selectedCharges, charge];
    }
    setSelectedCharges(updatedCharges);
  };

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow">
      {/* Additional Charges Checkbox */}
      <div className="flex items-center mb-4 space-x-2">
        <Checkbox
          checked={isEnabled}
          onCheckedChange={handleCheckboxChange}
          className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
          id="additionalChargesEnabled"
        />
        <label
          htmlFor="additionalChargesEnabled"
          className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Any Other Charges?
        </label>
      </div>

      {/* Multi-Select Dropdown */}
      {isEnabled && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              {selectedCharges.length > 0
                ? `${selectedCharges.length} selected`
                : "Select Additional Charges"}
              <ChevronDown className="ml-auto w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Command>
              <CommandList>
                <CommandGroup>
                  {ADDITIONAL_CHARGES_OPTIONS.map((charge) => (
                    <CommandItem
                      key={charge}
                      onSelect={() => handleChargeSelection(charge)}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={selectedCharges.includes(charge)}
                        onCheckedChange={() => handleChargeSelection(charge)}
                        className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                      />
                      {charge}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Dynamic Fields for Selected Charges */}
      {isEnabled &&
        selectedCharges.map((charge) => (
          <div key={charge} className="p-2 mt-4 rounded-lg border shadow">
            <p className="mb-2 font-medium">{charge}</p>

            {/* Amount Input */}
            <Controller
              name={`additionalCharges.${charge}.amount`}
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor={`additionalCharges-${charge}-amount`}
                    className="w-28 text-sm font-medium"
                  >
                    Amount (AED)
                  </label>
                  <Input
                    id={`additionalCharges-${charge}-amount`}
                    {...field}
                    placeholder="Enter amount"
                    className="input-field"
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (
                        !/^\d*$/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </div>
              )}
            />

            {/* Date Input */}
            <Controller
              name={`additionalCharges.${charge}.date`}
              control={control}
              defaultValue={null}
              render={({ field, fieldState }) => (
                <div className="flex items-center mt-4 space-x-4">
                  <label
                    htmlFor={`additionalCharges-${charge}-date`}
                    className="w-28 text-sm font-medium"
                  >
                    Date
                  </label>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    className="p-2 w-full rounded border"
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </div>
              )}
            />
          </div>
        ))}
    </div>
  );
};

export default AdditionalChargesField;
