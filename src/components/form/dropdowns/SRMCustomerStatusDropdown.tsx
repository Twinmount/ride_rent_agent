import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { CustomerStatus } from "@/types/srm-types";
import { cn } from "@/lib/utils"; // Utility function for conditional classes

type SRMCustomerStatusDropdownProps = {
  control: any;
  name: string;
};

export default function SRMCustomerStatusDropdown({
  control,
  name,
}: SRMCustomerStatusDropdownProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex mb-2 w-full max-sm:flex-col">
          <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
            Customer Remark <span className="mr-5 max-sm:hidden">:</span>
          </FormLabel>
          <div className="flex-col items-start w-full">
            <FormControl>
              <Select
                onValueChange={(value) =>
                  field.onChange(value as CustomerStatus)
                }
                value={field.value}
              >
                <SelectTrigger
                  className={`ring-0 outline-none select-field focus:ring-0 input-fields ${
                    field.value !== CustomerStatus.SUCCESSFUL &&
                    "!text-red-600 "
                  }`}
                >
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {Object.entries(CustomerStatus).map(([key, value]) => (
                    <SelectItem
                      key={key}
                      value={value}
                      className={cn(
                        value !== CustomerStatus.SUCCESSFUL &&
                          "text-red-600 hover:!text-red-600 "
                      )}
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the status of the customer based on the trip. Any status
              other than "Successfully Completed Trip" will be used later to
              flag the customer for future trips.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
