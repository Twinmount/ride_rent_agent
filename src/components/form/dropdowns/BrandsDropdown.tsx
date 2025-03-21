import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBrands, fetchBrandById } from "@/api/brands";
import { useEffect, useMemo, useState } from "react";

type BrandsDropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  vehicleCategoryId?: string;
};

const BrandsDropdown = ({
  value,
  onChangeHandler,
  placeholder = "brand",
  isDisabled = false,
  vehicleCategoryId,
}: BrandsDropdownProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(value || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [open, setOpen] = useState(false);
  // Fetch brand by ID if value is provided
  const { data: specificBrandData, isLoading: isSpecificBrandLoading } =
    useQuery({
      queryKey: ["brand", value],
      queryFn: () => fetchBrandById(value as string),
      enabled: !!value, // Only run this query if value is provided
    });

  // Fetch brands by search term and category id
  const { data: brandData, isFetching: isBrandsLoading } = useQuery({
    queryKey: ["brands", vehicleCategoryId, debouncedSearchTerm],
    queryFn: () =>
      fetchAllBrands({
        page: 1,
        limit: 20,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId as string,
        search: debouncedSearchTerm,
      }),
    enabled: !!vehicleCategoryId && debouncedSearchTerm.length > 1,
    staleTime: 0,
  });

  // Set the selected value based on the fetched specific brand
  useEffect(() => {
    if (specificBrandData && specificBrandData.result) {
      setSelectedValue(specificBrandData.result.id);
    }
  }, [specificBrandData]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  // Debounced handle search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Debounce delay

    return () => {
      clearTimeout(handler); // Clear timeout if user types again
    };
  }, [searchTerm]);

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue);
    if (onChangeHandler) onChangeHandler(currentValue);
  };

  const selectedBrandName = useMemo(() => {
    // Prioritize loading states first
    if (isSpecificBrandLoading || isBrandsLoading) return "Loading...";

    if (specificBrandData?.result) {
      return specificBrandData.result.brandName;
    }

    // Default text if nothing is found or loaded yet
    return `Choose ${placeholder}`;
  }, [selectedValue, specificBrandData, isSpecificBrandLoading]);

  const handleSearchTermChange = (value: string) => {
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setSearchTerm(value);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={isDisabled || !vehicleCategoryId}
          className="justify-between w-full font-normal"
        >
          {!vehicleCategoryId
            ? "Choose a vehicle category first"
            : isBrandsLoading || isSpecificBrandLoading
              ? "Loading brands..."
              : selectedBrandName}
          <ChevronDown className="w-6 h-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:!w-96 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder}...`}
            onValueChange={(value) => handleSearchTermChange(value)}
          />
          <CommandList>
            {!searchTerm ? (
              <CommandEmpty>Please search the brand.</CommandEmpty>
            ) : isBrandsLoading ? (
              <CommandEmpty>Searching for {searchTerm}...</CommandEmpty>
            ) : brandData?.result.list.length === 0 ? (
              <CommandEmpty>
                No {placeholder} found for &apos;{searchTerm}&apos;.
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {brandData &&
                  brandData.result.list.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.id}
                      onSelect={() => {
                        handleSelect(brand.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === brand.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {brand.brandName}
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BrandsDropdown;
