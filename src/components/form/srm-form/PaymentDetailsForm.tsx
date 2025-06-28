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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SRMPaymentDetailsFormDefaultValues } from "@/constants";
import { SRMPaymentDetailsFormSchema } from "@/lib/validator";
import { RentalDetails, SRMPaymentDetailsFormType } from "@/types/srm-types";
import "react-international-phone/style.css";

import { toast } from "@/components/ui/use-toast";
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
import { FormContainer } from "../form-ui/FormContainer";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import {
  FormGenericButton,
  FormSubmitButton,
} from "../form-ui/FormSubmitButton";
import RentalDetailsPreview from "../SRMRentalDetailsPreview";

type SRMPaymentDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMPaymentDetailsFormType | null;
  refetchLevels?: () => void;
  isAddOrIncomplete?: boolean;
  onNextTab?: () => void;
};

// Mock rental details (replace with actual props later if needed)

export default function SRMPaymentDetailsForm({
  type,
  formData,
  refetchLevels,
  isAddOrIncomplete,
  onNextTab,
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
      if (isAddOrIncomplete) {
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
        refetchLevels?.();
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
    if (bookingStartDate && bookingEndDate && rentalDetails) {
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

  // form fields are disabled if the type is "Update"
  const isFieldsDisabled = type === "Update";

  return (
    <Form {...form}>
      <FormContainer
        onSubmit={form.handleSubmit(onSubmit)}
        description={
          type === "Add" ? (
            <p className="text-sm italic text-center text-gray-600">
              Add trip payment details here. It will be used to generate
              invoice.
            </p>
          ) : null
        }
      >
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
                        disabled={isFieldsDisabled}
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
                        disabled={
                          !form.watch("bookingStartDate") || isFieldsDisabled
                        }
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

        {/* rental details preview */}
        <FormFieldLayout
          label="Rental Details (Preview)"
          description="This preview summarizes the rental prices and mileage limits set above."
        >
          <RentalDetailsPreview rentalDetails={rentalDetails} />
        </FormFieldLayout>

        <FormField
          control={form.control}
          name="advanceAmount"
          render={({ field }) => (
            <FormFieldLayout
              label="Advance Paid &#40;AED&#41;"
              description=" Enter the advance received for this model in AED."
            >
              <Input
                {...field}
                placeholder="Advance Paid (AED)"
                className="input-field"
                type="text"
                inputMode="numeric"
                readOnly={isFieldsDisabled}
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
            </FormFieldLayout>
          )}
        />

        <FormField
          control={form.control}
          name="remainingAmount"
          render={({ field }) => (
            <FormFieldLayout
              label="Balance to Paid &#40;AED&#41;"
              description={
                <>
                  Balance amount to be paid for this model will be automatically
                  calculated based on <strong>rental details</strong> of the
                  vehicle, <strong>booking period</strong>, and{" "}
                  <strong>advance paid</strong>.
                </>
              }
            >
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
            </FormFieldLayout>
          )}
        />

        {/* security deposit */}
        <FormField
          control={form.control}
          name="securityDeposit"
          render={() => (
            <FormFieldLayout
              label="Security Deposit"
              description="Specify if a security deposit is required and provide the
                  amount if applicable."
            >
              <SecurityDepositField isDisabled={isFieldsDisabled} />
            </FormFieldLayout>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormFieldLayout
              label="Select Currency"
              description="his currency unit is only used while generating invoice"
            >
              <CurrencyDropdown
                onChangeHandler={(value) => {
                  field.onChange(value);
                }}
                value={initialValues.currency}
                isDisabled={isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />

        {type === "Add" && (
          <FormGenericButton type="button">
            Download Quote/Invoice
          </FormGenericButton>
        )}

        {/* submit  */}
        {type === "Add" && (
          <FormSubmitButton
            text={type === "Add" ? "Submit" : "Update Payment Details"}
            isLoading={form.formState.isSubmitting}
          />
        )}
      </FormContainer>
    </Form>
  );
}
