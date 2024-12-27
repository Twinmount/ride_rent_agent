import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { extendTrip, fetchExtendTripDetails } from "@/api/srm/trips";
import { ExtendTripSchema } from "@/lib/validator";
import { useEffect } from "react";
import { calculateRentalAmount } from "@/helpers";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/general/Spinner";

// Validation schema

export type ExtendTripFormType = z.infer<typeof ExtendTripSchema>;

interface ExtendTripModalProps {
  bookingId: string;
  onClose: () => void;
}

export default function ExtendTripModal({
  bookingId,
  onClose,
}: ExtendTripModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["extend-trip", bookingId],
    queryFn: () => fetchExtendTripDetails(bookingId),
    enabled: !!bookingId,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ExtendTripFormType>({
    resolver: zodResolver(ExtendTripSchema),
    defaultValues: {
      newEndDate: undefined,
      advanceAmount: data?.result.advanceCollected.toString() || "",
      remainingAmount: "",
    },
  });

  useEffect(() => {
    if (data) {
      const { advanceCollected, bookingEndDate, remainingAmount } = data.result;

      // Prefill advance amount
      form.setValue("advanceAmount", advanceCollected.toString());
      form.setValue("remainingAmount", remainingAmount.toString());
      form.setValue("newEndDate", new Date(bookingEndDate));
    }
  }, [data]);

  const onSubmit = async (values: ExtendTripFormType) => {
    try {
      let data;

      data = await extendTrip(bookingId, values);
      if (data) {
        navigate("/srm/ongoing-trips");
        queryClient.invalidateQueries({ queryKey: ["activeTrips"] });
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Trip End Failed`,
        description: "Something went wrong",
      });
      console.error("Error in onSubmit:", error);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen fixed inset-0 w-full flex-center bg-black/40">
        <div className="h-80 w-80 flex-center bg-white rounded-lg text-lg">
          Loading...
        </div>
      </div>
    );

  if (!data) {
    throw new Error("Failed to fetch extend trip data");
  }

  const {
    bookingStartDate,
    bookingEndDate,
    remainingAmount: initialRemainingAmount,
    nextPossibleMaxBookingEndDate,
  } = data.result;

  const { rentalDetails } = data.result.vehicle;

  const handleNewEndDateChange = (date: Date | null) => {
    if (date) {
      // Calculate the rental amount for the extended period
      const extendedPeriodAmount = calculateRentalAmount(
        rentalDetails,
        bookingEndDate,
        date.toISOString()
      );

      // Add the new extended rental amount to the initial remaining amount
      const totalRemainingAmount =
        initialRemainingAmount + extendedPeriodAmount;

      form.setValue("remainingAmount", totalRemainingAmount.toFixed(2)); // Format as string for form
    }
  };

  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-center text-lg">Extend Trip</DialogTitle>
          <DialogDescription className="text-center">
            Choose a new end date for the trip
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[75vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 p-4 pb-10 mx-auto w-full max-w-xl bg-white"
            >
              {/* Booking Period */}
              <div className="flex flex-col mb-2 w-full">
                <label
                  htmlFor="bookingStartDate"
                  className="flex justify-between mt-4 ml-2 w-52 text-base font-medium max-sm:mb-2 min-w-48 lg:min-w-52 max-sm:w-fit lg:text-lg"
                >
                  Booking Period
                </label>
                <div className="flex flex-col gap-5">
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
                          htmlFor="bookingEndDate"
                          className="flex justify-between items-center mr-1 w-14 text-gray-600 whitespace-nowrap text-grey-600"
                        >
                          Start <span>:</span>
                        </label>
                        <DatePicker
                          selected={new Date(bookingStartDate)}
                          showTimeSelect
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy h:mm aa"
                          wrapperClassName="datePicker text-base text-gray-500 w-full"
                          placeholderText="DD/MM/YYYY"
                          id="bookingStartDate"
                          minDate={new Date(bookingStartDate)}
                          maxDate={new Date(bookingStartDate)}
                          disabled={true}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="ml-24">
                      Booking start date. Cannot modify.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="newEndDate"
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
                              htmlFor="newEndDate"
                              className="flex justify-between items-center mr-1 w-14 whitespace-nowrap text-grey-600"
                            >
                              End <span>:</span>
                            </label>
                            <DatePicker
                              selected={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                                handleNewEndDateChange(date);
                              }}
                              minDate={new Date(bookingEndDate)}
                              {...(nextPossibleMaxBookingEndDate
                                ? {
                                    maxDate: new Date(
                                      nextPossibleMaxBookingEndDate
                                    ),
                                  } // Conditionally add maxDate
                                : {})}
                              showTimeSelect
                              dateFormat="dd/MM/yyyy h:mm aa"
                              placeholderText="Select New End Date"
                              wrapperClassName="datePicker text-base w-full"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="ml-24">
                          Choose a new end date, if required.
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
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Advance Paid
                    </FormLabel>
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Advance Paid (AED)"
                          className="input-field !cursor-default !text-gray-600"
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
                          readOnly={true}
                        />
                      </FormControl>
                      <FormDescription className="ml-2">
                        Advance received for this model in AED.
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
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Balance to be Paid{" "}
                    </FormLabel>
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Balance Amount (AED)"
                          className="input-field !cursor-default !text-gray-500 !font-semibold"
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
                          readOnly
                        />
                      </FormControl>
                      <FormDescription className="ml-2">
                        Balance amount wil be automatically calculated based on
                        the <strong>rental details</strong> of the vehicle,and
                        the new <strong>end date</strong> provided.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-4 text-white bg-slate-800 hover:bg-slate-700"
                disabled={form.formState.isSubmitting}
              >
                Extend Trip {form.formState.isSubmitting && <Spinner />}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
