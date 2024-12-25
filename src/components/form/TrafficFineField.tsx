import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormDescription, FormMessage } from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const TrafficFineField = () => {
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "finesCollected", // The field name for the array
  });

  // Handle changes in the checkbox (yes/no)
  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      append({
        amount: "",
        description: `TRAFFIC FINE`, // Internally set description
        paymentDate: null,
      }); // Add a new traffic fine
    } else {
      setValue("finesCollected", []); // Reset the traffic fine array
    }
  };

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow bg-slate-50">
      {/* Traffic Fine Checkboxes */}
      <div className="flex items-center mt-3 space-x-4">
        {/* Yes Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={fields.length > 0}
            onCheckedChange={(checked) =>
              handleCheckboxChange(checked === true)
            }
            className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
            id="trafficFineYes"
          />
          <Label
            htmlFor="trafficFineYes"
            className="text-sm font-medium leading-none"
          >
            Yes
          </Label>
        </div>

        {/* No Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={fields.length === 0}
            onCheckedChange={(checked) =>
              handleCheckboxChange(checked === false)
            }
            className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
            id="trafficFineNo"
          />
          <Label
            htmlFor="trafficFineNo"
            className="text-sm font-medium leading-none"
          >
            No
          </Label>
        </div>
      </div>

      {/* Conditionally Render Traffic Fine Amount and Date */}
      {fields.length > 0 && (
        <div className="flex flex-col mt-4 space-y-4">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col space-y-4 p-2 mt-4 bg-white rounded-lg border shadow relative"
            >
              {/* Traffic Fine Amount */}
              <Controller
                name={`finesCollected.${index}.amount`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex items-center">
                    <Label
                      htmlFor={`finesCollected.${index}.amount`}
                      className="block mr-1 mb-5 w-28 min-w-24 text-[0.8rem] font-medium"
                    >
                      Fine Amount (AED)
                    </Label>
                    <div className="w-full h-fit">
                      <Input
                        id={`finesCollected.${index}.amount`}
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
                name={`finesCollected.${index}.paymentDate`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex items-center">
                    <Label
                      htmlFor={`finesCollected.${index}.paymentDate`}
                      className="block mr-1 mb-5 w-28 min-w-24 text-[0.8rem] font-medium"
                    >
                      Date of Fine
                    </Label>
                    <div className="w-full h-fit">
                      <DatePicker
                        selected={field.value}
                        onChange={(date: Date | null) => field.onChange(date)}
                        dateFormat="dd/MM/yyyy"
                        wrapperClassName="datePicker text-base"
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
              {/* Delete Button top right */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 flex-center absolute -top-7  -right-2 text-white  !rounded-full w-6 h-6 "
              >
                <X width={16} />
              </button>
            </div>
          ))}

          {/* Add More Button */}
          <Button
            type="button"
            onClick={() =>
              append({
                amount: "",
                description: `TRAFFIC FINE - ${fields.length + 1}`,
                paymentDate: undefined,
              })
            }
            className="mt-4 text-white bg-slate-800 hover:bg-slate-700 hover:text-white"
          >
            Add More +
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrafficFineField;
