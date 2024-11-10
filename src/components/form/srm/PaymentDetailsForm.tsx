import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SRMPaymentDetailsFormDefaultValues } from "@/constants";
import { SRMPaymentDetailsFormSchema } from "@/lib/validator";
import { SRMPaymentDetailsFormType } from "@/types/types";
import "react-international-phone/style.css";

import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useParams } from "react-router-dom";
import {
  addPaymentDetailsForm,
  updatePaymentDetailsForm,
} from "@/api/srm/srmFormApi";
import CurrencyDropdown from "../dropdowns/CurrencyDropdown";

type SRMPaymentDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMPaymentDetailsFormType | null;
  onNextTab?: () => void;
  initialCountryCode?: string;
  isAddOrIncomplete: boolean;
};

export default function SRMPaymentDetailsForm({
  type,
  onNextTab,
  formData,
}: SRMPaymentDetailsFormProps) {
  const {} = useParams<{}>();

  // Call the useLoadingMessages hook to manage loading messages

  const initialValues =
    formData && type === "Update"
      ? formData
      : SRMPaymentDetailsFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMPaymentDetailsFormSchema>>({
    resolver: zodResolver(SRMPaymentDetailsFormSchema),
    defaultValues: initialValues as SRMPaymentDetailsFormType,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SRMPaymentDetailsFormSchema>) {
    // Append other form data
    try {
      let data;
      if (type === "Add") {
        data = await addPaymentDetailsForm(values);
      } else if (type === "Update") {
        data = await updatePaymentDetailsForm(values);
      }

      if (data) {
        toast({
          title: `Vehicle ${type.toLowerCase()}ed successfully`,
          className: "bg-yellow text-white",
        });

        if (type === "Add") {
          if (onNextTab) onNextTab();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${type} Vehicle failed`,
        description: "Something went wrong",
      });

      console.error(error);
    }
  }

  useEffect(() => {
    // Check for validation errors and scroll to the top if errors are present
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        variant: "destructive",
        title: `Validation Error`,
        description: "Please make sure values are provided",
      });
      window.scrollTo({ top: 65, behavior: "smooth" }); // Scroll to the top of the page
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5  mx-auto bg-white  rounded-3xl p-2 md:p-4 py-8 !pb-8  "
      >
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Select Currency <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CurrencyDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);

                        form.setValue("currency", "");
                      }}
                      value={initialValues.currency}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select vehicle category
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="advanceAmount"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Advance Paid <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
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
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the model name, e.g., "Mercedes-Benz C-Class 2024
                    Latest Model.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remainingAmount"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Amount to be Paid{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
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
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the model name, e.g., "Mercedes-Benz C-Class 2024
                    Latest Model.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === "Add" ? "Continue" : "Update Vehicle Details"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
