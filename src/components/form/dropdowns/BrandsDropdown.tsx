import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn, debounce } from "@/lib/utils";
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
  const [selectedValue, setSelectedValue] = React.useState<string>(value || "");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // Fetch brand by ID if value is provided
  const { data: specificBrandData, isLoading: isSpecificBrandLoading } =
    useQuery({
      queryKey: ["brand", value],
      queryFn: () => fetchBrandById(value as string),
      enabled: !!value, // Only run this query if value is provided
    });

  // Fetch brands by search term and category id
  const {
    data: brandData,
    isFetching: isBrandsLoading,
    refetch,
  } = useQuery({
    queryKey: ["brands", vehicleCategoryId, searchTerm],
    queryFn: () =>
      fetchAllBrands({
        page: 1,
        limit: 20,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId as string,
        search: searchTerm,
      }),
    enabled: !!vehicleCategoryId,
    staleTime: 0,
  });

  // Set the selected value based on the fetched specific brand
  React.useEffect(() => {
    if (specificBrandData && specificBrandData.result) {
      setSelectedValue(specificBrandData.result.id);
    }
  }, [specificBrandData]);

  React.useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  // Debounced handle search
  const debouncedHandleSearch = React.useCallback(
    debounce((query: string) => {
      setSearchTerm(query);
      refetch(); // Trigger the refetch
    }, 500), // 300ms delay
    [refetch]
  );

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue);
    if (onChangeHandler) onChangeHandler(currentValue);
  };

  const selectedBrandName = React.useMemo(() => {
    // Prioritize loading states first
    if (isSpecificBrandLoading || isBrandsLoading) return "Loading...";

    // Try to find the brand in the `brandData` list
    if (selectedValue && brandData?.result.list) {
      const brand = brandData.result.list.find(
        (brand) => brand.id === selectedValue
      );
      if (brand) {
        return brand.brandName;
      }
    }

    // If `brandData` doesn't have the brand, fallback to `specificBrandData`
    if (specificBrandData?.result) {
      return specificBrandData.result.brandName;
    }

    // Default text if nothing is found or loaded yet
    return `Choose ${placeholder}`;
  }, [
    selectedValue,
    brandData,
    specificBrandData,
    isSpecificBrandLoading,
    isBrandsLoading,
    placeholder,
  ]);

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
            onValueChange={debouncedHandleSearch}
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
