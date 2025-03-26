import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription, FormMessage } from "@/components/ui/form";

const SecurityDepositField = ({
  isDisabled = false,
}: {
  isDisabled?: boolean;
}) => {
  const { control, watch, clearErrors } = useFormContext();
  const isEnabled = watch("securityDeposit.enabled");

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow">
      {/* Security Deposit Checkbox */}
      <Controller
        name="securityDeposit.enabled"
        control={control}
        render={({ field }) => (
          <div className="flex items-center mt-3 space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
              id="securityDeposit-enabled"
              disabled={isDisabled}
            />
            <label
              htmlFor="securityDeposit-enabled"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Security Deposit
            </label>
          </div>
        )}
      />

      {/* Security Deposit Amount - Conditionally displayed based on checkbox */}
      {isEnabled && (
        <Controller
          name="securityDeposit.amountInAED"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <div className="flex items-center mt-2">
                <label
                  htmlFor="securityDeposit-amountInAED"
                  className="block mr-1 mb-5 w-28 text-[0.8rem] font-medium"
                >
                  Deposit in AED
                </label>
                <div className="w-full h-fit">
                  <Input
                    id="securityDeposit-amountInAED"
                    {...field}
                    placeholder="Enter deposit amount in AED"
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    readOnly={isDisabled}
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
                      clearErrors("securityDeposit"); // Clear the error
                    }}
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}

                  <FormDescription>
                    Refundable deposit required to rent this model.
                  </FormDescription>
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default SecurityDepositField;
