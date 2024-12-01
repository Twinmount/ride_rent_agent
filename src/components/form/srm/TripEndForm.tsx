import { useState, useEffect } from "react";
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
import { useParams } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerStatus } from "@/types/types";
import TrafficFineField from "../TrafficFineField";
import SalikField from "../SalikField";
import AdditionalChargesField from "../SRMAdditionalChargesField";

type TripEndFormProps = {
  type: "Add" | "Update";
  formData?: null;
};

export default function TripEndForm({ type, formData }: TripEndFormProps) {
  const {} = useParams<{}>();

  // Call the useLoadingMessages hook to manage loading messages
  const formSchema = z.object({
    fineAmount: z.number().optional(),
    totalAmountCollected: z
      .number()
      .min(0, "Total amount must be non-negative"),
    customerStatus: z.nativeEnum(CustomerStatus),
  });

  const initialValues =
    formData && type === "Update"
      ? formData
      : {
          fineAmount: undefined,
          totalAmountCollected: 0,
          customerStatus: CustomerStatus.SUCCESSFUL,
        };

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {}

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
    <section className="container py-5 mx-auto min-h-screen rounded-lg md:py-7">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5  mx-auto bg-white shadow-md rounded-3xl p-2 md:p-4 py-8 !pb-8  "
        >
          <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
            {/* Brand and Customer Name */}
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Brand Name <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="eg: 'Model'"
                        {...field}
                        className={`input-field`}
                        readOnly
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
            {/* customer */}
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Customer Name <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="eg: 'Model'"
                        {...field}
                        className={`input-field`}
                        readOnly
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

            {/* Traffic Fine */}
            <FormField
              control={form.control}
              name="trafficFine"
              render={() => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Traffic Fine? <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <TrafficFineField />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Salik */}
            <FormField
              control={form.control}
              name="salik"
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
                      <AdditionalChargesField />
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

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Discounts / Adjustments{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="eg: ABC12345"
                        {...field}
                        className={`input-field`}
                        type="text"
                        onKeyDown={(e) => {
                          if (
                            !/[a-zA-Z0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab", // To allow tabbing between fields
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      &#40;optional&#41; provide value if any.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Total Amount to be Collected{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="eg: ABC12345"
                        {...field}
                        className={`input-field`}
                        type="text"
                        onKeyDown={(e) => {
                          if (
                            !/[a-zA-Z0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab", // To allow tabbing between fields
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      &#40;optional&#41; provide value if any.
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
                    Customer Remark
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

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              End Trip
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
