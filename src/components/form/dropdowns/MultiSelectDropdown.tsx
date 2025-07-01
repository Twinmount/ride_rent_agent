import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

type MultiSelectDropdownProps = {
  value?: string[];
  onChangeHandler: (value: string[]) => void;
  placeholder?: string;
  options: { name: string; label: string; selected: boolean }[];
  isDisabled?: boolean;
};

const MultiSelectDropdown = ({
  value = [],
  onChangeHandler,
  options,
  isDisabled = false,
}: MultiSelectDropdownProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value); // Selected options state

  // Pre-select values on mount (for Update case)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedOptions.length === 0) {
        const preSelectedValues = options
          .filter((option) => option.selected)
          .map((option) => option.name);
        setSelectedOptions(preSelectedValues);
        onChangeHandler(preSelectedValues); // Sync initial state with form handler
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [onChangeHandler, options, selectedOptions]);

  const handleOptionSelect = (optionName: string) => {
    let updatedOptions;
    if (selectedOptions.includes(optionName)) {
      updatedOptions = selectedOptions.filter((o) => o !== optionName);
    } else {
      updatedOptions = [...selectedOptions, optionName];
    }
    setSelectedOptions(updatedOptions);
    onChangeHandler(updatedOptions); // Update form value
  };

  return (
    <div className="relative pb-2 border-none top-1">
      {/* Trigger Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between px-2 overflow-hidden bg-white border rounded-lg hover:no-underline cursor-pointer ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span>
              {selectedOptions.length > 0
                ? `${selectedOptions.length} selected`
                : "Choose features"}
            </span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown Menu Content */}
        <DropdownMenuContent className="max-sm:w-full w-[400px] p-4 overflow-auto bg-slate-50 shadow-lg max-h-96">
          {/* Multi-select options */}
          <div className="flex flex-col w-full gap-2">
            {options.map((option) => (
              <div key={option.name} className="flex items-center gap-2 mb-1">
                <Checkbox
                  id={option.name}
                  checked={selectedOptions.includes(option.name)}
                  onCheckedChange={() => handleOptionSelect(option.name)}
                  className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none "
                />
                <Label htmlFor={option.name} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MultiSelectDropdown;
