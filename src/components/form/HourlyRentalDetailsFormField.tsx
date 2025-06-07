// HourlyRentalDetailFormField.tsx
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Infinity } from "lucide-react";

const HourlyRentalDetailFormField = ({
  isDisabled = false,
  isSRM = false,
  isIndia = false,
}: {
  isDisabled?: boolean;
  isSRM?: boolean;
  isIndia?: boolean;
}) => {
  const { control, watch, clearErrors } = useFormContext();
  const isEnabled = watch("rentalDetails.hour.enabled");

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow">
      <Controller
        name="rentalDetails.hour.enabled"
        control={control}
        render={({ field }) => (
          <div className="flex items-center mt-3 space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={(value) => {
                if (isSRM && !value) return;

                field.onChange(value);
                if (!value) {
                  clearErrors([`rentalDetails`]);
                }
              }}
              className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
              id="rentalDetails-hour-enabled"
              disabled={isDisabled}
            />
            <label
              htmlFor="rentalDetails-hour-enabled"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Hour{" "}
              <span className="text-sm italic text-gray-700">
                &#40;select to set hourly rental rates&#41;
              </span>
            </label>
          </div>
        )}
      />

      {isEnabled && (
        <>
          {/* Minimum Required Booking (Select) */}
          <Controller
            name="rentalDetails.hour.minBookingHours"
            control={control}
            render={({ field }) => (
              <div className="flex items-start mt-4 space-x-2">
                <label className="flex items-start w-36 font-medium max-md:text-sm">
                  Minimum Booking Hours <span className="mt-3">:</span>
                </label>
                <div className="flex flex-col w-full">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      clearErrors("rentalDetails");
                    }}
                    value={field.value || ""}
                    disabled={isDisabled}
                  >
                    <SelectTrigger
                      disabled={isDisabled}
                      className="ring-0 select-field focus:ring-0 input-fields"
                    >
                      <SelectValue
                        className="!font-bold !text-black"
                        placeholder="Select hour"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, index) => (
                        <SelectItem
                          key={index + 1}
                          value={(index + 1).toString()}
                        >
                          {index + 1} hour{index + 1 > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the minimum required booking hours (1–10 hours).
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* Rent in AED */}
          <Controller
            name="rentalDetails.hour.rentInAED"
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-4 space-x-2">
                <label className="w-36 font-medium">
                  Rent in {isIndia ? "INR" : "AED"}:
                </label>
                <div className="flex flex-col w-full">
                  <Input
                    {...field}
                    placeholder={
                      isIndia ? "Enter rent in INR" : "Enter rent in AED"
                    }
                    className="input-field"
                    type="text"
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
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors(`rentalDetails`);
                    }}
                    readOnly={isDisabled}
                  />
                  <FormDescription>
                    Specify the hourly rental price in{" "}
                    {isIndia ? "INR." : "AED."}
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* Mileage Limit */}
          <Controller
            name="rentalDetails.hour.mileageLimit"
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-4 space-x-2">
                <label className="w-36 font-medium">Mileage Limit:</label>
                <div className="flex flex-col w-full">
                  <Input
                    {...field}
                    placeholder="Enter mileage limit"
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    disabled={watch(`rentalDetails.hour.unlimitedMileage`)}
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
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors(`rentalDetails`);
                    }}
                    readOnly={isDisabled}
                  />
                  <FormDescription>
                    Specify the mileage limit for hourly rentals &#40;in
                    KM&#41;.
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* is unlimited */}
          <Controller
            name={`rentalDetails.hour.unlimitedMileage`}
            control={control}
            render={({ field }) => (
              <div className="ml-24 mt-4 flex w-fit max-w-full flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(value) => field.onChange(value)}
                    className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
                    id="rentalDetails-hour-unlimitedMileage"
                    disabled={isDisabled}
                  />
                  <label
                    htmlFor="rentalDetails-hour-unlimitedMileage"
                    className="flex-center gap-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Unlimited Mileage <Infinity className="text-yellow" />
                  </label>
                </div>
                <FormDescription>
                  Check this box if the vehicle has no mileage limit.
                </FormDescription>
              </div>
            )}
          />
        </>
      )}
    </div>
  );
};

export default HourlyRentalDetailFormField;
