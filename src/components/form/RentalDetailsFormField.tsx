import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "../ui/form";
import HourlyRentalDetailFormField from "./HourlyRentalDetailsFormField";
import { Infinity } from "lucide-react";

type RentalDetailsFieldProps = {
  period: "day" | "week" | "month";
  description: string;
  isDisabled?: boolean;
  isSRM?: boolean;
  isIndia?: boolean;
};

const RentalDetailField = ({
  period,
  description,
  isDisabled = false,
  isSRM = false,
  isIndia = false,
}: RentalDetailsFieldProps) => {
  const { control, watch, clearErrors } = useFormContext();
  const isEnabled = watch(`rentalDetails.${period}.enabled`);

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow">
      <Controller
        name={`rentalDetails.${period}.enabled`}
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
              id={`rentalDetails-${period}-enabled`}
              disabled={isDisabled}
            />
            <label
              htmlFor={`rentalDetails-${period}-enabled`}
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}{" "}
              <span className="text-sm italic text-gray-700">
                {description}
              </span>
            </label>
          </div>
        )}
      />
      {isEnabled && (
        <>
          <Controller
            name={`rentalDetails.${period}.rentInAED`}
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-2">
                <label
                  htmlFor={`rentalDetails-${period}-rentInAED`}
                  className="block mr-1 mb-5 w-28 text-sm font-medium"
                >
                  Rent in {isIndia ? "INR" : "AED"}
                </label>
                <div className="w-full">
                  <Input
                    id={`rentalDetails-${period}-rentInAED`}
                    {...field}
                    placeholder={isIndia ? "Rent in INR" : "Rent in AED"}
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
                    {`Rent of the Vehicle in ${
                      isIndia ? "INR" : "AED"
                    } per ${period} `}
                  </FormDescription>
                </div>
              </div>
            )}
          />
          <Controller
            name={`rentalDetails.${period}.mileageLimit`}
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-2">
                <label
                  htmlFor={`rentalDetails-${period}-mileageLimit`}
                  className="block mb-6 w-28 text-sm font-medium"
                >
                  Mileage Limit
                </label>
                <div className="w-full">
                  <Input
                    id={`rentalDetails-${period}-mileageLimit`}
                    {...field}
                    placeholder="Mileage Limit"
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    disabled={watch(`rentalDetails.${period}.unlimitedMileage`)}
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
                    {`Mileage of the vehicle per ${period} (KM)`}
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* is unlimited */}
          <Controller
            name={`rentalDetails.${period}.unlimitedMileage`}
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

const RentalDetailsFormField = ({
  isDisabled = false,
  isSRM = false,
  isIndia = false,
}: {
  isDisabled?: boolean;
  isSRM?: boolean;
  isIndia?: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <RentalDetailField
        period="day"
        description="(Select to set daily rental rates)"
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
      />
      <RentalDetailField
        period="week"
        description="(Select to set weekly rental rates)"
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
      />
      <RentalDetailField
        period="month"
        description="(Select to set monthly rental rates)"
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
      />
      <HourlyRentalDetailFormField
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
      />
    </div>
  );
};

export default RentalDetailsFormField;
