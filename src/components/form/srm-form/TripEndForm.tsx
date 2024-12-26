import { useEffect, useState } from "react";
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
    console.log("Form Submitted", values);
    return;
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
        navigate("srm/completed-trips");
      }
    } catch (error) {}
  }

  // custom hook to validate form
  useFormValidationToast(form);

  const discount = form.watch("discounts") || "";

  // totalAmountCollected calculation
  useEffect(() => {
    const baseRentalAmount = calculateRentalAmount(
      bookingData?.rentalDetails as RentalDetails,
      bookingData?.bookingStartDate as string,
      bookingData?.bookingEndDate as string
    );

    // Use the already calculated additionalChargesTotal
    const finalAmount = calculateFinalAmount(
      baseRentalAmount,
      additionalChargesTotal,
      discount
    );

    setTotalAmountCollected(finalAmount);

    // Update the form value (read-only field)
    form.setValue("totalAmountCollected", finalAmount.toFixed(2));
  }, [additionalChargesTotal, discount]);

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
                      <TrafficFineField />
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
                      <SalikField />
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
                          const value = e.target.value.replace(/[^\d.]/g, ""); // Allow only numeric input
                          field.onChange(value);
                        }}
                        className="input-field"
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      &#40;optional&#41; provide discount in AED if any. Default
                      to 0.
                    </FormDescription>
                    <FormMessage className="ml-2" />
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl text-red-500 font-semibold transition-colors"
            >
              End Trip
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
