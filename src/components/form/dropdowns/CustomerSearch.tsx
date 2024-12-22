import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { debounce } from "@/helpers";
import { searchCustomer } from "@/api/srm";
import { CustomerListItem } from "@/types/srm-api-types";

type CustomerSearchProps = {
  value?: string;
  onChangeHandler: (value: string, customerData?: any) => void;
  placeholder?: string;
};

const CustomerSearch = ({
  value,
  onChangeHandler,
  placeholder = "Search customer name...",
}: CustomerSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(""); // Default to an empty string
  const [open, setOpen] = useState(false);

  // Fetch customer data based on the search term
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["searchCustomer", searchTerm],
    queryFn: () => searchCustomer(searchTerm),
    enabled: false, // Do not fetch initially
    staleTime: 0,
  });

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        refetch(); // Trigger the query only if a valid search term exists
      }
    }, 500),
    [refetch]
  );

  // Handle search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  // Handle selecting a customer from the dropdown
  const handleSelectCustomer = (customerName: string, customerData?: any) => {
    setSearchTerm(customerName); // Set the selected name in the field
    setOpen(false);
    onChangeHandler(customerName, customerData); // Pass the selected customer data
  };

  const customerData = data?.result.list;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-w-full">
        <Command>
          <input
            value={searchTerm}
            placeholder={placeholder}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full border-b outline-none focus:ring-0 h-10 text-sm"
          />
          <CommandList>
            {isFetching ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : customerData?.length ? (
              <CommandGroup>
                {searchTerm && (
                  <CommandItem
                    key="manual-entry"
                    onSelect={() => handleSelectCustomer(searchTerm, {})}
                    className="border mb-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium ">"{searchTerm}"</span>
                    </div>
                  </CommandItem>
                )}
                {customerData.map((customer: CustomerListItem) => (
                  <CommandItem
                    key={customer.id}
                    onSelect={() =>
                      handleSelectCustomer(customer.customerName, customer)
                    }
                    className="border mb-1"
                  >
                    <div className="flex flex-col ">
                      <span className="font-medium">
                        {customer.customerName}
                      </span>
                      <span className="text-sm text-gray-500">
                        Passport: {customer.passportNumber || "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">
                        License: {customer.drivingLicenseNumber || "N/A"}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <>
                <CommandEmpty>
                  {searchTerm.length > 0
                    ? "No customers found"
                    : "Search customer name..."}
                </CommandEmpty>
                {searchTerm && (
                  <CommandGroup>
                    <CommandItem
                      key="manual-entry"
                      onSelect={() => handleSelectCustomer(searchTerm, {})}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">"{searchTerm}"</span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerSearch;
