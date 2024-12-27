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
import { RentalDetails, SRMPaymentDetailsFormType } from "@/types/srm-types";
import "react-international-phone/style.css";

import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import {
  addPaymentDetailsForm,
  updateBookingDataForPayment,
} from "@/api/srm/srmFormApi";
import CurrencyDropdown from "../dropdowns/CurrencyDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SecurityDepositField from "../SecurityDepositField";
import { validateSecurityDeposit } from "@/helpers/form";
import { CalendarDays } from "lucide-react";
import { calculateRentalAmount } from "@/helpers";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { useState } from "react";

type SRMPaymentDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMPaymentDetailsFormType | null;
};

// Mock rental details (replace with actual props later if needed)

export default function SRMPaymentDetailsForm({
  type,
  formData,
}: SRMPaymentDetailsFormProps) {
  const {} = useParams<{}>();
  const bookingId = sessionStorage.getItem("bookingId");
  const [rentalDetails, setRentalDetails] = useState<RentalDetails | null>(
    null
  );

  const navigate = useNavigate();

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
    if (!bookingId) {
      toast({
        variant: "destructive",
        title: "Booking ID Missing",
        description: "Please complete the Customer Details Form first.",
      });
      return;
    }

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
        const paymentId = data?.result?.id;

        const bookingStartDate = values.bookingStartDate;
        const bookingEndDate = values.bookingEndDate;

        await updateBookingDataForPayment({
          paymentId,
          bookingId,
          bookingStartDate: bookingStartDate.toISOString(),
          bookingEndDate: bookingEndDate.toISOString(),
        });

        // Safely clear the sessionStorage after successful form submission
        sessionStorage.removeItem("bookingId");
      }

      if (data) {
        toast({
          title: `Trip ${type.toLowerCase()} successful`,
          className: "bg-yellow text-white",
        });

        // Safely clear the sessionStorage after successful form submission
        sessionStorage.removeItem("bookingId");
        sessionStorage.removeItem("rentalDetails");
        navigate("/srm/ongoing-trips");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Payment ${type} failed`,
        description: "Something went wrong",
      });

      console.error(error);
    }
  }

  // custom hook to validate form
  useFormValidationToast(form);

  // Watch fields to trigger calculations
  const bookingStartDate = form.watch("bookingStartDate");
  const bookingEndDate = form.watch("bookingEndDate");
  const advanceAmount = form.watch("advanceAmount");

  useEffect(() => {
    const storedRentalDetails = sessionStorage.getItem("rentalDetails");
    if (storedRentalDetails) {
      setRentalDetails(JSON.parse(storedRentalDetails));
    }
  }, []);

  useEffect(() => {
    // Perform calculation only if both bookingStartDate and bookingEndDate are provided
    if (bookingStartDate && bookingEndDate) {
      const baseRentalAmount = calculateRentalAmount(
        rentalDetails as RentalDetails,
        bookingStartDate.toISOString(),
        bookingEndDate.toISOString()
      );

      // Calculate remaining amount
      const remainingAmount =
        baseRentalAmount - parseFloat(advanceAmount || "0");

      // Update remainingAmount field in the form (read-only)
      form.setValue("remainingAmount", remainingAmount.toFixed(2), {
        shouldValidate: true,
      });
    }
  }, [bookingStartDate, bookingEndDate, advanceAmount, form.setValue]);

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
              className="flex justify-between mt-4 ml-2 w-52 text-base font-medium max-sm:mb-2 min-w-48 lg:min-w-52 max-sm:w-fit lg:text-lg h-fit "
            >
              Booking Period<span className="mr-5 max-sm:hidden">:</span>
            </label>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="bookingStartDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 gap-x-1 py-2">
                        <CalendarDays className="text-orange" strokeWidth={3} />
                        <label
                          htmlFor="bookingStartDate"
                          className="flex justify-between items-center mr-1 w-14 whitespace-nowrap text-grey-600"
                        >
                          Start <span>:</span>
                        </label>
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          showTimeSelect
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy h:mm aa"
                          wrapperClassName="datePicker text-base w-full"
                          placeholderText="DD/MM/YYYY"
                          id="bookingStartDate"
                          minDate={new Date()}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="ml-2">
                      Enter the booking start date for this model.
                    </FormDescription>
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
                        <CalendarDays
                          className={`text-orange ${
                            !form.watch("bookingStartDate") ? "opacity-50" : ""
                          }`}
                          strokeWidth={3}
                        />
                        <label
                          htmlFor="bookingEndDate"
                          className={`flex justify-between items-center mr-1 w-14 whitespace-nowrap   text-grey-600 ${
                            !form.watch("bookingStartDate") ? "opacity-50" : ""
                          }`}
                        >
                          End <span>:</span>
                        </label>
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          showTimeSelect
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy h:mm aa"
                          wrapperClassName="datePicker text-base "
                          placeholderText="DD/MM/YYYY"
                          id="bookingEndDate"
                          minDate={form.watch("bookingStartDate")}
                          disabled={!form.watch("bookingStartDate")}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="ml-2">
                      Enter the booking end date for this model.
                    </FormDescription>
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
                  Advance Paid &#40;AED&#41;
                  <span className="mr-5 max-sm:hidden">:</span>
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
                  Balance to be Paid &#40;AED&#41;{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Balance Amount (AED)"
                      className="input-field !font-semibold !cursor-default"
                      type="text"
                      inputMode="numeric"
                      readOnly
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
                    Balance amount to be paid for this model will be
                    automatically calculated based on{" "}
                    <strong>rental details</strong> of the vehicle,{" "}
                    <strong>booking period</strong>, and{" "}
                    <strong>advance paid</strong>.
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
