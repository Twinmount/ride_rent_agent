// NationalityDropdown.tsx
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming your utility for classNames
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

type NationalityDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

type NationalityType = {
  name: string;
  value: string;
};

const NationalityDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
  placeholder = "Select nationality...",
}: NationalityDropdownProps) => {
  // Mock data (replace this with your actual data fetching logic)
  const mockNationalities: NationalityType[] = [
    { name: "America", value: "america" },
    { name: "Canada", value: "canada" },
    { name: "Australia", value: "australia" },
    { name: "India", value: "india" },
    { name: "United Kingdom", value: "united kingdom" },
    { name: "Germany", value: "germany" },
    { name: "France", value: "france" },
    { name: "Japan", value: "japan" },
    { name: "Brazil", value: "brazil" },
    { name: "Mexico", value: "mexico" },
  ];

  const [nationalities, setNationalities] =
    React.useState<NationalityType[]>(mockNationalities);
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="ring-0 select-field focus:ring-0 input-fields w-full justify-between text-gray-600"
          disabled={isDisabled}
        >
          {value
            ? nationalities.find((nationality) => nationality.value === value)
                ?.name
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-72 max-w-full p-0">
        <Command>
          <CommandInput placeholder="Search nationality..." />
          <CommandList>
            <CommandEmpty>No nationality found.</CommandEmpty>
            <CommandGroup>
              {nationalities.map((nationality) => (
                <CommandItem
                  key={nationality.value}
                  value={nationality.value}
                  onSelect={(currentValue) => {
                    const selectedValue =
                      currentValue === value ? "" : currentValue;
                    onChangeHandler(selectedValue); // Update form state here
                    setOpen(false); // Close the dropdown after selection
                  }}
                >
                  {nationality.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === nationality.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default NationalityDropdown;
