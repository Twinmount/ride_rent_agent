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
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TrafficFineField from "../TrafficFineField";
import SalikField from "../SalikField";
import AdditionalChargesField from "../SRMAdditionalChargesField";
import { CustomerStatus, TripEndFormType } from "@/types/srm-types";
import { TripEndFormSchema } from "@/lib/validator";
import { TripEndFormDefaultValues } from "@/constants";
import { endTrip } from "@/api/srm";
import { calculateFinalAmount, calculateRentalAmount } from "@/helpers";

type TripEndFormProps = {
  type: "Add" | "Update";
  formData?: TripEndFormType | null;
  advanceCollected?: number;
  companyId: string;
};

// mock data
const mockRentalDetails = {
  day: { enabled: true, rentInAED: "234", mileageLimit: "2342" },
  week: { enabled: true, rentInAED: "554", mileageLimit: "554" },
  month: { enabled: true, rentInAED: "123", mileageLimit: "553" },
  hour: {
    enabled: true,
    rentInAED: "12",
    mileageLimit: "1234",
    minBookingHours: "2",
  },
};

const mockBookingStartDate = "2023-12-18T18:00:00.000Z";
const mockBookingEndDate = "2024-12-26T17:30:00.000Z";

export default function TripEndForm({
  type,
  formData,
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

  const discount = form.watch("discounts") || "";

  // totalAmountCollected calculation
  useEffect(() => {
    const baseRentalAmount = calculateRentalAmount(
      mockRentalDetails,
      mockBookingStartDate,
      mockBookingEndDate
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
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Brand Name <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="eg: 'Mercedes-Benz'"
                        {...field}
                        className={`input-field`}
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      Enter the brand name, e.g., "Mercedes-Benz".
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Customer Name <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="eg: 'John Doe'"
                        {...field}
                        className={`input-field`}
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      Enter the customer's name.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            {/* Customer Remark Dropdown */}
            <FormField
              control={form.control}
              name="customerStatus"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Customer Remark{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value as CustomerStatus)
                        }
                        value={field.value}
                      >
                        <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {Object.entries(CustomerStatus).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
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
