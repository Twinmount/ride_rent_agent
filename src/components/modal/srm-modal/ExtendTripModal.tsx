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

// Validation schema
const ExtendTripSchema = z.object({
  vehicleBrand: z.string().min(1, "Brand Name is required"),
  vehicleRegistrationNumber: z
    .string()
    .min(1, "Registration Number is required"),
  customerName: z.string().min(1, "Customer Name is required"),
  bookingStartDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: "Booking Start Date is required",
    }),
  bookingEndDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: "Booking End Date is required",
    }),
  advanceAmount: z.string().regex(/^\d+$/, "Advance Amount must be numeric"),
  remainingAmount: z
    .string()
    .regex(/^\d+$/, "Remaining Amount must be numeric"),
});

type ExtendTripFormType = z.infer<typeof ExtendTripSchema>;

interface ExtendTripModalProps {
  tripId: string;
  onClose: () => void;
}

export default function ExtendTripModal({
  tripId,
  onClose,
}: ExtendTripModalProps) {
  const form = useForm<ExtendTripFormType>({
    resolver: zodResolver(ExtendTripSchema),
    defaultValues: {
      vehicleBrand: "",
      vehicleRegistrationNumber: "sample data",
      customerName: "",
      bookingStartDate: "" || undefined,
      bookingEndDate: "" || undefined,
      advanceAmount: "",
      remainingAmount: "",
    },
  });

  const onSubmit = (values: ExtendTripFormType) => {
    console.log("Form Submitted", values);
    onClose(); // Close the modal after form submission
  };

  const minAllowedDate = new Date("2023-12-01"); // Replace with your desired start date
  const maxAllowedDate = new Date("2023-12-31");

  return (
    <Dialog open={!!tripId} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Extend Trip</DialogTitle>
          <DialogDescription>
            Update the trip details below to extend the booking period.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 p-4 pb-10 mx-auto w-full max-w-xl"
            >
              {/* vehicle registration number */}
              <FormField
                control={form.control}
                name="vehicleRegistrationNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Registration Number{" "}
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
                        Provided Registration Number
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* vehicle brand */}
              <FormField
                control={form.control}
                name="vehicleBrand"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Vehicle Brand
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
                        Vehicle Brand
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Booking Period */}
              <div className="flex flex-col mb-2 w-full">
                <label
                  htmlFor="bookingStartDate"
                  className="flex justify-between mt-4 ml-2 w-52 text-base font-medium max-sm:mb-2 min-w-48 lg:min-w-52 max-sm:w-fit lg:text-lg"
                >
                  Booking Period
                </label>
                <div className="flex flex-col gap-5">
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
                              htmlFor="bookingEndDate"
                              className="flex justify-between items-center mr-1 w-14 whitespace-nowrap text-grey-600"
                            >
                              Start <span>:</span>
                            </label>
                            <DatePicker
                              selected={field.value}
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
                              showTimeSelect
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy h:mm aa"
                              wrapperClassName="datePicker text-base w-full"
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
                              className="flex justify-between items-center mr-1 w-14 whitespace-nowrap text-grey-600"
                            >
                              End <span>:</span>
                            </label>
                            <DatePicker
                              selected={field.value}
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
                              showTimeSelect
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy h:mm aa"
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
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Advance Paid
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
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Balance to be Paid{" "}
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-4 text-white bg-green-500 hover:bg-green-600"
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
