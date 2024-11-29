import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormDescription, FormMessage } from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TrafficFineField = () => {
  const { control, watch, clearErrors } = useFormContext();
  const trafficFine = watch("trafficFine");

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow">
      {/* Traffic Fine Checkboxes */}
      <Controller
        name="trafficFine"
        control={control}
        render={({ field }) => (
          <div className="flex items-center mt-3 space-x-4">
            {/* Yes Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.value === "yes"}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? "yes" : "")
                }
                className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                id="trafficFineYes"
              />
              <label
                htmlFor="trafficFineYes"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Yes
              </label>
            </div>

            {/* No Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.value === "no"}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? "no" : "")
                }
                className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                id="trafficFineNo"
              />
              <label
                htmlFor="trafficFineNo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                No
              </label>
            </div>
          </div>
        )}
      />

      {/* Conditionally Render Traffic Fine Amount and Date */}
      {trafficFine === "yes" && (
        <div className="flex flex-col mt-4 space-y-4">
          {/* Traffic Fine Amount */}
          <Controller
            name="trafficFineAmount"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex items-center">
                <label
                  htmlFor="trafficFineAmount"
                  className="block mr-1 mb-5 w-28 text-[0.8rem] font-medium"
                >
                  Fine Amount (AED)
                </label>
                <div className="w-full h-fit">
                  <Input
                    id="trafficFineAmount"
                    {...field}
                    placeholder="Enter traffic fine amount"
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
                      field.onChange(e); // Update the field value
                      clearErrors("trafficFineAmount"); // Clear any existing error
                    }}
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}

                  <FormDescription>
                    Enter the fine amount in AED.
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* Date of Traffic Fine */}
          <Controller
            name="dateOfTrafficFine"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex items-center">
                <label
                  htmlFor="dateOfTrafficFine"
                  className="block mr-1 mb-5 w-28 text-[0.8rem] font-medium"
                >
                  Date of Fine
                </label>
                <div className="w-full h-fit">
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    wrapperClassName="datePicker text-base -ml-4"
                    placeholderText="DD/MM/YYYY"
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}

                  <FormDescription>
                    Select the date when the fine was issued.
                  </FormDescription>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default TrafficFineField;
