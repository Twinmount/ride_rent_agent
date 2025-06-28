import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

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
import { useNavigate, useParams } from "react-router-dom";

import TrafficFineField from "../TrafficFineField";
import SalikField from "../SalikField";
import AdditionalChargesField from "../SRMAdditionalChargesField";
import { RentalDetails, TripEndFormType } from "@/types/srm-types";
import { TripEndFormSchema } from "@/lib/validator";
import { TripEndFormDefaultValues } from "@/constants";
import { endTrip } from "@/api/srm";
import { calculateFinalAmount, calculateRentalAmount } from "@/helpers";
import SRMCustomerStatusDropdown from "../dropdowns/SRMCustomerStatusDropdown";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { validateFieldArray } from "@/helpers/srm-form";

export type BookingDataType = {
  advanceCollected: number;
  customerName: string;
  vehicleBrand: string;
  rentalDetails: RentalDetails;
  bookingStartDate: string;
  bookingEndDate: string;
};

type TripEndFormProps = {
  type: "Add" | "Update";
  formData?: TripEndFormType | null;
  bookingData?: BookingDataType;
  companyId: string;
};

export default function TripEndForm({
  type,
  formData,
  bookingData,
  companyId,
}: TripEndFormProps) {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [baseRentalAmount, setBaseRentalAmount] = useState<number>(0);
  const [totalAmountCollected, setTotalAmountCollected] = useState<number>(0);
  const [additionalChargesTotal, setAdditionalChargesTotal] =
    useState<number>(0);

  const navigate = useNavigate();

  // form initial values
  const initialValues =
    formData && type === "Update" ? formData : TripEndFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof TripEndFormSchema>>({
    resolver: zodResolver(TripEndFormSchema),
    defaultValues: initialValues,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof TripEndFormSchema>) {
    const trafficFineError = validateFieldArray(
      values.finesCollected,
      "Traffic Fine"
    );

    if (trafficFineError) {
      form.setError("finesCollected", {
        type: "manual",
        message: trafficFineError,
      });
      form.setFocus("finesCollected");
      return;
    }

    const salikError = validateFieldArray(values.salikCollected, "Salik");
    if (salikError) {
      form.setError("salikCollected", {
        type: "manual",
        message: salikError,
      });
      form.setFocus("salikCollected");
      return;
    }

    const additionalChargesError = validateFieldArray(
      values.additionalCharges,
      "Additional Charges"
    );
    if (additionalChargesError) {
      form.setError("additionalCharges", {
        type: "manual",
        message: additionalChargesError,
      });
      form.setFocus("additionalCharges");
      return;
    }

    try {
      let data;

      if (type === "Add") {
        data = await endTrip({
          values: values as TripEndFormType,
          bookingId: bookingId as string,
          companyId: companyId as string,
        });
      }

      if (data) {
        navigate("/srm/completed-trips");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Trip End Failed`,
        description: "Something went wrong",
      });
      console.error("Error in onSubmit:", error);
    }
  }

  // custom hook to validate form
  useFormValidationToast(form);

  const discount = form.watch("discounts") || "";

  // Calculate baseRentalAmount on component mount or when bookingData changes
  useEffect(() => {
    if (bookingData) {
      const calculatedBaseRentalAmount = calculateRentalAmount(
        bookingData.rentalDetails,
        bookingData.bookingStartDate,
        bookingData.bookingEndDate
      );
      setBaseRentalAmount(calculatedBaseRentalAmount); // Set the fixed base rental amount
    }
  }, [bookingData]);

  // Calculate totalAmountCollected dynamically
  useEffect(() => {
    const finalAmount = calculateFinalAmount(
      baseRentalAmount,
      additionalChargesTotal,
      discount
    );

    setTotalAmountCollected(finalAmount);

    // Synchronize with the form value (read-only field)
    form.setValue("totalAmountCollected", finalAmount.toFixed(2));
  }, [baseRentalAmount, additionalChargesTotal, discount]);

  return (
    <section className="container py-5 mx-auto min-h-screen rounded-lg md:py-7">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5  mx-auto bg-white shadow-md rounded-3xl p-2 md:p-4 py-8 !pb-8  "
        >
          <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
            {/* Brand Name */}
            <div className="flex mb-2 w-full max-sm:flex-col">
              <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                Brand <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="flex-col items-start w-full">
                <div>
                  <Input
                    placeholder="eg: 'Mercedes-Benz'"
                    value={bookingData?.vehicleBrand}
                    className={`input-field !cursor-default !text-gray-700`}
                    readOnly
                  />
                </div>
                <FormDescription className="ml-2">
                  Brand of the vehicle of this trip.
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </div>

            {/* Customer Name */}
            <div className="flex mb-2 w-full max-sm:flex-col">
              <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                Customer Name <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="flex-col items-start w-full">
                <div>
                  <Input
                    placeholder="eg: 'Mercedes-Benz'"
                    value={bookingData?.customerName}
                    className={`input-field !cursor-default !text-gray-700`}
                    readOnly
                  />
                </div>
                <FormDescription className="ml-2">
                  This is the customer's name of this trip.
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </div>

            {/* Base rental amount */}
            <div className="flex mb-2 w-full max-sm:flex-col">
              <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                Base Rental Amount &#40;AED&#41;{" "}
                <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="flex-col items-start w-full">
                <div>
                  <Input
                    value={baseRentalAmount}
                    className={`input-field !cursor-default !text-gray-700 !font-semibold`}
                    readOnly
                  />
                </div>
                <FormDescription className="ml-2">
                  Calculated based on the <b>rental details</b> of the vehicle
                  for the booking period from{" "}
                  <b>
                    {bookingData?.bookingStartDate
                      ? format(
                          new Date(bookingData.bookingStartDate),
                          "dd/MM/yyyy h:mm aa"
                        )
                      : "N/A"}
                  </b>{" "}
                  to{" "}
                  <b>
                    {bookingData?.bookingEndDate
                      ? format(
                          new Date(bookingData.bookingEndDate),
                          "dd/MM/yyyy h:mm aa"
                        )
                      : "N/A"}
                  </b>
                  .
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </div>

            {/* Customer Remark Dropdown */}
            <SRMCustomerStatusDropdown
              control={form.control}
              name="customerStatus"
            />

            {/* Traffic Fine */}
            <FormField
              control={form.control}
              name="finesCollected"
              render={() => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Traffic Fine? <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <TrafficFineField
                        control={form.control}
                        bookingStartDate={
                          bookingData?.bookingStartDate as string
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Specify if a security deposit is required and provide the
                      amount if applicable.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Salik */}
            <FormField
              control={form.control}
              name="salikCollected"
              render={() => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Salik Collected?{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <SalikField
                        control={form.control}
                        bookingStartDate={
                          bookingData?.bookingStartDate as string
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Specify if a security deposit is required and provide the
                      amount if applicable.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Additional Charges */}
            <FormField
              control={form.control}
              name="additionalCharges"
              render={() => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Any Other Charges?{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <AdditionalChargesField
                        setAdditionalChargesTotal={setAdditionalChargesTotal}
                        control={form.control}
                        bookingStartDate={
                          bookingData?.bookingStartDate as string
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Specify if a security deposit is required and provide the
                      amount if applicable.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Total Amount to be Collected */}
            <FormField
              control={form.control}
              name="totalAmountCollected"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Total Amount to be Collected &#40;AED&#41;{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        {...field}
                        value={totalAmountCollected.toFixed(2)}
                        readOnly
                        className="input-field !text-lg !font-semibold !cursor-default"
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      Total amount to be collected in AED. Will be automatically
                      calculated based on the <strong>booking period</strong> ,{" "}
                      <strong>rental details</strong> of the vehicle,{" "}
                      <strong>discount</strong> provided, and the{" "}
                      <strong>additional charges</strong>. &#40;
                      <strong>5% tax included</strong>&#41;
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            {/* Discounts / Adjustments */}
            <FormField
              control={form.control}
              name="discounts"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Discounts / Adjustments &#40;AED&#41;{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter discount amount"
                        type="text"
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^\d.]/g, ""); // Allow only numeric input
                          if (parseFloat(value) > baseRentalAmount) {
                            value = baseRentalAmount.toFixed(2); // Restrict to max
                          }
                          field.onChange(value); // Update the field value
                        }}
                        onBlur={() => {
                          // Ensure the value is within the valid range
                          const value = parseFloat(field.value || "0");
                          if (value > baseRentalAmount) {
                            field.onChange(baseRentalAmount.toFixed(2));
                          }
                        }}
                        className="input-field"
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      &#40;optional&#41; Provide discount in AED if any.{" "}
                      <b>Maximum allowed value is {baseRentalAmount}</b>, which
                      is the rental amount of the vehicle calculated for the
                      booking period.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl text-red-500 font-semibold transition-colors"
              disabled={form.formState.isSubmitting}
            >
              End Trip & Generate Receipt
              {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
