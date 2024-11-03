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

const HourlyRentalDetailFormField = () => {
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
                field.onChange(value);
                if (!value) {
                  clearErrors([`rentalDetails`]);
                }
              }}
              className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
              id="rentalDetails-hour-enabled"
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
                  >
                    <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
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
                <label className="w-36 font-medium">Rent in AED:</label>
                <div className="flex flex-col w-full">
                  <Input
                    {...field}
                    placeholder="Enter rent in AED"
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
                  />
                  <FormDescription>
                    Specify the hourly rental price in AED.
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
                  />
                  <FormDescription>
                    Specify the mileage limit for hourly rentals &#40;in
                    KM&#41;.
                  </FormDescription>
                </div>
              </div>
            )}
          />
        </>
      )}
    </div>
  );
};

export default HourlyRentalDetailFormField;
