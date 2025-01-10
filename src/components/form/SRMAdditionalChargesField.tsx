import { useFormContext, Controller } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormDescription } from "@/components/ui/form";
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
import { debounce } from "@/lib/utils";
import { ADDITIONAL_CHARGES_OPTIONS } from "@/constants";

type AdditionalChargesFieldProps = {
  setAdditionalChargesTotal: React.Dispatch<React.SetStateAction<number>>;
  control: any;
  bookingStartDate: string;
};

const AdditionalChargesField = ({
  setAdditionalChargesTotal,
  control,
  bookingStartDate,
}: AdditionalChargesFieldProps) => {
  const { watch, setValue, clearErrors } = useFormContext();
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);

  const additionalCharges = watch("additionalCharges") || [];

  /**
   * Debounced function to calculate and update the total of all additional charges.
   * This function is debounced to prevent multiple recalculations from rapid input changes.
   */
  const updateTotal = useMemo(
    () =>
      debounce((updatedCharges: typeof additionalCharges) => {
        const total = updatedCharges.reduce(
          (sum, charge) => sum + parseFloat(charge.amount || "0"),
          0
        );
        setAdditionalChargesTotal(total);
      }, 1000),
    [setAdditionalChargesTotal]
  );

  /**
   * Handles changes to the "amount" input field for a specific charge.
   * Updates the corresponding charge in the form state and triggers the debounced total calculation.
   *
   * @param {string} value - The new value of the input field.
   * @param {number} index - The index of the charge being updated in the additionalCharges array.
   */
  const handleInputChange = useCallback(
    (value: string, index: number) => {
      const updatedCharges = [...additionalCharges];
      updatedCharges[index] = {
        ...updatedCharges[index],
        amount: value,
      };
      setValue("additionalCharges", updatedCharges); // Update form field value
      updateTotal(updatedCharges); // Trigger debounced total update
    },
    [additionalCharges, setValue, updateTotal]
  );

  /**
   * Ensures that the total is calculated and updated when the component first renders
   * or whenever the additionalCharges array changes.
   */
  useEffect(() => {
    updateTotal(additionalCharges);
  }, [additionalCharges, updateTotal]);

  /**
   * Handles the change in the additional charges checkbox.
   * If the checkbox is checked, it enables the additional charges field.
   * If the checkbox is unchecked, it clears the selected charges and resets the form field.
   */
  const handleCheckboxChange = () => {
    setIsEnabled((prev) => !prev);
    if (!isEnabled) {
      setSelectedCharges([]); // Clear selections if disabled
      setValue("additionalCharges", []);
    }
    clearErrors("additionalCharges");
  };

  /**
   * Handles the selection of additional charges.
   * If the charge is already selected, it removes it from the list.
   * If the charge is not selected, it adds it to the list.
   */
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
        paymentDate: undefined,
      };
      setValue("additionalCharges", [...additionalCharges, newCharge]);
    }
    setSelectedCharges(updatedCharges);
    clearErrors("additionalCharges");
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
            <Button
              variant="outline"
              className="w-full bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
            >
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
                  {/* Loop over Additional Charges Options */}
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
            <p className="mb-2 font-semibold">{charge.description}</p>

            {/* Amount Input */}
            <Controller
              name={`additionalCharges.${index}.amount`}
              control={control}
              defaultValue={charge.amount}
              render={({ field }) => (
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor={`additionalCharges-${charge.description}-amount`}
                    className="w-24 text-sm font-medium min-w-24"
                  >
                    Amount (AED)
                  </label>
                  <div className="flex flex-col">
                    <Input
                      id={`additionalCharges-${charge.description}-amount`}
                      {...field}
                      placeholder="Enter amount"
                      className="input-field"
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, ""); // Allow only numeric input
                        field.onChange(value); // Update form state
                        handleInputChange(value, index); // Trigger calculation
                        clearErrors("additionalCharges");
                      }}
                    />
                    <FormDescription className="ml-2 text-xs">
                      Fine Amount in AED.
                    </FormDescription>
                  </div>
                </div>
              )}
            />

            {/* Date Input */}
            <Controller
              name={`additionalCharges.${index}.paymentDate`}
              control={control}
              defaultValue={charge.paymentDate}
              render={({ field }) => (
                <div className="flex items-center mt-4 space-x-4">
                  <label
                    htmlFor={`additionalCharges-${charge.description}-date`}
                    className="w-24 text-sm font-medium min-w-24"
                  >
                    Date
                  </label>
                  <div className="flex flex-col">
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => {
                        field.onChange(date);
                        clearErrors("additionalCharges");
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      wrapperClassName="datePicker text-base"
                      minDate={new Date(bookingStartDate)}
                    />
                    <FormDescription className="ml-2 text-xs">
                      Date of the fine.
                    </FormDescription>
                  </div>
                </div>
              )}
            />
          </div>
        ))}
    </div>
  );
};

export default AdditionalChargesField;
