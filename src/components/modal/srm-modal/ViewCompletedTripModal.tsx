import { useForm } from "react-hook-form";
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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface CompletedTripDetails {
  tripId: string;
  brandName: string;
  customerName: string;
  nationality: string;
  passportNumber: string;
  licenseNumber: string;
  amountPaid: number;
  amountPending: number;
  customerStatus: "Banned" | "Active";
}

interface ViewCompletedTripModalProps {
  tripDetails: CompletedTripDetails;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedDetails: CompletedTripDetails) => Promise<void>;
}

export default function ViewCompletedTripModal({
  tripDetails,
  isOpen,
  onClose,
  onSubmit,
}: ViewCompletedTripModalProps) {
  const schema = z.object({
    amountPaid: z.number().min(0),
    customerStatus: z.enum(["Banned", "Active"]),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amountPaid: tripDetails.amountPaid,
      customerStatus: tripDetails.customerStatus,
    },
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    await onSubmit({ ...tripDetails, ...data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Completed Trip</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Brand Name:</p>
                <p>{tripDetails.brandName}</p>
              </div>
              <div>
                <p className="font-semibold">Customer Name:</p>
                <p>{tripDetails.customerName}</p>
              </div>
              <div>
                <p className="font-semibold">Nationality:</p>
                <p>{tripDetails.nationality}</p>
              </div>
              <div>
                <p className="font-semibold">Passport Number:</p>
                <p>{tripDetails.passportNumber}</p>
              </div>
              <div>
                <p className="font-semibold">License Number:</p>
                <p>{tripDetails.licenseNumber}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Enter amount paid"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Status</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full">
                      <option value="Active">Active</option>
                      <option value="Banned">Banned</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
