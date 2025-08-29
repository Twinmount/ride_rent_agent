import React from "react";
import { RentalDetails } from "@/types/srm-types";
import { Input } from "@/components/ui/input";
import { FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface RentalDetailsPreviewProps {
  rentalDetails: RentalDetails | null;
}

const RentalDetailsPreview: React.FC<RentalDetailsPreviewProps> = ({
  rentalDetails,
}) => {
  if (!rentalDetails) return null;

  const periods = ["hour", "day", "week", "month"] as const;

  return (
    <div className="flex flex-col">
      {periods.map((period) => {
        const data = rentalDetails[period];
        if (!data?.enabled) return null;

        return (
          <div
            key={period}
            className="p-2 mb-2 rounded-lg border-b shadow bg-white"
          >
            {/* Disabled Checkbox & Period Label */}
            <div className="flex items-center mt-3 space-x-2">
              <Checkbox
                checked={data.enabled}
                disabled
                className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                id={`preview-${period}-enabled`}
              />
              <label
                htmlFor={`preview-${period}-enabled`}
                className="text-base font-medium leading-none"
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}{" "}
                <span className="text-sm italic text-gray-700">
                  (Preview of {period} rental details)
                </span>
              </label>
            </div>

            {/* Rent in AED */}
            <div className="flex items-center mt-2">
              <label
                htmlFor={`preview-${period}-rentInAED`}
                className="block mr-1 mb-5 w-28 text-sm font-medium"
              >
                Rent in AED
              </label>
              <div className="w-full">
                <Input
                  id={`preview-${period}-rentInAED`}
                  value={data.rentInAED}
                  readOnly
                  className="input-field"
                />
                <FormDescription>
                  Rent of the Vehicle in AED per {period}
                </FormDescription>
              </div>
            </div>

            {/* Mileage Limit */}
            <div className="flex items-center mt-2">
              <label
                htmlFor={`preview-${period}-mileageLimit`}
                className="block mb-6 w-28 text-sm font-medium"
              >
                Mileage Limit
              </label>
              <div className="w-full">
                <Input
                  id={`preview-${period}-mileageLimit`}
                  value={data.mileageLimit}
                  readOnly
                  className="input-field"
                />
                <FormDescription>
                  Mileage of the vehicle per {period} (KM)
                </FormDescription>
              </div>
            </div>

            {/* Hourly-specific: Min Booking Hours */}
            {period === "hour" && (
              <div className="flex items-center mt-2">
                <label
                  htmlFor="preview-hour-minBookingHours"
                  className="block w-28 text-sm font-medium"
                >
                  Min Hours
                </label>
                <div className="w-full">
                  {/* @ts-ignore */}
                  <Input
                    id="preview-hour-minBookingHours"
                    // @ts-ignore
                    value={data.minBookingHours}
                    readOnly
                    className="input-field"
                  />
                  <FormDescription>
                    Minimum booking hours required
                  </FormDescription>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RentalDetailsPreview;
