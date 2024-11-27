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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SecurityDepositField from "../SecurityDepositField";
import { validateSecurityDeposit } from "@/helpers/form";

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
    const securityDepositError = validateSecurityDeposit(
      values.securityDeposit
    );

    if (securityDepositError) {
      form.setError("securityDeposit", {
        type: "manual",
        message: securityDepositError,
      });
      form.setFocus("securityDeposit");
      return;
    }

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

  const minAllowedDate = new Date("2023-12-01"); // Replace with your desired start date
  const maxAllowedDate = new Date("2023-12-31");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5  mx-auto bg-white  rounded-3xl p-2 md:p-4 py-8 !pb-8  "
      >
        <p className="-mt-4 text-sm italic text-center text-gray-600 max-sm:-mt-8">
          Add Payment details here.
        </p>
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          {/* Booking Period */}
          <div className="flex mb-2 w-full max-sm:flex-col">
            <label
              htmlFor="bookingStartDate"
              className="flex justify-between mt-4 ml-2 w-52 text-base font-medium max-sm:mb-2 min-w-48 lg:min-w-52 max-sm:w-fit lg:text-lg"
            >
              Booking Period<span className="mr-5 max-sm:hidden">:</span>
            </label>
            <div className="flex flex-col gap-5 lg:flex-row">
              <FormField
                control={form.control}
                name="bookingStartDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 gap-x-1 py-2">
                        <img
                          src="/assets/icons/calendar.svg"
                          alt="calendar"
                          width={24}
                          height={24}
                          className="filter-yellow-orange"
                        />
                        <label
                          htmlFor="bookingStartDate"
                          className="mr-1 whitespace-nowrap text-grey-600"
                        >
                          Start On:
                        </label>
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          wrapperClassName="datePicker text-base  "
                          placeholderText="DD/MM/YYYY"
                          id="bookingStartDate"
                          minDate={minAllowedDate}
                          maxDate={maxAllowedDate}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bookingEndDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2 gap-x-1">
                        <img
                          src="/assets/icons/calendar.svg"
                          alt="calendar"
                          width={24}
                          height={24}
                          className="filter-yellow-orange"
                        />
                        <label
                          htmlFor="bookingEndDate"
                          className="mr-1 whitespace-nowrap text-grey-600"
                        >
                          End Date:
                        </label>
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          wrapperClassName="datePicker text-base"
                          placeholderText="DD/MM/YYYY"
                          id="bookingEndDate"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
                      placeholder="Advance Paid (AED)"
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
                    Enter the advance received for this model in AED.
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
                  Balance to be Paid{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Balance Amount (AED)"
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
                    Enter the remaining amount to be paid in AED.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* security deposit */}
          <FormField
            control={form.control}
            name="securityDeposit"
            render={() => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Security Deposit <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <SecurityDepositField />
                  </FormControl>
                  <FormDescription className="ml-1">
                    Specify if a security deposit is required and provide the
                    amount if applicable.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

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
                    This currency unit is only used while generating invoice
                  </FormDescription>
                  <FormMessage />
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
          {type === "Add" ? "Submit" : "Update Payment Details"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
