import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form";
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
import { Label } from "../ui/label";

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
  "Lost Registration Card (Mulkia)",
  "Replacement Car Delivery Fee",
  "Car Delivery Fee",
  "Car Return Fee",
  "Service Charge",
];

const AdditionalChargesField = () => {
  const { control, watch, setValue } = useFormContext();
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);

  const additionalCharges = watch("additionalCharges") || [];

  const handleCheckboxChange = () => {
    setIsEnabled((prev) => !prev);
    if (!isEnabled) {
      setSelectedCharges([]); // Clear selections if disabled
      setValue("additionalCharges", []);
    }
  };

  const handleChargeSelection = (charge: string) => {
    let updatedCharges: string[];
    if (selectedCharges.includes(charge)) {
      updatedCharges = selectedCharges.filter((item) => item !== charge);
      const newAdditionalCharges = additionalCharges.filter(
        (item) => item.description !== charge
      );
      setValue("additionalCharges", newAdditionalCharges);
    } else {
      updatedCharges = [...selectedCharges, charge];
      const newCharge = {
        amount: "",
        description: charge,
        paymentDate: new Date(),
      };
      setValue("additionalCharges", [...additionalCharges, newCharge]);
    }
    setSelectedCharges(updatedCharges);
  };

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow bg-slate-50">
      {/* Additional Charges Checkbox */}
      <div className="flex gap-x-4 items-center">
        <div className="flex items-center mb-4 space-x-2">
          <Checkbox
            checked={isEnabled}
            onCheckedChange={handleCheckboxChange}
            className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
            id="additionalChargesEnabled"
          />
          <Label
            htmlFor="additionalChargesEnabled"
            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Yes
          </Label>
        </div>

        <div className="flex items-center mb-4 space-x-2">
          <Checkbox
            checked={!isEnabled}
            onCheckedChange={handleCheckboxChange}
            className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
            id="additionalChargesEnabledNo"
          />
          <Label
            htmlFor="additionalChargesEnabledNo"
            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            No
          </Label>
        </div>
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
                      className="flex gap-x-2 items-center"
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
        additionalCharges.map((charge, index) => (
          <div
            key={index}
            className="p-2 mt-4 bg-white rounded-lg border shadow"
          >
            <p className="mb-2 font-medium">{charge.description}</p>

            {/* Amount Input */}
            <Controller
              name={`additionalCharges.${index}.amount`}
              control={control}
              defaultValue={charge.amount}
              render={({ field, fieldState }) => (
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor={`additionalCharges-${charge.description}-amount`}
                    className="w-24 text-sm font-medium min-w-24"
                  >
                    Amount (AED)
                  </label>
                  <Input
                    id={`additionalCharges-${charge.description}-amount`}
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
              name={`additionalCharges.${index}.paymentDate`}
              control={control}
              defaultValue={charge.paymentDate}
              render={({ field, fieldState }) => (
                <div className="flex items-center mt-4 space-x-4">
                  <label
                    htmlFor={`additionalCharges-${charge.description}-date`}
                    className="w-24 text-sm font-medium min-w-24"
                  >
                    Date
                  </label>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    wrapperClassName="datePicker text-base"
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
