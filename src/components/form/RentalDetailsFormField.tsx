import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "../ui/form";
import HourlyRentalDetailFormField from "./HourlyRentalDetailsFormField";

const RentalDetailField = ({
  period,
  description,
}: {
  period: "day" | "week" | "month";
  description: string;
}) => {
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
                field.onChange(value);
                if (!value) {
                  clearErrors([`rentalDetails`]); // Clear related errors when checkbox is unchecked
                }
              }}
              className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
              id={`rentalDetails-${period}-enabled`}
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
                  Rent in AED
                </label>
                <div className="w-full">
                  <Input
                    id={`rentalDetails-${period}-rentInAED`}
                    {...field}
                    placeholder="Rent in AED"
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
                    {`Rent of the Vehicle in AED per ${period} `}
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
                    {`Mileage of the vehicle per ${period} (KM)`}
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

const RentalDetailsFormField = () => {
  return (
    <div className="flex flex-col">
      <RentalDetailField
        period="day"
        description="(Select to set daily rental rates)"
      />
      <RentalDetailField
        period="week"
        description="(Select to set weekly rental rates)"
      />
      <RentalDetailField
        period="month"
        description="(Select to set monthly rental rates)"
      />
      <HourlyRentalDetailFormField />
    </div>
  );
};

export default RentalDetailsFormField;
