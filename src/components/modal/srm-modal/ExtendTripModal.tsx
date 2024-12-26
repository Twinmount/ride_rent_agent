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
import { useQuery } from "@tanstack/react-query";
import { fetchExtendTripDetails } from "@/api/srm/trips";
import { ExtendTripSchema } from "@/lib/validator";
import { useEffect, useState } from "react";
import { calculateRentalAmount } from "@/helpers";

// Validation schema

type ExtendTripFormType = z.infer<typeof ExtendTripSchema>;

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

  const [remainingAmount, setRemainingAmount] = useState<number>(0);

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

  const onSubmit = (values: ExtendTripFormType) => {
    console.log("Form Submitted", values);
    onClose();
  };

  const handleNewEndDateChange = (date: Date | null) => {
    if (data?.result) {
      const { bookingEndDate, remainingAmount: initialRemainingAmount } =
        data.result;
      const { rentalDetails } = data.result.vehicle;

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

        // Update the remaining amount
        setRemainingAmount(totalRemainingAmount);
        form.setValue("remainingAmount", totalRemainingAmount.toString());
      }
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

  const { bookingStartDate, bookingEndDate, nextPossibleMaxBookingEndDate } =
    data.result;

  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader className="">
          <DialogTitle>Extend Trip</DialogTitle>
          <DialogDescription>
            Update the trip details below to extend the booking period.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[75vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 p-4 pb-10 mx-auto w-full max-w-xl"
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
                          className="flex justify-between items-center mr-1 w-14 whitespace-nowrap text-grey-600"
                        >
                          Start <span>:</span>
                        </label>
                        <DatePicker
                          selected={new Date(bookingStartDate)}
                          showTimeSelect
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy h:mm aa"
                          wrapperClassName="datePicker text-base w-full"
                          placeholderText="DD/MM/YYYY"
                          id="bookingStartDate"
                          minDate={new Date(bookingStartDate)}
                          maxDate={new Date(bookingStartDate)}
                          disabled={true}
                        />
                      </div>
                    </FormControl>
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
                          className="input-field !cursor-default !text-gray-800"
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
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Balance to be Paid{" "}
                    </FormLabel>
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Balance Amount (AED)"
                          className="input-field !cursor-default !text-gray-800"
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
                        Enter the remaining amount to be paid in AED.
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
              >
                Submit
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
