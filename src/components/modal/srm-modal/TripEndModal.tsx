import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerStatus } from "@/types/types";
import { SelectContent } from "@radix-ui/react-select";

interface TripEndModalProps {
  brandName: string;
  customerName: string;
  advancePaid: number;
  amountRemaining: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    fineAmount?: number;
    totalAmountCollected: number;
    customerStatus: CustomerStatus;
  }) => Promise<void>;
}

export default function TripEndModal({
  brandName,
  customerName,
  advancePaid,
  amountRemaining,
  isOpen,
  onClose,
  onSubmit,
}: TripEndModalProps) {
  const [trafficFineCollected, setTrafficFineCollected] = useState(false);

  const formSchema = z.object({
    fineAmount: z.number().optional(),
    totalAmountCollected: z
      .number()
      .min(0, "Total amount must be non-negative"),
    customerStatus: z.nativeEnum(CustomerStatus),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fineAmount: undefined,
      totalAmountCollected: 0,
      customerStatus: CustomerStatus.SUCCESSFUL,
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Trip</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            {/* Brand and Customer Name */}
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Brand Name</p>
                <p>{brandName}</p>
              </div>
              <div>
                <p className="font-semibold">Customer Name</p>
                <p>{customerName}</p>
              </div>
            </div>

            {/* Customer Remark Dropdown */}
            <FormField
              control={form.control}
              name="customerStatus"
              render={({ field }) => (
                <FormItem className="flex items-center j">
                  <FormLabel>Customer Remark</FormLabel>
                  <div>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value as CustomerStatus)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
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

            {/* Advance Paid and Remaining */}
            <div>
              <p>
                <span className="font-semibold">Advance Paid:</span>{" "}
                {advancePaid} AED
              </p>
              <p>
                <span className="font-semibold">Amount Remaining:</span>{" "}
                {amountRemaining} AED
              </p>
            </div>

            {/* Traffic Fine Collected */}
            <div className="flex items-center space-x-4">
              <FormLabel>Traffic Fine Collected?</FormLabel>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fineNo"
                  name="trafficFine"
                  value="no"
                  checked={!trafficFineCollected}
                  onChange={() => setTrafficFineCollected(false)}
                />
                <label htmlFor="fineNo">No</label>
                <input
                  type="radio"
                  id="fineYes"
                  name="trafficFine"
                  value="yes"
                  checked={trafficFineCollected}
                  onChange={() => setTrafficFineCollected(true)}
                />
                <label htmlFor="fineYes">Yes</label>
              </div>
            </div>

            {/* Fine Amount */}
            {trafficFineCollected && (
              <FormField
                control={form.control}
                name="fineAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fine Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter fine amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Total Amount Collected */}
            <FormField
              control={form.control}
              name="totalAmountCollected"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount to be Collected</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              End Trip
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
