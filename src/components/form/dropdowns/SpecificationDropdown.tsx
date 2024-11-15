import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

type DropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  options: { label: string; value: string }[];
  isDisabled?: boolean;
  isEngineType?: boolean;
};

const SpecificationDropdown = ({
  value = "",
  onChangeHandler,
  options,
  isDisabled = false,
  isEngineType = false,
}: DropdownProps) => {
  const [open, setOpen] = React.useState(false);

  const sortedOptions = React.useMemo(() => {
    return isEngineType
      ? [...options].sort((a, b) => a.label.localeCompare(b.label))
      : options;
  }, [options, isEngineType]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className="justify-between w-full"
        >
          {value
            ? sortedOptions.find((option) => option.value === value)?.label
            : "Choose option..."}
          <ChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-11/12">
        <Command>
          {sortedOptions.length > 5 && <CommandInput placeholder="Search..." />}
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup className="pr-2 w-96">
              {sortedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const selectedValue =
                      currentValue === value ? "" : currentValue;
                    onChangeHandler(selectedValue); // Update form state here
                    setOpen(false); // Close the dropdown after selection
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SpecificationDropdown;
